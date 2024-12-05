//stackpress
import type { StatusResponse } from '@stackpress/types/dist/types';
//common
import type { AuthExtended, SigninType, SigninInput } from '../types';

export default async function signin(
  type: SigninType, 
  input: SigninInput
): Promise<Partial<StatusResponse<AuthExtended>>> {
  let client;
  try {
    client = await import('@stackpress/incept/client');
  } catch (error) {
    return { code: 500, status: 'Internal Server Error' };
  }
  
  //get form body
  const response = await client.model.auth.action.search({
    filter: { type: type, token: input[type] || '' }
  });
  const results = response.results?.[0] as AuthExtended;
  if (response.code !== 200) {
    return { ...response, results };
  } else if (!results) {
    return { code: 404, status: 'Not Found' };
  } else if (String(input.secret) !== String(results.secret)) {
    return { code: 401, status: 'Unauthorized' };
  }
  //update consumed
  await client.model.auth.action.update(results.id, {
    consumed: new Date()
  });
  return {
    code: 200,
    status: 'OK',
    results: results,
    total: 1
  };
};