import { User } from "../entities/user.entity";

export type BaseUser = Pick<User, "id" | "name" | "github_id" | "avatar_url" | "github_access_token">;
