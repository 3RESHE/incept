//stackpress
import type { ServerRequest } from '@stackpress/ingest/dist/types';
import type Response from '@stackpress/ingest/dist/Response';

export default async function populate(req: ServerRequest, res: Response) {
  const server = req.context;
  const john = await server.call('profile-create', {
    name: 'John Doe',
    type: 'person',
    roles: [ 'ADMIN' ]
  }) as { results: { id: string } };
  const jane = await server.call('profile-create', {
    name: 'Jane Doe',
    type: 'person',
    roles: [ 'USER' ]
  }) as { results: { id: string } };
  const jack = await server.call('profile-create', {
    name: 'Jack Doe',
    type: 'person',
    roles: [ 'USER' ]
  }) as { results: { id: string } };

  await server.call('auth-create', {
    profileId: john.results.id,
    type: 'username',
    token: 'johndoe',
    secret: '123'
  });
  await server.call('auth-create', {
    profileId: john.results.id,
    type: 'email',
    token: 'john@doe.com',
    secret: '123'
  });
  await server.call('auth-create', {
    profileId: jane.results.id,
    type: 'username',
    token: 'janedoe',
    secret: '123'
  });
  await server.call('auth-create', {
    profileId: jane.results.id,
    type: 'email',
    token: 'jane@doe.com',
    secret: '123'
  });
  await server.call('auth-create', {
    profileId: jack.results.id,
    type: 'username',
    token: 'jackdoe',
    secret: '123'
  });
  await server.call('auth-create', {
    profileId: jack.results.id,
    type: 'email',
    token: 'jack@doe.com',
    secret: '123'
  });

  const app = await server.call('application-create', {
    profileId: john.results.id,
    name: 'Example App',
    scopes: [ 'profile-write', 'auth-read' ],
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  }) as { results: { id: string } };

  await server.call('session-create', {
    profileId: john.results.id,
    applicationId: app.results.id,
    scopes: [ 'profile-write', 'auth-read' ],
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365)
  });
  res.setStatus(200);
};