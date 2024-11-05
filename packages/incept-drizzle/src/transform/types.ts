export type Config = { 
  url: { type: string, value: string }, 
  engine: { type: string, value: string } 
};
export type Method = { 
  name: string, 
  args: string[] 
};
export type Relations = Record<string, {
  localTable: string,
  localId: string,
  foreignTable: string,
  foreignId: string
}>;