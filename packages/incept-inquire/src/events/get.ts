//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';
//incept
import type Model from '@stackpress/incept/dist/schema/Model';
//actions
import get from '../actions/get';
//common
import type { DatabasePlugin } from '../types';

/**
 * This is a factory function that creates an event 
 * handler for retrieving a record from the database
 * 
 * Usage:
 * emitter.on('profile-get', getEventFactory(profile));
 */
export default function getEventFactory(model: Model) {
  return async function GetEventAction(req: ServerRequest, res: Response) {
    //if there is a response body or there is an error code
    if (res.body || (res.code && res.code !== 200)) {
      //let the response pass through
      return;
    }
    //get the database engine
    const engine = req.context.plugin<DatabasePlugin>('database');
    if (!engine) return;

    //get the value
    const value = req.data('value');
    if (typeof value === 'undefined') return;
    //get the key
    const key = req.data('key');

    const response = await get(model, engine, key, value);

    if (response.code === 200 && !response.results) {
      response.code = 404;
      response.status = 'Not Found';
    }

    res.fromStatusResponse(response);
  };
};