//types
import type { SourceFile } from 'ts-morph';
import type Fieldset from '@stackpress/incept/dist/config/Fieldset';
//helpers
import assert from '../assert';
import { formatCode } from '@stackpress/incept/dist/config/helpers';

export function body(fieldset: Fieldset) {
  return formatCode(`
    //collect errors, if any
    const errors: Record<string, any> = {};
    ${fieldset.assertions.map(column => {
      const input = `input.${column.name}`;
      const error = `errors.${column.name}`;
      //for each assertion
      const assertions = column.assertions.filter(
        //filter out invalid methods
        assertion => Object.keys(assert).includes(assertion.method)
      ).filter(
        //filter out required
        assertion => assertion.method !== 'required'
      ).map(assertion => {
        const { method, message } = assertion;
        const args = assertion.args.map(
          arg => typeof arg === 'string'? `'${arg}'`: arg 
        );
        const assert = args.length > 0
          ? `assert.${method}(${input}, ${ args.join(', ')})`
          : `assert.${method}(${input})`;
        return `if (!${assert}) {
          ${error} = '${message}';
        }`;  
      });

      return assertions.length > 0 ? `//check ${column.name}
        if (typeof ${input} !== 'undefined') {
          ${assertions.join(' else ')}
        }`: '';
    }).filter(code => code.length > 0).join('\n')}

    ${fieldset.fieldsets.map(column => {
      const fieldset = column.fieldset as Fieldset;
      if (column.multiple) {
        //errors.address = input.address.map(address.create).filter(Boolean);
        //if (errors.address.length === 0) delete errors.address;
        return `
          if (typeof input.${column.name} !== 'undefined') {
            //check ${column.name}
            errors.${column.name} = input.${column.name}.map(${
              fieldset.camel
            }.create).filter(Boolean);
            if (errors.${column.name}.length === 0) {
              delete errors.${column.name};
            }
          }
        `.trim();
      } else {
        //errors.address = create(input.address);
        //if (!errors.address) delete errors.address;
        return `
          if (typeof input.${column.name} !== 'undefined') {
            //check ${column.name}
            errors.${fieldset.camel} = ${fieldset.camel}.create(input.${column.name});
            if (!errors.${fieldset.camel}) {
              delete errors.${fieldset.camel};
            }
          }
        `.trim();
      }
    }).join('\n')}
    return Object.keys(errors).length > 0 ? errors : null;
  `)
}

export default function generate(
  source: SourceFile, 
  fieldset: Fieldset,
  method = 'update'
) {
  //export function update(input: ProfileInput): Record<string, any>|null
  source.addFunction({
    isExported: true,
    name: method,
    parameters: [
      { name: 'input', type: `Partial<${fieldset.title}Input>` }
    ],
    returnType: 'Record<string, any>|null',
    statements: body(fieldset)
  });
}