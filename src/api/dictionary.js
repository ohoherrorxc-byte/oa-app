import request from '@/router/axios';

export default class dictionaryApi {
  static getDictionary(code) {
    return request({
      url: `/api/oa-system/dict/dictionary?code=${code}`,
      method: 'get',
    })
  }
}