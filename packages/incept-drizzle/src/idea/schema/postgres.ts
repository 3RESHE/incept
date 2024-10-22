//types
import type Column from '@stackpress/incept-spec/dist/Column';
import type { Method, Relations } from '../types';
//helpers
import { clen, numdata, attr } from '../helpers';

const typemap: Record<string, string> = {
  String: 'string',
  Text: 'text',
  Number: 'number',
  Integer: 'number',
  Float: 'number',
  Boolean: 'boolean',
  Date: 'date',
  Datetime: 'timestamp',
  Time: 'time',
  Json: 'jsonb',
  Object: 'jsonb',
  Hash: 'jsonb'
}

export default function postgres(column: Column, relations: Relations) {
  const type = typemap[column.type];
  if (!type && !column.fieldset && !column.enum) {
    return [] as Method[];
  }

  let method: Method = { name: type, args: [ `'${column.name}'` ] };
  //array
  if (column.multiple) {
    method.name = 'jsonb';
  //char, varchar
  } else if (type === 'string') {
    const length = clen(column);

    if (length[0] === length[1]) {
      method = { 
        name: 'char', 
        args: [ 
          `'${column.name}'`, 
          `{ length: ${length[1]} }` 
        ] 
      };
    } else {
      method = { 
        name: 'varchar', 
        args: [ 
          `'${column.name}'`, 
          `{ length: ${length[1]} }` 
        ] 
      };
    }
  //integer, smallint, bigint, float
  } else if (type === 'number') {
    const { minmax, integerLength, decimalLength } = numdata(column);

    if (decimalLength > 0) {
      method = { 
        name: 'numeric', 
        args: [ 
          `'${column.name}'`, 
          JSON.stringify({
            precision: integerLength + decimalLength,
            scale: decimalLength,
            unsigned: minmax[0] < 0
          }).replaceAll('"', '') 
        ] 
      };
    } else if (integerLength === 1) {
      method = { name: 'smallint', args: [ `'${column.name}'` ] };
    } else if (integerLength > 8) {
      method = { name: 'bigint', args: [ `'${column.name}'` ] };
    } else {
      method = { 
        name: 'integer', 
        args: [ 
          `'${column.name}'`, 
          JSON.stringify({
            precision: integerLength,
            unsigned: minmax[0] < 0
          }).replaceAll('"', '') 
        ] 
      };
    }
  //if it's a type
  } else if (column.fieldset) {
    method.name = 'json';
  } else if (column.enum) {
    method = { 
      name: 'varchar', 
      args: [ 
        `'${column.name}'`, 
        `{ length: 255 }` 
      ] 
    };
  }

  return [ method, ...attr(column, relations) ];
}