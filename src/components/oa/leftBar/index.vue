<template>
    <div class="leftContainer">
        <div v-for="item in menuList"  class="item-button" @click="$emit('tab', item.tabName)">
            <img :src="require(`../../../assets/${item.iconImg}`)" class="w50 h50" alt="">
            <div class="mt10 text-center">{{ $t(`leftBar.${item.name}`) }}</div>
        </div>
    </div>
</template>

<script>
import * as config from './config/index'
import { mapGetters } from "vuex";
export default {
    data() {
        return {
              menuList:[]  
        }
    },
    props:{
        barName:{
            type:String,
            default:''
        }
    },
    computed: {
    ...mapGetters(["userInfo"]),
  },
    mounted(){
        this.menuList = config[this.barName]
        this.menuList = this.menuList.filter(ele=>{
            if(ele.notShowPerson){
                return this.userInfo.role_name!=="大乘用车人员"||this.userInfo.account==="osikfi"||this.userInfo.account==="xfhje"||this.userInfo.account==="ofnaxi"
                //张方方 王振勇  殷霄雯
                //return !ele.notShowPerson.includes(this.userInfo.account)
            }
            return !ele.showPerson||ele.showPerson.includes(this.userInfo.nick_name)
        })    
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
.leftContainer {
    margin-top: 20px;
}

.item-button {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-bottom: 30px;
}
.text-center{
    text-align: center;
}
</style>