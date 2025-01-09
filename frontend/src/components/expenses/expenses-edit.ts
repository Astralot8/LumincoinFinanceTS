import { Router } from "../../router";
import { DefaultResponseType } from "../../types/default-response.type";
import { OperationRequestType } from "../../types/operation-request.type";
import { openRoute } from "../../types/routes.type";
import { HttpUtils } from "../../utils/http-utils";

export class ExpensesEdit {
  private editButton: HTMLElement | null;
  private expenseTitleElement: HTMLInputElement | null;
  private expenseTitleErrorElement: HTMLElement | null;
  private id: string | null;

  private openNewRoute: openRoute;

  constructor(fn: openRoute) {
    this.openNewRoute = fn;
    this.editButton = document.getElementById("edit-button");
    this.expenseTitleElement = document.getElementById(
      "expense-title"
    ) as HTMLInputElement;
    this.expenseTitleErrorElement = document.getElementById(
      "expense-title-error"
    );

    const url: URLSearchParams = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    this.getExpenseItemInfo();
    if (this.editButton) {
      this.editButton.addEventListener(
        "click",
        this.editExpenseItem.bind(this)
      );
    }
  }

  private async getExpenseItemInfo(): Promise<void> {
    const result: DefaultResponseType | OperationRequestType =
      await HttpUtils.request("/categories/expense/" + this.id, "GET", true);
    if (
      (result || !(result as OperationRequestType).response.error) &&
      this.expenseTitleElement
    ) {
      this.expenseTitleElement.value = (
        result as OperationRequestType
      ).response.title;
    }
  }

  private async editExpenseItem(): Promise<void> {
    if (this.expenseTitleElement && this.expenseTitleElement.value) {
      await HttpUtils.request("/categories/expense/" + this.id, "PUT", true, {
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
