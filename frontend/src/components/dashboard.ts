import { DateUtils } from "../utils/date-utils";
import { HttpUtils } from "../utils/http-utils";

import { Chart } from "chart.js/auto";

export class Dashboard {
  constructor(openNewRoute) {
    this.openNewRoute = openNewRoute;
    this.findElement();
    this.init();
  }

  init() {
    this.todayFilterButton.classList.add("active");
    this.getProfitExpenses();
    this.watchActiveButton(this.filterButtonsArray);
  }

  watchActiveButton(buttonsArray) {
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
          this.intervalPopUp.style.display = "flex";
          this.resetChart();
          this.setInterval();
          this.chooseButton.addEventListener("click", (e) => {
            this.intervalPopUp.style.display = "none";
            buttonsArray[i].classList.add("active");
            this.getProfitExpenses(this.startDay, this.endDay);
          }, { once: true });
          this.closeButton.addEventListener("click", () => {
            this.intervalPopUp.style.display = "none";
          });
        }
      });
    }
  }

  resetChart() {
    const buttonsElements = document.querySelectorAll("button");
    buttonsElements.forEach((buttonItem) =>
      buttonItem.classList.remove("active")
    );
    this.incomeChartArray = [];
    this.expenseChartArray = [];
    this.incomeChartArrayConcat = [];
    this.expenseChartArrayConcat = [];
  }

  setInterval() {
    this.startDateInput.addEventListener("change", () => {
      this.startDateText.innerText = new Date(
        this.startDateInput.value
      ).toLocaleDateString();
      this.startDay = this.startDateInput.value;
    });
    this.endDateInput.addEventListener("change", () => {
      this.endDateText.innerText = new Date(
        this.endDateInput.value
      ).toLocaleDateString();
      this.endDay = this.endDateInput.value;
    });
  }

  findElement() {
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

    this.startDateInput = document.getElementById("startDate");
    this.endDateInput = document.getElementById("endDate");

    this.startDay = null;
    this.endDay = null;

    this.startDateText = document.getElementById("startDateText");
    this.endDateText = document.getElementById("endDateText");

    this.filterButtonsArray = [
      this.todayFilterButton,
      this.weekFilterButton,
      this.monthFilterButton,
      this.yearFilterButton,
      this.allFilterButton,
      this.intervalFilterButton,
    ];

    this.incomeChartElement = document.getElementById("income");
    this.expenseChartElement = document.getElementById("expense");
    this.incomeChart = null;
    this.expenseChart = null;

    this.incomeChartArray = [];
    this.expenseChartArray = [];
    this.incomeChartArrayConcat = [];
    this.expenseChartArrayConcat = [];
  }

  async getProfitExpenses(dateFrom, dateTo) {
    let result = null;
    if (dateFrom && dateTo) {
      result = await HttpUtils.request(
        "/operations?period=interval&dateFrom=" +
          dateFrom +
          "&dateTo=" +
          dateTo,
        "GET",
        true
      );
      if (result.redirect) {
        return this.openNewRoute(result.redirect);
      }

      if (
        result.error ||
        !result.response ||
        (result.response && result.response.error)
      ) {
        return alert(
          "Возникла ошибка при запросе операций. Обратитесь в поддержку."
        );
      }
    } else {
      result = await HttpUtils.request("/operations", "GET", true);
      if (result.redirect) {
        return this.openNewRoute(result.redirect);
      }

      if (
        result.error ||
        !result.response ||
        (result.response && result.response.error)
      ) {
        return alert(
          "Возникла ошибка при запросе операций. Обратитесь в поддержку."
        );
      }
    }

    let labelObjForIncome = null;

    let labelObjForExpense = null;

    for (let i = 0; i < result.response.length; i++) {
      if (result.response[i].type === "income") {
        labelObjForIncome = {
          category: result.response[i].category,
          amount: result.response[i].amount,
        };
        if (result.response[i].category === labelObjForIncome.category) {
          labelObjForIncome.amount =
            labelObjForIncome.amount + result.response[i].amount;
        }
        this.incomeChartArray.push(labelObjForIncome);
      }
      if (result.response[i].type === "expense") {
        labelObjForExpense = {
          category: result.response[i].category,
          amount: result.response[i].amount,
        };

        this.expenseChartArray.push(labelObjForExpense);
      }
    }

    let tempObjIncome = {};

    this.incomeChartArray.map((object) => {
      tempObjIncome[object.category] = (tempObjIncome[object.category] || 0) + object.amount; 
    });

    for(let key in tempObjIncome){
      this.incomeChartArrayConcat.push({category: key, amount: tempObjIncome[key]})
    }
    let tempObjExpense = {};

    this.expenseChartArray.map((object) => {
      tempObjExpense[object.category] = (tempObjExpense[object.category] || 0) + object.amount; 
    });

    for(let key in tempObjExpense){
      this.expenseChartArrayConcat.push({category: key, amount: tempObjExpense[key]})
    }

    if (this.expenseChart || this.incomeChart) {
      this.chartCleaner();
    }

    this.initChartPie(this.incomeChartArrayConcat, this.expenseChartArrayConcat);
  }
  initChartPie(incomeChartArray, expenseChartArray) {
    const incomeConfig = {
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

    const expenseConfig = {
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

    this.incomeChart = new Chart(this.incomeChartElement, incomeConfig);
    this.expenseChart = new Chart(this.expenseChartElement, expenseConfig);
  }

  chartCleaner() {
    this.incomeChart.destroy();
    this.expenseChart.destroy();
  }
}
