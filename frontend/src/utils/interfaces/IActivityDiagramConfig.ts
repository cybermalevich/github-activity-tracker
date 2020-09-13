export interface IActivityDiagramConfigValue {
  date: string;
  count: number;
}

export interface IActivityDiagramConfig {
  startDate: string,
  endDate: string;
  values: IActivityDiagramConfigValue[];
}
