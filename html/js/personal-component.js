import { html , LitElement, css } from "/jslib/lit-core.min.js";
import { Task } from "/jslib/lit-task.js";
import { user, globalStyle } from "./data-service.js";
import {
  workTimeGet,
  workTimeDownload,
  workTimeUpdate,
  workTimeDelete,
  workTimeCustomer,
} from "./api.js";

export class PersonalElement extends LitElement {
  static properties = {
    id: { type: Number },
    defaultDate: { type: Object },
    defaultDateInput: { type: Object },
    defaultDateStats: { type: Object },
    showStats: { type: Boolean },
    showEdit: { type: Boolean },
    showOtherUserView: { type: Boolean },
    customerSel: { type: Object },
    catSel: { type: Object },
    stats: { type: Object },
  };

  constructor() {
    super();
    let userid = user.getId();
    let urlid = user.getUrlId();
    this.id = user.isAdmin() && urlid != undefined ? urlid : userid;
    this.showOtherUserView = this.id != userid;
    this.defaultDate = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    this.defaultDateInput = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };
    this.defaultDateStats = {
      weekday: "long",
      month: "long",
      day: "numeric",
    };
    this.showStats = false;
    this.showEdit = false;
    this.customerSel = [];
    this.catSel = [];
    this.stats = [];
  }

  _tableTask = new Task(this, {
    task: async ([id, token], { signal }) => {
      let res = await workTimeGet(id, token);
      this.processWorkTime(res);
      return res;
    },
    args: () => [this.id, user.getToken()],
  });

  async processWorkTime(w) {
    const setOfCat = new Set();
    w.forEach((e) => setOfCat.add(e.category));
    this.catSel = Array.from(setOfCat);
    const setOfCustomers = new Set();
    w.forEach((e) => setOfCustomers.add(e.customer));
    let staticEntries = await workTimeCustomer(user.getToken());
    staticEntries.forEach((e) => setOfCustomers.add(e.name));
    this.customerSel = Array.from(setOfCustomers);
    this.calculateStats(w);
  }

  calculateStats(w) {
    let entry = 0,
      actElm,
      date,
      time = 0,
      txt = [];
    for (var i = 0; i < w.length && entry < 5; i++) {
      actElm = w[i];
      if (date != actElm.date) {
        if (time != 0) {
          txt.push(
            new Date(date).toLocaleString("de-DE", this.defaultDateStats) +
              ":\t" +
              Math.round((time / 60.0) * 100) / 100.0 +
              "h"
          );
          time = 0;
          entry++;
        }
        date = actElm.date;
      }
      time += actElm.time;
    }
    // Add last entry in case of a short list
    if (time != 0) {
      txt.push(
        new Date(date).toLocaleString("de-DE", this.defaultDateStats) +
          ":\t" +
          time / 60.0 +
          "h"
      );
      time = 0;
      entry++;
    }
    this.stats = txt;
  }

  downloadStatistics() {
    workTimeDownload(new Date().getFullYear(), user.getId(), user.getToken());
  }

  fillEditForm(item) {
    this.showEdit = true;
    this.shadowRoot.getElementById("id").value = item.id;
    this.shadowRoot.getElementById("userid").value = item.userid;
    this.shadowRoot.getElementById("date").value = item.date;
    let h = Math.floor(item.time / 60);
    let m = item.time - h * 60;
    this.shadowRoot.getElementById("time").value =
      (h > 0 ? h + "h" : "") + (m > 0 ? m + "m" : "");
    this.shadowRoot.getElementById("customer").value = item.customer;
    this.shadowRoot.getElementById("category").value = item.category;
    this.shadowRoot.getElementById("note").value = item.note;
  }

  openCleanEditForm() {
    this.showEdit = true;
    this.shadowRoot.getElementById("id").value = -1;
    this.shadowRoot.getElementById("userid").value = user.getId();
    this.shadowRoot.getElementById("date").value = new Date()
      .toISOString()
      .split("T")[0];
    this.shadowRoot.getElementById("time").value = "";
    this.shadowRoot.getElementById("customer").value = "";
    this.shadowRoot.getElementById("category").value = "";
    this.shadowRoot.getElementById("note").value = "";
  }

  async _onSubmit(e) {
    e.preventDefault(); // disable Default submit
    let form = new FormData(e.target);
    var object = {};
    form.forEach((value, key) => (object[key] = value));
    object.id = Number(object.id);
    object.userid = Number(object.userid);
    object.time = this.processTime(object.time);
    if (form.get("date").length > 0) {
      let time = await workTimeUpdate(object, user.getToken());
      console.log(time);
      if (time) {
        this._tableTask.run();
        this.showEdit = false;
      }
    }
  }

  processTime(time) {
    var res = 0;
    let stringTime = time.toLowerCase().replace(/\s/g, "");
    if (stringTime.replace("m", "").indexOf("h") > 0) {
      let splitTime = stringTime.split("h");
      let min =
        splitTime.length > 1 && splitTime[1].length > 0
          ? parseInt(splitTime[1])
          : 0;
      let cleanH = splitTime[0].replace(",", ".");
      res = Math.floor(
        (cleanH.indexOf(".") > 0
          ? parseFloat(cleanH)
          : parseInt(splitTime[0])) *
          60.0 +
          min
      );
    } else if (parseInt(stringTime) > 0) {
      let t = parseInt(stringTime);
      res = t > 9 ? t : t * 60;
    } else {
      res = Math.floor(parseFloat(stringTime.replace(",", ".")) * 60.0);
    }
    return res;
  }

  closeModalOnClickOutside(e) {
    if (e.target === this.shadowRoot.getElementById("entryeditor")) {
      this.showEdit = false;
    }
  }

  async delete(item) {
    let res = await workTimeDelete(Number(item.id), user.getToken());
    this._tableTask.run();
  }

  renderOtherUserViewButton() {
    return this.showOtherUserView
      ? html`<button class="red" @click=${() => user.navigate("personal")}>
          Schließe ${this.id}'s Ansicht
        </button>`
      : html``;
  }

  renderStatView() {
    return html`<div
      class="modalWindow ${this.showStats ? "open" : "hide"}"
      @click=${() => (this.showStats = false)}
    >
      <div class="modal-content">
        <h2>Statistiken</h2>
        <p>Summe Zeiten der letzten Tage:</p>
        ${this.stats.map((c) => html` <p>${c}</p>`)}
        <button @click=${() => (this.showStats = false)} class="center">
          Schließen
        </button>
      </div>
    </div>`;
  }

  renderEditView() {
    return html`<div
      id="entryeditor"
      class="modalWindow ${this.showEdit ? "open" : "hide"}"
      @click=${(e) => this.closeModalOnClickOutside(e)}
    >
      <div class="modal-content">
        <h2>Projektzeiterfassung</h2>
        <form
          name="formTime"
          id="formTime"
          autocomplete="off"
          @submit="${this._onSubmit}"
        >
          <input type="hidden" id="id" name="id" />
          <input type="hidden" id="userid" name="userid" />
          <label for="date">Datum: </label>
          <input type="date" id="date" name="date" required />
          <label for="time">Zeit: </label>
          <input
            type="text"
            id="time"
            name="time"
            class="tooltip"
            placeholder="5h30m oder 5,5"
            required
          />
          <label for="customer">Kunde: </label>
          <input id="customer" name="customer" list="customerList" required />
          <datalist id="customerList">
            ${this.customerSel.map(
              (c) => html`<option value="${c}">${c}</option>`
            )}
          </datalist>
          <label for="category">Kategorie </label>
          <input
            id="category"
            name="category"
            list="categoryList"
            placeholder="Möglichst grobe Beschreibung"
          />
          <datalist id="categoryList">
            ${this.catSel.map((c) => html`<option value="${c}">${c}</option>`)}
          </datalist>
          <label for="note">Notiz: </label>
          <input
            type="text"
            id="note"
            name="note"
            placeholder="Detailbeschreibung"
          />
          <div class="spacer-wrap">
            <button
              type="reset"
              @click=${() => (this.showEdit = false)}
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

  renderTableView() {
    return html`<table class="table table-striped">
      <thead>
        <tr>
          <th style="min-width: 5%">Datum</th>
          <th style="min-width: 5%">Minuten</th>
          <th style="min-width: 5%">Kunde</th>
          <th style="min-width: 5%">Kategorie</th>
          <th style="min-width: 10%">Notiz</th>
          <th style="min-width: 5%"></th>
        </tr>
      </thead>
      <tbody>
        ${this._tableTask.render({
          initial: () => html`<tr>
            <td colspan="6" class="text-center"></td>
          </tr>`,
          pending: () => html`<tr>
            <td colspan="6" class="text-center">... Lade Daten ...</td>
          </tr>`,
          complete: (tbl) =>
            html` ${tbl.map(
              (item, index) => html`
                <tr>
                  <td>
                    ${new Date(item.date).toLocaleString(
                      "de-DE",
                      this.defaultDate
                    )}
                  </td>
                  <td>${item.time}</td>
                  <td>${item.customer}</td>
                  <td>${item.category}</td>
                  <td>${item.note}</td>
                  <td>
                    <span
                      @click="${() => this.delete(item)}"
                      class="red mini-btn right"
                      >Delete</span
                    >
                    <span
                      @click="${() => this.fillEditForm(item)}"
                      class="blue mini-btn right"
                      >Edit</span
                    >
                  </td>
                </tr>
              `
            )}`,
          error: (e) => html`<tr>
            <td colspan="6" class="text-center">
              Fehler beim Laden der Daten!
            </td>
          </tr>`,
        })}
      </tbody>
    </table>`;
  }

  renderMainView() {
    return html`<div class="container">
      <logo-component class="right"></logo-component>
      <h1>Projektzeiterfassung</h1>
      <button @click=${() => this.openCleanEditForm()} class="green">
        Neu erfassen
      </button>
      <button @click=${() => (this.showStats = true)} class="tooltip blue">
        Statistiken
        <span class="tooltiptext">Zeige gebuchte Stunden der letzten Tage</span>
      </button>
      <button class="tooltip blue" @click=${this.downloadStatistics}>
        Download
        <span class="tooltiptext">Downloade Projektzeiten</span>
      </button>
      ${this.renderOtherUserViewButton()}
      <div class="wrap">${this.renderTableView()}</div>
    </div>`;
  }

  render() {
    return html`
      ${this.renderStatView()}${this.renderEditView()}${this.renderMainView()}
    `;
  }

  static styles = [globalStyle, css``];
}

window.customElements.define("personal-component", PersonalElement);
