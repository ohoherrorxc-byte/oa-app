<template>
  <basic-container>
    <el-row :gutter="24">
      <el-col :span="spanLeft">
        <kaoQinGroup ref="kaoQinGroup" @collapse="collapse" @currRow="getCurKaoQin"></kaoQinGroup>
      </el-col>
      <el-col :span="spanRight">
        <div class="row-button">
          <div class=" ">
            <span class="" @click="checkState(1)" :class="{choose:tabValue===1}">日历</span>
            <span class="mx10" @click="checkState(2)" :class="{choose:tabValue===2}">清单</span>
            <el-button type="primary" v-if="tabValue===2" icon="el-icon-delete" class="fr mx10" @click="branchDelete">批量删除</el-button>
            <el-button type="primary" icon="el-icon-plus" class="fr" @click="add">新 建</el-button>
            <el-date-picker format="yyyy" value-format="yyyy" class="" v-model="currYear" @change="getYear" type="year"
                placeholder="选择年">
              </el-date-picker>
          </div>
        </div>
        <div class="" v-if="tabValue===1">
          <div class="flex-center pb20">         
            <div>        
            </div>
            <div class="list-desc">
              <div v-for="item in typeList" class="flex-center ">
                <div :style="{ background: item.color }" class="icon-squr mx5"></div>
                <div class="pr5">{{ item.name }}:{{ holidayData[item.type] }}天</div>
              </div>
            </div>
          </div>
          <div class="rili">
            <riliList @editDate="editDate" ref="riliListL" :year="currYear" :month="index" v-for="(item, index) in 12"
              :key="index" :list="holidayData.allFestivalHoliday">
            </riliList>
          </div>
        </div>
        <div v-else>
           <list ref="listRef" @editDate="editDate" @getDetail="getDetail" :list="holidayData.allFestivalHoliday"></list>
        </div>
      </el-col>
    </el-row>
    <createHoliday @getDetail="getDetail" ref="createHoliday" :curKaoQin="curKaoQin"></createHoliday>
  </basic-container>
</template>

<script>
import kaoQinGroup from './components/kaoQinGroup.vue'
import createHoliday from './components/createHoliday.vue'
import riliList from './components/riliList.vue'
import HolidaysAndFestivalsApi from '@/api/checkingIn/holidaysAndFestivals/index'
import list from './components/list.vue'
export default {
  components: {
    kaoQinGroup, riliList, createHoliday,list
  },
  data() {
    return {
      currYear: new Date().getFullYear(),
      holidayData: {
        allocateWorkDay: '',
        personHolidayDay: "",
        allocateHoliday: "",
        allFestivalHoliday: []
      },
      tabValue:1,
      isCollapse: false,
      typeList: [
        {
          type: 'personHolidayDay',
          number: 11,
          color: 'green',
          name: '公众假日'
        },
        {
          type: 'allocateWorkDay',
          number: 11,
          color: 'red',
          name: '调配工作日'
        },
        {
          type: 'allocateHoliday',
          number: 12,
          color: 'blue',
          name: '调配休息日'
        }
      ],
      curKaoQin: {}
    }
  },
  computed: {
    spanLeft() {
      return !this.isCollapse ? 5 : 1
    },
    spanRight() {
      return !this.isCollapse ? 19 : 23
    }
  },
  mounted() {
  },
  methods: {
    collapse(key) {
      this.isCollapse = key
    },
    checkState(val){
      this.tabValue = val
      this.getDetail()
    },
    editDate(data) {
      this.$refs.createHoliday.dialogVisible = true
      this.$refs.createHoliday.getDetail(data)
      console.log(data)
      console.log('data')
    },
    branchDelete(){
      this.$refs.listRef.deleteRow('',true)
    },
    add() {
      this.$nextTick(() => {
        this.$refs.createHoliday.dialogVisible = true
        this.$refs.createHoliday.reset()
      })
    },
    getYear(e) {
      this.currYear = e
      this.getDetail()
    },
    getCurKaoQin(data) {
      this.curKaoQin = data
      this.getDetail()
    },
    async getDetail() {
      let res = await HolidaysAndFestivalsApi.getFestivalHolidayByYear(this.currYear, this.curKaoQin.id)
      // console.log(res)
      if (res.data.code === 0) {
        this.holidayData = res.data.data
        // this.$nextTick(()=>{
        //   this.$refs.riliListL.dealData(this.holidayData.allFestivalHoliday)
        // })   
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.choose{
  color: #409eff;
  border-bottom: 1px solid;
  padding-bottom: 5px;
  margin-bottom: 20px;
}
.rili {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

}

.icon-squr {
  width: 16px;
  height: 16px;
}

.row-button {
  height: 50px;
  // padding-bottom:20px;
}

.list-desc {
  display: flex;
  margin-left: auto;
}
</style>