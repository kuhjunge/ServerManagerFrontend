import { html, LitElement, css } from "/jslib/lit-core.min.js";
import { user, globalStyle } from "./data-service.js";

export class NavBarElement extends LitElement {
  static properties = {
    responsive: { type: String },
    path: { type: String },
  };

  constructor() {
    super();
    this.responsive = "";
    this.path = "";
  }

  isActive(active) {
    return this.path === active ? "active" : "";
  }

  render() {
    return html`<div class="topnav ${this.responsive}" id="navigation">
      <a href="/home" class="${this.isActive("home")}">Start</a>
      <a href="/quelle" class="${this.isActive("quelle")}">Neuanlagen</a>
      <a href="/artikelstamm" class="${this.isActive("artikelstamm")}"
        >Master-Artikelstamm</a
      >
      <a href="javascript:void(0);" @click=${this.logout} class="right"
        >Logout</a
      >
      <a href="/admin" class="right ${this.isActive("admin")}"
        >${user.getName()}</a
      >
      <a href="/personal" class="right ${this.isActive("personal")}"
        >Projektzeit</a
      >
      <a href="javascript:void(0);" class="icon" @click=${this.toggleNav}>
        <i>🟰</i>
      </a>
    </div>`;
  }

  logout(event) {
    user.logout();
  }

  toggleNav() {
    this.responsive = this.responsive == "" ? "responsive" : "";
  }

  static styles = [
    globalStyle,
    css`
      .topnav {
        position: relative;
        overflow: hidden;
        background-color: rgba(0, 0, 0, 0.87);
        height: 47px;
        z-index: 99;
      }

      .topnav a {
        float: left;
        display: block;
        color: rgba(255, 255, 255, 0.55);
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        font-size: 17px;
      }

      .topnav .right {
        float: right;
      }

      .topnav a:hover {
        background-color: #333;
        color: white;
      }

      .topnav a.active {
        color: white;
      }

      .topnav .icon {
        display: none;
      }

      @media screen and (max-width: 800px) {
        .topnav a:not(:first-child) {
          display: none;
        }
        .topnav a.icon {
          float: right;
          display: block;
        }
      }

      @media screen and (max-width: 800px) {
        .topnav.responsive {
          position: relative;
        }
        .topnav.responsive .icon {
          position: absolute;
          right: 0;
          top: 0;
        }
        .topnav.responsive a {
          float: none;
          display: block;
          text-align: left;
        }
      }
    `,
  ];
}

window.customElements.define("navbar-component", NavBarElement);
