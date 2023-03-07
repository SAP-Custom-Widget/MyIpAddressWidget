(function () {
  let template = document.createElement("template");
  template.innerHTML = `
    <style>
      :host {
        display: block;
        font-family: Arial, sans-serif;
        font-size: 16px;
      }
      .container {
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 10px;
      }
      .row {
        display: flex;
        align-items: center;
        margin: 5px 0;
      }
      .label {
        font-weight: bold;
        margin-right: 10px;
      }
      .value {
        flex: 1;
      }
    </style>
    <div class="container">
      <div class="row">
        <div class="label" id="ipAddressLabel">IP Address:</div>
        <div class="value" id="ipAddressValue"></div>
      </div>
      <div class="row">
        <div class="label" id="cityLabel">City:</div>
        <div class="value" id="cityValue"></div>
      </div>
      <div class="row">
        <div class="label" id="countryLabel">Country:</div>
        <div class="value" id="countryValue"></div>
      </div>
    </div>
  `;
  class Widget extends HTMLElement {
    constructor() {
      super();
      let shadowRoot = this.attachShadow({
        mode: "open"
      });
      shadowRoot.appendChild(template.content.cloneNode(true));
      this._props = {};
    }
    async connectedCallback() {
      await this.initMain();
    }
    async initMain() {
      try {
        const response = await fetch("https://freeipapi.com/api/json/");
        const data = await response.json();
        this.shadowRoot.querySelector("#ipAddressValue").textContent = data.ipAddress;
        this.shadowRoot.querySelector("#countryValue").textContent = data.countryName;
        this.shadowRoot.querySelector("#cityValue").textContent = data.cityName + ", " + data.regionName;
        this.setValues(data.ipAddress, data.countryName, data.countryCode, data.cityName, data.zipCode);
      } catch (error) {
        console.error(error);
      }
    }
    onCustomWidgetBeforeUpdate(changedProperties) {
      this._props = {
        ...this._props,
        ...changedProperties
      };
    }
    onCustomWidgetAfterUpdate(changedProperties) {
      this.initMain();
    }

    setValues(_ipAddress, _countryName, _countryCode, _cityName, _zipCode) {
      this.dispatchEvent(new CustomEvent("propertiesChanged", {
        detail: {
          properties: {
            ipAddress: _ipAddress,
            countryName: _countryName,
            countryCode: _countryCode,
            cityName: _cityName,
            zipCode: _zipCode
          }
        }
      }));
    }
  }
  customElements.define(
    "com-rohitchouhan-sap-myipaddresswidget",
    Widget
  );
})();