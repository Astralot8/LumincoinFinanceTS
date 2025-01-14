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
  }

  private async deleteProfitExpense(): Promise<void> {
    const result: DefaultResponseType = await HttpUtils.request("/operations/" + this.id, "DELETE", true);

    if (result.error) {
      alert("Не удалось удалить элемент, попробуйте позже.");
    }
    
    this.openNewRoute("/operations");
    return;
  }
}
