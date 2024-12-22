import { HttpUtils } from "../../utils/http-utils";

export class ExpensesEdit {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.editButton = document.getElementById("edit-button");
    this.expenseTitleElement = document.getElementById("expense-title");
    this.expenseTitleErrorElement =
      document.getElementById("expense-title-error");

    const url = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    this.getExpenseItemInfo();

    this.editButton.addEventListener("click", this.editExpenseItem.bind(this));
  }

  async getExpenseItemInfo() {
    const result = await HttpUtils.request(
      "/categories/expense/" + this.id,
      "GET",
      true
    );
    console.log(result.response.title);
    if (result || !result.response.error) {
      this.expenseTitleElement.value = result.response.title;
    }
  }

  async editExpenseItem() {
    if (this.expenseTitleElement.value) {
      await HttpUtils.request("/categories/expense/" + this.id, "PUT", true, {
        title: this.expenseTitleElement.value,
      });
      this.openNewRoute("/expenses");
    } else {
      this.expenseTitleErrorElement.classList.remove("d-none");
    }
  }
}
