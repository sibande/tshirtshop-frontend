import BaseService from './base_service';
import {handleFetchResponse} from './base_service';


export default class OrderService extends BaseService {

  constructor() {
    super();
  }


  getShippingRegions() {
    var url = this.baseUrl + '/shipping/regions';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return handleFetchResponse(res);
    });
  }

  getShippingTypesByRegion(shippingRegionId) {
    var url = this.baseUrl + '/shipping/regions/' + shippingRegionId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return handleFetchResponse(res);
    });
  }

  getOrder(orderId) {
    var url = this.baseUrl + '/orders/' + orderId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return handleFetchResponse(res);
    });
  }

  getOrderList() {
    var url = this.baseUrl + '/orders/inCustomer';

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return handleFetchResponse(res);
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
      return handleFetchResponse(res);
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
      return handleFetchResponse(res);
    });
  }

}
