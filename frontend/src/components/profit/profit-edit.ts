import { Router } from "../../router";
import { DefaultResponseType } from "../../types/default-response.type";
import { OperationRequestType } from "../../types/operation-request.type";
import { OperationType } from "../../types/operation.type";
import { HttpUtils } from "../../utils/http-utils";

export class ProfitEdit {
  private editButton: HTMLElement | null;
  private profitTitleElement: HTMLInputElement | null;
  private profitTitleErrorElement: HTMLElement | null;
  private id: string | null;

  constructor() {
    
    this.editButton = document.getElementById("edit-button");
    this.profitTitleElement = document.getElementById("profit-title") as HTMLInputElement;
    this.profitTitleErrorElement =
      document.getElementById("profit-title-error");

    const url: URLSearchParams = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    this.getProfitItemInfo();
    if(this.editButton){
      this.editButton.addEventListener("click", this.editProfitItem.bind(this));
    }
  }

  private async getProfitItemInfo(): Promise<void> {
    const result: DefaultResponseType | OperationRequestType = await HttpUtils.request(
      "/categories/income/" + this.id,
      "GET",
      true
    );
    if (result || !(result as OperationRequestType).response.error) {
      if(this.profitTitleElement){
        this.profitTitleElement.value = (result as OperationRequestType).response.title;
      }
    }
  }

  private async editProfitItem(): Promise<void> {
    if (this.profitTitleElement && this.profitTitleElement.value) {
      await HttpUtils.request("/categories/income/" + this.id, "PUT", true, {
        title: this.profitTitleElement.value,
      });
      Router.openNewRoute("/profit");
    } else {
      if(this.profitTitleErrorElement){
        this.profitTitleErrorElement.classList.remove("d-none");
      }
    }
  }
}
