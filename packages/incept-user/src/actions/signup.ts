import type { Payload } from '@stackpress/incept';

import { email } from '@stackpress/incept/dist/assert';
import client, { Profile, Auth } from '@stackpress/incept/client';

export type SignupInput = {
  name: string,
  username?: string,
  email?: string,
  phone?: string,
  secret: string
};

export type ProfileAuth = Profile & { auth: Record<string, Auth> };

/**
 * Signup action
 */
export default async function signup(
  input: SignupInput
): Promise<Payload<ProfileAuth>> {
  //validate input
  const errors = assert(input);
  //if there are errors
  if (errors) {
    //return the errors
    return { code: 400, status: 'Invalid Parameters', errors };
  }
  //create profile
  const response = await client.model.profile.action.create({
    name: input.name,
    roles: [ 'user' ]
  });
  //if error, return response
  if (response.code !== 200) {
    return response as Payload<ProfileAuth>;
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
      return auth as unknown as Payload<ProfileAuth>;
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
      return auth as unknown as Payload<ProfileAuth>;
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
      return auth as unknown as Payload<ProfileAuth>;
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