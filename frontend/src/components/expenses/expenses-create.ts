
import { HttpUtils } from "../../utils/http-utils";

export class ExpensesCreate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.createButton = document.getElementById("create-button");
    this.expenseTitleElement = document.getElementById("expense-title");
    this.expenseTitleErrorElement =
      document.getElementById("expense-title-error");

    this.createButton.addEventListener("click", this.createProfitItem.bind(this));
  }

  async createProfitItem(){

    if (this.expenseTitleElement.value) {
      await HttpUtils.request("/categories/expense", "POST", true, {
        title: this.expenseTitleElement.value,
      });
      this.openNewRoute("/expenses");
    } else {
      this.expenseTitleErrorElement.classList.remove("d-none");
    }

  }
}
