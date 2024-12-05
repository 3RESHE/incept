import type { 
  SuccessResponse,
  ResponseStatus
} from '@stackpress/types/dist/types';
import type { AuthExtended } from '@stackpress/incept/client';

export type SigninInput = {
  username?: string,
  email?: string,
  phone?: string,
  secret: string
};

export type SigninType = 'username' | 'email' | 'phone';

export default async function signin(
  type: SigninType, 
  input: SigninInput
): Promise<SuccessResponse<AuthExtended> | ResponseStatus> {
  let client;
  try {
    client = await import('@stackpress/incept/client');
  } catch (error) {
    return { code: 500, status: 'Internal Server Error' } as ResponseStatus;
  }
  
  //get form body
  const response = await client.model.auth.action.search({
    filter: { type: type, token: input[type] || '' }
  });
  const results = response.results?.[0] as AuthExtended;
  if (response.code !== 200) {
    return { ...response, results } as SuccessResponse<AuthExtended>;
  } else if (!results) {
    return { code: 404, status: 'Not Found' } as ResponseStatus;
  } else if (String(input.secret) !== String(results.secret)) {
    return { code: 401, status: 'Unauthorized' } as ResponseStatus;
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
  } as SuccessResponse<AuthExtended>;
};