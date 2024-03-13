import { css } from "/jslib/lit-core.min.js";

export const globalStyle = css`
  :host {
    font-family: Arial, Helvetica, sans-serif;
  }

  .container {
    margin: auto;
    padding-top: 20px;
    padding-bottom: 25px;
    width: 80%;
  }

  .right {
    float: right;
  }

  .center {
    position: relative;
    left: 50%;
    transform: translateX(-50%);
  }

  .modalWindow {
    position: fixed; /* Stay in place */
    z-index: 1; /* Sit on top */
    padding-top: 100px; /* Location of the box */
    left: 0;
    top: 0;
    width: 100%; /* Full width */
    height: 100%; /* Full height */
    overflow: auto; /* Enable scroll if needed */
    background-color: rgb(0, 0, 0); /* Fallback color */
    background-color: rgba(0, 0, 0, 0.4); /* Black w/ opacity */
    transition: opacity 0.25s ease-in;
  }

  /* Modal Content */
  .modal-content {
    background-color: #fefefe;
    margin: auto;
    padding: 20px;
    border: 1px solid #888;
    width: 50%;
  }

  .hide {
    display: none!important;
  }

  .invisible {
    visibility: hidden; 
  }

  .spacer-wrap {
    display: flex;
  }
  .spacer {
    flex: 1 1 auto;
  }
  /* Inputs */
  form label {
    display: block;
    margin-bottom: 10px;
  }

  input, select {
    outline: 0;
    background: #f2f2f2;
    width: 100%;
    border: 0;
    margin: 0 0 15px;
    padding: 10px;
    box-sizing: border-box;
    font-size: 18px;
  }

  /* Button Design */
  input:hover,
  button:hover {
    box-shadow: 0 0 0 0.25rem rgba(230, 230, 230, 0.95);
  }

  button {
    min-width: 175px;
    min-height: 36px;
    margin: 5px;
    padding: 10px;
    position: relative;
    text-transform: uppercase;
    outline: 0;
    background-color: #999;
    border: 0;
    color: #fff;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    border-radius: 5px;
    cursor: pointer;
  }

  button:before {
    content: "";
    position: absolute;
    right: 16px;
    top: 50%;
    margin-top: -12px;
    width: 24px;
    height: 24px;
    border: 2px solid;
    border-left-color: transparent;
    border-right-color: transparent;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.5s;
    animation: 0.8s linear infinite rotate;
  }
  button.load {
    pointer-events: none;
    cursor: not-allowed;
    box-shadow: 0 0 0 0.25rem rgba(230, 230, 230, 0.95);
  }
  button.load:before {
    transition-delay: 0.5s;
    transition-duration: 1s;
    opacity: 1;
  }
  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .mini-btn {
    min-width: 45px;
    vertical-align: middle;
    text-align: center;
    font-size: small;
    padding: 5px;
    margin: 2px;
    outline: 0;
    border: 0;
    color: #fff;
    font-size: 14px;
    -webkit-transition: all 0.3 ease;
    transition: all 0.3 ease;
    border-radius: 4px;
    display: inline-block;
    cursor: pointer;
  }

  /* Tooltip Design */
  .tooltip {
    position: relative;
    display: inline-block;
  }

  .tooltip .tooltiptext {
    visibility: hidden;
    width: 120px;
    background-color: #555;
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px 0;
    position: absolute;
    z-index: 1;
    bottom: 125%;
    left: 50%;
    margin-left: -60px;
    opacity: 0;
    transition: opacity 0.3s;
    text-transform: none;
  }

  .tooltip .tooltiptext::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: #555 transparent transparent transparent;
  }

  .tooltip:hover .tooltiptext {
    visibility: visible;
    opacity: 1;
  }
  /* Table Design */
  table {
    border-collapse: collapse;
    width: 100%;
    margin-top: 10px;
  }

  table td,
  Table th {
    padding: 8px;
  }

  table tr {
    background-color: white;
  }

  table tr:nth-child(odd) {
    background-color: #f7f7f7;
  }

  table tr:hover {
    background-color: #ddd;
  }

  table th {
    padding-top: 12px;
    padding-bottom: 12px;
    text-align: left;
    background-color: white;
    color: black;
  }
  /* Colors */
  .green {
    background-color: green;
  }

  .blue {
    background-color: rgb(13, 110, 253);
  }

  .red {
    background-color: red;
  }
`;

class User {
  static properties = {
    session: { type: Object },
  };

  constructor() {
    try {
      let sessUser = JSON.parse(localStorage.getItem("user"));
      console.log(sessUser);
      this.session = sessUser ? sessUser : { token: "" };
    } catch (err) {
      console.log(err);
    }
    this._nav = undefined;
  }

  isLoggedIn() {
    return this.session && this.session.token.length > 2;
  }

  getName() {
    return this.session && this.session.firstname
      ? this.session.firstname + " " + this.session.lastname
      : "";
  }

  getId() {
    return this.session.id;
  }

  isAdmin() { 
    return this.session.admin == true;
  }

  canSee(id) { 
    return this.session.id != id && this.isAdmin();
  }

  canSeeSelf(id) { 
    return this.session.id == id || this.isAdmin();
  }

  getToken() {
    return this.session && this.session.token ? this.session.token : "";
  }

  logout() {
    this.session = { token: "" };
    localStorage.clear();
    this.navigate("login");
  }

  getUrlId(){
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
  }

  navigate(site) {
    window.location.href = "/" + site;
  }
}

export const user = new User();


class TblStorage {
  static properties = {
    session: { type: Object },
  };

}

export const tblStorage = new TblStorage();