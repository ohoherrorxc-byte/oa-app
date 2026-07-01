import request from '@/router/axios';

export default class OriginalStatementApi {
    static list(params) {
        return request({
            url: `/api/oa-portal/clockInfo/selectPage`,
            method: 'get',
            params
        })
    }
    static originalStatementExport(){
        return request({
            url: `/api/oa-portal/clockInfo/export`,
            method: 'get',
            responseType: 'blob'
        })
    }

    static totalClockInfoPage(data){
        return request({
            url: `/api/oa-portal/clockInfo/totalClockInfoPage`,
            method: 'post',
            data
        })
    }
    static dayClockInfoPage(data){
        return request({
            url: `/api/oa-portal/clockInfo/dayClockInfoPage`,
            method: 'post',
            data
        })
    }
    
    static totalClockInfoExport(params){
        return request({
            url: `/api/oa-portal/clockInfo/totalClockInfoExport`,
            method: 'get',
            responseType: 'blob',
            params:{
                ...params
            }
        })
    }
    static getHolidayInfoByUserId(userId){
        return request({
            url: `/api/oa-portal/holiday/getHolidayInfoByUserId?userId=${userId}`,
            method: 'get',
        })
    }
    static getClockInDetails(userId,time){
        return request({
            url: `/api/oa-app/clockIn/getClockInDetails?userId=${userId}&time=${time}`,
            method: 'get',
           
        })
    }
}