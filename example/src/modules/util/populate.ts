//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';

import type { ProfileAuth } from '@stackpress/incept-user';

export default async function populate(req: ServerRequest, res: Response) {
  const server = req.context;

  const john = await server.call<ProfileAuth>('auth-signup', {
    type: 'person',
    name: 'John Doe',
    username: 'johndoe',
    email: 'john@doe.com',
    secret: '123',
    roles: [ 'ADMIN' ]
  });
  await server.call('auth-signup', {
    type: 'person',
    name: 'Jane Doe',
    username: 'janedoe',
    email: 'jane@doe.com',
    secret: '123',
    roles: [ 'USER' ]
  });
  await server.call('auth-signup', {
    type: 'person',
    name: 'Jack Doe',
    username: 'jackdoe',
    email: 'jack@doe.com',
    secret: '123',
    roles: [ 'USER' ]
  });
  
  const app = await server.call('application-create', {
    profileId: john.results?.id,
    name: 'Example App',
    scopes: [ 'profile-write', 'auth-read' ],
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  }) as { results: { id: string } };

  await server.call('session-create', {
    profileId: john.results?.id,
    applicationId: app.results.id,
    scopes: [ 'profile-write', 'auth-read' ],
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  });
  res.setStatus(200);
};