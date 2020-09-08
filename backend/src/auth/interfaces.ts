export interface ILoginUser {
  id: string,
  githubId: number,
}

export interface IJwtPayload {
  id: string;
  sub: number | string;
}
