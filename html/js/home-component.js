import { html, LitElement, css } from "/jslib/lit-core.min.js";
import { Task } from "/jslib/lit-task.js";
import { user, globalStyle } from "./data-service.js";
import { getState, setState } from "./api-kj.js";

export class HomeElement extends LitElement {
  constructor() {
    super();
  }

  _serverTask = new Task(this, {
    task: async ([token], { signal }) => {
      let res = await getState("pal", token);
      return res;
    },
    args: () => [user.getToken()],
  });

  async setServer(val){
    let res = await setState("pal", val, user.getToken());
    this._serverTask.run();
  }

  render() {
    return html`<div class="container">
      <h1>Kuhfreunde Server Control</h1>
      Hallo ${user.getName()}
      <br />
      <br />
      ${this._serverTask.render({
        initial: () => html`...`,
        pending: () => html`... Lade Daten ...`,
        complete: (btn) =>
          btn == 1
            ? html` <button @click=${() => this.setServer(0)} class="green">
                Palworld Server stoppen
              </button>`
            : html` <button @click=${() => this.setServer(1)} class="red">
                Palworld Server starten
              </button>`,
        error: (e) => html`Controllserver offline!`,
      })}
    </div>`;
  }

  static styles = [globalStyle, css``];
}

window.customElements.define("home-component", HomeElement);
