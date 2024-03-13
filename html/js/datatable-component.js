import { html, LitElement, css } from "/jslib/lit-core.min.js";
import { user, tblStorage, globalStyle } from "./data-service.js";

export class DataElement extends LitElement {
  constructor() {
    super();
  }

  renderNav() {
    return html` <div id="sidenav">
      <h2>Options</h2>
      <div class="wrap-collabsible">
        <input id="collapsible" class="toggle" type="checkbox" />
        <label for="collapsible" class="lbl-toggle">Kunde</label>
        <div class="collapsible-content">
          <div class="content-inner">
            <select class="select" name="customer">
              <option value="MD">FIRMA1</option>
              <option value="BIT">Firma2</option>
              <option value="BLA">BLA</option>
            </select>
          </div>
        </div>
      </div>
      <div class="wrap-collabsible">
        <input id="collapsible-2" class="toggle" type="checkbox" />
        <label for="collapsible-2" class="lbl-toggle">Filter</label>
        <div class="collapsible-content">
          <div class="content-inner">
            <label for="row">Spalte</label>
            <select class="select" name="row">
              <option value="Alle">Alle</option>
              <option value="BIT">Firma1</option>
              <option value="BLA">BLA</option>
            </select>
            <input type="text" placeholder="Spalteninhalt" name="rowcontent" />
            <button>Suchen</button>
          </div>
        </div>
      </div>
      <div class="wrap-collabsible">
        <input id="collapsible-3" class="toggle" type="checkbox" />
        <label for="collapsible-3" class="lbl-toggle">Spaltenkonfig</label>
        <div class="collapsible-content">
          <div class="content-inner">
            <input type="checkbox" id="check1" name="check1" value="1" />
            <label for="check1"> Spalte</label><br />
          </div>
        </div>
      </div>
      <logo-component></logo-component>
    </div>`;
  }

  render() {
    return html` <div id="pagewrap">
      ${this.renderNav()}
      <div id="tblcontent">Hallo ${user.getName()}</div>
    </div>`;
  }

  static styles = [
    globalStyle,
    css`
      #pagewrap {
        box-sizing: border-box;
        padding: 47px 0 0 0; /* Navigation */
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        height: 100%;
        width: 100%;
      }

      #tblcontent {
        flex-grow: 1 0 auto;
        padding: 5px;
      }

      #sidenav {
        flex-shrink: 0;
        width: 250px;
        height: 100%;
        padding: 7px;
        background-color: #fafafa;
        border-right: 1px solid black;
      }

      input[type="checkbox"] {
        display: none;
      }

      .wrap-collabsible {
        margin: 0.8rem 0;
        border-radius: 7px;
        background: white;
        border: 1px solid #eee;
      }

      .lbl-toggle {
        display: block;
        text-align: center;
        padding: 1rem;
        color: #555;
        cursor: pointer;
        transition: all 0.25s ease-out;
      }
      .lbl-toggle:hover {
        color: #000;
      }
      .lbl-toggle::before {
        content: " ";
        display: inline-block;
        border-top: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-left: 5px solid currentColor;
        vertical-align: middle;
        margin-right: 0.7rem;
        transform: translateY(-2px);
        transition: transform 0.2s ease-out;
      }
      .toggle:checked + .lbl-toggle::before {
        transform: rotate(90deg) translateX(-3px);
      }
      .collapsible-content {
        max-height: 0px;
        overflow: hidden;
        transition: max-height 0.25s ease-in-out;
      }
      .toggle:checked + .lbl-toggle + .collapsible-content {
        max-height: 350px;
      }
      .toggle:checked + .lbl-toggle {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }
      .collapsible-content .content-inner {
        border-bottom-left-radius: 7px;
        border-bottom-right-radius: 7px;
        padding: 0.5rem 1rem;
      }
      .collapsible-content p {
        margin-bottom: 0;
      }
    `,
  ];
}

window.customElements.define("data-component", DataElement);
