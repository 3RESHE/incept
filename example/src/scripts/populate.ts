//common
import make from '../server';

async function populate() {
  //server emit
  const server = await make();
  await server.call('profile-create', {
    id: 'john-doe',
    name: 'John Doe',
    type: 'person',
    roles: [ 'ADMIN' ]
  });
  await server.call('profile-create', {
    id: 'jane-doe',
    name: 'Jane Doe',
    type: 'person',
    roles: [ 'USER' ]
  });
  await server.call('profile-create', {
    id: 'jack-doe',
    name: 'Jack Doe',
    type: 'person',
    roles: [ 'USER' ]
  });
  await server.call('auth-create', {
    profileId: 'john-doe',
    type: 'username',
    token: 'johndoe',
    secret: '123'
  });
  await server.call('auth-create', {
    profileId: 'john-doe',
    type: 'email',
    token: 'john@doe.com',
    secret: '123'
  });
  await server.call('auth-create', {
    profileId: 'jane-doe',
    type: 'username',
    token: 'janedoe',
    secret: '123'
  });
  await server.call('auth-create', {
    profileId: 'jane-doe',
    type: 'email',
    token: 'jane@doe.com',
    secret: '123'
  });
  await server.call('auth-create', {
    profileId: 'jack-doe',
    type: 'username',
    token: 'jackdoe',
    secret: '123'
  });
  await server.call('auth-create', {
    profileId: 'jack-doe',
    type: 'email',
    token: 'jack@doe.com',
    secret: '123'
  });
};

populate().catch(console.error);