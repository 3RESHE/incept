import type { Payload } from '@stackpress/incept';

import client, { Profile, Auth } from '@stackpress/incept/client';

export type SignupInput = {
  name: string,
  username?: string,
  email?: string,
  phone?: string,
  password: string
};

/**
 * Signup action
 */
export default async function signup(input: SignupInput): Promise<Payload<Auth>> {
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
    return { ...response } as Payload<Auth>;
  }
  const profile = response.results as Profile;
  //if email
  if (input.email) {
    return await client.model.auth.action.create({
      profileId: profile.id,
      type: 'email',
      token: input.email,
      secret: input.password
    });
  //if phone
  } else if (input.phone) {
    return await client.model.auth.action.create({
      profileId: profile.id,
      type: 'phone',
      token: input.phone,
      secret: input.password
    });
  }
  //by default, username
  return await client.model.auth.action.create({
    profileId: profile.id,
    type: 'username',
    token: input.username as string,
    secret: input.password
  });
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
  }
  if (!input.password) {
    errors.password = 'Password is required';
  }
  return Object.keys(errors).length ? errors : null;
};