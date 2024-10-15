//types
import type { Directory } from 'ts-morph';
import type Registry from '../../configuration/Registry';
//transformers
import enumGenerator from './enums';
import typeGenerator from './types';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  //generate enums
  enumGenerator(directory, registry);
  //generate typescript
  typeGenerator(directory, registry);

  const source = directory.createSourceFile('types.ts', '', { overwrite: true });

  //export * from './module/profile';
  for (const model of registry.model.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: `./${model.name}/types`
    });
  }
  //export * from './module/profile';
  for (const fieldset of registry.fieldset.values()) {
    source.addExportDeclaration({
      isTypeOnly: true,
      moduleSpecifier: `./${fieldset.name}/types`
    });
  }
};