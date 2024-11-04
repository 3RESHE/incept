import type Project from '@stackpress/incept/dist/Project';
import type { Languages } from './types';

import I18N from './I18N';

type ProjectConfig = { languages: Languages };

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(project: Project) {
  //get the project config
  const config = project.config.get<ProjectConfig>();
  //make a new i18n
  const i18n = new I18N();
  //load the languages from the project config
  i18n.languages = config.languages || {};
  //add i18n as a project plugin
  project.register('i18n', i18n);
};