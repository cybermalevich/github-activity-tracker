import { IRep } from "./rep";

export interface IUser {
  id: string;
  github_id: string;
  name: string;
  github_access_token: string;
  access_token: string;
  profile_url: string;
  avatar_url: string;
}

export interface IUserData extends IUser {
  reps: IRep[];
}