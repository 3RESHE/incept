//stackpress
import type { PluginWithProject } from '@stackpress/incept/dist/types';
import Registry from '@stackpress/incept/dist/schema/Registry';
//local
import generateView from './view';
import generateForm from './form';
import generateFilters from './filters';
import generateTable from './table';


/**
 * @stackpress/.incept (file structure)
 * - profile/
 * | - components/
 * | | - filter.ink
 * | | - form.ink
 * | | - table.ink
 * | | - view.ink
 */

/**
 * This is the The params comes form the cli
 */
export default function generate(props: PluginWithProject) {
  //-----------------------------//
  // 1. Config
  //extract props
  const { schema, project } = props;
  const registry = new Registry(schema);

  //-----------------------------//
  // 2. Generators
  // - profile/components/view.ink
  generateView(project, registry);
  // - profile/components/form.ink
  generateForm(project, registry);
  // - profile/components/filters.ink
  generateFilters(project, registry);
  // - profile/components/table.ink
  generateTable(project, registry);
};