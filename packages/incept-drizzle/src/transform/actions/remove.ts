//types
import type { SourceFile } from 'ts-morph';
import type Model from '@stackpress/incept/dist/config/Model';
//helpers
import { formatCode } from '@stackpress/incept/dist/config/helpers';

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
    return await db.update(schema.${model.camel})
      .set({ ${model.active.name}: false })
      .where(${model.ids.length > 1
        ? `sql\`${model.ids.map(id => `${id.name} = \${${id.name}}`).join(' AND ')}\``
        : `eq(schema.${model.camel}.${model.ids[0].name}, ${model.ids[0].name})`
      })
      .returning()
      .then(toResponse)
      .catch(toErrorResponse);
  `) : formatCode(`
    return await db.delete(schema.${model.camel})
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
  //export async function remove(
  //  id: string,
  //): Promise<ResponsePayload<Profile>>
  source.addFunction({
    isExported: true,
    name: 'remove',
    isAsync: true,
    parameters: model.ids.map(
      column => ({ name: column.name, type: typemap[column.type] })
    ),
    returnType: `Promise<ResponsePayload<${model.title}>>`,
    statements: body(model)
  });
};