import type { Factory } from '@stackpress/incept';
import type { Languages } from './types';

import I18N from './I18N';

type ProjectConfig = { languages: Languages };

/**
 * This interface is intended for the Incept library.
 */
export default function plugin(client: Factory<ProjectConfig>) {
  //get the project config
  const config = client.config.get();
  //make a new i18n
  const i18n = new I18N();
  //load the languages from the project config
  i18n.languages = config.languages || {};
  //add i18n as a project plugin
  client.register('i18n', i18n);
};