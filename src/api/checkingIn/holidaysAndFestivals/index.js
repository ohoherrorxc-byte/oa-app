import request from '@/router/axios';

export default class HolidaysAndFestivalsApi {
    static attendanceGroup() {
        return request({
            url: `/api/oa-portal/attendanceGroup/selectPage`,
            method: 'get',
        })
    }
    static batchSave(data){
        return request({
            url: `/api/oa-portal/festivalHoliday/batchSave`,
            method: 'post',
            data
        })
    }
    static delete(ids){
        return request({
            url: `/api/oa-portal/festivalHoliday/delete?ids=${ids}`,
            method: 'get',
        })
    }
    static getDetail(day,groupId){
        return request({
            url: `/api/oa-portal/festivalHoliday/getDetail?day=${day}&groupId=${groupId}`,
            method: 'get',
        })
    }
    static getFestivalHolidayByYear(year,groupId){
        return request({
            url: `/api/oa-portal/festivalHoliday/getFestivalHolidayByYear?year=${year}&groupId=${groupId}`,
            method: 'get',
        })
    }
    static update(data){
        return request({
            url: `/api/oa-portal/festivalHoliday/save`,
            method: 'post',
            data
        })
    }
}