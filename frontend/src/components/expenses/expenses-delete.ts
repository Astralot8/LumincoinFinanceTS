import { HttpUtils } from "../../utils/http-utils";

export class ExpensesDelete {
  constructor(openNewRoute){
    this.openNewRoute = openNewRoute;
    const url = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    
    this.deleteExpense().then();
  }

  async deleteExpense() {
    
    const response = await HttpUtils.request("/categories/expense/" + this.id, "DELETE", true);

    if (response.error) {
      alert(response.error);
      return response.redirect ? this.openNewRoute(response.redirect) : null;
    }

    return this.openNewRoute('/expenses');
   

  }
  
}
