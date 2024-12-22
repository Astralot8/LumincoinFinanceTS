import { HttpUtils } from "../../utils/http-utils";

export class ProfitDelete {
  constructor(openNewRoute){
    this.openNewRoute = openNewRoute;
    const url = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    
    this.deleteProfit().then();
  }

  async deleteProfit() {
    
    const response = await HttpUtils.request("/categories/income/" + this.id, "DELETE", true);

    if (response.error) {
      alert(response.error);
      return response.redirect ? this.openNewRoute(response.redirect) : null;
    }

    return this.openNewRoute('/profit');
   

  }
  
}
