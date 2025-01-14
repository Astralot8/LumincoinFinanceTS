
import { DefaultResponseType } from "../../types/default-response.type";
import { OperationRequestType } from "../../types/operation-request.type";
import { OperationType } from "../../types/operation.type";
import { openRoute } from "../../types/routes.type";
import { HttpUtils } from "../../utils/http-utils";

export class Profit {
  private popUpElement: HTMLElement | null;
  private confirmButton: HTMLLinkElement | null;
  private canceledButton: HTMLElement | null;
  private openNewRoute: openRoute;

  constructor(fn: openRoute) {
    this.openNewRoute = fn;
    this.popUpElement = document.getElementById("deleteProfit");
    this.confirmButton = document.getElementById(
      "confirm-button"
    ) as HTMLLinkElement;
    this.canceledButton = document.getElementById("canceled-button");
    this.getProfit().then();
  }

  private async getProfit(): Promise<void> {
    const result: DefaultResponseType | OperationRequestType =
      await HttpUtils.request("/categories/income", "GET", true);
    if ((result as DefaultResponseType).redirect) {
      return this.openNewRoute(
        (result as DefaultResponseType).redirect as string
      );
    }

    if ((result as DefaultResponseType).error) {
      console.log((result as DefaultResponseType).message);
    }

    this.showRecords((result as OperationRequestType).response);
  }

  private showRecords(profitArray: OperationType[]): void {
    const recordsElement: HTMLElement | null =
      document.getElementById("records");
    if (profitArray) {
      for (let i = 0; i < profitArray.length; i++) {
        const cardWrappElement: HTMLElement | null =
          document.createElement("div");
        cardWrappElement.className = "col ps-0 pe-3";
        const cardElement: HTMLElement | null = document.createElement("div");
        cardElement.className = "card p-3";
        const cardHeaderElement: HTMLElement | null =
          document.createElement("div");
        cardHeaderElement.className = "dashboard-pie-title h3";
        cardHeaderElement.innerText = profitArray[i].title as string;
        const cardButtonWrappElement: HTMLElement | null =
          document.createElement("div");
        cardButtonWrappElement.className = "d-flex gap-2";
        const cardButtonEditElement: HTMLAnchorElement | null =
          document.createElement("a");
        cardButtonEditElement.className = "btn btn-primary px-3";
        cardButtonEditElement.href = "/profit-edit?id=" + profitArray[i].id;
        cardButtonEditElement.innerText = "Редактировать";
        const cardButtonDeleteElement: HTMLAnchorElement | null =
          document.createElement("a");
        cardButtonDeleteElement.className = "btn btn-danger px-3 delete-button";
        cardButtonDeleteElement.href = "/openPopUp?id=" + profitArray[i].id;
        cardButtonDeleteElement.id = "delete-button";
        cardButtonDeleteElement.innerText = "Удалить";

        cardButtonWrappElement.appendChild(cardButtonEditElement);
        cardButtonWrappElement.appendChild(cardButtonDeleteElement);

        cardElement.appendChild(cardHeaderElement);
        cardElement.appendChild(cardButtonWrappElement);

        cardWrappElement.appendChild(cardElement);
        if (recordsElement) {
          recordsElement.appendChild(cardWrappElement);
        }
      }
    }

    const cardWrappAddElement: HTMLElement | null =
      document.createElement("div");
    cardWrappAddElement.className = "col ps-0 pe-3";
    const cardAddElement: HTMLElement | null = document.createElement("div");
    cardAddElement.className =
      "card p-3 h-100 justify-content-center text-center";
    const cardButtonCreateElement: HTMLAnchorElement | null =
      document.createElement("a");
    cardButtonCreateElement.href = "/profit-create";
    cardButtonCreateElement.innerHTML = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M14.5469 6.08984V9.05664H0.902344V6.08984H14.5469ZM9.32422 0.511719V15.0039H6.13867V0.511719H9.32422Z"
                                fill="#CED4DA" />
                        </svg>`;

    cardAddElement.appendChild(cardButtonCreateElement);
    cardWrappAddElement.appendChild(cardAddElement);
    if (recordsElement) {
      recordsElement.appendChild(cardWrappAddElement);
    }

    this.activateDeleteButton();
  }

  private activateDeleteButton(): void {
    const deleteButtons: NodeListOf<HTMLLinkElement> =
      document.querySelectorAll(".delete-button");
    if (deleteButtons) {
      Array.from(deleteButtons).forEach((link) => {
        link.addEventListener("click", (event) => {
          if (this.popUpElement && this.confirmButton) {
            this.popUpElement.style.display = "flex";
            event.preventDefault();
            this.confirmButton.addEventListener("click", () => {
              const url = new URLSearchParams(window.location.search);
              const id = url.get("id");
              if (this.confirmButton) {
                this.confirmButton.href = "/profit-delete?id=" + id;
              }
            });
          }
        });
      });
    }
  }
}
