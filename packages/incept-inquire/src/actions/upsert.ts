//stackpress
import type { UnknownNest, NestedObject } from '@stackpress/types/dist/types';
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import type Model from '@stackpress/incept/dist/schema/Model';
//local
import create from './create';
import update from './update';

/**
 * Updates or inserts into a database table row
 */
export default async function upsert<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  input: NestedObject
) {
  const ids: Record<string, string|number> = {};
    for (const column of model.ids) {
      if (!input[column.name]) {
        return await create<M>(model, engine, input);
      }
      ids[column.name] = input[column.name] as string|number;
    }
    return await update<M>(model, engine, ids, input);
};