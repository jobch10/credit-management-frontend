import { Module } from "./Module";

export interface Role {
  id?: number | null;
  name?: string | null;
  code?: string | null;
  state?: boolean | null;
  modules?: Module[] | null;
}