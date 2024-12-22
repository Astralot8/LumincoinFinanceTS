import { HttpUtils } from "../../utils/http-utils";

export class Profit {
  constructor(openNewRoute) {
    this.popUpElement = document.getElementById("deleteProfit");
    this.confirmButton = document.getElementById("confirm-button");
    this.canceledButton = document.getElementById("canceled-button");
    this.openNewRoute = openNewRoute;
    this.getProfit().then();
  }

  async getProfit() {
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
        "Возникла ошибка при запросе доходов. Обратитесь в поддержку."
      );
    }

    this.showRecords(result.response);
  }

  showRecords(profitArray) {
    const recordsElement = document.getElementById("records");
    if (profitArray) {
      for (let i = 0; i < profitArray.length; i++) {
        const cardWrappElement = document.createElement("div");
        cardWrappElement.className = "col ps-0 pe-3";
        const cardElement = document.createElement("div");
        cardElement.className = "card p-3";
        const cardHeaderElement = document.createElement("div");
        cardHeaderElement.className = "dashboard-pie-title h3";
        cardHeaderElement.innerText = profitArray[i].title;
        const cardButtonWrappElement = document.createElement("div");
        cardButtonWrappElement.className = "d-flex gap-2";
        const cardButtonEditElement = document.createElement("a");
        cardButtonEditElement.className = "btn btn-primary px-3";
        cardButtonEditElement.href = "/profit-edit?id=" + profitArray[i].id;
        cardButtonEditElement.innerText = "Редактировать";
        const cardButtonDeleteElement = document.createElement("a");
        cardButtonDeleteElement.className = "btn btn-danger px-3 delete-button";
        cardButtonDeleteElement.href = "/openPopUp?id=" + profitArray[i].id;
        cardButtonDeleteElement.id = "delete-button";
        cardButtonDeleteElement.innerText = "Удалить";

        cardButtonWrappElement.appendChild(cardButtonEditElement);
        cardButtonWrappElement.appendChild(cardButtonDeleteElement);

        cardElement.appendChild(cardHeaderElement);
        cardElement.appendChild(cardButtonWrappElement);

        cardWrappElement.appendChild(cardElement);

        recordsElement.appendChild(cardWrappElement);
      }
    }

    const cardWrappAddElement = document.createElement("div");
    cardWrappAddElement.className = "col ps-0 pe-3";
    const cardAddElement = document.createElement("div");
    cardAddElement.className =
      "card p-3 h-100 justify-content-center text-center";
    const cardButtonCreateElement = document.createElement("a");
    cardButtonCreateElement.href = "/profit-create";
    cardButtonCreateElement.innerHTML = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z"
                                fill="#CED4DA" />
                        </svg>`;

    cardAddElement.appendChild(cardButtonCreateElement);
    cardWrappAddElement.appendChild(cardAddElement);
    recordsElement.appendChild(cardWrappAddElement);

    this.activateDeleteButton();
  }

  activateDeleteButton(){
    const deleteButtons = document.querySelectorAll(".delete-button");
    if (deleteButtons) {
      Array.from(deleteButtons).forEach(link => {
        link.addEventListener("click", (event) => {
          this.popUpElement.style.display = "flex";
          event.preventDefault();
          this.confirmButton.addEventListener("click", ()=> {
            const url = new URLSearchParams(window.location.search);
            const id = url.get("id")
            this.confirmButton.href =
              "/profit-delete?id=" + id;  
          });
        });
      })
    }
  }
}
