import BaseService from './base_service';


export default class CustomerService extends BaseService {

  constructor() {
    super();
  }


  facebookLogin(accessToken) {
    var formData = new FormData();

    formData.append('access_token', accessToken);

    return fetch(this.baseUrl + '/customers/facebook', Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'POST'
    }, this.getOptions())).then(function(res) {

      return res.json();
    });
  }

  getCustomer() {
    let url = this.baseUrl + '/customer';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  loginCustomer(email, password) {
    var formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    return fetch(this.baseUrl + '/customers/login', Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'POST'
    }, this.getOptions())).then(function(res) {

      return res.json();
    });
  }

  registerCustomer(name, email, password) {
    var formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);

    return fetch(this.baseUrl + '/customers', Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'POST'
    }, this.getOptions())).then(function(res) {

      return res.json();
    });
  }

  updateCustomerAddress(address1, address2, city, region, postalCode, country, shippingRegionId) {
    var url = this.baseUrl + '/customers/address';

    var formData = new FormData();
    formData.append('address_1', address1);
    formData.append('address_2', address2);
    formData.append('city', city);
    formData.append('region', region);
    formData.append('postal_code', postalCode);
    formData.append('country', country);
    formData.append('shipping_region_id', shippingRegionId);

    return fetch(url, Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'PUT'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }


  updateCustomer(data) {
    var url = this.baseUrl + '/customer';

    var formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }

    return fetch(url, Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'PUT'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }
  
}
