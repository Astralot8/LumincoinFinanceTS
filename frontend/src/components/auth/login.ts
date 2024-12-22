import { AuthUtils } from "../../utils/auth-utils";
import { HttpUtils } from "../../utils/http-utils";

export class Login {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;

    if(AuthUtils.getAuthInfo(AuthUtils.accessTokenKey)) {
      return this.openNewRoute('/')
    }

    this.emailElement = document.getElementById("email");
    this.emailErrorElement = document.getElementById("email-error");
    this.passwordElement = document.getElementById("password");
    this.passwordErrorElement = document.getElementById("password-error");
    this.rememberMeElement = document.getElementById("remember-me");
    this.commonErrorElement = document.getElementById("common-error");

    document.getElementById("process-button").addEventListener("click", this.login.bind(this));
  }

  validateForm() {
    let isValid = true;
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
    return isValid;
  }

  async login() {
    this.commonErrorElement.classList.add("d-none");
    if (this.validateForm()) {

      const result = await HttpUtils.request('/login', 'POST', false, {
        email: this.emailElement.value,
        password: this.passwordElement.value,
        rememberMe: this.rememberMeElement.checked,
      })
      
      if(result.error || !result.response || (result.response && !result.response.tokens.accessToken || !result.response.tokens.refreshToken || !result.response.user.id || !result.response.user.lastName || !result.response.user.name)){
        this.commonErrorElement.classList.remove("d-none");
        return;
      }
      
      AuthUtils.setAuthInfo(result.response.tokens.accessToken, result.response.tokens.refreshToken, {id: result.response.user.id, lastName: result.response.user.lastName, name: result.response.user.name})
      
      this.openNewRoute('/');
      
    }
  }
}
