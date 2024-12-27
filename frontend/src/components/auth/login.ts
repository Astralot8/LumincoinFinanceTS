import { Router } from "../../router";
import { LoginRequestType } from "../../types/login-response.type";
import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";

export class Login {
  private emailElement: HTMLInputElement | null;
  private emailErrorElement: HTMLElement | null;
  private passwordElement: HTMLInputElement | null;
  private passwordErrorElement: HTMLElement | null;
  private rememberMeElement: HTMLInputElement | null;
  private commonErrorElement: HTMLElement | null;
  private openNewRoute: any;

  constructor(openNewRoute: Router) {
    this.openNewRoute = openNewRoute;

    this.emailElement = document.getElementById("email") as HTMLInputElement;
    this.emailErrorElement = document.getElementById("email-error");
    this.passwordElement = document.getElementById(
      "password"
    ) as HTMLInputElement;
    this.passwordErrorElement = document.getElementById("password-error");
    this.rememberMeElement = document.getElementById(
      "remember-me"
    ) as HTMLInputElement;
    this.commonErrorElement = document.getElementById("common-error");

    const proccessButtonElement: HTMLElement | null =
      document.getElementById("process-button");
    if (proccessButtonElement) {
      proccessButtonElement.addEventListener("click", this.login.bind(this));
    }

    if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      this.openNewRoute("/");
      return;
    }
  }

  private validateForm(): boolean {
    let isValid = true;
    if (
      this.emailElement &&
      this.emailErrorElement &&
      this.passwordElement &&
      this.passwordErrorElement
    ) {
      isValid = false;
      if (
        this.emailElement.value &&
        this.emailElement.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
      ) {
        this.emailElement.classList.remove("is-invalid");
        this.emailErrorElement.classList.add("d-none");
      } else {
        this.emailElement.classList.add("is-invalid");
        this.emailErrorElement.classList.remove("d-none");
        isValid = false;
      }
      if (this.passwordElement.value) {
        this.passwordElement.classList.remove("is-invalid");
        this.passwordErrorElement.classList.add("d-none");
      } else {
        this.passwordElement.classList.add("is-invalid");
        this.passwordErrorElement.classList.remove("d-none");
        isValid = false;
      }
    }
    return isValid;
  }

  private async login(): Promise<void> {
    if (
      this.commonErrorElement &&
      this.emailElement &&
      this.passwordElement &&
      this.rememberMeElement
    ) {
      this.commonErrorElement.classList.add("d-none");
      if (this.validateForm()) {
        const result: LoginRequestType = await HttpUtils.request(
          "/login",
          "POST",
          false,
          {
            email: this.emailElement.value,
            password: this.passwordElement.value,
            rememberMe: this.rememberMeElement.checked,
          }
        );
        if (result.response && result.response.tokens && result.response.user) {
          if (
            result.error ||
            !result.response ||
            !result.response.tokens.accessToken ||
            !result.response.tokens.refreshToken ||
            !result.response.user.id ||
            !result.response.user.lastName ||
            !result.response.user.name
            ) {
            this.commonErrorElement.classList.remove("d-none");
            AuthUtils.setAuthInfo(
              result.response.tokens.accessToken,
              result.response.tokens.refreshToken,
              {
                id: result.response.user.id,
                lastName: result.response.user.lastName,
                name: result.response.user.name,
              }
            );
            return;
          }
        }

        this.openNewRoute("/");
      }
    }
  }
}


