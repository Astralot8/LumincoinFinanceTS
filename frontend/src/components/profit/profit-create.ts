
import { HttpUtils } from "../../utils/http-utils";

export class ProfitCreate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.createButton = document.getElementById("create-button");
    this.profitTitleElement = document.getElementById("profit-title");
    this.profitTitleErrorElement =
      document.getElementById("profit-title-error");

    this.createButton.addEventListener("click", this.createProfitItem.bind(this));
  }

  async createProfitItem(){

    if (this.profitTitleElement.value) {
      await HttpUtils.request("/categories/income", "POST", true, {
        title: this.profitTitleElement.value,
      });
      this.openNewRoute("/profit");
    } else {
      this.profitTitleErrorElement.classList.remove("d-none");
    }

  }
}
