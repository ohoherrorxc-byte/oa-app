<template>
  <basic-container>

    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">

        <el-form-item label="收款订单号 ">
          <el-input v-model.trim="query.orderIdTbox" size="mini" clearable/>
        </el-form-item>

        <el-form-item label="VIN ">
          <el-input v-model.trim="query.vin" size="mini" clearable/>
        </el-form-item>

        <el-form-item label="国家地区：">
          <el-select v-model="query.countryReginCode" placeholder="全部"  clearable>
            <el-option v-for="item in countryCodes"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车系车型">
          <series-model v-model="seriesModels" :region="query.countryReginCode" ></series-model>
        </el-form-item>

        <el-form-item label="TBOX收款状态" >
          <el-select v-model="query.statusTbox"  clearable>
            <el-option v-for="item in receiveStatuss" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="语音付款状态"  >
          <el-select v-model="query.statusVoice" clearable>
            <el-option v-for="item in paymentStatuss" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="天气付款状态"  >
          <el-select v-model="query.statusWeather" clearable>
            <el-option v-for="item in paymentStatuss" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地图导航付款状态"  >
          <el-select v-model="query.statusMap" clearable >
            <el-option v-for="item in paymentStatuss" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="地图图资付款状态"  >
          <el-select v-model="query.statusMapData" clearable >
            <el-option v-for="item in paymentStatuss" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" size="mini" type="primary" v-on:click="searchChange">查询</el-button>
          <el-button icon="el-icon-circle-export-outline" size="mini" type="primary" v-on:click="handleExport">导出</el-button>
        </el-form-item>

      </el-form>
    </el-card>
    <el-card>
      <el-row>

        <el-col :span="24" style="margin-bottom: 0px;">
          <div class="tool-box" >
            <el-button :style="[{'width': '101px'},{'border-bottom': '0px'},{'height':'38px'},{'border-radius': '0px'},{'background-color':(changeTboxTab?'#F21F03':'#fee9e6')}]"  v-on:click="showColumn('changeTboxTab')">
              <span :style="{'color':(changeTboxTab?'#FFF': '#F21F03')}"> Tbox收付款</span></el-button>
            <el-button :style="[{'width': '100px'},{'margin-left':'auto'},{'border-bottom': '0px'},{'height':'38px'},{'border-radius': '0px'},{'background-color':(changeVoiceTab?'#F21F03':'#fee9e6')}]"  v-on:click="showColumn('changeVoiceTab')">
              <span :style="{'color':(changeVoiceTab?'#FFF': '#F21F03')}"> 语音付款</span></el-button>
            <el-button :style="[{'width': '101px'},{'margin-left':'-1px'},{'border-bottom': '0px'},{'height':'38px'},{'border-radius': '0px'},{'background-color':(changeWeatherTab?'#F21F03':'#fee9e6')}]"  v-on:click="showColumn('changeWeatherTab')">
              <span :style="{'color':(changeWeatherTab?'#FFF': '#F21F03')}"> 天气付款</span></el-button>
            <el-button :style="[{'width': '101px'},{'margin-left':'-1px'},{'border-bottom': '0px'},{'height':'38px'},{'border-radius': '0px'},{'background-color':(changeNavigatioTab?'#F21F03':'#fee9e6')}]"  v-on:click="showColumn('changeNavigatioTab')">
              <span :style="{'color':(changeNavigatioTab?'#FFF': '#F21F03')}"> 导航付款</span></el-button>
            <el-button :style="[{'width': '101px'},{'margin-left':'-1px'},{'border-bottom': '0px'},{'height':'38px'},{'border-radius': '0px'},{'background-color':(changeMapTab?'#F21F03':'#fee9e6')}]"  v-on:click="showColumn('changeMapTab')">
              <span :style="{'color':(changeMapTab?'#FFF': '#F21F03')}"> 图资付款</span></el-button>
          </div>
        </el-col>
      </el-row>

      <!-- table 列表 -->
      <el-row>
        <el-table :data="data" border style="width: 100%" @selection-change="selectChange">
          <el-table-column align="center" label="VIN" prop="vin" width="100" v-bind:formatter=" formatterData" v-bind:key="1"></el-table-column>
          <el-table-column :formatter="countryCodesFormat" align="center" label="国家地区" width="100" prop="countryReginCode"   :key="2"></el-table-column>
          <el-table-column align="center" label="车系" width="100" prop="seriesName"   :key="3"></el-table-column>
          <el-table-column align="center" label="车型" prop="modelName" width="100"  :key="4"></el-table-column>
          <el-table-column align="center" label="TBOX不统计类型" prop="isTestVehicle" v-bind:formatter=" formatterIsTestVehicle" width="130" key="5"></el-table-column>
          <el-table-column align="center" label="TBOX是否要统计" prop="needStatisticsTboxName" width="130" v-if="changeTboxTab" :key="6"></el-table-column>
          <el-table-column align="center" label="语音是否要统计" prop="needStatisticsVoiceName" width="120" v-if="changeVoiceTab" v-bind:key="7"></el-table-column>
          <el-table-column align="center" label="天气是否要统计" prop="needStatisticsWeatherName" width="120" v-if="changeWeatherTab" v-bind:key="8"></el-table-column>
          <el-table-column align="center" label="导航/地图是否要统计"  prop="needStatisticsMapName" width="160" v-if="changeNavigatioTab||changeMapTab" :key="9"></el-table-column>


          <el-table-column align="center" label="TBOX激活时间" prop="activationTime"  v-bind:key="10" width="130"></el-table-column>
          <el-table-column align="center" label="AVN激活时间" prop="avnActivateTime"  v-bind:key="11" width="120"></el-table-column>
          <el-table-column align="center" label="收款状态" prop="statusTbox" width="100" v-bind:formatter="formatterTboxStatuss" v-bind:key="12"></el-table-column>
          <el-table-column align="center" label="收款订单号" prop="orderIdTbox" width="100" v-bind:v-if="changeTboxTab" :key="13"></el-table-column>

          <el-table-column align="center" label="语音付款状态" prop="statusVoice" v-bind:formatter="formatterSupplierStatuss" v-if="changeVoiceTab||changeTboxTab" :key="14" width="120" ></el-table-column>
          <el-table-column align="center" label="语音付款订单号" prop="orderIdVoice"  v-if="changeVoiceTab" :key="15" width="100" ></el-table-column>
          <el-table-column align="center" label="语音付款时间" prop="voicePaidTime" width="100"  v-if="changeVoiceTab" :key="16"></el-table-column>
          <el-table-column align="center" label="语音供应商" prop="supplierNameVoice" width="100" v-if="changeVoiceTab" :key="17"></el-table-column>


          <el-table-column align="center" label="天气付款状态" prop="statusWeather" v-bind:formatter="formatterSupplierStatuss" v-if="changeWeatherTab||changeTboxTab" :key="18" width="120" ></el-table-column>
          <el-table-column align="center" label="天气付款订单号" prop="orderIdWeather"  v-if="changeWeatherTab" :key="19" width="100" ></el-table-column>
          <el-table-column align="center" label="天气付款时间" prop="weatherPaidTime" v-if="changeWeatherTab" :key="20" width="100"></el-table-column>
          <el-table-column align="center" label="天气供应商" prop="supplierNameWeather" v-if="changeWeatherTab" :key="21" width="100"></el-table-column>


          <el-table-column align="center" label="导航付款状态" prop="statusMap" width="100"  :formatter="formatterSupplierStatuss" v-if="changeNavigatioTab||changeTboxTab" :key="22"></el-table-column>
          <el-table-column align="center" label="导航付款订单号" prop="orderIdMap" v-if="changeNavigatioTab" :key="23" width="100" ></el-table-column>
          <el-table-column align="center" label="导航付款时间" prop="mapPaidTime" width="100" v-if="changeNavigatioTab" :key="24"></el-table-column>
          <el-table-column align="center" label="导航供应商" prop="supplierNameMap" width="100" v-if="changeNavigatioTab" :key="25"></el-table-column>

          <el-table-column align="center" label="图资付款状态" prop="statusMapData" width="100"  :formatter="formatterSupplierStatuss" v-if="changeMapTab||changeTboxTab" :key="26"></el-table-column>
          <el-table-column align="center" label="图资付款订单号" prop="orderIdMapData"  v-if="changeMapTab" :key="27" width="100" ></el-table-column>
          <el-table-column align="center" label="图资付款时间" prop="lastUpdateMapData" width="100" v-if="changeMapTab" :key="28"></el-table-column>
          <el-table-column align="center" label="图资供应商" prop="supplierNameMapData" width="100" v-if="changeMapTab" :key="29"></el-table-column>


          <el-table-column align="center" label="地图激活时间" prop="mapActivatedTime" width="130" v-if="changeNavigatioTab||changeMapTab" :key="30">
          </el-table-column>


        </el-table>
      </el-row>

      <!-- 分页 -->
      <el-row>
        <el-pagination
          :key="page.elementuiKey"
          :current-page.sync="page.currentPage"
          :page-size="10"
          :page-sizes="[10, 20, 30, 50]"
          :total="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="sizeChange"
          @current-change="currentChange">
        </el-pagination>
      </el-row>
    </el-card>

  </basic-container>
</template>

<script>
import {exportList, getList} from "@/api/saic/tboxpaidlist";
import {download} from "@/util/excel";
import {mapGetters} from "vuex";
import SeriesModel from "@/views/saic/series-model";
import constData from "@/config/constData";
import {findByvalue} from "@/util/util";
// import table from "../util/table";


export default {

  components: {SeriesModel},
  data() {
    return {
      // 是否显示
      formVisible: false,
      // 是否查看
      viewMode: false,
      // dialog标题
      dialogTitle: '',
      // 列表查询数据
      query: {
        countryReginCode: '',
        statusVoice: '',
        statusWeather: '',
        statusMap:'',
        statusTbox: '',
        orderIdTbox: '',
        vin: '',
        seriesModel:''

      },
        seriesModels:{ model: "" },
      loading: true,
      //table中数据
      data: [],
      multiSelection: [],
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        elementuiKey: 0
      },
      regionCode:'',
      changeTboxTab: true,
      changeVoiceTab: false,
      changeWeatherTab: false,
      changeNavigatioTab: false,
      changeMapTab: false,

      isTboxActive:true,
      isVoiceActive:false,
      isWeatherActive:false,
      isNavActive:false,
      isMapActive:false,
      // isAuditReferee: 0,


      //收款状态
      receiveStatuss: constData.orderStatus,
      //付款状态
      paymentStatuss: constData.billStatus,
      countryCodes: [
        // {value: "3G02", name: "欧盟"},
        // {value: "3G08", name: "英国"},
        // {value: "3G05", name: "泰国"},
        // {value: "3G07", name: "印度"},
        // {value: "3F02", name: "澳洲设计标准"},
        // {value: "3G16", name: "印尼"},
      ],

    }
  },
  created() {
      this.countryCodes=constData.countryList;

      this.query.orderIdTbox = this.$route.query.orderIdTbox;
      if(this.query.orderIdTbox){
          this.onLoad(this.page, this.query);
      }
  },
  computed: {

    ...mapGetters(["userInfo", "permission"]),
    ids() {
      let ids = [];
      this.multiSelection.forEach(ele => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },

  },
  methods: {

    onLoad(page, params = {}) {
      this.loading = true;
      this.isShow = true;

      this.query.seriesModel = this.seriesModels.model

      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {
        //debugger
        this.data = res.data.data.records;
        this.page.total = res.data.data.total;
      });
      this.loading = false;
    },


searchChange() {

      if ((this.query.countryReginCode == null || this.query.countryReginCode.length == 0)
        && (this.query.vin == null || this.query.vin.length == 0)
        && (this.query.orderIdTbox == null || this.query.orderIdTbox.length == 0)) {
        this.$message({type: "warning", message: '国家地区 / VIN 必须选择其中一项'});
        return;
      }
      this.page.currentPage = 1;
      this.page.elementuiKey= 1;
      this.onLoad(this.page, this.query);
    },

    change: ({value}) => {
      this.regionCode = value;
    },
    selectChange(val) {
      this.multiSelection = val;
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
      this.onLoad(this.page, this.query);
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
      this.onLoad(this.page, this.query);
    },

    countryCodesFormat(row, column) {
      const daterc = row[column.property];

      // if (daterc) {
      //   if (daterc == '3G02') {
      //     return "欧盟";
      //   } else if (daterc == '3G08') {
      //     return "英国";
      //   } else if (daterc == '3G05') {
      //     return "泰国";
      //   } else if (daterc == '3G07') {
      //     return "印度";
      //   } else if (daterc == '3G16') {
      //     return "印尼";
      //   } else if (daterc == '3F02') {
      //     return "澳洲设计标准";
      //   }
      // }
      for(let i=0;i<this.countryCodes.length;i++){
        if(daterc == this.countryCodes[i].value){
          return this.countryCodes[i].label;
        }
      }
    },
      formatterIsTestVehicle(row, column) {
          // 车型不统计 > 导入工程车不统计 > 手动设置不统计
          const daterc = row[column.property];
          const needStatisticsTbox = row['needStatisticsTbox'];
          const modelNeedStatisticsTbox = row['modelNeedStatisticsTbox'];
          if(needStatisticsTbox == 1 && modelNeedStatisticsTbox == 1) {
              return "要统计";
          }
          if(modelNeedStatisticsTbox == 0){
              return "车型不统计";
          }
          if(daterc ==1 && needStatisticsTbox == 0){
              return "导入工程车";
          }else {
              return "手动设置";
          }
      },
    formatterTboxStatuss(row, column) {
      const daterc = row[column.property]
      //console.log(daterc)
      if (daterc === undefined || daterc === -1 || daterc === 5) return ""
      return findByvalue(constData.orderStatus, parseInt(daterc))
    },

    formatterData(row,column) {
      const daterc = row[column.property];
      if(daterc == '-1') {
        return '';
      }
      return daterc;
    },
    formatterSupplierStatuss(row, column) {
      const daterc = row[column.property]
      //console.log(daterc)
      if (daterc === undefined || daterc === -1 || daterc === 5) return ""
      return findByvalue(constData.billStatus, parseInt(daterc))
    },
      showColumn(tabName){
        if(tabName == 'changeTboxTab'){
            this.changeTboxTab = true;
            this.changeVoiceTab = false;
            this.changeWeatherTab = false;
            this.changeNavigatioTab = false;
            this.changeMapTab = false;

            this.isVoiceActive=false;
            this.isWeatherActive=false;
            this.isNavActive=false;
            this.isMapActive=false;
        }else if(tabName == 'changeVoiceTab'){
            this.changeTboxTab = false;
            this.changeVoiceTab = true;
            this.changeWeatherTab = false;
            this.changeNavigatioTab = false;
            this.changeMapTab = false;

          this.isVoiceActive=true;
          this.isWeatherActive=false;
          this.isNavActive=false;
          this.isMapActive=false;
        }else if(tabName == 'changeWeatherTab'){
            this.changeWeatherTab = true;
            this.changeTboxTab = false;
            this.changeVoiceTab = false;
            this.changeNavigatioTab = false;
            this.changeMapTab = false;
        }else if(tabName == 'changeNavigatioTab'){
            this.changeNavigatioTab = true;
            this.changeWeatherTab = false;
            this.changeTboxTab = false;
            this.changeVoiceTab = false;
            this.changeMapTab = false;
        }else if(tabName == 'changeMapTab'){
            this.changeMapTab = true;
            this.changeNavigatioTab = false;
            this.changeWeatherTab = false;
            this.changeTboxTab = false;
            this.changeVoiceTab = false;
        }
        return;
      },

    handleExport() {
      if ((this.query.countryReginCode == null || this.query.countryReginCode.length == 0)
        && (this.query.vin == null || this.query.vin.length == 0)
        && (this.query.orderIdTbox == null || this.query.orderIdTbox.length == 0)) {
        this.$message({type: "warning", message: '国家地区 / VIN 必须选择其中一项'});
        return;
      }
      this.$confirm("确定导出数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //取车型
        this.query.seriesModel = this.seriesModels.model
        return exportList(this.query);
      }).then((res) => {
        download(res);
      })
    },
  }
}
</script>
<style lang="scss" scoped>
.el-pagination {
  position: relative;
  text-align: right;
  padding: 25px 0 20px 20px;
}

.el-form .el-select {
  width: 100%;
}
.el-table .cell {
  height: 20px !important;
}
.el-table{
  width:99.9%!important;//不让它到临界值，这样可避免自动计算
}

.co-el-button{
  width: 101px;
  border-bottom: 0px;
  height: 38px;
  border-radius:0px;
}
</style>
