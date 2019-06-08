import BaseService from './base_service';


export default class OrderService extends BaseService {

  constructor() {
    super();
  }


  getShippingRegions() {
    var url = this.baseUrl + '/shipping/regions';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getShippingTypesByRegion(shippingRegionId) {
    var url = this.baseUrl + '/shipping/regions/' + shippingRegionId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getOrder(orderId) {
    var url = this.baseUrl + '/orders/' + orderId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  createOrder(cartId, shippingId, taxId) {
    var formData = new FormData();
    formData.append('cart_id', cartId);
    formData.append('shipping_id', shippingId);
    formData.append('tax_id', taxId);

    return fetch(this.baseUrl + '/orders', Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'POST'
    }, this.getOptions())).then(function(res) {

      return res.json();
    });
  }

  chargeOrder(stripeToken, orderId, description, amount, currency) {
    var formData = new FormData();
    formData.append('stripeToken', stripeToken);
    formData.append('order_id', orderId);
    formData.append('description', description);
    formData.append('amount', amount.toFixed());
    formData.append('currency', currency);

    return fetch(this.baseUrl + '/stripe/charge', Object.assign({
      body: formData, // must match 'Content-Type' header
      method: 'POST'
    }, this.getOptions())).then(function(res) {

      return res.json();
    });
  }

}
