import path from 'path';
import ink, { cache } from '@stackpress/ink/compiler';
import { plugin as css } from '@stackpress/ink-css';

import { dev } from '@stackpress/ink-dev';

const { refresh } = dev({ cwd: __dirname });

const build = path.join(__dirname, '../build');

//create ink compiler
const compiler = ink({ 
  brand: '', 
  cwd: __dirname, 
  minify: process.env.SERVER_ENV !== 'development' 
});
//use ink css
compiler.use(css());
//use build cache
compiler.use(cache({ 
  environment: process.env.NODE_ENV,
  buildPath: build
}));

const render = (filePath: string, props: Record<string, unknown> = {}) => {
  if (process.env.SERVER_ENV === 'development') {
    refresh.sync(compiler.fromSource(filePath));
  }
  return compiler.render(filePath, props);
};

export { refresh, render };
export default compiler;