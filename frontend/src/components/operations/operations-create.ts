import { Router } from "../../router";
import { DefaultResponseType } from "../../types/default-response.type";
import { OperationRequestType } from "../../types/operation-request.type";
import { OperationType } from "../../types/operation.type";
import { HttpUtils } from "../../utils/http-utils";

export class profitExpensesCreate {
  private createButton: HTMLButtonElement | null;
  private typeElement: HTMLSelectElement | null;
  private typeErrorElement: HTMLElement | null;
  private categoryElement: HTMLSelectElement | null;
  private categoryErrorElement: HTMLElement | null;
  private amountElement: HTMLInputElement | null;
  private amountErrorElement: HTMLElement | null;
  private dateElement: HTMLInputElement | null;
  private dateErrorElement: HTMLElement | null;
  private commentElement: HTMLInputElement | null;
  private commentErrorElement: HTMLElement | null;
  private optionElementValue: string | null;
  private optionElement: string | null;
  private profitCategory: string | null;
  private expenseCategory: string | null;

  constructor() {
    this.createButton = document.getElementById(
      "create-button"
    ) as HTMLButtonElement;
    this.typeElement = document.getElementById("type") as HTMLSelectElement;
    this.typeErrorElement = document.getElementById("type-error");
    this.categoryElement = document.getElementById(
      "category"
    ) as HTMLSelectElement;
    this.categoryErrorElement = document.getElementById("category-error");
    this.amountElement = document.getElementById("amount") as HTMLInputElement;
    this.amountErrorElement = document.getElementById("amount-error");
    this.dateElement = document.getElementById("date") as HTMLInputElement;
    this.dateErrorElement = document.getElementById("date-error");
    this.commentElement = document.getElementById(
      "comment"
    ) as HTMLInputElement;
    this.commentErrorElement = document.getElementById("comment-error");
    this.profitCategory = null;
    this.expenseCategory = null;
    this.optionElement = null;
    this.optionElementValue = null;

    if (this.typeElement.value === "income") {
      this.getCategoryProfit();
    }

    if (this.typeElement.value === "expense") {
      this.getCategoryExpense();
    }

    this.typeElement.addEventListener("change", () => {
      if (this.typeElement && this.categoryElement) {
        if (this.typeElement.value === "income") {
          this.categoryElement.innerHTML = this.getCategoryProfit() as any;
        }
        if (this.typeElement.value === "expense") {
          this.categoryElement.innerHTML = this.getCategoryExpense() as any;
        }
      }
    });

    this.createButton.addEventListener(
      "click",
      this.createOperationsItem.bind(this)
    );
  }

  private async createOperationsItem(): Promise<void> {
    if (
      this.validateForm() &&
      this.typeElement &&
      this.amountElement &&
      this.dateElement &&
      this.commentElement
    ) {
      const result: DefaultResponseType | OperationRequestType =
        await HttpUtils.request("/operations", "POST", true, {
          type: this.typeElement.value,
          amount: parseInt(this.amountElement.value),
          date: this.dateElement.value,
          comment: this.commentElement.value,
          category_id: parseInt(this.optionElementValue as string),
        });
      if ((result as DefaultResponseType).redirect) {
        return Router.openNewRoute(
          (result as DefaultResponseType).redirect as string
        );
      }

      if (
        (result as DefaultResponseType).error ||
        !(result as OperationRequestType).response ||
        ((result as OperationRequestType).response &&
          (result as OperationRequestType).response.error)
      ) {
        return alert(
          "Возникла ошибка при создании операции. Обратитесь в поддержку."
        );
      }
      return Router.openNewRoute("/operations");
    }
  }

  private validateForm(): boolean {
    let isValid: boolean = true;
    if (
      this.amountErrorElement &&
      this.dateErrorElement &&
      this.commentErrorElement &&
      this.amountElement &&
      this.dateElement &&
      this.commentElement
    ) {
      this.amountErrorElement.classList.add("d-none");
      this.dateErrorElement.classList.add("d-none");
      this.commentErrorElement.classList.add("d-none");
      if (!this.amountElement.value) {
        this.amountErrorElement.classList.remove("d-none");
        isValid = false;
      }
      if (!this.dateElement.value) {
        this.dateErrorElement.classList.remove("d-none");
        isValid = false;
      }
      if (!this.commentElement.value) {
        this.commentErrorElement.classList.remove("d-none");
        isValid = false;
      }
    }
    return isValid;
  }

  private async getCategoryProfit(): Promise<void> {
    const result: DefaultResponseType | OperationRequestType = await HttpUtils.request("/categories/income", "GET", true);
    if ((result as DefaultResponseType).redirect) {
      return Router.openNewRoute((result as DefaultResponseType).redirect as string);
    }

    if (
      (result as DefaultResponseType).error ||
      !(result as OperationRequestType).response ||
      ((result as OperationRequestType).response && (result as OperationRequestType).response.error)
    ) {
      return alert(
        "Возникла ошибка при запросе операции. Обратитесь в поддержку."
      );
    }

    this.showRecords((result as OperationRequestType).response);
  }

  private async getCategoryExpense(): Promise<void> {
    const result: DefaultResponseType | OperationRequestType = await HttpUtils.request("/categories/expense", "GET", true);
    if ((result as DefaultResponseType).redirect) {
      return Router.openNewRoute((result as DefaultResponseType).redirect as string);
    }

    if (
      (result as DefaultResponseType).error ||
      !(result as OperationRequestType).response ||
      ((result as OperationRequestType).response && (result as OperationRequestType).response.error)
    ) {
      return alert(
        "Возникла ошибка при запросе расходов. Обратитесь в поддержку."
      );
    }

    this.showRecords((result as OperationRequestType).response);
  }

  private showRecords(categoriesArray: OperationType[]): void {
    if(this.categoryElement){
      for (let i = 0; i < categoriesArray.length; i++) {
        const optionElement = document.createElement("option");
        this.optionElementValue = (categoriesArray[0].id as number).toString();
        optionElement.value = (categoriesArray[i].id as number).toString();
        optionElement.innerText = categoriesArray[i].title as string;
        this.categoryElement.appendChild(optionElement);
      }
  
      this.categoryElement.addEventListener("change", (e: Event) => {
        this.optionElementValue = (e.target as HTMLOptionElement).value;
      });
    }
    
  }
}
