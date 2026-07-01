import request from '@/router/axios';

export default class SubscribeManageApi {
    //导出
    static exportSubscribeDetail() {
        return request({
            url: `/api/oa-portal/subscribeApply/exportSubscribeDetail`,
            method: 'get',
            responseType: 'blob'
        })
    }
}