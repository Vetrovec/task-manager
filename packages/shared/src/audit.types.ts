export interface IAudit {
  id: number;
  userId: number;
  actionType: string;
  description: string;
  createdAt: Date;
}

export interface IGetAuditsResponse {
  log: IAudit[];
}
