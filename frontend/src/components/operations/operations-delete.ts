import { Router } from "../../router";
import { DefaultResponseType } from "../../types/default-response.type";
import { HttpUtils } from "../../utils/http-utils";

export class profitExpensesDelete {
  private id: string | null;
  private openNewRoute: any;

  constructor(openNewRoute: Router) {
    this.openNewRoute = openNewRoute;
    const url: URLSearchParams = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    this.deleteProfitExpense().then();
  }

  private async deleteProfitExpense(): Promise<void> {
    
    const response: DefaultResponseType = await HttpUtils.request("/operations/" + this.id, "DELETE", true);

    if (response.error) {
      alert(response.error);
      if(response.redirect){
        this.openNewRoute(response.redirect)
      }
    }
    return this.openNewRoute('/operations');
  }
}
