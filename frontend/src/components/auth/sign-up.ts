
import { LoginRequestType } from "../../types/login-response.type";
import { openRoute } from "../../types/routes.type";
import { SignupRequestType } from "../../types/signup-response.type";
import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";

export class SignUp {
  private fullNameElement: HTMLInputElement | null;
  private fullNameErrorElement: HTMLElement | null;
  private emailElement: HTMLInputElement | null;
  private emailErrorElement: HTMLElement | null;
  private passwordElement: HTMLInputElement | null;
  private passwordErrorElement: HTMLElement | null;
  private repeatPasswordElement: HTMLInputElement | null;
  private repeatPasswordErrorElement: HTMLElement | null;
  private commonErrorElement: HTMLElement | null;

  private openNewRoute: openRoute;

  constructor(fn: openRoute) {
    this.openNewRoute = fn;
    this.fullNameElement = document.getElementById(
      "fullName"
    ) as HTMLInputElement;
    this.fullNameErrorElement = document.getElementById("fullName-error");
    this.emailElement = document.getElementById("email") as HTMLInputElement;
    this.emailErrorElement = document.getElementById("email-error");
    this.passwordElement = document.getElementById(
      "password"
    ) as HTMLInputElement;
    this.passwordErrorElement = document.getElementById("password-error");
    this.repeatPasswordElement = document.getElementById(
      "password-repeat"
    ) as HTMLInputElement;
    this.repeatPasswordErrorElement = document.getElementById(
      "password-repeat-error"
    );

    this.commonErrorElement = document.getElementById("common-error");
    if (AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      this.openNewRoute("/");
      return;
    }

    const proccessButtonElement: HTMLElement | null =
      document.getElementById("process-button");
    if (proccessButtonElement) {
      proccessButtonElement.addEventListener("click", this.signUp.bind(this));
    }
  }

  private validateForm(): boolean {
    let isValid = true;
    if (
      this.fullNameElement &&
      this.fullNameErrorElement &&
      this.emailElement &&
      this.emailErrorElement &&
      this.passwordElement &&
      this.passwordErrorElement &&
      this.repeatPasswordElement &&
      this.repeatPasswordErrorElement
    ) {
      if (
        this.fullNameElement.value &&
        this.fullNameElement.value.match(
          /^[А-ЯЁ][а-яё]{2,}([-][А-ЯЁ][а-яё]{2,})?\s[А-ЯЁ][а-яё]{2,}\s[А-ЯЁ][а-яё]{2,}$/
        )
      ) {
        this.fullNameElement.classList.remove("is-invalid");
        this.fullNameErrorElement.classList.add("d-none");
      } else {
        this.fullNameElement.classList.add("is-invalid");
        this.fullNameErrorElement.classList.remove("d-none");
        isValid = false;
      }
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
      if (
        this.passwordElement.value &&
        this.passwordElement.value.match(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+[{\]};:'",/?]).{8,}$/
        )
      ) {
        this.passwordElement.classList.remove("is-invalid");
        this.passwordErrorElement.classList.add("d-none");
      } else {
        this.passwordElement.classList.add("is-invalid");
        this.passwordErrorElement.classList.remove("d-none");
        isValid = false;
      }
      if (
        this.repeatPasswordElement.value &&
        this.passwordElement.value === this.repeatPasswordElement.value
      ) {
        this.repeatPasswordElement.classList.remove("is-invalid");
        this.repeatPasswordErrorElement.classList.add("d-none");
      } else {
        this.repeatPasswordElement.classList.add("is-invalid");
        this.repeatPasswordErrorElement.classList.remove("d-none");
        isValid = false;
      }
    }
    return isValid;
  }
  private async signUp(): Promise<void> {
    if (
      this.commonErrorElement &&
      this.fullNameElement &&
      this.emailElement &&
      this.passwordElement &&
      this.repeatPasswordElement
    ) {
      this.commonErrorElement.classList.add("d-none");
      console.log(this.validateForm());
      if (this.validateForm()) {
        const fullNameArray: string[] = this.fullNameElement.value.split(" ");

        const result: SignupRequestType = await HttpUtils.request(
          "/signup",
          "POST",
          false,
          {
            name: fullNameArray[1],
            lastName: fullNameArray[0],
            email: this.emailElement.value,
            password: this.passwordElement.value,
            passwordRepeat: this.repeatPasswordElement.value,
          }
        );
        if (result.error) {
          this.commonErrorElement.innerText = result.response.message as string;
          this.commonErrorElement.classList.remove("d-none");
          return;
        }

        if (result.response && result.response.user) {
          if (
            !result.response ||
            (result.response && !result.response.user.id) ||
            !result.response.user.email ||
            !result.response.user.name ||
            !result.response.user.lastName
          ) {
            this.commonErrorElement.classList.remove("d-none");
            return;
          }
          if (
            result.response.user.id ||
            result.response.user.email ||
            result.response.user.name ||
            result.response.user.lastName
          ) {
            const autoLogin: LoginRequestType = await HttpUtils.request(
              "/login",
              "POST",
              false,
              {
                email: this.emailElement.value,
                password: this.passwordElement.value,
                rememberMe: true,
              }
            );
            if (autoLogin.response.tokens && autoLogin.response.user) {
              AuthUtils.setAuthInfo(
                autoLogin.response.tokens.accessToken,
                autoLogin.response.tokens.refreshToken,
                {
                  id: autoLogin.response.user.id,
                  lastName: autoLogin.response.user.lastName,
                  name: autoLogin.response.user.name,
                }
              );
            }
          }
        }
        this.openNewRoute("/");
      }
    }
  }
}
