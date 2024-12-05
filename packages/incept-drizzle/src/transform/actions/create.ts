//modules
import type { SourceFile } from 'ts-morph';
//stackpress
import type Model from '@stackpress/incept/dist/schema/Model';
import { formatCode } from '@stackpress/incept/dist/schema/helpers';
//common
import type { Config } from '../types';

export function body(model: Model, config: Config) {
  const engine = config.engine.type === 'env' 
    ? process.env[config.engine.value] 
    : config.engine.value;

  return formatCode(`
    //collect errors, if any
    const errors = config.assert(input, true);
    //if there were errors
    if (errors) {
      //return the errors
      return Exception
        .for('Invalid parameters')
        .withCode(400)
        .withErrors(errors)
        .toResponse();
    }
    //action and return response
    return await tx.insert(schema.${model.camel}).values(
      config.serialize(input, { object: ${
        engine === 'sqlite' ? 'false' : 'true'
      } })
    )
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
  //export type CreateTransaction = { insert: Function }
  source.addTypeAlias({
    isExported: true,
    name: 'CreateTransaction',
    type: 'Record<string, any> & { insert: Function }'
  });
  //export default async function create(
  //  data: ProfileInput
  //): Promise<Payload<Profile>>
  source.addFunction({
    isExported: true,
    name: 'create',
    isAsync: true,
    parameters: [
      { name: 'input', type: `${model.title}Input` },
      { name: 'tx', type: 'CreateTransaction', initializer: 'db' }
    ],
    returnType: `Promise<Payload<${model.title}>>`,
    statements: body(model, config)
  });
};