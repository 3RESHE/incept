import type Request from '@stackpress/ingest/dist/payload/Request';
import type Response from '@stackpress/ingest/dist/payload/Response';
import type { JwtPayload } from 'jsonwebtoken';
import type { PermissionList, SessionData } from './types';

import jwt from 'jsonwebtoken';
import Exception from '@stackpress/incept/dist/config/Exception';

/**
 * Used to get session data from tokens and check permissions
 */
export default class Session {
  public access: PermissionList;
  protected seed: string;

  /**
   * Need seed to verify tokens and access for roles 
   */
  public constructor(seed: string, access: PermissionList) {
    this.seed = seed;
    this.access = access;
  }

  /**
   * Authorizes a request, to be used with api handlers
   */
  public authorize(
    req: Request, 
    res: Response, 
    permits: string[] = []
  ) {
    const token = this.fromAuthorization(req);
    const permissions = this.permits(token || '');
    
    if (token) {
      const session = this.get(token);
      //if no session
      if (!session) {
        res.mimetype = 'application/json';
        res.body = Exception.for('Unauthorized').withCode(401).toResponse();
        return false;
      }

      if (!this.can(token, ...permits)) {
        res.mimetype = 'application/json';
        res.body = Exception.for('Unauthorized').withCode(401).toResponse();
        return false;
      }

      return { ...session, token, permissions };
    }

    if (!this.can('', ...permits)) {
      res.mimetype = 'application/json';
      res.body = Exception.for('Unauthorized').withCode(401).toResponse();
      return false;
    }
    
    return { id: 0, roles: [ 'GUEST' ], token, permissions };
  }

  /**
   * Returns true if a token has the required permissions
   */
  public can(token: string, ...permits: string[]) {
    if (permits.length === 0) {
      return true;
    }
    const permissions = this.permits(token);      
    return Array.isArray(permits) && permits.every(
      permit => permissions.includes(permit)
    );
  }

  /**
   * Gets token from request authorization header
   */
  public fromAuthorization(req: Request) {
    const authorization = req.headers.get('Authorization') as string;
    if (authorization) {
      const [ , token ] = authorization.split(' ');
      return token;
    }
    return null;
  }

  /**
   * Get session data from token
   */
  public get(token: string): SessionData|null {
    if (!token?.length) {
      return null;
    }
    let response: JwtPayload|string;
    try {
      response = jwt.verify(token, this.seed);
    } catch (error) {
      return null;
    }

    return typeof response === 'string' 
      ? JSON.parse(response)
      : response;
  }

  /**
   * Returns a list of permissions for a token
   */
  public permits(token: string) {
    const session = this.get(token);
    const roles: string[] = session?.roles || [ 'GUEST' ];
    return roles.map(
      //ie. [ ['GUEST', 'USER'], ['USER', 'ADMIN'] ]
      role => this.access[role] || []
    ).flat().filter(
      //unique
      (value, index, self) => self.indexOf(value) === index
    );
  }
};