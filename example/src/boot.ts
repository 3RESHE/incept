// NOTE: Keep it short. Keep it brief. This boot is loaded per request.
import path from 'path';
import * as config from '../incept.config';

//--------------------------------------------------------------------//
// i18n Setup

import { i18n } from '@stackpress/incept-i18n';
i18n.languages = config.languages;

//--------------------------------------------------------------------//
// Session Setup

import { Session } from '@stackpress/incept-session';
const seed = process.env.SESSION_SEED as string || 'default';
const session = new Session(seed, config.access);

//--------------------------------------------------------------------//
// Ink Setup

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

const render = function(filePath: string, props: Record<string, unknown> = {}) {
  if (process.env.SERVER_ENV === 'development') {
    refresh.sync(compiler.fromSource(filePath));
  }
  return compiler.render(filePath, props);
};

export { i18n, session, compiler, refresh, render, config };