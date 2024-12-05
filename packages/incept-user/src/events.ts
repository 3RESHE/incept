import { ServerRouter } from '@stackpress/ingest/dist/Router';

const emitter = new ServerRouter();

emitter.on('auth-signup', async function AuthSignup(req, res) {
  const server = req.context;
  const client = await import('@stackpress/incept/client');
  client.
  const input = config.input(req.data());
  const response = await actions.create(input);
  if (response.error) {
    res.setError(response);
  } else {
    res.setResults(response.results || {});
  }
});

export default emitter;