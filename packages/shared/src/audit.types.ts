export interface IAudit {
  id: number;
  userId: number;
  actionType: string;
  description: string;
  createdAt: Date;
}

export type IGetAuditsResponse = IAudit[];
