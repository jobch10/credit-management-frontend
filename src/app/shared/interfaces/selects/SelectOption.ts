export type SelectOption<T = unknown> = T & {
  label: string;
  value?: string | number | T | null;
};