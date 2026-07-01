import request from '@/router/axios';

export default class subjectManageApi {
    static getList(value) {
        //listForFlow
        let data = value
        return request({
            url: '/api/oa-portal/subject/listForFlow',
            method: 'post',
            data
        })
    }
    static getListSubject(data){
        return request({
            url: '/api/oa-portal/subject/list',
            method: 'post',
            data
        })
    }
    
    static getListAll(){
        return request({
            url: '/api/oa-portal/subject/subject-list',
            method: 'get',
        })
    }
    static add(data) {
        return request({
            url: '/api/oa-portal/subject/save',
            method: 'post',
            data
        })
    }
    static update(data) {
        return request({
            url: '/api/oa-portal/subject/update',
            method: 'post',
            data
        })
    }

    static details(id) {
        return request({
            url: `/api/oa-portal/subject/update?id=${id}`,
            method: 'post'
        })
    }

    static exportSubject(costCenterId){
        return request({
            url: `/api/oa-portal/subject/import-all?costCenterId=${costCenterId}`,
            method: 'get',
            responseType: 'blob'
        })
    }
    static importSubject(data){
        return request({
            url: `/api/oa-portal/subject/import`,
            method: 'post',
            data
        })
    }
    static downModel(){
        return request({
            url: `/api/oa-portal/subject/exportTemplate`,
            method: 'get',
            responseType: 'blob'
        })
    }
    static subjectMoney(subjectId,costCenterId){
        return request({
            url: `/api/oa-portal/subject/subjectMoney?subjectId=${subjectId}&costCenterId=${costCenterId}`,
            method: 'get'
        })
    }
   
}