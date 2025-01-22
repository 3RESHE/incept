//stackpress
import type { UnknownNest, StatusResponse } from '@stackpress/lib/dist/types';
import type Engine from '@stackpress/inquire/dist/Engine';
//incept
import type Model from '@stackpress/incept/dist/schema/Model';
import Exception from '@stackpress/incept/dist/Exception';
//common
import { toResponse } from '../helpers';
//local
import upsert from './upsert';

/**
 * Upserts many rows into the database table
 */
export default async function batch<M extends UnknownNest = UnknownNest>(
  model: Model, 
  engine: Engine,
  rows: M[]
) {
  const results: Partial<StatusResponse<Partial<M>>>[] = [];
  try {
    let error = false;
    await engine.transaction(async () => {
      for (const row of rows) {
        const response = await upsert<M>(model, engine, row);
        if (response.code !== 200) {
          error = true;
        }
        results.push(response);
      }
      if (error) {
        throw Exception.for('Errors found in batch inputs');
      }
    });
  } catch(e) {
    const error = Exception.upgrade(e as Error);
    return {
      code: 400,
      status: 'Bad Request',
      error: error.message,
      results: results,
      total: results.length,
      stack: error.trace()
    };
  }
  return toResponse(results);
};