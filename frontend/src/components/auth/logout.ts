import { Router } from "../../router";
import { AuthUtils } from "../../utils/auth-utils";

export class Logout {
  constructor() {
    if (
      !AuthUtils.getAuthInfo(AuthUtils.accessTokenKey) ||
      !AuthUtils.getAuthInfo(AuthUtils.refreshTokenKey)
    ) {
      Router.openNewRoute("/login");
      return;
    }
    this.logout().then();
  }

  private async logout(): Promise<void> {
    const refreshToken: string | null = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const result: Response = await fetch("http://localhost:3000/api/logout", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          refreshToken: refreshToken,
        }),
      });
      if (result) {
        AuthUtils.removeAuthInfo();
        Router.openNewRoute("/login");
      }
    } else {
      AuthUtils.removeAuthInfo();
      Router.openNewRoute("/login");
    }
  }
}
