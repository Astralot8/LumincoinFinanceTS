
import { DefaultResponseType } from "../../types/default-response.type";
import { openRoute } from "../../types/routes.type";
import { HttpUtils } from "../../utils/http-utils";

export class ExpensesDelete {
  private id: string | null;

  private openNewRoute: openRoute;

  constructor(fn: openRoute) {
    this.openNewRoute = fn;
    const url: URLSearchParams = new URLSearchParams(window.location.search);
    this.id = url.get("id");

    this.deleteExpense().then();
  }

  private async deleteExpense(): Promise<void> {
    const result: DefaultResponseType = await HttpUtils.request(
      "/categories/expense/" + this.id,
      "DELETE",
      true
    );

    if (result.error) {
      alert("Не удалось удалить элемент, попробуйте позже.");
    }
    this.openNewRoute("/expenses");
    return;
  }
}
