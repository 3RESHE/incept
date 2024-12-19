import type { 
  UnknownNest,
  NestedObject, 
  StatusResponse
} from '@stackpress/types/dist/types';
import type { SearchParams } from './types';

import Engine from '@stackpress/inquire/dist/Engine';
import Model from '@stackpress/incept/dist/schema/Model';
import Exception from '@stackpress/incept/dist/Exception';

import { 
  toSqlString,
  toSqlFloat,
  toSqlInteger,
  toSqlBoolean,
  toSqlDate,
  toResponse,
  toErrorResponse
} from './helpers';

const stringable = [ 'String', 'Text', 'Json', 'Object', 'Hash' ];
const floatable = [ 'Number', 'Float' ];
const dateable = [ 'Date', 'Time', 'Datetime' ];
const boolable = [ 'Boolean' ];
const intable = [ 'Integer' ];

export class Actions<M extends UnknownNest = UnknownNest> {
  //engine generic
  public readonly engine: Engine;
  //schema model
  public readonly model: Model;

  /**
   * Sets the model and engine for the actions. 
   */
  constructor(model: Model, engine: Engine) {
    this.engine = engine;
    this.model = model;
  }

  /**
   * Creates a database table row
   */
  public async create(
    input: NestedObject
  ): Promise<StatusResponse<Partial<M>>> {
    //collect errors, if any
    const errors = this.model.assert(input, true);
    //if there were errors
    if (errors) {
      //return the errors
      return Exception
        .for('Invalid parameters')
        .withCode(400)
        .withErrors(errors as NestedObject<string>)
        .toResponse() as StatusResponse<Partial<M>>;
    }
  
    const data = { ...this.model.defaults, ...input };
  
    //action and return response
    try {
      const results = await this.engine
        .insert(this.model.name)
        .values(this.model.serialize(data) as NestedObject<string>)
        .returning('*');
      if (results.length) {
        return toResponse(results[0]) as StatusResponse<Partial<M>>;
      }
    } catch (e) {
      return toErrorResponse(e as Error) as StatusResponse<Partial<M>>;
    }
    return toResponse(data) as StatusResponse<Partial<M>>;
  }

  /**
   * Returns a database table row
   */
  public async detail(
    ids: Record<string, string|number>
  ): Promise<StatusResponse<M|null>> {
    const filter = Object.fromEntries(
      this.model.ids.map(column => [ 
        column.name, 
        ids[column.name] 
      ])
    );
    if (this.model.active) {
      filter[this.model.active.name] = -1;
    }
    const response = await this.search({ filter, take: 1 });
    //@ts-ignore - Property 'results' does not exist on type 'ErrorResponse'.
    if (Array.isArray(response.results)) {
      //@ts-ignore - Property 'results' does not exist on type 'ErrorResponse'.
      response.results = response.results[0] || null;
    }
    return response as unknown as StatusResponse<M>;
  }

  /**
   * Returns a database table row
   */
  public async get(
    key: string, 
    value: string|number
  ): Promise<StatusResponse<M|null>> {
    const filter: Record<string, string|number|boolean> = { [key]: value };
    if (this.model.active) {
      filter[this.model.active.name] = -1;
    }
    const response = await this.search({ filter, take: 1 });
    //@ts-ignore - Property 'results' does not exist on type 'ErrorResponse'.
    if (Array.isArray(response.results)) {
      //@ts-ignore - Property 'results' does not exist on type 'ErrorResponse'.
      response.results = response.results[0] || null;
    }
    return response as unknown as StatusResponse<M>;
  }

  /**
   * Removes a database table row
   */
  public async remove(
    ids: Record<string, string|number>
  ): Promise<StatusResponse<M>> {
    //action and return response
    const active = this.model.active?.name;
    if (active) {
      return await this.update(ids, { [active]: false }) as StatusResponse<M>;
    }
    const remove = this.engine.delete(this.model.name);
    for (const column of this.model.ids) {
      if (!ids[column.name]) {
        return Exception
          .for('Missing %s', column.name)
          .withCode(400)
          .toResponse() as StatusResponse<M>;
      }
      remove.where(`${column.name} = ?`, [ ids[column.name] ]);
    }
    try {
      await remove;
    } catch (e) {
      return toErrorResponse(e as Error) as StatusResponse<M>;
    }
    return await this.detail(ids) as StatusResponse<M>;
  }
  
  /**
   * Restores a database table row
   */
  public async restore(
    ids: Record<string, string|number>
  ): Promise<StatusResponse<M|null>> {
    //action and return response
    const active = this.model.active?.name;
    if (active) {
      return await this.update(ids, { [active]: true });
    }
    
    return await this.detail(ids);
  }

  /**
   * Searches the database table
   */
  public async search(
    query: SearchParams
  ): Promise<StatusResponse<M[]>> {
    //extract params
    let {
      q,
      columns = [ '*' ],
      include = [],
      filter = {},
      span = {},
      sort = {},
      skip = 0,
      take = 50,
      total: useTotal = true
    } = query;
    //default active value
    if (this.model.active) {
      if(typeof filter[this.model.active.name] === 'undefined') {
        filter[this.model.active.name] = true;
      } else if (filter[this.model.active.name] == -1) {
        delete filter[this.model.active.name];
      }
    }
    //selectors
    const select = this.engine
      .select<M>(columns)
      .from(this.model.name)
      .offset(skip)
      .limit(take);
    const count = this.engine
      .select<{ total: number }>('COUNT(*) as total')
      .from(this.model.name);
    //searchable
    if (q && this.model.searchables.length > 0) {
      select.where(
        this.model.searchables.map(
          column => `${column.name} ILIKE ?`
        ).join(' OR '), 
        this.model.searchables.map(_ => `%${q}%`)
      );
      count.where(
        this.model.searchables.map(
          column => `${column.name} ILIKE ?`
        ).join(' OR '), 
        this.model.searchables.map(_ => `%${q}%`)
      );
    }
    //filters
    Array.from(this.model.columns.values()).forEach(column => {
      if (filter[column.name]) {
        const value = stringable.includes(column.type)
          ? toSqlString(filter[column.name])
          : floatable.includes(column.type)
          ? toSqlFloat(filter[column.name])
          : intable.includes(column.type)
          ? toSqlInteger(filter[column.name])
          : boolable.includes(column.type)
          ? toSqlBoolean(filter[column.name])
          : dateable.includes(column.type)
          ? toSqlDate(filter[column.name])?.toISOString()
          : String(filter[column.name]);
        select.where(`${column.name} = ?`, [ value || String(filter[column.name]) ]);
        count.where(`${column.name} = ?`, [ value || String(filter[column.name]) ]);
      }
    });
    //spans
    this.model.spans.forEach(column => {
      if (typeof span[column.name]?.[0] !== 'undefined'
        && span[column.name][0] !== null
        && span[column.name][0] !== ''
      ) {
        const value = stringable.includes(column.type)
          ? toSqlString(span[column.name][0])
          : floatable.includes(column.type)
          ? toSqlFloat(span[column.name][0])
          : intable.includes(column.type)
          ? toSqlInteger(span[column.name][0])
          : boolable.includes(column.type)
          ? toSqlBoolean(span[column.name][0])
          : dateable.includes(column.type)
          ? toSqlDate(span[column.name][0])?.toISOString()
          : String(span[column.name][0]);
        select.where(`${column.name} >= ?`, [ value || String(filter[column.name]) ]);
        count.where(`${column.name} >= ?`, [ value || String(filter[column.name]) ]);
      }
      if (typeof span[column.name]?.[1] !== 'undefined'
        && span[column.name][1] !== null
        && span[column.name][1] !== ''
      ) {
        const value = stringable.includes(column.type)
          ? toSqlString(span[column.name][1])
          : floatable.includes(column.type)
          ? toSqlFloat(span[column.name][1])
          : intable.includes(column.type)
          ? toSqlInteger(span[column.name][1])
          : boolable.includes(column.type)
          ? toSqlBoolean(span[column.name][1])
          : dateable.includes(column.type)
          ? toSqlDate(span[column.name][1])?.toISOString()
          : String(span[column.name][1]);
        select.where(`${column.name} <= ?`, [ value || String(filter[column.name]) ]);
        count.where(`${column.name} <= ?`, [ value || String(filter[column.name]) ]);
      }
    });
    //sort
    this.model.sortables.forEach(column => {
      if (sort[column.name]) {
        select.order(column.name, sort[column.name].toUpperCase());
      }
    });
  
    try {
      const rows = (await select).map(row => this.model.unserialize(row));
      const total = useTotal ? await count : [ { total: 0 } ];
      if (rows.length) {
        for (const column of this.model.relations) {
          if (!column.relation) {
            continue;
          }
          const model = column.relation.parent.model;
          const foreignTable = model.name;
          const foreignKey = column.relation.parent.key.name;
          const localKey = column.relation.child.key.name;
          const key = column.relation.child.column.name;
          //if there is an include and this relation is not included
          if (include.length 
            && !include.includes(foreignTable.toLowerCase())
          ) {
            continue;
          }
          const ids = rows.map(
            row => column.relation && row[localKey]
          ).filter(Boolean);
          const joins: UnknownNest = Object.fromEntries((
            await this.engine.select<UnknownNest>()
            .from(foreignTable)
            .where(`${foreignKey} IN (${ids.map(_ => '?').join(', ')})`, ids)
          ).map(row => [ row[foreignKey], model.unserialize(row) ]));
          rows.forEach(row => {
            if (row[localKey]) {
              //@ts-ignore - Type 'R' is generic 
              //and can only be indexed for reading.
              row[key] = joins[row[localKey] as any];
            }
          });
        }
      }
  
      return toResponse(rows, total[0].total) as StatusResponse<M[]>;
    } catch (e) {
      return toErrorResponse(e as Error) as StatusResponse<M[]>;
    }
  }
  
  /**
   * Updates a database table row
   */
  public async update(
    ids: Record<string, string|number>, 
    input: NestedObject
  ): Promise<StatusResponse<M>> {
    //collect errors, if any
    const errors = this.model.assert(input, true);
    //if there were errors
    if (errors) {
      //return the errors
      return Exception
        .for('Invalid parameters')
        .withCode(400)
        .withErrors(errors as NestedObject<string>)
        .toResponse() as StatusResponse<M>;
    }
  
    //action and return response
    const update = this.engine
      .update(this.model.name)
      .set(this.model.serialize(input) as NestedObject<string>);
    for (const column of this.model.ids) {
      if (!ids[column.name]) {
        return Exception
          .for('Missing %s', column.name)
          .withCode(400)
          .toResponse()as StatusResponse<M>;
      }
      update.where(`${column.name} = ?`, [ ids[column.name] ]);
    }
    try {
      await update;
    } catch (e) {
      return toErrorResponse(e as Error) as StatusResponse<M>;
    }
    return await this.detail(ids) as StatusResponse<M>;
  }
}

export default function actions<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine
) {
  return new Actions<M>(model, engine);
}
