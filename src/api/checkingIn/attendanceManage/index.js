import request from '@/router/axios';

export default class AttendanceManageApi {
    static detail(id) {
        return request({
            url: `/api/oa-portal/attendanceGroup/detail?id=${id}`,
            method: 'get',
        })
    }
    static save(data){
        return request({
            url: `/api/oa-portal/attendanceGroup/save`,
            method: 'post',
            data
        })
    }
    static selectPage(params){
        return request({
            url: `/api/oa-portal/attendanceGroup/selectPage`,
            method: 'get',
            params
        })
    }
    static delete(ids){
        return request({
            url: `/api/oa-portal/attendanceGroup/delete?ids=${ids}`,
            method: 'get',
        })
    }
    static banciList(){
        return request({
            url: `/api/oa-portal/rank/getList`,
            method: 'get',
        })
    }
}