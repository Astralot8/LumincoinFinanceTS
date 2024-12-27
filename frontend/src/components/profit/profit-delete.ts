import { Router } from "../../router";
import { DefaultResponseType } from "../../types/default-response.type";
import { HttpUtils } from "../../utils/http-utils";

export class ProfitDelete {
  private id: string | null;

  constructor() {
    const url: URLSearchParams = new URLSearchParams(window.location.search);
    this.id = url.get("id");

    this.deleteProfit().then();
  }

  private async deleteProfit(): Promise<void> {
    const result: DefaultResponseType = await HttpUtils.request(
      "/categories/income/" + this.id,
      "DELETE",
      true
    );

    if (result.error) {
      alert("Не удалось удалить элемент, попробуйте позже.");
    }
    Router.openNewRoute("/profit");
    return;
  }
}
