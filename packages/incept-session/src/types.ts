export type PermissionList = Record<string, string[]>;
export type SessionData = Record<string, any> & { 
  id: string, 
  roles: string[]
};
export type Session = SessionData & {
  token: string
};