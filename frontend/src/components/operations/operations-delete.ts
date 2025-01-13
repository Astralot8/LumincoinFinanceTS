import { DefaultResponseType } from "../../types/default-response.type";
import { openRoute } from "../../types/routes.type";
import { HttpUtils } from "../../utils/http-utils";

export class profitExpensesDelete {
  private id: string | null;
  private openNewRoute: openRoute;

  constructor(fn: openRoute) {
    this.openNewRoute = fn;
    const url: URLSearchParams = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    this.deleteProfitExpense().then();
    this.openNewRoute("/operations");
  }

  private async deleteProfitExpense(): Promise<void> {
    const response: DefaultResponseType = await HttpUtils.request("/operations/" + this.id, "DELETE", true);

    // if (response.error === false) {
    //   response.redirect ? this.openNewRoute(response.redirect) : null;
    //   return;
    // } else {
      
    //   return;
    // }
  }
}
