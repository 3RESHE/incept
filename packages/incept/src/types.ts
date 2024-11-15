import type FileSystem from '@stackpress/types/dist/filesystem/FileSystem';

export type Payload<T = any> = {
  code: number,
  status: string, 
  errors?: Record<string, any>,
  results?: T,
  total?: number
};

export type MethodName = 'all'
  | 'get'   | 'post'    |'put'
  | 'delete'| 'patch'   |'options'
  | 'head'  | 'connect' |'trace';

export type MethodRouter = Record<
  MethodName, 
  (route: string, entry: string) => void
>;

export type ConfigLoaderOptions = {
  cwd?: string,
  fs?: FileSystem
};

export type PluginLoaderOptions = ConfigLoaderOptions & {
  modules?: string, 
  plugins?: string[]
};