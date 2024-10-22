//types
import type { SourceFile } from 'ts-morph';
import type Model from '@stackpress/incept-spec/dist/Model';
import type { Config } from '../types';
//helpers
import { formatCode } from '@stackpress/incept-spec/dist/helpers';

const helpers: Record<string, string> = {
  String: 'toSqlString',
  Text: 'toSqlString',
  Number: 'toSqlFloat',
  Integer: 'toSqlInteger',
  Float: 'toSqlFloat',
  Boolean: 'toSqlBoolean',
  Date: 'toSqlDate',
  Time: 'toSqlDate',
  Datetime: 'toSqlDate',
  Json: 'toSqlString',
  Object: 'toSqlString',
  Hash: 'toSqlString'
}

//map from column types to sql types and helpers
export const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'string',
  Time: 'string',
  Datetime: 'string',
  Json: 'string',
  Object: 'string',
  Hash: 'string'
};

export function body(model: Model, config: Config) {
  const engine = config.engine.type === 'env' 
    ? process.env[config.engine.value] 
    : config.engine.value;
  const ids = model.ids.map(column => column.name);
  return formatCode(`
    //collect errors, if any
    const errors = assert.update(input);
    //if there were errors
    if (errors) {
      //return the errors
      return toErrorResponse(
        Exception
          .for('Invalid parameters')
          .withCode(400)
          .withErrors(errors)
      );
    }
    //action and return response
    return await db.update(schema.${model.camel}).set({
      ${model.assertions.map(column => {
        if (column.multiple) {
          return engine === 'sqlite' 
            ? `${column.name}: input.${column.name} ? JSON.stringify(input.${column.name} || []): undefined`
            : `${column.name}: input.${column.name} || undefined`;  
        } else if (['Json', 'Object', 'Hash'].includes(column.type)) {
          return engine === 'sqlite' 
            ? `${column.name}: input.${column.name} ? JSON.stringify(input.${column.name} || {}): undefined`
            : `${column.name}: input.${column.name} || undefined`;  
        }
        const helper = helpers[column.type];
        return helper 
          ? `${column.name}: ${helper}(input.${column.name})`
          : `${column.name}: input.${column.name}`
      }).join(',\n')}
    }).where(${ids.length > 1
      ? `sql\`${ids.map(id => `${id} = \${${id}}`).join(' AND ')}\``
      : `eq(schema.${model.camel}.${ids[0]}, ${ids[0]})`
    })
    .returning()
    .then(results => results[0])
    .then(toResponse)
    .catch(toErrorResponse);
  `);
};

export default function generate(
  source: SourceFile, 
  model: Model,
  config: Config
) {
  //export async function action(
  //  id: string,
  //  data: ProfileInput
  //): Promise<ResponsePayload<Profile>>
  source.addFunction({
    isExported: true,
    name: 'update',
    isAsync: true,
    parameters: [
      ...model.ids.map(
        column => ({ name: column.name, type: typemap[column.type] })
      ),
      { name: 'input', type: `Partial<${model.title}Input>` }
    ],
    returnType: `Promise<ResponsePayload<${model.title}>>`,
    statements: body(model, config)
  });
};