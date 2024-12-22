import { HttpUtils } from "../../utils/http-utils";

export class profitExpensesDelete {
  constructor(openNewRoute){
    this.openNewRoute = openNewRoute;
    const url = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    
    this.deleteProfitExpense().then();
  }

  async deleteProfitExpense() {
    
    const response = await HttpUtils.request("/operations/" + this.id, "DELETE", true);

    if (response.error) {
      alert(response.error);
      return response.redirect ? this.openNewRoute(response.redirect) : null;
    }

    return this.openNewRoute('/operations');
   

  }
  
}
