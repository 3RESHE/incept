import fs from 'fs';
import path from 'path';
import Exception from '@stackpress/types/dist/Exception';

/**
 * Exceptions are used to give more information
 * of an error that has occured
 */
export default class InceptException extends Exception {
  /**
   * Return a new trace with source code snippet
   */
  public trace(start = 0, end = 0) {
    return super.trace(start, end).map(trace => {
      const { file } = trace;
      if (file.startsWith(path.sep) && fs.existsSync(file)) {
        const source = fs.readFileSync(file, 'utf8');
        return { ...trace, source };
      }
      return { ...trace, source: '' };
    });
  }
}