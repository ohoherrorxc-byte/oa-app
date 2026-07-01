<template>
    <div>
        <partsMaintenance ref="partsMaintenanceRef" :isUpdateFlow="true" :categoryPriceForm="categoryForm" ></partsMaintenance>
    </div>
</template>

<script>
import partsMaintenance from "@/views/contract/partsMaintenance/addOrUpdateOrDetail/index.vue"
import PartsUpdateApi from '@/api/partsUpdate/index'
export default {
    data() {
        return { 
            businessId: null,
            categoryForm:null,
            form:null
        }
    },
    components: { partsMaintenance },
    created() { },
    mounted() {
        let name = this.$route.query.titleName
      
        this.businessId = this.$route.query.businessId;
        this.isEdit = this.$route.query.isEdit;
        if (this.businessId) {
            this.getDetail();
        }
    },
    methods: {
        async getDetail() {
            let res = await PartsUpdateApi.details(this.businessId)
            if(res.data.code===200){
                //零件ID，价格维护回显
                this.categoryForm = JSON.parse(JSON.stringify(res.data.data))
                this.categoryForm.tbPartsCategoryList.map(ele=>{
                    if(ele.validStartDate){
                        ele.validDate = [ele.validStartDate,ele.validEndDate]
                    }
                })
                this.categoryForm.id = this.categoryForm.partId
                this.form = res.data.data;
                this.form.fileList = this.form.fileList||[]
                this.$emit("getFormData", this.form);
            }
        },
        // submit(){
        //     if( this.isSubMaint){
        //         this.$refs.partSubMaintRef.handleSubmit()
        //     }else{
        //         this.$refs.partsMaintenanceRef.handleSubmit()
        //     }
        // },
        testForm(){
            return true
        }
    }
}
</script>