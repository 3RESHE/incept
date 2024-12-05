//stackpress
import type Column from '@stackpress/incept/dist/schema/Column';
//common
import type { Method, Relations } from '../types';
import { numdata, attr } from '../helpers';

//map from column types to sql types and helpers
export const typemap: Record<string, string> = {
  String: 'string',
  Text: 'string',
  Number: 'number',
  Integer: 'number',
  Float: 'real',
  Boolean: 'number',
  Date: 'string',
  Datetime: 'string',
  Time: 'string',
  Json: 'string',
  Object: 'string',
  Hash: 'string'
};

export default function sqlite(column: Column, relations: Relations) {
  const type = typemap[column.type];
  if (!type && !column.fieldset && !column.enum) {
    return [] as Method[];
  }

  let method: Method = { name: type, args: [ `'${column.name}'` ] };

  //char, varchar
  if (type === 'string') {
    if (column.type === 'Json' 
      || column.type === 'Object' 
      || column.type === 'Hash'
    ) {
      method = { 
        name: 'text', 
        args: [ 
          `'${column.name}'`, 
          "{ mode: 'json' }" 
        ] 
      };
    } else {
      method = { name: 'text', args: [ `'${column.name}'` ] };
    }
  //integer, smallint, bigint, float
  } else if (type === 'number') {
    const { decimalLength } = numdata(column);
    if (column.type === 'Boolean') {
      method = { 
        name: 'integer', 
        args: [ `'${column.name}'`, "{ mode: 'boolean' }" ] 
      };
    } else if (column.type === 'Float' || decimalLength > 0) {
      method = { name: 'real', args: [ `'${column.name}'` ] };
    } else {
      method = { name: 'integer', args: [ `'${column.name}'` ] };
    }
    //if it's a type
  } else if (column.fieldset) {
    method = { 
      name: 'text', 
      args: [ 
        `'${column.name}'`, 
        "{ mode: 'json' }" 
      ] 
    };
  } else if (column.enum) {
    method = { name: 'text', args: [ `'${column.name}'` ] };
  }

  return [ method, ...attr(column, relations) ];
}