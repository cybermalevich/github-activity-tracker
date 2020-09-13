import { IUserData } from "../utils/interfaces/user";

export interface IContext {
  isAuthorized: boolean;
  userData: IUserData | null;
  handleLogout: (() => void);
  handleSettingAccessToken: ((t: string) => void);
  handleSettingLoading: ((b: boolean) => void);
}

const context: IContext = {
  isAuthorized: false,
  userData: null,
  handleLogout: () => {},
  handleSettingAccessToken(t: string) {},
  handleSettingLoading(b: boolean) {},
};

export default context;
