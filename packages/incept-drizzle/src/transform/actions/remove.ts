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
    return await tx.update(schema.${model.camel})
      .set({ ${model.active.name}: false })
      .where(${model.ids.length > 1
        ? `sql\`${model.ids.map(id => `${id.name} = \${${id.name}}`).join(' AND ')}\``
        : `eq(schema.${model.camel}.${model.ids[0].name}, ${model.ids[0].name})`
      })
      .returning()
      .then(toResponse)
      .catch(toErrorResponse);
  `) : formatCode(`
    return await tx.delete(schema.${model.camel})
      .where(${model.ids.length > 1
        ? `sql\`${model.ids.map(id => `${id.name} = \${${id.name}}`).join(' AND ')}\``
        : `eq(schema.${model.camel}.${model.ids[0].name}, ${model.ids[0].name})`
      })
      .returning()
      .then(toResponse)
      .catch(toErrorResponse);
  `);
};

export default function generate(source: SourceFile, model: Model) {
  //export type RemoveTransaction = { insert: Function }
  source.addTypeAlias({
    isExported: true,
    name: 'RemoveTransaction',
    type: 'Record<string, any> & { update: Function, delete: Function }'
  });
  //export async function remove(
  //  id: string,
  //): Promise<Payload<Profile>>
  source.addFunction({
    isExported: true,
    name: 'remove',
    isAsync: true,
    parameters: [
      ...model.ids.map(
        column => ({ name: column.name, type: typemap[column.type] })
      ),
      { name: 'tx', type: 'RemoveTransaction', initializer: 'db' }
    ],
    returnType: `Promise<Payload<${model.title}>>`,
    statements: body(model)
  });
};