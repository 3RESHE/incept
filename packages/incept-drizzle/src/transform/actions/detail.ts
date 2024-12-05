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
  const ids = model.ids.map(column => column.name);
  return model.active ? formatCode(`
    return search({
      filter: { ${model.active.name}: -1, ${ids.map(id => `${id}`).join(', ')} },
      take: 1
    }, tx).then(response => ({
      ...response,
      results: response.results?.[0] || null
    }));
  `) : formatCode(`
    return search({
      filter: { ${ids.map(id => `${id}`).join(', ')} },
      take: 1
    }).then(response => ({
      ...response,
      results: response.results?.[0] || null
    }));
  `);
};

export default function generate(source: SourceFile, model: Model) {
  //export type DetailTransaction = { insert: Function }
  source.addTypeAlias({
    isExported: true,
    name: 'DetailTransaction',
    type: 'Record<string, any> & { select: Function }'
  });
  //export async function detail(
  //  id: string,
  //): Promise<Payload<Profile>>
  source.addFunction({
    isExported: true,
    name: 'detail',
    isAsync: true,
    parameters: [ 
      ...model.ids.map(
        column => ({ name: column.name, type: typemap[column.type] })
      ), 
      { name: 'tx', type: 'DetailTransaction', initializer: 'db' }
    ],
    returnType: `Promise<Payload<${model.title}Extended|null>>`,
    statements: body(model)
  });
};