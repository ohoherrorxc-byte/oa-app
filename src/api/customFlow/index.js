import request from '@/router/axios';

export default class CustomFlowApi {
    static getDictData(url) {
        return request({
            url: url,
            method: 'get',
        })
    }

}