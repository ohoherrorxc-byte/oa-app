import request from '@/router/axios';

//请假

export default class askForLeaveApi {
    //详情
    static details(businessId) {
        return request({
            url: `/api/oa-flow/leave/detail?businessId=${businessId}`,
            method: 'get',
        })
    }
    static countRestTime(data) {
        return request({
            url: `/api/oa-portal/clockInfo/countRestTime`,
            method: 'post',
            data
        })
    }
    static getHolidayInfoByUserId(userId){
        return request({
            url: `/api/oa-portal/holiday/getHolidayInfoByUserId?userId=${userId}`,
            method: 'get',
        })
    }
}
