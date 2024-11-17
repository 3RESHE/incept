import type Project from '@stackpress/incept/dist/Project';
import Session from './Session';

type ProjectConfig = { access: Record<string, string[]> };

const seed = process.env.SESSION_SEED as string || 'default';

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(project: Project) {
  //get the project config
  const config = project.config.get<ProjectConfig>();
  //make a new session
  const session = new Session(seed, config.access || {});
  //add session as a project plugin
  project.register('session', session);
};