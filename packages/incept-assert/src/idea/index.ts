//types
import type { Directory } from 'ts-morph';
import type Fieldset from '@stackpress/incept-spec/dist/Fieldset';
import type Registry from '@stackpress/incept-spec/dist/Registry';
//generators
import generateCreate from './create';
import generateUpdate from './update';

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    //get the final path (.incept/Profile/assert.ts)
    const file = `${model.name}/assert.ts`;
    //determine the source file
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //import { assert } from '@stackpress/incept-assert';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/incept-assert/dist/assert',
      defaultImport: 'assert'
    });
    //import { ProfileInput } from './types';
    source.addImportDeclaration({
      moduleSpecifier: './types',
      namedImports: [ `${model.title}Input` ]
    });
    //import * as address from '../address/assert';
    model.fieldsets.forEach(column => {
      const fieldset = column.fieldset as Fieldset;
      source.addImportDeclaration({
        moduleSpecifier: `../${fieldset.name}/assert`,
        defaultImport: `* as ${fieldset.name}`
      });
    })
    //generate the model
    generateCreate(source, model);
    generateUpdate(source, model);
  }
  //loop through fieldsets
  for (const fieldset of registry.fieldset.values()) {
    //get the final path (.incept/Profile/assert.ts)
    const file = `${fieldset.name}/assert.ts`;
    //determine the source file
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //import { assert } from '@stackpress/incept/dist/assert';
    source.addImportDeclaration({
      moduleSpecifier: '@stackpress/incept/dist/assert',
      namedImports: [ 'assert' ]
    });
    //import { ProfileInput } from '../profile/types';
    source.addImportDeclaration({
      moduleSpecifier: './types',
      namedImports: [ `${fieldset.title}Input` ]
    });
    //import * as address from '../Address/assert';
    fieldset.fieldsets.forEach(column => {
      const fieldset = column.fieldset as Fieldset;
      source.addImportDeclaration({
        moduleSpecifier: `../${fieldset.name}/assert`,
        defaultImport: `* as ${fieldset.name}`
      });
    })
    //generate the fieldset
    generateCreate(source, fieldset);
    generateUpdate(source, fieldset);
  }
};