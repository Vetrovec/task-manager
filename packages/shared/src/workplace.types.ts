export interface IWorkplace {
  id: number;
  createdAt: Date;
  name: string;
  text: string;
}

export interface IFindAllWorkplacesResponse {
  workplaces: IWorkplace[];
}
