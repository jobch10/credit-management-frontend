import { Entity } from "./Entity";

export interface Investor {
  id: number;
  entityId: number;
  entity: Entity;
  investorCode: string;
  investmentCapacity: number;
  preferredRate: number;
  notes: string;
  status: boolean;
  createdAt: string;
}