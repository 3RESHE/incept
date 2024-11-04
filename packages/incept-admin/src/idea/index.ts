//types
import type { Directory } from 'ts-morph';
import type Registry from '@stackpress/incept-spec/dist/Registry';
//generators
import generatePages from './pages';
import generateTemplates from './templates';
import generateRoutes from './routes';

export default function generate(directory: Directory, registry: Registry) {
  generatePages(directory, registry);
  generateTemplates(directory, registry);
  generateRoutes(directory, registry);
};