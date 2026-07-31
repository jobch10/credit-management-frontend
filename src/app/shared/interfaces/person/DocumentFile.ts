import { TypeDocument } from "./TypeDocument";

export interface DocumentFile {
  id?: number;
  entity: string;
  entityId: number;
  documentType?: TypeDocument | string;
  fileName: string;
  fileUrl: string;
  issueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}