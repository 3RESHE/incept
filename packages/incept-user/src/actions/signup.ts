//stackpress
import type { StatusResponse } from '@stackpress/types/dist/types';
import { email } from '@stackpress/incept/dist/assert';
//common
import type { ProfileAuth, SignupInput, Profile, Auth } from '../types';

/**
 * Signup action
 */
export default async function signup(
  input: SignupInput
): Promise<Partial<StatusResponse<ProfileAuth>>> {
  let client;
  try {
    client = await import('@stackpress/incept/client');
  } catch (error) {
    return { code: 500, status: 'Internal Server Error' };
  }
  //validate input
  const errors = assert(input);
  //if there are errors
  if (errors) {
    //return the errors
    return { code: 400, error: 'Invalid Parameters', errors };
  }
  //create profile
  const response = await client.model.profile.action.create({
    name: input.name,
    roles: [ 'user' ]
  });
  //if error, return response
  if (response.code !== 200) {
    return response;
  }
  const results = response.results as Profile & { 
    auth: Record<string, Auth> 
  };
  results.auth = {};
  //if email
  if (input.email) {
    const auth = await client.model.auth.action.create({
      profileId: results.id,
      type: 'email',
      token: String(input.email),
      secret: String(input.secret)
    });
    if (auth.code !== 200) {
      return auth;
    }
    results.auth.email = auth.results as Auth;
  } 
  //if phone
  if (input.phone) {
    const auth = await client.model.auth.action.create({
      profileId: results.id,
      type: 'phone',
      token: String(input.phone),
      secret: String(input.secret)
    });
    if (auth.code !== 200) {
      return auth;
    }
    results.auth.phone = auth.results as Auth;
  }
  //if username
  if (input.username) {
    const auth = await client.model.auth.action.create({
      profileId: results.id,
      type: 'username',
      token: String(input.username),
      secret: String(input.secret)
    });
    if (auth.code !== 200) {
      return auth;
    }
    results.auth.username = auth.results as Auth;
  }

  return { ...response, results };
}

/**
 * Validate signup input
 */
export function assert(input: SignupInput) {
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