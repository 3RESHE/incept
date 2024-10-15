import type { Data } from '@stackpress/idea-parser';
import { Exception } from '@stackpress/idea-parser';
import { Loader } from '@stackpress/idea-transformer';

/**
 * Returns true if the value is a native JS object
 */
export function isHash(value: unknown) {
  return typeof value === 'object' && value?.constructor.name === 'Object';
};

/**
 * Converts a string into camel format
 * ie. "some string" to "someString"
 */
export function camelize(string: string) {
  return lowerize(
    string.trim()
      //replace special characters with underscores
      .replace(/[^a-zA-Z0-9]/g, '_')
      //replace multiple underscores with a single underscore
      .replace(/_{2,}/g, '_')
      //trim underscores from the beginning and end of the string
      .replace(/^_+|_+$/g, '')
      //replace underscores with capital
      .replace(/([-_][a-z0-9])/ig, ($1) => {
        return $1.toUpperCase()
          .replace('-', '')
          .replace('_', '');
      })
  );
}

/**
 * Converts a word into capital format
 * ie. "title" to "Title"
 */
export function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

/**
 * Converts a word into lower format
 * ie. "Title" to "title"
 */
export function lowerize(word: string) {
  return word.charAt(0).toLowerCase() + word.slice(1);
}

/**
 * Returns the actual value even if it is an environment variable
 * ex. output "./modules/types.ts"
 * ex. output "env(OUTPUT)"
 */
export function enval<T = Data>(value: Data) {
  const string = (value || '').toString();
  const type = string.indexOf('env(') === 0 ? 'env': 'literal';
  const deconstructed = type === 'env' 
    ? string.replace('env(', '').replace(')', '')
    : value as T;
  return { type, value: deconstructed };
};

/**
 * Returns the absolute path of a file considering environment variables
 */
export function ensolute(output: string, cwd: string) {
  const path = enval<string>(output);
  return path.type === 'env' 
    ? process.env[path.value]
    : Loader.absolute(path.value, cwd);
}

/**
 * A simple code formatter
 */
export function formatCode(code: string): string {
  code = code
    .replace(/\}\s+else\s+if\s+\(/g, '} else if (')
    .replace(/\s*\n\s*\n\s*/g, "\n")
    .trim();
  const lines = code.split("\n");
  let indent = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.match(/^\}/g) || line.match(/^\)/g) || line.match(/^<\//g) || line.match(/^\/>/g)) {
      indent -= 2;
    }
    lines[i] = `${' '.repeat(indent >= 0 ? indent: 0)}${line}`;
    if (line.match(/\s*\{\s*$/g) || line.match(/\s*\(\s*$/g) || line.match(/\s*<[a-zA-Z][^>]*>{0,1}\s*$/g)) {
      indent += 2;
    }
  }
  return lines.join("\n");
};

/**
 * A simple code formatter
 */
export function pipeCode(code: string) {
  const lines: string[] = [];
  for (const line of code.split("\n")) {
    lines.push(line.replace(/^\s*\|\s{0,1}/g, ''))
  }
  return lines.join("\n").trim();
};

/**
 * Wraps any errors or exceptions in a reponse payload. 
 * This is for prisma, instead of throwing errors
 * 
 * Example: `const response = errorToResponse(e)`
 * Example: `await prisma.create().catch(errorToResponse)`
 */
export function toErrorResponse(e: Error|Exception, code = 400) {
  if (e.constructor.name === 'Exception') {
    const exception = e as Exception;
    return exception.toResponse();
  }
  const status = e.message;
  const payload: {
    code: number;
    status: string;
    errors?: Record<string, string|string[]>;
  } = { code, status };
  if (e instanceof Exception) {
    payload.errors = e.errors;
  }
  return payload;
};

/**
 * Wraps any results in a reponse payload. 
 * This is for prisma, instead of throwing errors
 * 
 * Example: `await prisma.create().then(resultsToResponse)`
 */
export function toResponse(results: any, total?: number) {
  if (typeof total === 'number') {
    return { code: 200, status: 'OK', results, total: total as number };
  }
  return { code: 200, status: 'OK', results };
};

/**
 * Formats an inputted value to an acceptable SQL string
 */
export function toSqlString<
  Strict = string|null|undefined
>(value: any, strict = false): Strict {
  if (typeof value === 'undefined') {
    return (strict ? '': undefined) as Strict;
  } else if (value === null) {
    return (strict ? '': null) as Strict;
  } else if (typeof value === 'object') {
    return JSON.stringify(value) as Strict;
  }
  return value.toString() as Strict;
}

/**
 * Formats an inputted value to an acceptable SQL boolean
 */
export function toSqlBoolean<
  Strict = boolean|null|undefined
>(value: any, strict = false): Strict {
  if (typeof value === 'undefined') {
    return (strict ? false: undefined) as Strict;
  } else if (value === null) {
    return (strict ? false: null) as Strict;
  }
  return Boolean(value) as Strict;
}

/**
 * Formats an inputted value to an acceptable SQL date string
 */
export function toSqlDate<
  Strict = string|null|undefined
>(value: any, strict = false): Strict {
  if (!strict) {
    if (typeof value === 'undefined') {
      return undefined as Strict;
    } else if (value === null) {
      return null as Strict;
    }
  }
  
  let date = value instanceof Date? value: new Date(value);
  //if invalid date
  if (isNaN(date.getTime())) {
    //soft error
    date = new Date(0);
  }

  const format = {
    year: String(date.getFullYear()),
    month: String(date.getMonth() + 1).padStart(2, '0'),
    day: String(date.getDate()).padStart(2, '0'),
    hour: String(date.getHours() % 12).padStart(2, '0'),
    min: String(date.getMinutes()).padStart(2, '0'),
    sec: String(date.getSeconds()).padStart(2, '0')
  };
  return [
    `${format.year}-${format.month}-${format.day}`,
    `${format.hour}:${format.min}:${format.sec}`
  ].join(' ') as Strict;
}

/**
 * Formats an inputted value to an acceptable SQL integer
 */
export function toSqlInteger<
  Strict = number|null|undefined
>(value: any, strict = false): Strict {
  if (typeof value === 'undefined') {
    return (strict ? 0: undefined) as Strict;
  } else if (value === null) {
    return (strict ? 0: null) as Strict;
  }
  return (parseInt(value) || 0) as Strict;
}

/**
 * Formats an inputted value to an acceptable SQL float
 */
export function toSqlFloat<
  Strict = number|null|undefined
>(value: any, strict = false): Strict {
  if (typeof value === 'undefined') {
    return (strict ? 0: undefined) as Strict;
  } else if (value === null) {
    return (strict ? 0: null) as Strict;
  }
  return (parseFloat(value) || 0) as Strict;
}