import type FileSystem from '@stackpress/types/dist/filesystem/FileSystem';

export type ConfigLoaderOptions = {
  cwd?: string,
  fs?: FileSystem
};

export type PluginLoaderOptions = ConfigLoaderOptions & {
  modules?: string, 
  plugins?: string[]
};