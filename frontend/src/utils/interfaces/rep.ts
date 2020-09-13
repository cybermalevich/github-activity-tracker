interface RepUser {
  user_id: number;
  rep_id: number;
}

export interface IRep {
  id: number,
  github_id: number,
  name: string;
  url: string;
  repsUsers: RepUser[]
}
