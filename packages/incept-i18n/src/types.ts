export type Scalar = string | number | boolean | null | undefined;

export type Language = {
  label: string,
  translations: Record<string, string>
};

export type Languages = Record<string, Language>;