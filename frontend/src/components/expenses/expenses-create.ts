import { Router } from "../../router";
import { HttpUtils } from "../../utils/http-utils";

export class ExpensesCreate {
  private createButton: HTMLElement | null;
  private expenseTitleElement: HTMLInputElement | null;
  private expenseTitleErrorElement: HTMLElement | null;

  private openNewRoute: any;

  constructor(openNewRoute: Router) {
    this.openNewRoute = openNewRoute;
    this.createButton = document.getElementById("create-button");
    this.expenseTitleElement = document.getElementById(
      "expense-title"
    ) as HTMLInputElement;
    this.expenseTitleErrorElement = document.getElementById(
      "expense-title-error"
    );
    if (this.createButton) {
      this.createButton.addEventListener(
        "click",
        this.createProfitItem.bind(this)
      );
    }
  }

  private async createProfitItem(): Promise<void> {
    if (this.expenseTitleElement && this.expenseTitleElement.value) {
      await HttpUtils.request("/categories/expense", "POST", true, {
        title: this.expenseTitleElement.value,
      });
      this.openNewRoute("/expenses");
    } else {
      if (this.expenseTitleErrorElement) {
        this.expenseTitleErrorElement.classList.remove("d-none");
      }
    }
  }
}
