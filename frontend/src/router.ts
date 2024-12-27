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
import { RoutesType } from "./types/routes.type";

export class Router {
  
  readonly titlePageElement: HTMLElement | null;
  readonly contentPageElement: HTMLElement | null;
  readonly indexStyleSheetElement: HTMLElement | null;
  private routes: RoutesType[];
  

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
          new Dashboard();
          new Layout();
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
          new SignUp();
        },
        styles: ["login.css"],
      },
      {
        route: "/logout",
        load: () => {
          new Logout();
        },
      },
      {
        route: "/profit",
        title: "Доходы",
        filePathTemplate: "/templates/pages/profit/profit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Profit();
          new Layout();
        },
      },
      {
        route: "/openPopUp",
      },
      {
        route: "/profit-delete",
        load: () => {
          new ProfitDelete();
        },
      },
      {
        route: "/profit-create",
        title: "Создание категории доходов",
        filePathTemplate: "/templates/pages/profit/profit-create.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ProfitCreate();
          new Layout();
        },
      },
      {
        route: "/profit-edit",
        title: "Редактирование категории доходов",
        filePathTemplate: "/templates/pages/profit/profit-edit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ProfitEdit();
          new Layout();
        },
      },
      {
        route: "/expenses",
        title: "Расходы",
        filePathTemplate: "/templates/pages/expenses/expenses.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new Expenses();
          new Layout();
        },
      },
      {
        route: "/expenses-delete",
        load: () => {
          new ExpensesDelete();
        },
      },
      {
        route: "/expenses-edit",
        title: "Редактирование категории расходов",
        filePathTemplate: "/templates/pages/expenses/expenses-edit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ExpensesEdit();
          new Layout();
        },
      },
      {
        route: "/expenses-create",
        title: "Создание категории расходов",
        filePathTemplate: "/templates/pages/expenses/expenses-create.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ExpensesCreate();
          new Layout();
        },
      },
      {
        route: "/operations",
        title: "Доходы и расходы",
        filePathTemplate: "/templates/pages/operations/operations.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new ProfitExpenses();
          new Layout();
        },
      },
      {
        route: "/operations-delete",
        load: () => {
          new profitExpensesDelete();
        },
      },
      {
        route: "/operations-edit",
        title: "Редактирование дохода/расхода",
        filePathTemplate: "/templates/pages/operations/operations-edit.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new profitExpensesEdit();
          new Layout();
        },
      },
      {
        route: "/operations-create",
        title: "Создание дохода/расхода",
        filePathTemplate: "/templates/pages/operations/operations-create.html",
        useLayout: "/templates/layout.html",
        load: () => {
          new profitExpensesCreate();
          new Layout();
        },
      },
    ];
  }
  
  private initEvents(): void {
    window.addEventListener("DOMContentLoaded", this.activateRoute.bind(this));
    window.addEventListener("popstate", this.activateRoute.bind(this));
    document.addEventListener("click", this.clickHandler.bind(this));
  }

  public async openNewRoute(url: string): Promise<void> {
    const currentRoute: string = window.location.pathname;
    history.pushState({}, "", url);
    if (currentRoute) {
      await this.activateRoute(null, currentRoute);
    }
  }

  private async clickHandler(e: Event): Promise<void> {
    let element: EventTarget | null = null;
    if (e.target as HTMLElement) {
      if ((e.target as HTMLElement).nodeName === "A") {
        element = e.target;
      } else if (
        ((e.target as HTMLElement).parentNode as ParentNode).nodeName === "A"
      ) {
        element = (e.target as HTMLElement).parentNode;
      }
    }
    if (element) {
      //e.preventDefault();
      const url: string = (element as HTMLLinkElement).href.replace(
        window.location.origin,
        ""
      );
      if (!url || url === "/#" || url.startsWith("javascript:void(0)")) {
        return;
      }
      await this.openNewRoute(url);
    }
  }

  private async activateRoute(
    e?: Event | null,
    oldRoute?: string | null
  ): Promise<void> {
    if (oldRoute) {
      const currentRoute: RoutesType | undefined = this.routes.find(
        (item) => item.route === oldRoute
      );
      if (currentRoute) {
        if (currentRoute.styles && currentRoute.styles.length > 0) {
          currentRoute.styles.forEach((style) => {
            const styleSheets = document.querySelector(
              `link[href='/css/${style}']`
            );
            if (styleSheets) {
              styleSheets.remove();
            }
          });
        }
      }
    }

    const urlRoute: string = window.location.pathname;
    const newRoute: RoutesType | undefined = this.routes.find(
      (item: RoutesType) => item.route === urlRoute
    );

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
        if (this.titlePageElement) {
          this.titlePageElement.innerText =
            newRoute.title + " | Lumincoin Finance";
        }
      }

      if (newRoute.filePathTemplate) {
        let contentBlock = this.contentPageElement;
        if (newRoute.useLayout) {
          if (this.contentPageElement) {
            this.contentPageElement.innerHTML = await fetch(
              newRoute.useLayout as string
            ).then((response) => response.text());
            contentBlock = document.getElementById("content-layout");
          }
        }
        if (contentBlock) {
          contentBlock.innerHTML = await fetch(newRoute.filePathTemplate).then(
            (response) => response.text()
          );
        }
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
