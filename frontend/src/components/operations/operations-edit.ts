import { Router } from "../../router";
import { DefaultResponseType } from "../../types/default-response.type";
import { OperationRequestType } from "../../types/operation-request.type";
import { OperationType } from "../../types/operation.type";
import { HttpUtils } from "../../utils/http-utils";

export class profitExpensesEdit {
  private editButton: HTMLButtonElement | null;
  private typeElement: HTMLSelectElement | null;
  private categoryElement: HTMLSelectElement | null;
  private amountElement: HTMLInputElement | null;
  private amountErrorElement: HTMLElement | null;
  private dateElement: HTMLInputElement | null;
  private dateErrorElement: HTMLElement | null;
  private commentElement: HTMLInputElement | null;
  private commentErrorElement: HTMLElement | null;
  private optionElementValue: string | null;
  private optionElement: string | null;
  private id: string | null;

  constructor() {
    this.editButton = document.getElementById(
      "edit-button"
    ) as HTMLButtonElement;
    this.typeElement = document.getElementById("type") as HTMLSelectElement;
    this.categoryElement = document.getElementById(
      "category"
    ) as HTMLSelectElement;
    this.amountElement = document.getElementById("amount") as HTMLInputElement;
    this.amountErrorElement = document.getElementById("amount-error");
    this.dateElement = document.getElementById("date") as HTMLInputElement;
    this.dateErrorElement = document.getElementById("date-error");
    this.commentElement = document.getElementById(
      "comment"
    ) as HTMLInputElement;
    this.commentErrorElement = document.getElementById("comment-error");

    this.optionElementValue = null;
    this.optionElement = null;

    const url: URLSearchParams = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    this.getOperationsItemInfo();

    this.typeElement.addEventListener("change", () => {
      if (this.typeElement && this.typeElement.value === "income") {
        if (this.categoryElement) {
          this.categoryElement.innerHTML = this.getCategoryProfit() as any;
        }
      }
      if (this.typeElement && this.typeElement.value === "expense") {
        if (this.categoryElement) {
          this.categoryElement.innerHTML = this.getCategoryExpense() as any;
        }
      }
    });

    this.editButton.addEventListener(
      "click",
      this.editOperationsItem.bind(this)
    );
  }

  private async getOperationsItemInfo(): Promise<void> {
    const result: DefaultResponseType | OperationRequestType =
      await HttpUtils.request("/operations/" + this.id, "GET", true);

    if (result || !(result as OperationRequestType).response.error) {
      if (this.typeElement) {
        this.typeElement.value = (result as OperationRequestType).response.type;
        if (this.typeElement.value === "income") {
          this.getCategoryProfit();
        } else if (this.typeElement.value === "expense") {
          this.getCategoryExpense();
        }
      }

      this.optionElement = (result as OperationRequestType).response.category;
      if (this.amountElement) {
        this.amountElement.value = (
          result as OperationRequestType
        ).response.amount;
      }
      if (this.dateElement) {
        this.dateElement.value = (result as OperationRequestType).response.date;
      }
      if (this.commentElement) {
        this.commentElement.value = (
          result as OperationRequestType
        ).response.comment;
      }
    }
  }

  private async editOperationsItem(): Promise<void> {
    if (
      this.typeElement &&
      this.amountElement &&
      this.dateElement &&
      this.commentElement &&
      this.optionElementValue
    ) {
      if (this.validateForm()) {
        const result: DefaultResponseType | OperationRequestType =
          await HttpUtils.request("/operations/" + this.id, "PUT", true, {
            type: this.typeElement.value,
            amount: parseInt(this.amountElement.value),
            date: this.dateElement.value,
            comment: this.commentElement.value,
            category_id: parseInt(this.optionElementValue),
          });
        if (
          (result as DefaultResponseType).error ||
          !(result as OperationRequestType).response ||
          ((result as OperationRequestType).response &&
            (result as OperationRequestType).response.error)
        ) {
          return alert(
            "Возникла ошибка при редактировании операции. Обратитесь в поддержку."
          );
        }
        return Router.openNewRoute("/operations");
      }
    }
  }

  private validateForm(): boolean {
    let isValid = true;
    if (this.amountErrorElement && this.dateErrorElement) {
      this.amountErrorElement.classList.add("d-none");
      this.dateErrorElement.classList.add("d-none");

      if (this.amountElement && !this.amountElement.value) {
        this.amountErrorElement.classList.remove("d-none");
        isValid = false;
      }
      if (this.dateElement && !this.dateElement.value) {
        this.dateErrorElement.classList.remove("d-none");
        isValid = false;
      }
      if (
        this.commentElement &&
        this.commentErrorElement &&
        !this.commentElement.value
      ) {
        this.commentErrorElement.classList.remove("d-none");
        isValid = false;
      }
    }
    return isValid;
  }

  private async getCategoryProfit(): Promise<void> {
    const result = await HttpUtils.request("/categories/income", "GET", true);
    if (result.redirect) {
      return Router.openNewRoute(result.redirect);
    }

    if (
      result.error ||
      !result.response ||
      (result.response && result.response.error)
    ) {
      return alert(
        "Возникла ошибка при запросе операции. Обратитесь в поддержку."
      );
    }

    this.showRecords(result.response, this.optionElement as string);
  }

  private async getCategoryExpense(): Promise<void> {
    const result = await HttpUtils.request("/categories/expense", "GET", true);
    if (result.redirect) {
      return Router.openNewRoute(result.redirect);
    }

    if (
      result.error ||
      !result.response ||
      (result.response && result.response.error)
    ) {
      return alert(
        "Возникла ошибка при запросе расходов. Обратитесь в поддержку."
      );
    }

    this.showRecords(result.response, this.optionElement as string);
  }

  private showRecords(
    categoriesArray: OperationType[],
    categoryName: string
  ): void {
    for (let i = 0; i < categoriesArray.length; i++) {
      const option: HTMLOptionElement | null = document.createElement("option");
      option.value = (categoriesArray[i].id as number).toString();
      option.innerText = categoriesArray[i].title as string;
      if(this.categoryElement){
        this.categoryElement.appendChild(option);
      }
      if (categoryName === categoriesArray[i].title) {
        if(this.categoryElement){
          this.categoryElement.value = (categoriesArray[i].id as number).toString();
        }
        this.optionElementValue = (categoriesArray[i].id as number).toString();
      }
    }
    if(this.categoryElement){
      this.categoryElement.addEventListener("change", (e: Event) => {
        if(e.target){
          this.optionElementValue = (e.target as HTMLOptionElement).value;
        }
      });
    }
  }
}
