import type SessionType from './Session';
export type PermissionList = Record<string, string[]>;
export type SessionData = Record<string, any> & { 
  id: string, 
  name: string,
  image?: string,
  roles: string[]
};
export type Session = SessionData & {
  token: string
};
export type SessionPlugin = SessionType;
export type AuthConfig = { 
  access: Record<string, string[]>,
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
  }
};