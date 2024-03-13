import { html, LitElement, css } from "/jslib/lit-core.min.js";
import { doLogin } from "./api.js";
import { user, globalStyle } from "./data-service.js";

export class LoginElement extends LitElement {
  static properties = {
    session: { type: Object },
    loggedIn: { type: String },
    loading: { type: Boolean },
    error: { type: Boolean },
  };

  constructor() {
    super();
    this.loading = false;
    this.error = false;
    if (user.isLoggedIn()) {
      user.navigate("home");
    }
  }

  async _onSubmit(e) {
    e.preventDefault(); // disalbe Default submit
    let form = new FormData(e.target);
    if (form.get("username").length > 0) {
      this.loading = true;
      this.error = false;
      localStorage.clear();
      this.loggedIn = "";
      let apiUser = await doLogin(form.get("username"), form.get("password"));
      if (apiUser) {
        localStorage.setItem("user", JSON.stringify(apiUser)); // sessionStorage
        user.navigate("home");
      } else {
        this.error = true;
      }
      this.loading = false;
    }
  }

  render() {
    return html`<div id="login-page">
      <div id="login">
        <form @submit="${this._onSubmit}">
          <logo-component class=""></logo-component>
          <div class="container">
            <input
              type="text"
              placeholder="Benutzername"
              name="username"
              required
            />
            <input
              type="password"
              placeholder="Passwort"
              name="password"
              required
            />
            <button
              ?disabled="${this.loading}"
              type="submit"
              class="${this.loading ? "load" : ""}"
            >
              Login
            </button>
            <p class="errormessage">
              ${this.error ? "Login fehlerhaft!" : ""} ${this.loggedIn}
            </p>
            <p class="message"><a href="#">Password vergessen?</a></p>
          </div>
        </form>
      </div>
    </div>`;
  }

  static styles = [
    globalStyle,
    css`
      /* LOGIN CSS */
      #login-page {
        display: grid;
        width: 100%;
        height: 100%;
        margin: auto;
        grid-template-areas:
          "top top top"
          "left login right"
          "bottom bottom bottom";
        grid-template-columns: auto auto auto;
        grid-template-rows: auto auto auto;
      }

      #login .form {
        margin-top: -31px;
        margin-bottom: 26px;
      }

      #login {
        grid-area: login;
        min-width: 150px;
        max-width: 500px;
        max-height: 350px;
        margin: 0 auto;
        position: relative;
        z-index: 1;
        background: #ffffff;
        padding: 5%;
        text-align: center;
        box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.2),
          0 5px 5px 0 rgba(0, 0, 0, 0.24);
      }

      #login .center {
        display: block;
        margin-left: auto;
        margin-right: auto;
        margin-bottom: 15px;
      }

      #login input {
        outline: 0;
        background: #f2f2f2;
        width: 100%;
        border: 0;
        margin: 0 0 15px;
        padding: 15px;
        box-sizing: border-box;
        font-size: 14px;
      }

      #login button {
        width: 100%;
        margin: 0px;
        padding: 15px;
      }

      @keyframes load {
        0% {
          aspect-ratio: 1;
          border-radius: 50px;
        }
        25% {
          aspect-ratio: 2;
          border-radius: 50px;
        }
        50% {
          aspect-ratio: 2;
          border-radius: 0;
        }
        75% {
          aspect-ratio: 1;
          border-radius: 0;
        }
        100% {
          aspect-ratio: 1;
          border-radius: 50px;
        }
      }

      #login .message {
        margin: 15px 0 0;
        color: #b3b3b3;
        font-size: 12px;
      }

      #login .errormessage {
        height: 20px;
        margin: 15px 0 0;
        color: red;
        font-size: 18px;
      }

      #login .message a {
        color: #444;
        text-decoration: none;
      }
    `,
  ];
}

window.customElements.define("login-component", LoginElement);
