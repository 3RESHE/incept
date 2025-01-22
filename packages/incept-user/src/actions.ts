//stackpress
import type { 
  StatusResponse,
  ErrorResponse
} from '@stackpress/lib/dist/types';
import type { ClientPlugin } from '@stackpress/incept/dist/types';
import type { 
  ClientWithDatabasePlugin 
} from '@stackpress/incept-inquire/dist/types';
import type Engine from '@stackpress/inquire/dist/Engine';
import { email } from '@stackpress/incept/dist/assert';
import Exception from '@stackpress/incept/dist/Exception';
//common
import type { 
  Auth,
  Profile, 
  ProfileAuth, 
  AuthExtended,
  SignupInput, 
  SigninType, 
  SigninInput
} from './types';

/**
 * Signup action
 */
export async function signup(
  input: Partial<SignupInput>,
  engine: Engine
): Promise<Partial<StatusResponse<ProfileAuth>>> {
  let client;
  try {
    client = (
      await import('@stackpress/incept/client')
    ) as unknown as ClientPlugin<ClientWithDatabasePlugin>;
  } catch (error) {
    return Exception.upgrade(error as Error).toResponse();
  }
  //validate input
  const errors = assert(input);
  //if there are errors
  if (errors) {
    //return the errors
    return { code: 400, error: 'Invalid Parameters', errors };
  }
  //create profile
  const response = await client.model.profile.actions(engine).create({
    name: input.name as string,
    roles: input.roles || []
  });
  //if error, return response
  if (response.code !== 200) {
    return response as ErrorResponse;
  }
  const results = response.results as Profile & { 
    auth: Record<string, Auth> 
  };
  results.auth = {};
  const actions = client.model.auth.actions(engine);
  //if email
  if (input.email) {
    const auth = await actions.create({
      profileId: results.id,
      type: 'email',
      token: String(input.email),
      secret: String(input.secret)
    });
    if (auth.code !== 200) {
      return auth as StatusResponse<ProfileAuth>;
    }
    results.auth.email = auth.results as Auth;
  } 
  //if phone
  if (input.phone) {
    const auth = await actions.create({
      profileId: results.id,
      type: 'phone',
      token: String(input.phone),
      secret: String(input.secret)
    });
    if (auth.code !== 200) {
      return auth as StatusResponse<ProfileAuth>;
    }
    results.auth.phone = auth.results as Auth;
  }
  //if username
  if (input.username) {
    const auth = await actions.create({
      profileId: results.id,
      type: 'username',
      token: String(input.username),
      secret: String(input.secret)
    });
    if (auth.code !== 200) {
      return auth as StatusResponse<ProfileAuth>;
    }
    results.auth.username = auth.results as Auth;
  }

  return { ...response, results };
};

/**
 * Signin action
 */
export async function signin(
  type: SigninType, 
  input: Partial<SigninInput>,
  engine: Engine
): Promise<Partial<StatusResponse<AuthExtended>>> {
  let client;
  try {
    client = (
      await import('@stackpress/incept/client')
    ) as unknown as ClientPlugin<ClientWithDatabasePlugin>;
  } catch (error) {
    return Exception.upgrade(error as Error).toResponse();
  }
  const actions = client.model.auth.actions(engine);
  //get form body
  const response = await actions.search({
    filter: { type: type, token: input[type] || '' }
  });
  const results = response.results?.[0] as AuthExtended;
  if (response.code !== 200) {
    return { ...response, results };
  } else if (!results) {
    return { code: 404, status: 'Not Found', error: 'User Not Found' };
  } else if (String(input.secret) !== String(results.secret)) {
    return { code: 401, status: 'Unauthorized', error: 'Invalid Password' };
  }
  //update consumed
  await actions.update({ id: results.id }, {
    consumed: new Date()
  });
  return {
    code: 200,
    status: 'OK',
    results: results,
    total: 1
  };
};

/**
 * Validate signup input
 */
export function assert(input: Partial<SignupInput>) {
  const errors: Record<string, string> = {};
  if (!input.name) {
    errors.name = 'Name is required';
  }
  if (!input.username && !input.email && !input.phone) {
    errors.type = 'Username, email, or phone is required';
  } else if (input.email && !email(input.email)) {
    errors.email = 'Invalid email';
  }
  if (!input.secret) {
    errors.secret = 'Password is required';
  }
  return Object.keys(errors).length ? errors : null;
};