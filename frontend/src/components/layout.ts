import { BalanceResponseType, BalanceType } from "../types/balance.type";
import { UserInfoType } from "../types/user-info.type";
import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";

export class Layout {
  private balanceElement: HTMLElement | null;
  private modalSheet: HTMLElement | null;
  private newBalanceValue: HTMLInputElement | null;
  private saveBalanceButton: HTMLElement | null;
  private cancelButton: HTMLElement | null;
  private balanceValue: number;
  private userName: HTMLElement | null;
  private mainButton: HTMLLinkElement | null;
  private mainSVGElement: HTMLElement | null;
  private operationButton: HTMLElement | null;
  private operationSVGElement: HTMLElement | null;
  private categotyButton: HTMLElement | null;
  private categotySVGElement: HTMLElement | null;
  private profitButton: HTMLElement | null;
  private expensesButton: HTMLElement | null;
  private linkArray: HTMLLinkElement[];

  constructor() {
    this.balanceElement = document.getElementById("balance");
    this.modalSheet = document.getElementById("modalSheet");
    this.newBalanceValue = document.getElementById(
      "newBalanceValue"
    ) as HTMLInputElement;
    this.saveBalanceButton = document.getElementById("save-button");
    this.cancelButton = document.getElementById("cancel-button");
    this.balanceValue = 0;
    this.userName = document.getElementById("userName");

    this.mainButton = document.getElementById("main") as HTMLLinkElement;
    this.mainSVGElement = document.getElementById("main-svg");
    this.operationButton = document.getElementById("operations");
    this.operationSVGElement = document.getElementById("operations-svg");

    this.categotyButton = document.getElementById("categoty");
    this.categotySVGElement = document.getElementById("categoty-svg");
    this.profitButton = document.getElementById("profit");
    this.expensesButton = document.getElementById("expenses");

    this.linkArray = [
      this.mainButton as HTMLLinkElement,
      this.operationButton as HTMLLinkElement,
      this.categotyButton as HTMLLinkElement,
      this.profitButton as HTMLLinkElement,
      this.expensesButton as HTMLLinkElement,
    ];

    this.watchUserName();
    this.watchBalance();
    this.watchActiveButton(this.linkArray);

    const balanceButtonElement: HTMLElement | null =
      document.getElementById("balance-button");
    if (balanceButtonElement) {
      balanceButtonElement.addEventListener(
        "click",
        this.changeBalance.bind(this)
      );
    }
  }

  private async watchBalance(): Promise<void> {
    const result: BalanceType = await HttpUtils.request(
      "/balance",
      "GET",
      true
    );
    // if (result.redirect) {
    //   return Router.openNewRoute(result.redirect);
    // }
    if (this.balanceElement) {
      if (result) {
        this.balanceElement.innerText = result.response.balance + "$";
        this.balanceValue = result.response.balance;
      } else {
        this.balanceElement.innerText = "Ошибка запроса баланса";
      }
    }
  }

  private watchUserName(): void {
    const userInfo: UserInfoType | null = JSON.parse(
      AuthUtils.getAuthInfo("userInfo") as string
    );
    if (userInfo && this.userName) {
      this.userName.innerText = userInfo.name + " " + userInfo.lastName;
    }
  }

  private async changeBalance(): Promise<void> {
    if (
      this.modalSheet &&
      this.newBalanceValue &&
      this.saveBalanceButton &&
      this.cancelButton
    ) {
      this.modalSheet.style.display = "flex";
      this.newBalanceValue.value = this.balanceValue.toString();
      this.saveBalanceButton.addEventListener(
        "click",
        this.saveBalance.bind(this)
      );
      this.cancelButton.addEventListener("click", () => {
        if (this.modalSheet) {
          this.modalSheet.style.display = "none";
        }
      });
    }
  }

  private async saveBalance(): Promise<void> {
    if (this.newBalanceValue && this.balanceElement && this.modalSheet) {
      let balanceValue = parseFloat(this.newBalanceValue.value);
      if (balanceValue && balanceValue >= 0) {
        const result: BalanceType = await HttpUtils.request(
          "/balance",
          "PUT",
          true,
          {
            newBalance: balanceValue,
          }
        );
        if (result) {
          this.balanceElement.innerText = result.response.balance + "$";
          this.modalSheet.style.display = "none";
          this.balanceValue = result.response.balance;
          return;
        } else {
          this.balanceElement.innerText = "Ошибка при изменении баланса";
          return;
        }
      } else {
        alert(
          "Баланс должен быть заполнен, укажите корректное значение баланса - равен или больше 0! "
        );
        return;
      }
    }
  }

  private watchActiveButton(linkArray: HTMLLinkElement[]): void {
    if (
      this.categotyButton &&
      this.categotySVGElement &&
      this.operationSVGElement &&
      this.mainSVGElement &&
      this.mainButton
    ) {
      for (let i = 0; i < Array.from(linkArray).length; i++) {
        if (linkArray[i].href === window.location.href) {
          linkArray[i].classList.add("active");
        }
        if (
          window.location.href.includes("profit") ||
          window.location.href.includes("expenses")
        ) {
          this.categotyButton.classList.add("active");
          this.categotySVGElement.style.fill = "#ffffff";
        }
        if (window.location.href.includes("/operations")) {
          this.operationSVGElement.style.fill = "#ffffff";
        }
        if (
          window.location.href.includes("/") &&
          window.location.href === this.mainButton.href
        ) {
          this.mainSVGElement.style.fill = "#ffffff";
        }
      }
    }
  }
}
