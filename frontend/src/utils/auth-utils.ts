import config from "../config/config";

export class AuthUtils {
  static accessTokenKey = "accessToken";
  static refreshTokenKey = "refreshToken";
  static userInfoTokenKey = "userInfo";

  static setAuthInfo(accessToken, refreshToken, userInfo = null) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    if(userInfo){
      localStorage.setItem(this.userInfoTokenKey, JSON.stringify(userInfo));
    }
  }

  static removeAuthInfo() {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    localStorage.removeItem(this.userInfoTokenKey);
  }

  static getAuthInfo(key = null) {
    if (key && [this.accessTokenKey, this.refreshTokenKey, this.userInfoTokenKey].includes(key)) {
        return localStorage.getItem(key);   
    } else{
        return {
            [this.accessTokenKey]: localStorage.getItem(this.accessTokenKey),
            [this.refreshTokenKey]: localStorage.getItem(this.refreshTokenKey),
            [this.userInfoTokenKey]: localStorage.getItem(this.userInfoTokenKey),
        }
    }
  }

  static async updateAccessToken(){
    let result = false;
    const refreshToken = this.getAuthInfo(this.refreshTokenKey);
    const userInfo2 = JSON.parse(this.getAuthInfo("userInfo"));
    if(refreshToken) {
      const response = await fetch(config.api + '/refresh', {
        method: 'POST',
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({refreshToken: refreshToken}),
      });
      if(response && response.status === 200){
        const tokensObj = await response.json();
        if(tokensObj && !tokensObj.error){
          this.setAuthInfo(tokensObj.tokens.accessToken, tokensObj.tokens.refreshToken, userInfo2);
          result = true;
        }
      }
    }
    if(!result){
      this.removeAuthInfo();
    }
    return result;
  }
}