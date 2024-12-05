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

export type SignupInput = {
  name: string,
  username?: string,
  email?: string,
  phone?: string,
  secret: string
};

export type SigninInput = {
  username?: string,
  email?: string,
  phone?: string,
  secret: string
};

export type SigninType = 'username' | 'email' | 'phone';
export type ProfileAuth = Profile & { auth: Record<string, Auth> };

export type Profile = {
  id: string;
  name: string;
  image?: string;
  type: string;
  roles: string[];
  tags: string[];
  references?: Record<string, string | number | boolean | null>;
  active: boolean;
  created: Date;
  updated: Date;
};
export type ProfileExtended = Profile;
export type ProfileInput = {
  id?: string;
  name: string;
  image?: string;
  type?: string;
  roles: string[];
  tags?: string[];
  references?: Record<string, string | number | boolean | null>;
  active?: boolean;
  created?: Date;
  updated?: Date;
};
export type Auth = {
  id: string;
  profileId: string;
  type: string;
  token: string;
  secret: string;
  verified: boolean;
  consumed: Date;
  active: boolean;
  created: Date;
  updated: Date;
};
export type AuthExtended = Auth & {
  profile: Profile;
};
export type AuthInput = {
  id?: string;
  profileId: string;
  type?: string;
  token: string;
  secret: string;
  verified?: boolean;
  consumed?: Date;
  active?: boolean;
  created?: Date;
  updated?: Date;
};