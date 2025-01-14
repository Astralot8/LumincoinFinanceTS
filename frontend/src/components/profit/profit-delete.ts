
import { DefaultResponseType } from "../../types/default-response.type";
import { openRoute } from "../../types/routes.type";
import { HttpUtils } from "../../utils/http-utils";

export class ProfitDelete {
  private id: string | null;

  private openNewRoute: openRoute;
  
    constructor(fn: openRoute) {
      this.openNewRoute = fn;
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

    this.openNewRoute("/profit");
    return;
  }
}
