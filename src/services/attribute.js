import BaseService from './base_service';


export default class PostService extends BaseService {

  constructor() {
    super();
  }


  getProductAttributes(productId) {
    let url = this.baseUrl + '/attributes/inProduct/' + productId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

}
