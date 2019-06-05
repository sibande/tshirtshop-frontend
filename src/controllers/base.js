var M = require('materialize-css/dist/js/materialize.js');


export default class BaseController {

  constructor() {
    var authorizationKey = localStorage.getItem('authorizationKey'),
	customer = localStorage.getItem('customer');

    console.log(customer);
    try {
      customer = JSON.parse(customer);
    } catch (e) {
      customer = {};
    }

    this.customer = customer || {};
  }

  globalInit() {
    var elems = document.querySelectorAll('.customer-menu-trigger');
    var instances = M.Dropdown.init(elems, {});
  }
  
}
