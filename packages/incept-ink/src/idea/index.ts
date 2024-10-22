//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept-spec/dist/Registry';

//generators
import generateDetail from './detail';
import generateForm from './form';
import generateSearch from './search';

export default function generate(directory: Directory, registry: Registry) {
  generateDetail(directory, registry);
  generateForm(directory, registry);
  generateSearch(directory, registry);
};