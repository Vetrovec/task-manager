export interface IUser {
  id: number;
  displayName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGetMeResponse {
  user: IUser;
}
