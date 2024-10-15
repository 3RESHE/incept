//types
import type { Directory } from 'ts-morph';
import type { Config } from './types';
//project
import Registry from '../../configuration/Registry';
//generators
import generateStore from './store';
import generateSchema from './schema';
import generateActions from './actions';

/**
 * This is the The params comes form the cli
 * TODO: Enums, Unqiue
 */
export default function generate(
  directory: Directory, 
  registry: Registry,
  config: Config
) {
  //at a bare minimum generate the store
  generateStore(directory, registry, config);
  generateSchema(directory, registry, config);
  generateActions(directory, registry, config);
};