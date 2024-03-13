import { html, LitElement, css } from "/jslib/lit-core.min.js";
import { globalStyle } from "./data-service.js";

export class LogoElement extends LitElement {
  static properties = {
    class: { type: String },
  };

  constructor() {
    super();
    this.class = "";
  }

  render() {
    return html`<img
      class="${this.class}"
      src="/img/logoit.png"
      alt="Kuhfreudne"
    />`;
  }

  static styles = [
    globalStyle,
    css`
      img {
        width: 200px;
      }
    `,
  ];
}

window.customElements.define("logo-component", LogoElement);
