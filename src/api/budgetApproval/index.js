import request from '@/router/axios';

export default class BudgetApprovalApi {
    static getSubjectCode(projectName,type) {
        return request({
            url: `/api/oa-flow/project/budget/getSubjectCode?projectName=${projectName}&type=${type}`,
            method: 'get',           
        })
    }
}