import {configure, renderString, render} from 'nunjucks';

var routes = require('./../routes');

import BaseController from './base';
import OrderService from './../services/order';

var orderService = new OrderService();


export default class OrderController extends BaseController {

  constructor() {
    super();
  }

  render(params, query) {
    var that = this;

    orderService.getOrderList().then(function(orders) {

      render('order_history.html', {customer: that.customer, orders: orders}, function(err, res) {
	var mainDiv = document.getElementById('main');
	mainDiv.innerHTML= res;

	//
	that.globalInit();
      });

    });
  }


}
