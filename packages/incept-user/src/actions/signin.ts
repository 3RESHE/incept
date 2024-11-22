import type { Payload } from '@stackpress/incept';
import client, { AuthExtended } from '@stackpress/incept/client';

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
): Promise<Payload<AuthExtended>> {
  //get form body
  const response = await client.model.auth.action.search({
    filter: { type: type, token: input[type] || '' }
  });
  const results = response.results?.[0] as AuthExtended;
  if (response.code !== 200) {
    return { ...response, results } as Payload<AuthExtended>;
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
  } as Payload<AuthExtended>;
};