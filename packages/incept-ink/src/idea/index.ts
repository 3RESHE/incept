//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept-spec/dist/Registry';

//generators
import generateView from './view';
import generateForm from './form';
import generateFilters from './filters';
import generateTable from './table';

export default function generate(directory: Directory, registry: Registry) {
  generateView(directory, registry);
  generateForm(directory, registry);
  generateFilters(directory, registry);
  generateTable(directory, registry);
};