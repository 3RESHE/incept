import type { CookieOptions } from '@stackpress/incept';

const config = require('../incept.config') as Config;

export type Config = {
  plugins: string[],
  server: { cwd: string, mode: string, bodySize: number },
  access: Record<string, string[]>,
  cookie: CookieOptions,
  auth: {
    name: string,
    logo: string,
    '2fa': {},
    captcha: {},
    username: boolean,
    email: boolean,
    phone: boolean,
    password: {
      min: number,
      max: number,
      upper: boolean,
      lower: boolean,
      number: boolean,
      special: boolean
    }
  },
  template: {
    engine: string,
    config: {
      brand: string,
      minify: boolean,
      buildPath: string,
      cwd: string,
      dev: { 
        buildRoute: string,
        socketRoute: string
      }
    }
  },
  admin: {
    root: string,
    menu: {
      name: string,
      icon: string,
      path: string,
      match: string
    }[]
  },
  languages: Record<string, {
    label: string,
    translations: Record<string, string>
  }>
};

export { config };