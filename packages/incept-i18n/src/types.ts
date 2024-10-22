export type Scalar = string | number | boolean | null | undefined;

export type Languages = Record<string, {
  label: string,
  translations: Record<string, string>
}>;