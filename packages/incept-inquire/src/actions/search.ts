//stackpress
import type { UnknownNest, StatusResponse } from '@stackpress/lib/dist/types';
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import type Model from '@stackpress/incept/dist/schema/Model';
//common
import type { SearchParams } from '../types';
import { 
  toSqlString,
  toSqlFloat,
  toSqlInteger,
  toSqlBoolean,
  toSqlDate,
  toResponse,
  toErrorResponse
} from '../helpers';

const stringable = [ 'String', 'Text', 'Json', 'Object', 'Hash' ];
const floatable = [ 'Number', 'Float' ];
const dateable = [ 'Date', 'Time', 'Datetime' ];
const boolable = [ 'Boolean' ];
const intable = [ 'Integer' ];

/**
 * Searches the database table
 */
export default async function search<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  query: SearchParams = {}
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
  if (model.active) {
    if(typeof filter[model.active.name] === 'undefined') {
      filter[model.active.name] = true;
    } else if (filter[model.active.name] == -1) {
      delete filter[model.active.name];
    }
  }
  //selectors
  const snakerized = columns.map(column => {
    if (column === '*') {
      return column;
    }
    return column.trim()
      //replace special characters with dashes
      .replace(/[^a-zA-Z0-9\.\*'"]/g, '_')
      //replace multiple dashes with a single dash
      .replace(/-{2,}/g, '_')
      //trim dashes from the beginning and end of the string
      .replace(/^_+|_+$/g, '')
      //replace "someString" to "some_string"
      .replace(/([a-z])([A-Z0-9])/g, '$1_$2')
      .toLowerCase();
  });
  const select = engine.select<M>(snakerized).from(model.snake);
  //if skip
  if (skip) {
    select.offset(skip);
  }
  //if take
  if (take) {
    select.limit(take);
  }
  const count = engine
    .select<{ total: number }>('COUNT(*) as total')
    .from(model.snake);
  //searchable
  if (q && model.searchables.length > 0) {
    select.where(
      model.searchables.map(
        column => `${column.snake} ILIKE ?`
      ).join(' OR '), 
      model.searchables.map(_ => `%${q}%`)
    );
    count.where(
      model.searchables.map(
        column => `${column.snake} ILIKE ?`
      ).join(' OR '), 
      model.searchables.map(_ => `%${q}%`)
    );
  }
  //filters
  Array.from(model.columns.values()).forEach(column => {
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
      select.where(`${column.snake} = ?`, [ value || String(filter[column.name]) ]);
      count.where(`${column.snake} = ?`, [ value || String(filter[column.name]) ]);
    }
  });
  //spans
  model.spans.forEach(column => {
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
      select.where(`${column.snake} >= ?`, [ value || String(filter[column.name]) ]);
      count.where(`${column.snake} >= ?`, [ value || String(filter[column.name]) ]);
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
      select.where(`${column.snake} <= ?`, [ value || String(filter[column.name]) ]);
      count.where(`${column.snake} <= ?`, [ value || String(filter[column.name]) ]);
    }
  });
  //sort
  model.sortables.forEach(column => {
    if (sort[column.name]) {
      select.order(column.snake, sort[column.name].toUpperCase());
    }
  });

  try {
    const rows = (await select).map(row => model.unserialize(row));
    const total = useTotal ? await count : [ { total: 0 } ];
    if (rows.length) {
      for (const column of model.relations) {
        if (!column.relation) {
          continue;
        }
        const model = column.relation.parent.model;
        const foreignTable = model.snake;
        const foreignKey = column.relation.parent.key.name;
        const foreignSnake = column.relation.parent.key.snake;
        const localKey = column.relation.child.key.name;
        const key = column.relation.child.column.name;
        //if there is an include and this relation is not included
        if (include.length && !include.includes(model.name)) {
          continue;
        }
        const ids = rows.map(
          row => column.relation && row[localKey]
        ).filter(Boolean);
        const joins: UnknownNest = Object.fromEntries((
          await engine.select<UnknownNest>()
          .from(foreignTable)
          .where(`${foreignSnake} IN (${ids.map(_ => '?').join(', ')})`, ids)
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
};