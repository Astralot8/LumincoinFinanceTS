import { Router } from "../../router";
import { DefaultResponseType } from "../../types/default-response.type";
import { HttpUtils } from "../../utils/http-utils";

export class ExpensesDelete {
  private id: string | null;

  constructor() {
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
    Router.openNewRoute("/expenses");
    return;
  }
}
