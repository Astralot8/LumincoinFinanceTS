import config from "../config/config";
import { AuthUtils } from "../utils/auth-utils";
import { HttpUtils } from "../utils/http-utils";

export class Layout {
  constructor(openNewRoute) {
    this.balanceElement = document.getElementById("balance");
    this.modalSheet = document.getElementById("modalSheet");
    this.newBalanceValue = document.getElementById("newBalanceValue");
    this.saveBalanceButton = document.getElementById("save-button");
    this.cancelButton = document.getElementById("cancel-button");
    this.balanceValue = null;
    this.userName = document.getElementById("userName");

    this.mainButton = document.getElementById("main");
    this.mainSVGElement = document.getElementById("main-svg");
    this.operationButton = document.getElementById("operations");
    this.operationSVGElement = document.getElementById("operations-svg");
    
    this.categotyButton = document.getElementById("categoty");
    this.categotySVGElement = document.getElementById("categoty-svg");
    this.profitButton = document.getElementById("profit");
    this.expensesButton = document.getElementById("expenses");

    this.linkArray = [
      this.mainButton,
      this.operationButton,
      this.categotyButton,
      this.profitButton,
      this.expensesButton,
    ];

    
    
    this.openNewRoute = openNewRoute;
    this.watchUserName();
    this.watchBalance();
    this.watchActiveButton(this.linkArray);

    document
      .getElementById("balance-button")
      .addEventListener("click", this.changeBalance.bind(this));
  }

  async watchBalance() {
    const result = await HttpUtils.request("/balance", "GET", true);
    if (result.redirect) {
      return this.openNewRoute(result.redirect);
    }
    if (result || !result.error) {
      this.balanceElement.innerText = result.response.balance + "$";
      this.balanceValue = result.response.balance;
    } else {
      this.balanceElement.innerText = "Ошибка запроса баланса";
    }
  }

  watchUserName() {
    const userInfo = JSON.parse(AuthUtils.getAuthInfo("userInfo"));
    if (userInfo) {
      this.userName.innerText = userInfo.name + " " + userInfo.lastName;
    }
  }

  async changeBalance() {
    this.modalSheet.style.display = "flex";
    this.newBalanceValue.value = this.balanceValue;
    this.saveBalanceButton.addEventListener(
      "click",
      this.saveBalance.bind(this)
    );
    this.cancelButton.addEventListener("click", () => {
      this.modalSheet.style.display = "none";
    });
  }

  async saveBalance() {
    let balanceValue = this.newBalanceValue.value;
    if (balanceValue && balanceValue >= 0) {
      const result = await HttpUtils.request("/balance", "PUT", true, {
        newBalance: balanceValue,
      });
      if (result || !result.error) {
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

  watchActiveButton(linkArray) {
    
    for(let i = 0; i < Array.from(linkArray).length; i++){
      if(linkArray[i].href === window.location.href){
        linkArray[i].classList.add("active");
      }
      if(window.location.href.includes("profit") || window.location.href.includes("expenses")){
        this.categotyButton.classList.add("active");
        this.categotySVGElement.style.fill = "#ffffff"
      }
      if(window.location.href.includes("/operations")){
        this.operationSVGElement.style.fill = "#ffffff"
      }
      if(window.location.href.includes("/") && window.location.href === this.mainButton.href){
        this.mainSVGElement.style.fill = "#ffffff"
      }
     
    }
  }
}
