import config from "../config/config";
import { RefreshResponseType } from "../types/refresh-response.type";
import { UserFullInfoType, UserInfoType } from "../types/user-info.type";

export class AuthUtils {
  public static accessTokenKey: string = "accessToken";
  public static refreshTokenKey: string = "refreshToken";
  public static userInfoTokenKey: string = "userInfo";

  public static setAuthInfo(
    accessToken: string,
    refreshToken: string,
    userInfo: UserInfoType
  ): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    if (userInfo) {
      localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
    }
  }

  public static removeAuthInfo(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userInfoTokenKey);
  }

  public static getAuthInfo(key?: string): string | UserFullInfoType {
    const usefInfoArray: string[] = [
      this.accessTokenKey,
      this.refreshTokenKey,
      this.userInfoTokenKey,
    ];
    if (key && usefInfoArray.includes(key)) {
      return (localStorage.getItem(key) as string);
    } else {
      const fullUserInfo: UserFullInfoType = {
        [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
        [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
        [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
      }
      return fullUserInfo;
    }
  }

  public static async updateAccessToken(): Promise<boolean> {
    let result: boolean = false;
    const refreshToken: string = this.getAuthInfo(this.refreshTokenKey) as string;
    const userInfo2: UserInfoType = JSON.parse((this.getAuthInfo("userInfo") as string));
    if (refreshToken) {
      const response: Response = await fetch(config.api + "/refresh", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ refreshTokenKey: refreshToken }),
      });
      if (response && response.status === 200) {
        const tokensObj: RefreshResponseType | null = await response.json();
        if (tokensObj && !tokensObj.error && tokensObj.tokens) {
          this.setAuthInfo(
            tokensObj.tokens.accessToken,
            tokensObj.tokens.refreshToken,
            userInfo2
          );
          result = true;
        }
      }
    }
    if (!result) {
      this.removeAuthInfo();
    }
    return result;
  }
}
