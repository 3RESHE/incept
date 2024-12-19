//common
import make from '../server';

async function populate() {
  //server emit
  const server = await make();
  const john = await server.call('profile-create', {
    id: 'john-doe',
    name: 'John Doe',
    type: 'person',
    roles: [ 'ADMIN' ]
  }) as { results: { id: string } };
  const jane = await server.call('profile-create', {
    id: 'jane-doe',
    name: 'Jane Doe',
    type: 'person',
    roles: [ 'USER' ]
  }) as { results: { id: string } };
  const jack = await server.call('profile-create', {
    id: 'jack-doe',
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
};

populate()
  .then(() => process.exit(0))
  .catch(console.error);