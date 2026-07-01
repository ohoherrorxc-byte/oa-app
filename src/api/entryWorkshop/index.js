import request from '@/router/axios';

//补卡s

export default class EntryWorkshopApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/operation/user/joinDetail?businessId=${businessId}`,
            method: 'get',
        })
    }
   
    static getSex(){
        return request({
            url: `/api/oa-system/dict/dictionary?code=sex`,
            method: 'get',
        })
    }

}
