import { Router } from "../../router";
import { DefaultResponseType } from "../../types/default-response.type";
import { OperationRequestType } from "../../types/operation-request.type";
import { OperationType } from "../../types/operation.type";
import { DateUtils } from "../../utils/date-utils";
import { HttpUtils } from "../../utils/http-utils";

export class ProfitExpenses {
  private recordsElement: HTMLElement | null;
  private popUpElement: HTMLElement | null;
  private confirmButton: HTMLLinkElement | null;
  private canceledButton: HTMLElement | null;
  private todayFilterButton: HTMLElement | null;
  private weekFilterButton: HTMLElement | null;
  private monthFilterButton: HTMLElement | null;
  private yearFilterButton: HTMLElement | null;
  private allFilterButton: HTMLElement | null;
  private intervalFilterButton: HTMLElement | null;
  private intervalPopUp: HTMLElement | null;

  private chooseButton: HTMLElement | null;
  private closeButton: HTMLElement | null;

  private startDateInput: HTMLInputElement | null;
  private endDateInput: HTMLInputElement | null;

  private startDay: Date | null;
  private endDay: Date | null;

  private startDateText: HTMLElement | null;
  private endDateText: HTMLElement | null;

  private filterButtonsArray: HTMLElement[];

  constructor() {
    this.recordsElement = document.getElementById("records");
    this.popUpElement = document.getElementById("deleteOperation");

    this.confirmButton = document.getElementById("confirm-button") as HTMLLinkElement;
    this.canceledButton = document.getElementById("canceled-button");

    this.todayFilterButton = document.getElementById("today-filter");
    this.weekFilterButton = document.getElementById("week-filter");
    this.monthFilterButton = document.getElementById("month-filter");
    this.yearFilterButton = document.getElementById("year-filter");
    this.allFilterButton = document.getElementById("all-filter");
    this.intervalFilterButton = document.getElementById("interval-filter");

    this.intervalPopUp = document.getElementById("set-interval");
    this.chooseButton = document.getElementById("choose-button");
    this.closeButton = document.getElementById("close-button");

    this.startDateInput = document.getElementById(
      "startDate"
    ) as HTMLInputElement;
    this.endDateInput = document.getElementById("endDate") as HTMLInputElement;

    this.startDay = null;
    this.endDay = null;

    this.startDateText = document.getElementById("startDateText");
    this.endDateText = document.getElementById("endDateText");

    this.filterButtonsArray = [
      this.todayFilterButton as HTMLElement,
      this.weekFilterButton as HTMLElement,
      this.monthFilterButton as HTMLElement,
      this.yearFilterButton as HTMLElement,
      this.allFilterButton as HTMLElement,
      this.intervalFilterButton as HTMLElement,
    ];

    this.init();
  }

  init() {
    if (this.todayFilterButton) {
      this.todayFilterButton.classList.add("active");
    }

    this.getProfitExpenses().then();
    this.watchActiveButton(this.filterButtonsArray);
  }

  private watchActiveButton(buttonsArray: HTMLElement[]): void {
    for (let i = 0; i < buttonsArray.length; i++) {
      buttonsArray[i].addEventListener("click", (e) => {
        if (buttonsArray[i].id === "today-filter") {
          this.resetTable();
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses();
        }
        if (buttonsArray[i].id === "week-filter") {
          this.resetTable();
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateFrom, DateUtils.dateWeek);
        }
        if (buttonsArray[i].id === "month-filter") {
          this.resetTable();
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateFrom, DateUtils.dateMonth);
        }
        if (buttonsArray[i].id === "year-filter") {
          this.resetTable();
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateFrom, DateUtils.dateYear);
        }
        if (buttonsArray[i].id === "all-filter") {
          this.resetTable();
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateOld, DateUtils.dateNew);
        }
        if (buttonsArray[i].id === "interval-filter") {
          if (this.intervalPopUp && this.chooseButton) {
            this.intervalPopUp.style.display = "flex";
            this.setInterval();
            this.chooseButton.addEventListener(
              "click",
              () => {
                if (this.intervalPopUp) {
                  this.intervalPopUp.style.display = "none";
                  this.resetTable();
                  buttonsArray[i].classList.add("active");
                  this.getProfitExpenses(this.startDay, this.endDay);
                }
              },
              { once: true }
            );
          }

          if (this.intervalPopUp && this.closeButton) {
            this.closeButton.addEventListener("click", () => {
              if (this.intervalPopUp) {
                this.intervalPopUp.style.display = "none";
              }
            });
          }
        }
      });
    }
  }

  private setInterval(): void {
    if (this.startDateInput && this.endDateInput) {
      this.startDateInput.addEventListener("change", () => {
        if (this.startDateText && this.startDateInput) {
          this.startDateText.innerText = new Date(
            this.startDateInput.value
          ).toLocaleDateString();
          this.startDay = new Date(this.startDateInput.value);
        }
      });
      this.endDateInput.addEventListener("change", () => {
        if (this.endDateText && this.endDateInput) {
          this.endDateText.innerText = new Date(
            this.endDateInput.value
          ).toLocaleDateString();
          this.endDay = new Date(this.endDateInput.value);
        }
      });
    }
  }

  private resetTable(): void {
    const buttonsElements: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll("button");
    buttonsElements.forEach((buttonItem: HTMLButtonElement) =>
      buttonItem.classList.remove("active")
    );
    const tableElement: NodeListOf<HTMLElement> = document.querySelectorAll(
      ".table-body-content"
    );
    tableElement.forEach((item: HTMLElement) => item.remove());
  }

  private async getProfitExpenses(
    dateFrom?: Date | null,
    dateTo?: Date | null
  ): Promise<void> {
    let result: OperationRequestType | DefaultResponseType;
    if (dateFrom && dateTo) {
      result = await HttpUtils.request(
        "/operations?period=interval&dateFrom=" +
          dateFrom +
          "&dateTo=" +
          dateTo,
        "GET",
        true
      );
      if ((result as DefaultResponseType).redirect) {
        return Router.openNewRoute(
          (result as DefaultResponseType).redirect as string
        );
      }

      if (
        (result as DefaultResponseType).error ||
        !(result as OperationRequestType).response ||
        ((result as OperationRequestType).response &&
          (result as OperationRequestType).response.error)
      ) {
        return alert(
          "Возникла ошибка при запросе операций. Обратитесь в поддержку."
        );
      }
    } else {
      result = await HttpUtils.request("/operations", "GET", true);
      if ((result as DefaultResponseType).redirect) {
        return Router.openNewRoute(
          (result as DefaultResponseType).redirect as string
        );
      }

      if (
        (result as DefaultResponseType).error ||
        !(result as OperationRequestType).response ||
        ((result as OperationRequestType).response &&
          (result as OperationRequestType).response.error)
      ) {
        return alert(
          "Возникла ошибка при запросе операций. Обратитесь в поддержку."
        );
      }
    }

    this.showRecords((result as OperationRequestType).response);
  }

  private showRecords(profitExpensesArray: OperationType[]): void {
    if (profitExpensesArray) {
      for (let i = 0; i < profitExpensesArray.length; i++) {
        const trElement: HTMLTableRowElement | null =
          document.createElement("tr");

        trElement.classList.add("table-body-content");
        trElement.insertCell().innerHTML = (i + 1).toString();

        if (profitExpensesArray[i].type === "income") {
          trElement.insertCell().innerHTML = `<span class="text-success">доход</span>`;
        } else {
          trElement.insertCell().innerHTML = `<span class="text-danger">расход</span>`;
        }

        trElement.insertCell().innerText = profitExpensesArray[i]
          .category as string;
        trElement.insertCell().innerText = profitExpensesArray[i].amount + "$";
        trElement.insertCell().innerText = new Date(
          profitExpensesArray[i].date as string
        ).toLocaleDateString() as string;
        trElement.insertCell().innerText = profitExpensesArray[i]
          .comment as string;
        trElement.insertCell().innerHTML =
          `<div>
                                <a href="/openPopUp?id=` +
          profitExpensesArray[i].id +
          `" class="text-decoration-none me-2 delete-button" id="delete-icon">
                                    <svg width="14" height="15" viewBox="0 0 14 15" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M4.5 5.5C4.77614 5.5 5 5.72386 5 6V12C5 12.2761 4.77614 12.5 4.5 12.5C4.22386 12.5 4 12.2761 4 12V6C4 5.72386 4.22386 5.5 4.5 5.5Z"
                                            fill="black" />
                                        <path
                                            d="M7 5.5C7.27614 5.5 7.5 5.72386 7.5 6V12C7.5 12.2761 7.27614 12.5 7 12.5C6.72386 12.5 6.5 12.2761 6.5 12V6C6.5 5.72386 6.72386 5.5 7 5.5Z"
                                            fill="black" />
                                        <path
                                            d="M10 6C10 5.72386 9.77614 5.5 9.5 5.5C9.22386 5.5 9 5.72386 9 6V12C9 12.2761 9.22386 12.5 9.5 12.5C9.77614 12.5 10 12.2761 10 12V6Z"
                                            fill="black" />
                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                            d="M13.5 3C13.5 3.55228 13.0523 4 12.5 4H12V13C12 14.1046 11.1046 15 10 15H4C2.89543 15 2 14.1046 2 13V4H1.5C0.947715 4 0.5 3.55228 0.5 3V2C0.5 1.44772 0.947715 1 1.5 1H5C5 0.447715 5.44772 0 6 0H8C8.55229 0 9 0.447715 9 1H12.5C13.0523 1 13.5 1.44772 13.5 2V3ZM3.11803 4L3 4.05902V13C3 13.5523 3.44772 14 4 14H10C10.5523 14 11 13.5523 11 13V4.05902L10.882 4H3.11803ZM1.5 3V2H12.5V3H1.5Z"
                                            fill="black" />
                                    </svg>
                                </a>
                                <a href="/operations-edit?id=` +
          profitExpensesArray[i].id +
          `" class="text-decoration-none" id=""edit-icon>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12.1465 0.146447C12.3417 -0.0488155 12.6583 -0.0488155 12.8536 0.146447L15.8536 3.14645C16.0488 3.34171 16.0488 3.65829 15.8536 3.85355L5.85357 13.8536C5.80569 13.9014 5.74858 13.9391 5.68571 13.9642L0.68571 15.9642C0.500001 16.0385 0.287892 15.995 0.146461 15.8536C0.00502989 15.7121 -0.0385071 15.5 0.0357762 15.3143L2.03578 10.3143C2.06092 10.2514 2.09858 10.1943 2.14646 10.1464L12.1465 0.146447ZM11.2071 2.5L13.5 4.79289L14.7929 3.5L12.5 1.20711L11.2071 2.5ZM12.7929 5.5L10.5 3.20711L4.00001 9.70711V10H4.50001C4.77616 10 5.00001 10.2239 5.00001 10.5V11H5.50001C5.77616 11 6.00001 11.2239 6.00001 11.5V12H6.29291L12.7929 5.5ZM3.03167 10.6755L2.92614 10.781L1.39754 14.6025L5.21903 13.0739L5.32456 12.9683C5.13496 12.8973 5.00001 12.7144 5.00001 12.5V12H4.50001C4.22387 12 4.00001 11.7761 4.00001 11.5V11H3.50001C3.28561 11 3.10272 10.865 3.03167 10.6755Z"
                                            fill="black" />
                                    </svg>
                                </a>
                            </div>`;
        if (this.recordsElement) {
          this.recordsElement.appendChild(trElement);
        }
      }
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
                this.confirmButton.href = "/operations-delete?id=" + id;
              }
            });
          }
        });
      });
    }
  }
}
