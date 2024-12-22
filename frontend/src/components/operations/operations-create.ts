import { HttpUtils } from "../../utils/http-utils";

export class profitExpensesCreate {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.createButton = document.getElementById("create-button");
    this.typeElement = document.getElementById("type");
    this.typeErrorElement = document.getElementById("type-error");
    this.categoryElement = document.getElementById("category");
    this.categoryErrorElement = document.getElementById("category-error");
    this.amountElement = document.getElementById("amount");
    this.amountErrorElement = document.getElementById("amount-error");
    this.dateElement = document.getElementById("date");
    this.dateErrorElement = document.getElementById("date-error");
    this.commentElement = document.getElementById("comment");
    this.commentErrorElement = document.getElementById("comment-error");
    this.profitCategory = null;
    this.expenseCategory = null;
    this.optionElement = null;
    this.optionElementValue = null;

    if (this.typeElement.value === "income") {
      this.getCategoryProfit();
     
    }

    if (this.typeElement.value === "expense") {
      this.getCategoryExpense();
      
    }

    this.typeElement.addEventListener("change", () => {
      if (this.typeElement.value === "income") {
        this.categoryElement.innerHTML = this.getCategoryProfit();
       
      }
      if (this.typeElement.value === "expense") {
        this.categoryElement.innerHTML = this.getCategoryExpense();
       
      }
    });

    this.createButton.addEventListener(
      "click",
      this.createOperationsItem.bind(this)
    );
  }

  async createOperationsItem() {
    if (this.validateForm()) {
      const result = await HttpUtils.request("/operations", "POST", true, {
        type: this.typeElement.value,
        amount: parseInt(this.amountElement.value),
        date: this.dateElement.value,
        comment: this.commentElement.value,
        category_id: parseInt(this.optionElementValue),
      });
      if (result.redirect) {
        return this.openNewRoute(result.redirect);
      }

      if (
        result.error ||
        !result.response ||
        (result.response && result.response.error)
      ) {
        return alert(
          "Возникла ошибка при создании операции. Обратитесь в поддержку."
        );
      }
      return this.openNewRoute("/operations");
    }
  }

  validateForm() {
    let isValid = true;
    this.amountErrorElement.classList.add("d-none");
    this.dateErrorElement.classList.add("d-none");
    this.commentErrorElement.classList.add("d-none");
    if (!this.amountElement.value) {
      this.amountErrorElement.classList.remove("d-none");
      isValid = false;
    }
    if (!this.dateElement.value) {
      this.dateErrorElement.classList.remove("d-none");
      isValid = false;
    }
    if (!this.commentElement.value) {
      this.commentErrorElement.classList.remove("d-none");
      isValid = false;
    }
    return isValid;
  }

  async getCategoryProfit() {
    const result = await HttpUtils.request("/categories/income", "GET", true);
    if (result.redirect) {
      return this.openNewRoute(result.redirect);
    }

    if (
      result.error ||
      !result.response ||
      (result.response && result.response.error)
    ) {
      return alert(
        "Возникла ошибка при запросе операции. Обратитесь в поддержку."
      );
    }

    this.showRecords(result.response);
  }

  async getCategoryExpense() {
    const result = await HttpUtils.request("/categories/expense", "GET", true);
    if (result.redirect) {
      return this.openNewRoute(result.redirect);
    }

    if (
      result.error ||
      !result.response ||
      (result.response && result.response.error)
    ) {
      return alert(
        "Возникла ошибка при запросе расходов. Обратитесь в поддержку."
      );
    }

    this.showRecords(result.response);
  }

  showRecords(categoriesArray) {
    for (let i = 0; i < categoriesArray.length; i++) {
      const optionElement = document.createElement("option");
      this.optionElementValue = categoriesArray[0].id;
      optionElement.value = categoriesArray[i].id;
      optionElement.innerText = categoriesArray[i].title;
      this.categoryElement.appendChild(optionElement);
    }
    
    this.categoryElement.addEventListener("change", (e)=>{
      this.optionElementValue = e.target.value;
    })
  }
}
