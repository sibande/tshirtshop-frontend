import BaseService from './base_service';


export default class PostService extends BaseService {

  constructor() {
    super();
  }

  list(page, limit, descriptionLength) {
    let queryParams = this.getQuery({
      page: page,
      limit: limit,
      description_length: descriptionLength
    }, true);

    let url = this.baseUrl + '/products?' + queryParams;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  getProduct(productId) {
    let url = this.baseUrl + '/products/' + productId;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }

  search(queryString, allWords, page, limit, descriptionLength) {
    let queryParams = this.getQuery({
      query_string: queryString,
      all_words: allWords,
      page: page,
      limit: limit,
      description_length: descriptionLength
    }, true);

    let url = this.baseUrl + '/products/search?' + queryParams;

    return fetch(url, Object.assign({
      method: 'GET'
    }, this.getOptions())).then(function(res) {
      return res.json();
    });
  }


}
