import { EnumExcepcionType } from "../enums/excepcion-type.enum";

export interface ApiResponse<T> {
  timestamp: string;
  status: number;
  success: boolean;
  title: string;
  message: string;
  data: T;
  path: string;
  type?: EnumExcepcionType;
  errors?: string[];
}