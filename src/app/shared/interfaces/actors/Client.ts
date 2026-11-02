import { Entity } from "./Entity";

export interface Client {
  id?: number;
  entityId?: number;
  entity?: Entity;
  clientCode?: string;
  riskLevel?: string;
  creditScore?: number;
  monthlyIncome?: number | null;
  economicActivity?: string;
  creditLimit?: number;
  availableCredit?: number;
  notes?: string;
  state?: boolean;
  createdAt: string;
}