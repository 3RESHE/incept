//stackpress
import type { UnknownNest, StatusResponse } from '@stackpress/types/dist/types';
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import type Model from '@stackpress/incept/dist/schema/Model';
import Exception from '@stackpress/incept/dist/Exception';
//common
import { toErrorResponse } from '../helpers';
//local
import detail from './detail';
import update from './update';

/**
 * Removes a database table row
 */
export default async function remove<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  ids: Record<string, string|number>
): Promise<StatusResponse<M|null>> {
  //action and return response
  const active = model.active?.name;
  if (active) {
    return await update<M>(model, engine, ids, { [active]: false });
  }
  const remove = engine.delete(model.name);
  for (const column of model.ids) {
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
  return await detail<M>(model, engine, ids);
};