import { Router } from "../../router";
import { HttpUtils } from "../../utils/http-utils";
import { DefaultResponseType } from "../../types/default-response.type";

export class ProfitCreate {
  private createButton: HTMLElement | null;
  private profitTitleElement: HTMLInputElement | null;
  private profitTitleErrorElement: HTMLElement | null;

  private openNewRoute: any;

  constructor(openNewRoute: Router) {
    this.openNewRoute = openNewRoute;
    this.createButton = document.getElementById("create-button");
    this.profitTitleElement = document.getElementById("profit-title") as HTMLInputElement;
    this.profitTitleErrorElement =
      document.getElementById("profit-title-error");

      if(this.createButton){
        this.createButton.addEventListener("click", this.createProfitItem.bind(this));
      }
  }

  private async createProfitItem(): Promise<void>{

    if (this.profitTitleElement && this.profitTitleElement.value) {
      const result: DefaultResponseType =  await HttpUtils.request("/categories/income", "POST", true, {
        title: this.profitTitleElement.value,
      });
      if (result.error) {
        alert("Не удалось создать элемент, попробуйте позже.");
      }
      this.openNewRoute("/profit");
      return;
    } else {
      if(this.profitTitleErrorElement){
        this.profitTitleErrorElement.classList.remove("d-none");
      }
    }
  }
}
