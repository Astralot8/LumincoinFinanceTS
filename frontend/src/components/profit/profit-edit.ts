import { HttpUtils } from "../../utils/http-utils";

export class ProfitEdit {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.editButton = document.getElementById("edit-button");
    this.profitTitleElement = document.getElementById("profit-title");
    this.profitTitleErrorElement =
      document.getElementById("profit-title-error");

    const url = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    this.getProfitItemInfo();

    this.editButton.addEventListener("click", this.editProfitItem.bind(this));
  }

  async getProfitItemInfo() {
    const result = await HttpUtils.request(
      "/categories/income/" + this.id,
      "GET",
      true
    );
    console.log(result.response.title);
    if (result || !result.response.error) {
      this.profitTitleElement.value = result.response.title;
    }
  }

  async editProfitItem() {
    if (this.profitTitleElement.value) {
      await HttpUtils.request("/categories/income/" + this.id, "PUT", true, {
        title: this.profitTitleElement.value,
      });
      this.openNewRoute("/profit");
    } else {
      this.profitTitleErrorElement.classList.remove("d-none");
    }
  }
}
