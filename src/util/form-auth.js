import {getToken} from '@/util/auth';
import website from '@/config/website';
import Vue from 'vue'

export function generateFormReqHeader(rule) {
    if (!Array.isArray(rule)) {
        throw new Error('表单规则类型错误，需要传数组类型')
    }
    let tmpRule = [...rule]
    tmpRule.forEach((item) => {
        // console.log(item)
        if(item.type==='upload'){
            //上传类型设置默认值
            if(!item.props.uploadType){
                Vue.set(item.props,'uploadType','image')
            }
            Vue.set(item.props,'headers',{'Blade-Auth': `bearer ${getToken()}`,'Authorization':`Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`})
            item.props.onSuccess = (res, file)=>{
                file.url = res.data.link 
                console.log(arguments)
            }
            // item.props.headers['Blade-Auth'] = `bearer ${getToken()}`
            // item.props.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
        }else if(item.effect&&item.effect.fetch){
            item.effect.fetch.headers['Blade-Auth'] = `bearer ${getToken()}`
            item.effect.fetch.headers['Authorization'] = `Basic ${Base64.encode(`${website.clientId}:${website.clientSecret}`)}`;
        }
    })
    return tmpRule
}