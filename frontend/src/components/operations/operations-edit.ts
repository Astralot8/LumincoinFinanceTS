import { HttpUtils } from "../../utils/http-utils";

export class profitExpensesEdit {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.editButton = document.getElementById("edit-button");
    this.typeElement = document.getElementById("type");
    this.categoryElement = document.getElementById("category");
    this.amountElement = document.getElementById("amount");
    this.amountErrorElement = document.getElementById("amount-error");
    this.dateElement = document.getElementById("date");
    this.dateErrorElement = document.getElementById("date-error");
    this.commentElement = document.getElementById("comment");
    this.commentErrorElement = document.getElementById("comment-error");

    this.optionElementValue = null;
    this.optionElement = null;

    const url = new URLSearchParams(window.location.search);
    this.id = url.get("id");
    this.getOperationsItemInfo();

    this.typeElement.addEventListener("change", () => {
      if (this.typeElement.value === "income") {
        this.categoryElement.innerHTML = this.getCategoryProfit();
      }
      if (this.typeElement.value === "expense") {
        this.categoryElement.innerHTML = this.getCategoryExpense();
      }
    });

    this.editButton.addEventListener(
      "click",
      this.editOperationsItem.bind(this)
    );
  }

  async getOperationsItemInfo() {
    const result = await HttpUtils.request(
      "/operations/" + this.id,
      "GET",
      true
    );
    
    if (result || !result.response.error) {
      this.typeElement.value = result.response.type;
      if (this.typeElement.value === "income") {
        this.getCategoryProfit();
      } else if (this.typeElement.value === "expense") {
        this.getCategoryExpense();
      }
      
      
      this.optionElement = result.response.category;
      this.amountElement.value = result.response.amount;
      this.dateElement.value = result.response.date;
      this.commentElement.value = result.response.comment;
    }
  }

  async editOperationsItem() {
    if (this.validateForm()) {
      const result = await HttpUtils.request(
        "/operations/" + this.id,
        "PUT",
        true,
        {
          type: this.typeElement.value,
          amount: parseInt(this.amountElement.value),
          date: this.dateElement.value,
          comment: this.commentElement.value,
          category_id: parseInt(this.optionElementValue),
        }
      );
      if (
        result.error ||
        !result.response ||
        (result.response && result.response.error)
      ) {
        return alert(
          "Возникла ошибка при редактировании операции. Обратитесь в поддержку."
        );
      }
      return this.openNewRoute("/operations");
    }
  }

  validateForm() {
    let isValid = true;
    this.amountErrorElement.classList.add("d-none");
    this.dateErrorElement.classList.add("d-none");

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

    this.showRecords(result.response, this.optionElement);
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

    this.showRecords(result.response, this.optionElement);
  }

  showRecords(categoriesArray, categoryName) {
    for (let i = 0; i < categoriesArray.length; i++) {
      const option = document.createElement("option");
      option.value = categoriesArray[i].id;
      option.innerText = categoriesArray[i].title;
      this.categoryElement.appendChild(option);

      if(categoryName === categoriesArray[i].title){
        this.categoryElement.value = categoriesArray[i].id;
        this.optionElementValue = categoriesArray[i].id;
      }
    }
    
    this.categoryElement.addEventListener("change", (e) => {
      this.optionElementValue = e.target.value;
    });
  }

  getCategoryId(){

  }
}
