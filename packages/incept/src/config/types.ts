//types
import type { 
  Scalar, 
  Data,
  EnumConfig,
  PluginConfig,
  PropConfig,
  ColumnConfig,
  TypeConfig,
  ModelConfig,
  FinalSchemaConfig as SchemaConfig
} from '@stackpress/idea-parser';
import type Model from './Model';
import type Column from './Column';

export { 
  Scalar, 
  Data,
  EnumConfig,
  PluginConfig,
  PropConfig,
  ColumnConfig,
  TypeConfig,
  ModelConfig,
  SchemaConfig
};

export type Assertion = {
  method: string,
  args: unknown[],
  message: string|null
};

export type Relation = {
  local: string,
  foreign: string,
  name?: string
};

export type ColumnInfo = {
  type: string;
  name: string;
  required: boolean;
  multiple: boolean;
  attributes: Record<string, unknown>;
};

export type Component = {
  method: string;
  args: Data[];
  attributes: Record<string, Data>;
}

export type ColumnRelation = { 
  model: Model, 
  column: Column, 
  key: Column, 
  type: number 
};

export type ColumnRelationLink = { 
  parent: ColumnRelation,
  child: ColumnRelation
};

export type SerialOptions = {
  bool?: boolean,
  date?: boolean,
  object?: boolean
};