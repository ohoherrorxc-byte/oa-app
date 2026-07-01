import PartsApplyApi from '@/api/partsApply/index'
import {mapGetters} from 'vuex'
export const mixins = {
    data() {
        return {
            partsList: [],
            form: {
                partBasicDtoList: [
                    {
                        partName: '',
                        partNumber: "",
                        lossRate: "",
                        dayNumber: "",
                        partsProject: "",
                        remark: "",
                        unitPrice: "",
                        quantity: "",
                        money: "",
                        netWorth: "",
                        storageLocation: ""
                    }
                ]
            }
        }
    },
    created() {
        
    },
    computed: {
        ...mapGetters(["userInfo"])
    },
    methods: {     
        async remoteMethodPartName(query, type,key='partName') {
            if(!query)return
            let obj = {
                partName: key!=='partName'?'':query==="isStart"?"":query,
                partNumber: key!=='partNumber'?'':query,
                specificationAndModel: key!=='specificationAndModel'?'':query,
                currentState: type
            }         
            if (type === '已领用') {
                obj.recipient = this.userInfo.nick_name|| this.userInfo.realName || this.userInfo.user_name
            }
            let res = await PartsApplyApi.getBasicList(obj)
            if (res.data.code === 0) {
                this.partsList = res.data.data
                if(this.partsList.length>100&&type!== '已领用'&&type!== '在库中'){
                    this.partsList =  this.partsList.splice(0,100)
                    console.log(this.partsList)
                }
            }
        },
        getPartsDetail(row, index,key='partName') {
            let item = this.partsList.find(ele => {
                return ele.id === row[key]
            })
            // console.log(item)
            const obj = {
                partsCategory: item ? item.partsCategory : null,
                partNumber: item ? item.partNumber : null,
                storageLocation: item ? item.storageLocation : null,
                partId: item ? item.id : null,
                partName: item ? item.partName : null,
                partsProject: item ? item.partsProject : null,
                remark: item ? item.remark : null,
                unitPrice: item ? item.unitPrice : 0,
                warehousingTime: item ? item.warehousingTime : null,
                dayNumber: item ? item.dayNumber : 0,
                netWorth: item ? item.netWorth : null,
                lossRate: null,
                specificationAndModel:item?item.specificationAndModel:null
            }
            // console.log(obj)
            this.$set(this.form.partBasicDtoList, index, obj)
        },
    }
}