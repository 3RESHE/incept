//modules
import type { SourceFile } from 'ts-morph';
//stackpress
import type Model from '@stackpress/incept/dist/schema/Model';
import { formatCode } from '@stackpress/incept/dist/schema/helpers';

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

export function body(model: Model) {
  return model.active ? formatCode(`
    return search({
      filter: { ${model.active.name}: -1, [key]: value },
      take: 1
    }, tx).then(response => ({
      ...response,
      results: response.results?.[0] || null
    }));
  `) : formatCode(`
    return search({
      filter: { [key]: value },
      take: 1
    }).then(response => ({
      ...response,
      results: response.results?.[0] || null
    }));
  `);
};

export default function generate(source: SourceFile, model: Model) {
  //export type GetTransaction = { insert: Function }
  source.addTypeAlias({
    isExported: true,
    name: 'DetailTransaction',
    type: 'Record<string, any> & { select: Function }'
  });
  //export async function get(
  //  id: string,
  //): Promise<Payload<Profile>>
  source.addFunction({
    isExported: true,
    name: 'get',
    isAsync: true,
    parameters: [ 
      { name: 'key', type: 'string' },
      { name: 'value', type: 'any' }, 
      { name: 'tx', type: 'GetTransaction', initializer: 'db' }
    ],
    returnType: `Promise<Payload<${model.title}Extended|null>>`,
    statements: body(model)
  });
};