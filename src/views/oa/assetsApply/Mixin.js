import AssetsApplyApi from '@/api/assetsApply/index'
export const mixins = {
    data() {
        return {
            assetsList: [],
            form: {
                propertyList: [
                    {
                      assetCategories: "",
                      assetName: "",
                      assetNumber: "",
                      assetClass: "",
                      assetSubcategories: "",
                      assetLevel: "",
                      specificationAndModel: "",
                      brand: "",
                      unitPrice: "",
                      quantity: "",
                      money: "",
                      serviceLife: "",
                      relatedProjects: "",
                      assetDescription: "",
                      storageLocation: "",
                      requisitionDate: "",
                      receivingDepartment: "",
                      recipient: "",
                      assetStatus: "",
                      assetId:''
                    },
                  ],
            }
        }
    },
   
    methods: {
        async remoteMethodAssetsName(query) {   
            let res = await AssetsApplyApi.getProperty(query)
            if (res.data.code === 0) {
                this.assetsList = res.data.data
            }
        },
        getAssetsDetail(row, index) {
            let item = this.assetsList.find(ele => {
                return ele.id === row.id
            })
            // console.log(item)
            const obj = {
                assetCategories: item ? item.assetCategories : null,
                assetName: item ? item.assetName : null,
                storageLocation: item ? item.storageLocation : null,
                assetId: item ? item.id : null,
                id:item ? item.id : null,
                assetNumber: item ? item.assetNumber : null,
                assetClass: item ? item.assetClass : null,
                assetSubcategories: item ? item.assetSubcategories : null,
                assetLevel: item ? item.assetLevel : 0,
                specificationAndModel: item ? item.specificationAndModel : null,
                brand: item ? item.brand : 0,
                unitPrice: item ? item.unitPrice : null,
                quantity: item ? item.quantity : null,
                money: item ? item.money : null,
                serviceLife: item ? item.serviceLife : null,
                relatedProjects: item ? item.relatedProjects : null,
                assetDescription: item ? item.assetDescription : null,
                storageLocation: item ? item.storageLocation : null,
                requisitionDate: item ? item.requisitionDate : null,
                receivingDepartment: item ? item.receivingDepartment : null,
                recipient: item ? item.recipient : null,
                assetStatus: item ? item.assetStatus : null,
                statusName:item ?item.statusName:null,
                haveKey:item ?item.haveKey:null,
                serialNumber:item ?item.serialNumber:null,
            }
            // console.log(obj)
            this.$set(this.form.propertyList, index, obj)
        },
    }
}