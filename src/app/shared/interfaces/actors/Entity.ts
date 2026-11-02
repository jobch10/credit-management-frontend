import { TypeDocument } from "./TypeDocument";

export interface Entity {
  id?: number;
  entityType?: string;
  typeDocumentId?: number;
  typeDocument?: TypeDocument;
  documentNumber?: string;
  legalName?: string;
  phone?: string;
  email?: string;
  tradeName?: string;
  address?: string;
  state?: boolean;
  createdAt: string;
}
