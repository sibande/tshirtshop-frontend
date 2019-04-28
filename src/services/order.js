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

}
