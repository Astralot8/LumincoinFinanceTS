
import { DefaultResponseType } from "../types/default-response.type";
import { OperationRequestType } from "../types/operation-request.type";
import { OperationType } from "../types/operation.type";
import { openRoute } from "../types/routes.type";
import { DateUtils } from "../utils/date-utils";
import { HttpUtils } from "../utils/http-utils";

import { Chart } from "chart.js/auto";


export class Dashboard {
  private recordsElement: HTMLElement | null;
  private popUpElement: HTMLElement | null;

  private confirmButton: HTMLElement | null;
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
  private incomeChartElement: HTMLCanvasElement | null;
  private expenseChartElement: HTMLCanvasElement | null;
  private incomeChart: any;
  private expenseChart: any;

  private incomeChartArray: OperationType[];
  private expenseChartArray: OperationType[];
  private incomeChartArrayConcat: any;
  private expenseChartArrayConcat: any;

  private openNewRoute: openRoute;

  constructor(fn: openRoute) {
    this.openNewRoute = fn;
    this.recordsElement = document.getElementById("records");
    this.popUpElement = document.getElementById("deleteOperation");

    this.confirmButton = document.getElementById("confirm-button");
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

    this.incomeChartElement = document.getElementById(
      "income"
    ) as HTMLCanvasElement;
    this.expenseChartElement = document.getElementById(
      "expense"
    ) as HTMLCanvasElement;
    this.incomeChart = null;
    this.expenseChart = null;

    this.incomeChartArray = [];
    this.expenseChartArray = [];
    this.incomeChartArrayConcat = [];
    this.expenseChartArrayConcat = [];
    this.init();
  }

  private init(): void {
    if (this.todayFilterButton) {
      this.todayFilterButton.classList.add("active");
    }

    this.getProfitExpenses();
    this.watchActiveButton(this.filterButtonsArray);
  }

  private watchActiveButton(buttonsArray: HTMLElement[]): void {
    for (let i = 0; i < buttonsArray.length; i++) {
      buttonsArray[i].addEventListener("click", (e) => {
        if (buttonsArray[i].id === "today-filter") {
          this.resetChart();
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses();
        }
        if (buttonsArray[i].id === "week-filter") {
          this.resetChart();
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateFrom, DateUtils.dateWeek);
        }
        if (buttonsArray[i].id === "month-filter") {
          this.resetChart();
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateFrom, DateUtils.dateMonth);
        }
        if (buttonsArray[i].id === "year-filter") {
          this.resetChart();
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateFrom, DateUtils.dateYear);
        }
        if (buttonsArray[i].id === "all-filter") {
          this.resetChart();
          buttonsArray[i].classList.add("active");
          this.getProfitExpenses(DateUtils.dateOld, DateUtils.dateNew);
        }
        if (buttonsArray[i].id === "interval-filter") {
          if (this.intervalPopUp && this.chooseButton && this.closeButton) {
            this.intervalPopUp.style.display = "flex";
            this.resetChart();
            this.setInterval();
            this.chooseButton.addEventListener(
              "click",
              () => {
                if (this.intervalPopUp) {
                  this.intervalPopUp.style.display = "none";
                  buttonsArray[i].classList.add("active");
                  this.getProfitExpenses(this.startDay, this.endDay);
                }
              },
              { once: true }
            );
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

  private resetChart(): void {
    const buttonsElements: NodeListOf<HTMLButtonElement> =
      document.querySelectorAll("button");
    buttonsElements.forEach((buttonItem) =>
      buttonItem.classList.remove("active")
    );
    this.incomeChartArray = [];
    this.expenseChartArray = [];
    this.incomeChartArrayConcat = [];
    this.expenseChartArrayConcat = [];
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
        return this.openNewRoute(
          (result as DefaultResponseType).redirect as string
        );
      }
      if (
        (result as DefaultResponseType).error ||
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
        return this.openNewRoute(
          (result as DefaultResponseType).redirect as string
        );
      }

      if ((result as DefaultResponseType).error) {
        console.log((result as DefaultResponseType).message);
      }
    }

    let labelObjForIncome: OperationType;

    let labelObjForExpense: OperationType;

    for (let i = 0; i < (result as OperationRequestType).response.length; i++) {
      if ((result as OperationRequestType).response[i].type === "income") {
        labelObjForIncome = {
          category: (result as OperationRequestType).response[i].category,
          amount: (result as OperationRequestType).response[i].amount,
        };
        if (
          (result as OperationRequestType).response[i].category ===
          labelObjForIncome.category
        ) {
          labelObjForIncome.amount =
            labelObjForIncome.amount +
            (result as OperationRequestType).response[i].amount;
        }
        this.incomeChartArray.push(labelObjForIncome);
      }
      if ((result as OperationRequestType).response[i].type === "expense") {
        labelObjForExpense = {
          category: (result as OperationRequestType).response[i].category,
          amount: (result as OperationRequestType).response[i].amount,
        };

        this.expenseChartArray.push(labelObjForExpense);
      }
    }

    let tempObjIncome: any = {
      
    };

    this.incomeChartArray.map((object: OperationType)=> {
      if (object.category !== undefined) {
        tempObjIncome[object.category] =
          (tempObjIncome[object.category] || 0) + object.amount;
      }
    });

    for (let key in tempObjIncome) {
      this.incomeChartArrayConcat.push({
        category: key,
        amount: tempObjIncome[key],
      });
    }
    let tempObjExpense: any = {
      
    };

    this.expenseChartArray.map((object) => {
      if (object.category !== undefined) {
        tempObjExpense[object.category] =
          (tempObjExpense[object.category] || 0) + object.amount;
      }
    });

    for (let key in tempObjExpense) {
      this.expenseChartArrayConcat.push({
        category: key,
        amount: tempObjExpense[key],
      });
    }

    if (this.expenseChart || this.incomeChart) {
      this.chartCleaner();
    }

    this.initChartPie(
      this.incomeChartArrayConcat,
      this.expenseChartArrayConcat
    );
  }

  private initChartPie(
    incomeChartArray: OperationType[],
    expenseChartArray: OperationType[]
  ): void {
    const incomeConfig: any = {
      type: "pie",
      data: {
        labels: incomeChartArray.map((label) => label.category),
        datasets: [
          {
            label: "USD",
            data: incomeChartArray.map((label) => label.amount),
            borderWidth: 1,
          },
        ],
      },
    };

    const expenseConfig: any = {
      type: "pie",
      data: {
        labels: expenseChartArray.map((label) => label.category),
        datasets: [
          {
            label: "USD",
            data: expenseChartArray.map((label) => label.amount),
            borderWidth: 1,
          },
        ],
      },
    };

    this.incomeChart = new Chart(
      this.incomeChartElement as HTMLCanvasElement,
      incomeConfig
    );
    this.expenseChart = new Chart(
      this.expenseChartElement as HTMLCanvasElement,
      expenseConfig
    );
  }

  private chartCleaner(): void {
    if (this.incomeChart && this.expenseChart) {
      this.incomeChart.destroy();
      this.expenseChart.destroy();
    }
  }
}
