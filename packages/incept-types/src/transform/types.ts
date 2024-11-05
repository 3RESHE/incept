//types
import type { Directory, SourceFile } from 'ts-morph';
import type Registry from '@stackpress/incept/dist/config/Registry';
import type Model from '@stackpress/incept/dist/config/Model';
import type Fieldset from '@stackpress/incept/dist/config/Fieldset';
//project
import { formatCode } from '@stackpress/incept/dist/config/helpers';

export const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'Date',
  Time: 'Date',
  Datetime: 'Date',
  Json: 'Record<string, string|number|boolean|null>',
  Object: 'Record<string, string|number|boolean|null>',
  Hash: 'Record<string, string|number|boolean|null>'
};

/**
 * This is the The params comes form the cli
 */
export default function generate(directory: Directory, registry: Registry) {
  //loop through models
  for (const model of registry.model.values()) {
    const file = `${model.name}/types.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //generate the model
    generateModel(source, model);
  }
  //loop through fieldsets
  for (const fieldset of registry.fieldset.values()) {
    const file = `${fieldset.name}/types.ts`;
    const source = directory.createSourceFile(file, '', { overwrite: true });
    //generate the fieldset
    generateFieldset(source, fieldset);
  }
};

/**
 * Generate model types
 */
export function generateModel(source: SourceFile, model: Model) {
  const columns = Array.from(model.columns.values());
  const enums = Array.from(model.enums.values()).map(column => column.type);
  //import {} from '../enums'
  if (enums.length > 0) {
    source.addImportDeclaration({
      moduleSpecifier: '../enums',
      namedImports: enums
    });
  }
  for (const column of model.fieldsets.values()) {
    //import {} from '../Address/types'
    source.addImportDeclaration({
      moduleSpecifier: `../${column.type}/types`,
      namedImports: [ column.type ]
    });
  }
  //export type Profile
  source.addTypeAlias({
    isExported: true,
    name: model.title,
    type: formatCode(`{
      ${columns.filter(
        //filter out columns that are not in the model map
        column => !!typemap[column.type] || !!column.enum || !!column.fieldset
      ).map(column => (
        //name?: string
        `${column.name}${
          !column.required ? '?' : ''
        }: ${typemap[column.type] || column.type}${
          column.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
  //export type ProfileExtended
  if (model.relations.length) {
    source.addTypeAlias({
      isExported: true,
      name: `${model.title}Extended`,
      type: formatCode(`${model.title} & {
        ${model.relations.map(column => (
          //user?: User
          `${column.name}${
            !column.required ? '?' : ''
          }: ${column.type}${
            column.multiple ? '[]' : ''
          }`
        )).join(',\n')}
      }`)
    });
  } else {
    source.addTypeAlias({
      isExported: true,
      name: `${model.title}Extended`,
      type: model.title
    });
  }
  //gather all the field inputs
  const inputs = columns
    .filter(column => !column.generated)
    .filter(column => [
      //should be a name on the map
      ...Object.keys(typemap),
      //...also include enum names
      ...model.enums.map(column => column.type),
      //...also include fieldset names
      ...model.fieldsets.map(column => column.fieldset?.title)
    ].includes(column.type));
  //export type ProfileInput
  source.addTypeAlias({
    isExported: true,
    name: `${model.title}Input`,
    type: formatCode(`{
      ${inputs.map(column => (
        //name?: string
        `${column.name}${
          !column.required || typeof column.default !== 'undefined' ? '?' : ''
        }: ${typemap[column.type] || column.type}${
          column.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
};

/**
 * Generate fieldset types
 */
export function generateFieldset(source: SourceFile, fieldset: Fieldset) {
  const columns = Array.from(fieldset.columns.values());
  const enums = Array.from(fieldset.enums.values()).map(column => column.type);
  //import {} from '../enums'
  if (enums.length > 0) {
    source.addImportDeclaration({
      moduleSpecifier: '../enums',
      namedImports: enums
    });
  }
  for (const column of fieldset.fieldsets.values()) {
    //import {} from '../Address/types'
    source.addImportDeclaration({
      moduleSpecifier: `../${column.type}/types`,
      namedImports: [ column.type ]
    });
  }
  //export type Profile
  source.addTypeAlias({
    isExported: true,
    name: fieldset.title,
    type: formatCode(`{
      ${columns.filter(
        //filter out columns that are not in the map
        column => !!typemap[column.type] || !!column.enum || !!column.fieldset
      ).map(column => (
        //name?: string
        `${column.name}${
          !column.required ? '?' : ''
        }: ${typemap[column.type] || column.type}${
          column.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
  //gather all the field inputs
  const inputs = columns
    .filter(column => !column.generated)
    .filter(column => [ 
      //should be a name on the map
      ...Object.keys(typemap),
      //...also include enum names
      ...fieldset.enums.map(column => column.type),
      //...also include fieldset names
      ...fieldset.fieldsets.map(column => column.fieldset?.title)
    ].includes(column.type));
  //export type ProfileInput
  source.addTypeAlias({
    isExported: true,
    name: `${fieldset.title}Input`,
    type: formatCode(`{
      ${inputs.map(column => (
        //name?: string
        `${column.name}${
          !column.required || typeof column.default !== 'undefined' ? '?' : ''
        }: ${typemap[column.type] || column.type}${
          column.multiple ? '[]' : ''
        }`
      )).join(',\n')}
    }`)
  });
};