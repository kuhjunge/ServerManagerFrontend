import { html, LitElement, css } from "/jslib/lit-core.min.js";
import { Task } from "/jslib/lit-task.js";
import { user, globalStyle } from "./data-service.js";
import {
  userGetAll,
  workTimeDownload,
  userRegister,
  userUpdate,
  userDelete,
} from "./api.js";

export class AdminElement extends LitElement {
  static properties = {
    showNew: { type: Boolean },
    pwhint: { type: String },
  };

  constructor() {
    super();
    this.showNew = false;
    this.pwhint = "";
  }

  _tableTask = new Task(this, {
    task: async ([token], { signal }) => {
      let res = await userGetAll(token);
      return res;
    },
    args: () => [user.getToken()],
  });

  isAdmin() {
    return user.isAdmin();
  }

  downloadStatistics() {
    workTimeDownload(new Date().getFullYear(), -1, user.getToken());
  }

  showZeiten(id) {
    user.navigate("personal?id=" + id);
  }

  closeModalOnClickOutside(e) {
    if (e.target === this.shadowRoot.getElementById("entryeditor")) {
      this.showNew = false;
    }
  }

  async _onSubmit(e) {
    e.preventDefault(); // disalbe Default submit
    let form = new FormData(e.target);
    if (form.get("username").length > 0) {
      var object = {};
      form.forEach((value, key) => (object[key] = value));
      object.id = Number(object.id);
      console.log(object);
      let edituser =
        object.id >= 0
          ? await userUpdate(object.id, object, user.getToken())
          : await userRegister(object, user.getToken());
      console.log(edituser);
      if (edituser) {
        this._tableTask.run();
        this.showNew = false;
      }
    }
  }

  async delete(item) {
    let res = await userDelete(Number(item.id), user.getToken());
    this._tableTask.run();
  }

  fillEditForm(item) {
    this.showNew = true;
    this.shadowRoot.getElementById("id").value = item.id;
    this.shadowRoot.getElementById("firstname").value = item.firstname;
    this.shadowRoot.getElementById("lastname").value = item.lastname;
    this.shadowRoot.getElementById("username").value = item.username;
    this.shadowRoot.getElementById("password").value = item.password;
    this.pwhint = " (Passwort leer lassen, wenn unverändert)";
  }

  openCleanEditForm() {
    this.showNew = true;
    this.shadowRoot.getElementById("id").value = "-1";
    this.shadowRoot.getElementById("firstname").value = "";
    this.shadowRoot.getElementById("lastname").value = "";
    this.shadowRoot.getElementById("username").value = "";
    this.shadowRoot.getElementById("password").value = "";
    this.pwhint = "";
  }

  renderNewView() {
    return html`<div
      id="entryeditor"
      class="modalWindow ${this.showNew ? "open" : "hide"}"
      @click=${(e) => this.closeModalOnClickOutside(e)}
    >
      <div class="modal-content">
        <h2>Benutzer bearbeiten</h2>
        <form
          name="formUser"
          id="formUser"
          autocomplete="off"
          @submit="${this._onSubmit}"
        >
          <input type="hidden" id="id" name="id" />
          <label for="firstname">Vorname: </label>
          <input id="firstname" name="firstname" required />
          <label for="lastname">Nachname: </label>
          <input id="lastname" name="lastname" required />
          <label for="username">Benutzername: </label>
          <input id="username" name="username" required />
          <label for="password">Passwort: ${this.pwhint}</label>
          <input
            id="password"
            name="password"
            type="password"
            ${this.pwhint.size > 2 ? html`` : html`required`}
          />
          <div class="spacer-wrap">
            <button
              type="reset"
              @click=${() => (this.showNew = false)}
              class="red"
            >
              Abbrechen</button
            ><span class="spacer"></span
            ><button type="submit" id="btn-save" class="green">
              Speichern
            </button>
          </div>
        </form>
      </div>
    </div>`;
  }

  showAdminButtons() {
    return user.isAdmin()
      ? html` <button @click=${() => this.openCleanEditForm()} class="green">
            Neuer Nutzer
          </button>
          <button @click=${this.downloadStatistics} class="blue">
            Globale Projektzeiten
          </button>`
      : html``;
  }

  renderTableView() {
    return html`<table class="table table-striped">
      <thead>
        <tr>
          <th style="min-width: 5%">Benutzername</th>
          <th style="min-width: 5%">Vorname</th>
          <th style="min-width: 5%">Nachname</th>
          <th style="min-width: 5%"></th>
        </tr>
      </thead>
      <tbody>
        ${this._tableTask.render({
          initial: () => html`<tr>
            <td colspan="4" class="text-center"></td>
          </tr>`,
          pending: () => html`<tr>
            <td colspan="4" class="text-center">... Lade Daten ...</td>
          </tr>`,
          complete: (tbl) =>
            html` ${tbl.map(
              (item, index) => html`
                <tr>
                  <td>${item.username}</td>
                  <td>${item.firstname}</td>
                  <td>${item.lastname}</td>
                  <td>
                    <span
                      @click="${() => this.delete(item)}"
                      class="red mini-btn right ${user.canSee(item.id) == true
                        ? ""
                        : "invisible"}"
                      >Delete</span
                    >
                    <span
                      @click="${() => this.fillEditForm(item)}"
                      class="blue mini-btn right ${user.canSeeSelf(item.id) ==
                      true
                        ? ""
                        : "invisible"}"
                      >Edit</span
                    >
                    <span
                      @click="${() => this.showZeiten(item.id)}"
                      class="blue mini-btn right ${this.isAdmin() == true
                        ? ""
                        : "invisible"}"
                      >Zeiten</span
                    >
                  </td>
                </tr>
              `
            )}`,
          error: (e) => html`<tr>
            <td colspan="4" class="text-center">
              Fehler beim Laden der Daten!
            </td>
          </tr>`,
        })}
      </tbody>
    </table>`;
  }

  render() {
    return html`<div class="container">
      <logo-component class="right"></logo-component>
      ${this.renderNewView()}
      <h1>Benutzerverwaltung</h1>
      ${this.showAdminButtons()}
      <div class="wrap">${this.renderTableView()}</div>
    </div>`;
  }

  static styles = [globalStyle, css``];
}

window.customElements.define("admin-component", AdminElement);
