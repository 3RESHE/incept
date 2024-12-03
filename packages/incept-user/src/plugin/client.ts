import type { Factory } from '@stackpress/incept';
import Session from '../Session';

type ProjectConfig = { access: Record<string, string[]> };

const seed = process.env.SESSION_SEED as string || 'default';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(client: Factory<ProjectConfig>) {
  //get the project config
  const config = client.config.get();
  //make a new session
  const session = new Session(seed, config.access || {});
  //add session as a project plugin
  client.register('session', session);
};