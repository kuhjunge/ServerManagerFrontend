import { html, LitElement, css } from "/jslib/lit-core.min.js";
import { user, globalStyle } from "./data-service.js";
import { LogoElement } from "./logo-component.js";
import { NavBarElement } from "./navbar-component.js";
import { LoginElement } from "./login-component.js";
import { HomeElement } from "./home-component.js";
import { PersonalElement } from "./personal-component.js";
import { AdminElement } from "./admin-component.js";
import { DataElement } from "./datatable-component.js";



const Pages = {
  login: html`<login-component></login-component>`,
  home: html`<navbar-component path="home"></navbar-component
    ><home-component></home-component>`,
  personal: html`<navbar-component path="personal"></navbar-component
    ><personal-component></personal-component>`,
  admin: html`<navbar-component path="admin"></navbar-component
    ><admin-component></admin-component>`,
  quelle: html`<navbar-component path="quelle"></navbar-component
    ><data-component></data-component>`,
  artikelstamm: html`<navbar-component path="artikelstamm"></navbar-component
    ><data-component></data-component>`,
};

export class NavElement extends LitElement {
  static properties = {
    nav: { type: String },
  };

  constructor() {
    super();
  }

  render() {
    console.log();
    if (!user.isLoggedIn()) {
      this.nav = "login";
    } else if (!Object.hasOwn(Pages, this.nav)) {
      this.nav = "home";
    }
    return html`${Pages[this.nav]}`;
  }

  static styles = [globalStyle, css``];
}

window.customElements.define("nav-component", NavElement);

export class StartElement extends LitElement {
  constructor() {
    super();
  }

  render() {
    let pageKey = user.isLoggedIn()
      ? document.location.pathname.split("/")[1]
      : "login";
    pageKey = pageKey || "login";
    return html`<nav-component nav=${pageKey}></nav-component>`;
  }

  static styles = [globalStyle, css``];
}

window.customElements.define("start-component", StartElement);
