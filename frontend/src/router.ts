import { Login } from "./components/auth/login";
import { Logout } from "./components/auth/logout";
import { SignUp } from "./components/auth/sign-up";
import { Dashboard } from "./components/dashboard";
import { Expenses } from "./components/expenses/expenses";
import { ExpensesCreate } from "./components/expenses/expenses-create";
import { ExpensesDelete } from "./components/expenses/expenses-delete";
import { ExpensesEdit } from "./components/expenses/expenses-edit";
import { Layout } from "./components/layout";
import { ProfitExpenses } from "./components/operations/operations";
import { profitExpensesCreate } from "./components/operations/operations-create";
import { profitExpensesDelete } from "./components/operations/operations-delete";
import { profitExpensesEdit } from "./components/operations/operations-edit";
import { Profit } from "./components/profit/profit";
import { ProfitCreate } from "./components/profit/profit-create";
import { ProfitDelete } from "./components/profit/profit-delete";
import { ProfitEdit } from "./components/profit/profit-edit";

export class Router {
  constructor() {
    this.titlePageElement = document.getElementById("page-title");
    this.contentPageElement = document.getElementById("content");
    this.indexStyleSheetElement = document.getElementById("index-stylesheet");

    this.initEvents();

    this.routes = [
      {
        route: "/",
        title: "Главная",
        filePathTemplate: "/templates/pages/dashboard.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Dashboard(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/404",
        title: "Страница не найдена",
        filePathTemplate: "/templates/pages/404.html",
        useLayout: false,
      },
      {
        route: "/login",
        title: "Вход в систему",
        filePathTemplate: "/templates/pages/auth/login.html",
        useLayout: false,
        load: () => {
          new Login(this.openNewRoute.bind(this));
        },
        styles: ["login.css"],
      },
      {
        route: "/sign-up",
        title: "Регистрация",
        filePathTemplate: "/templates/pages/auth/sign-up.html",
        useLayout: false,
        load: () => {
          new SignUp(this.openNewRoute.bind(this));
        },
        styles: ["login.css"],
      },
      {
        route: "/logout",
        load: () => {
          new Logout(this.openNewRoute.bind(this));
        }
      },
      {
        route: "/profit",
        title: "Доходы",
        filePathTemplate:
          "/templates/pages/profit/profit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Profit(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
          
        },
      },
      {
        route: '/openPopUp',
      },
      {
        route: "/profit-delete",
        load: () => {
          new ProfitDelete(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/profit-create",
        title: "Создание категории доходов",
        filePathTemplate:
          "/templates/pages/profit/profit-create.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ProfitCreate(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/profit-edit",
        title: "Редактирование категории доходов",
        filePathTemplate:
          "/templates/pages/profit/profit-edit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ProfitEdit(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses",
        title: "Расходы",
        filePathTemplate:
          "/templates/pages/expenses/expenses.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Expenses(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses-delete",
        load: () => {
          new ExpensesDelete(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses-edit",
        title: "Редактирование категории расходов",
        filePathTemplate:
          "/templates/pages/expenses/expenses-edit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ExpensesEdit(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/expenses-create",
        title: "Создание категории расходов",
        filePathTemplate:
          "/templates/pages/expenses/expenses-create.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ExpensesCreate(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/operations",
        title: "Доходы и расходы",
        filePathTemplate:
          "/templates/pages/operations/operations.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ProfitExpenses(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/operations-delete",
        load: () => {
          new profitExpensesDelete(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/operations-edit",
        title: "Редактирование дохода/расхода",
        filePathTemplate:
          "/templates/pages/operations/operations-edit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new profitExpensesEdit(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
        },
      },
      {
        route: "/operations-create",
        title: "Создание дохода/расхода",
        filePathTemplate:
          "/templates/pages/operations/operations-create.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new profitExpensesCreate(this.openNewRoute.bind(this));
          new Layout(this.openNewRoute.bind(this));
        },
      },
      
      
      
      
    ];
  }

  initEvents() {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
    document.addEventListener("click", this.clickHandler.bind(this));
  }

  async openNewRoute(url) {
    const currentRoute = window.location.pathname;
    history.pushState({}, "", url);
    await this.activateRoute(null, currentRoute);
  }

  async clickHandler(e) {
    let element = null;
    if (e.target.nodeName === "A") {
      element = e.target;
    } else if (e.target.parentNode.nodeName === "A") {
      element = e.target.parentNode;
    }

    if (element) {
      e.preventDefault();
      const url = element.href.replace(window.location.origin, "");
      if (!url || url === "/#" || url.startsWith("javascript:void(0)")) {
        return;
      }
      await this.openNewRoute(url);
    }
  }

  async activateRoute(e, oldRoute = null) {
    if (oldRoute) {
      const currentRoute = this.routes.find((item) => item.route === oldRoute);
      if (currentRoute.styles && currentRoute.styles.length > 0) {
        currentRoute.styles.forEach((style) => {
          document.querySelector(`link[href='/css/${style}']`).remove();
        });
      }
    }
    const urlRoute = window.location.pathname;
    const newRoute = this.routes.find((item) => item.route === urlRoute);

    if (newRoute) {
      if (newRoute.styles && newRoute.styles.length > 0) {
        newRoute.styles.forEach((style) => {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = "/css/" + style;
          document.head.insertBefore(link, this.indexStyleSheetElement);
        });
      }

      if (newRoute.title) {
        this.titlePageElement.innerText =
          newRoute.title + " | Lumincoin Finance";
      }

      if (newRoute.filePathTemplate) {
        let contentBlock = this.contentPageElement;
        if (newRoute.useLayout) {
          this.contentPageElement.innerHTML = await fetch(
            newRoute.useLayout
          ).then((response) => response.text());
          contentBlock = document.getElementById("content-layout");
        }
        contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(
          (response) => response.text()
        );
      }

      if (newRoute.load && typeof newRoute.load === "function") {
        newRoute.load();
      }
    } else {
      history.pushState({}, "", "/404");
      await this.activateRoute();
      console.log("No route found");
    }
  }
}
