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

  
}
