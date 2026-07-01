<template>
  <basic-container>
    <div>
      <el-tabs value="first" v-model="activeName" @tab-click="tabClick">
        <el-tab-pane :label="$t('salesAmountWaterfullBoard.tboxActivationCount')" name="first">
          <el-row class="mb20">
            <el-col :span="24">
              <div class="fr">
                <span>{{$t('salesAmountWaterfullBoard.autoUpdateData')}}{{ updateTime }}</span>
                <!-- <el-button type="primary" class="mb10 ml20" @click="refleshData">手动刷新</el-button> -->
              </div>
            </el-col>
           
          </el-row>
          <el-row class="mb20">
          </el-row>
          <el-row style="margin-bottom: 100px;">
            <el-col id="activeDetailChart" :span="8" style="height: 550px"></el-col>
            <el-col id="currentYearActiveCountChart" :span="16" style="height: 550px"></el-col>
          </el-row>
          <el-row>
            <el-col :span="24" class="">
              <div class="fr">
                <span>{{$t('salesAmountWaterfullBoard.invoicedNetworkYear')}}：{{ $formatAmt(invoiceOnlineCount,0) }}</span>
                <!-- <el-button type="primary" class="mb10 ml20" @click="refleshData">手动刷新</el-button> -->
              </div>
            </el-col>
            <el-col :span="24" class="mt5">
              <div class="fr">
                <span>{{$t('salesAmountWaterfullBoard.invoicedNotNetworkYear')}}：{{ $formatAmt(invoiceOfflineCount,0) }}</span>
                <!-- <el-button type="primary" class="mb10 ml20" @click="refleshData">手动刷新</el-button> -->
              </div>
            </el-col>
            <el-col id="activeDetailBar" :span="24" style="height: 550px"></el-col>
           
          </el-row>
          <el-row>
            <el-col id="monthActiveCountChart" :span="24" style="height: 550px;"></el-col>
          </el-row>
          <!-- <el-row>
            <dataReport></dataReport>
          </el-row> -->
        </el-tab-pane>
        <!-- <el-tab-pane :label="$t('salesAmountWaterfullBoard.businessData')" name="second">
          <el-table :data="receivableData3" :row-style="rowStyle" @cell-click="handleClick">
            <el-table-column prop="salesType" :label="$t('salesAmountWaterfullBoard.itemClassification')" width="100" align="center" fixed></el-table-column>
            <el-table-column prop="shouldSignContract" :formatter="formatterNumber" label="合同-待签总金额" align="center">
            </el-table-column>
            <el-table-column prop="signedContract" :label="$t('salesAmountWaterfullBoard.contractSignedThisYear')" :formatter="formatterNumber"
              align="center"></el-table-column>
            <el-table-column prop="shouldOpenInvoice" label="发票-待开总金额" :formatter="formatterNumber"
              align="center"></el-table-column>
            <el-table-column prop="openedInvoice" :label="$t('salesAmountWaterfullBoard.invoiceOpenedThisYear')" :formatter="formatterNumber"
              align="center"></el-table-column>
            <el-table-column prop="shouldCollect" label="收款-待收总金额" :formatter="formatterNumber"
              align="center"></el-table-column>
            <el-table-column prop="collected" :label="$t('salesAmountWaterfullBoard.collectionThisYear')" :formatter="formatterNumber"
              align="center"></el-table-column>
          </el-table>
        </el-tab-pane> -->
        <el-tab-pane :label="$t('salesAmountWaterfullBoard.annualSalesData')" name="third" v-if="false">
          <el-row>
            <el-col :span="12">
              <el-date-picker v-model="fiscalYear" type="year" placeholder="选择财年" value-format="yyyy"
                @change="changeSalesYear">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row>
            <el-col id="salesTotalAmountChart" :span="12" style="height: 550px;width:550px"></el-col>
            <el-col id="eurInvoice" :span="12" style="height: 550px"></el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-date-picker v-model="salesYear" type="year" placeholder="选择年份" value-format="yyyy"
                @change="changeSalesYear2">
              </el-date-picker>
            </el-col>
          </el-row>
          <el-row>
            <el-col id="salesTotalAmountByYearChart" :span="24" style="height: 550px;width:1100px"></el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="$t('salesAmountWaterfullBoard.salesData')" name="fourth">
          <div class="">
            <div class="pb10 flex">
              <div>
                {{$t('salesAmountWaterfullBoard.year')}}：
                <el-date-picker v-model="collectionMonth" type="year" placeholder="选择年份" value-format="yyyy"
                  @change="changeCollectionMonth">
                </el-date-picker>
              </div>
              <div class="pl30">
                {{$t('salesAmountWaterfullBoard.type')}}：
                <el-radio-group v-model="searchTableHead" class="pl10">
                  <el-radio :label="0">{{$t('salesAmountWaterfullBoard.all')}}</el-radio>
                  <el-radio :label="1">{{$t('salesAmountWaterfullBoard.targetData')}}</el-radio>
                  <el-radio :label="2">{{$t('salesAmountWaterfullBoard.actualData')}}</el-radio>
                </el-radio-group>
              </div>
            </div>
            <div class="mb20">
              <el-table :data="receivableData1"   v-loading="isLoadingReceive" :row-style="rowStyle">
                <el-table-column prop="salesType" :label="$t('salesAmountWaterfullBoard.type')" width="60" fixed></el-table-column>
                <el-table-column :label="$t('salesAmountWaterfullBoard.annualTarget')" prop="yearGoalAmount" :formatter="formatterNumber" width="130"
                  align="center"></el-table-column>
                <el-table-column :label="$t('salesAmountWaterfullBoard.cumulativeCompletion')" prop="yearAmount" width="130" :formatter="formatterNumber"
                  align="center"></el-table-column>
                <el-table-column :label="$t('salesAmountWaterfullBoard.targetCompletionRate')" width="100" align="center" prop="targetCompletionRate"
                  :formatter="formatterNumber"></el-table-column>
                <el-table-column key="4" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.januaryTarget')" prop="janGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="5" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.januaryActual')" prop="janAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                      <el-table-column key="6" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.februaryTarget')" prop="febGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="7" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.februaryActual')" prop="febAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="8" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.marchTarget')" prop="marGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"> </el-table-column>
                <el-table-column key="9" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.marchActual')" prop="marAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                        <el-table-column key="10" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.aprilTarget')" prop="aprGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="11" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.aprilActual')" prop="aprAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="12" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.mayTarget')" prop="mayGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="13" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.mayActual')" prop="mayAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="14" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.juneTarget')" prop="junGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="15" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.juneActual')" prop="junAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="16" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.julyTarget')" prop="julGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="17" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.julyActual')" prop="julAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="18" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.augustTarget')" prop="augGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="19" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.augustActual')" prop="augAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="20" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.septemberTarget')" prop="septGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="21" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.septemberActual')" prop="septAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="22" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.octoberTarget')" prop="octGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="23" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.octoberActual')" prop="octAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="24" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.novemberTarget')" prop="novGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="25" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.novemberActual')" prop="novAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="26" v-if="showGoal()" :label="$t('salesAmountWaterfullBoard.decemberTarget')" prop="decGoalAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
                <el-table-column key="27" v-if="showFact()" :label="$t('salesAmountWaterfullBoard.decemberActual')" prop="decAmount" width="100"
                  :formatter="formatterNumber" align="center"></el-table-column>
              </el-table>
            </div>
          </div>
          <el-row>
            <el-col id="salesTotalAmountByYearChart" :span="24" style="height: 550px;width:1300px"></el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane  :label="$t('salesAmountWaterfullBoard.receivableReport')" name="seven">
          <accountsReceivable ref="accountsReceivable"></accountsReceivable>
        </el-tab-pane>
        <el-tab-pane :label="$t('salesAmountWaterfullBoard.licenseActivationAndInvoiceData')" name="sixth">
          <vinCheckData ref="vinCheckData"></vinCheckData>
        </el-tab-pane>
        <!-- <el-tab-pane :label="$t('salesAmountWaterfullBoard.technicalManagementReportData')" name="fifth">
          <Upload v-if="userInfo.user_name === 'admin'" :process='false' :fileListL="fileList" @getFileList="getFileList"
            :multiple="true" :btnName="$t('salesAmountWaterfullBoard.uploadImage')">
          </Upload>
          <el-button v-if="userInfo.user_name === 'admin'" type="primary" size="medium" @click="submitPhoto">{{$t('salesAmountWaterfullBoard.submit')}}</el-button>
          <div @click="preview(item)" class="pb10" v-for="item in fileList" v-if="userInfo.user_name !== 'admin'">
            <img :src="item.url" alt="" mode="widthFix" width="100%">
          </div>
        </el-tab-pane> -->
      </el-tabs>
    </div>
    <!-- <el-dialog width="95%" :visible.sync="dialogVisibleImg" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog> -->
    <saleBoardDialog :property="property" ref="saleBoardDialog"></saleBoardDialog>
  </basic-container>
</template>

<script>
import {
  mapGetters
} from "vuex";
import dataReport from "./components/dataReport.vue";
import Upload from '@/views/oa/photoWall/upload'
// import * as echarts from "echarts";
import { debounce } from '@/util/util'
import saleBoardDialog from './components/saleBoardDialog'
import vinCheckData from './components/vinCheckData'
import accountsReceivable from './components/accountsReceivable'
import {
  getTotal,
  getInvoiceTotalByYear,
  getInvoiceGoalByYear
} from "@/api/contract/invoice";
import {
  getAllAreaActiveCount,
  getEurInvoiceCount,
  getSalesBusinessData,
  clearRedis,
 getUpdateTime,getAllYearLicenseInvoiceCount
} from "@/api/billManage/dataBoard";
import {
  getLicenseCountAndYear,
  getLicenseCountAndMonth,
  getLicenseCountAndMonthByYear
} from "@/api/billManage/activationDetails";
import {
  getOptions
} from "@/api/base";
import {
  getSalesContractAmountGroupByCust, getCustInvoiceAmount
} from "@/api/contract/salesContractNew";
// import { getFormatDate } from '@/util/util'
import photoWallApi from '@/api/photoWall/index'
import { showMonthActiveAmountByYear, showCurrentYearActiveAmount, showMonthActiveAmount, showActiveDetail, showActiveDetailBar } from './echartOption'
const today = new Date()
export default {
  data() {
    return {
      dialogVisibleImg: false,
      dialogImageUrl: "",
      activeName: 'first',
      photoInfoList: [],
      tableData: [
        { tbox: '', online: '34828' }
      ],
      searchTableHead: 0,
      totalAmount: 0.00,
      licenseTotalAmount: 0.00,
      nreTotalAmount: 0.00,
      hwTotalAmount: 0.00,
      incubateTotalAmount: 0.00,
      activeAcountList: [],
      updateTime:null,
      otherActiveAcountList:[],
      activeTotalCountByCountry: 0,
      fiscalYear: today.getFullYear(),
      salesYear: today.getFullYear(),
      tboxActiveYear: today.getFullYear(),
      licenseCountAndYearX: [],
      licenseCountAndYearY: [],
      licenseCountAndYearDis: [],
      activeTotalCount: 0,
      licenseCount: 0,
      invoiceCount: 0,
      onTheWayCount: 0,
      noDepartCount: 0,
      waitInvoicingCount: 0,
      noInfoCount: 0,
      licenseMonthX: [],
      licenseMonthY: [],
      licenseMonthByYearX: [],
      licenseMonthByYearY: [],
      countryRegionList: [],
      countryReginCodeSel: '',
      receivableDate1: '',
      receivableDate2: '',
      receivableData1: [],
      receivableData2: [],
      isLoadingReceive:false,
      receivableData3: [],
      collectionMonth: '',
      property: {},
      photoWallId: null,
      fileList: [],
      invoiceOfflineCount:null,
      invoiceOnlineCount:null
    };
  },
  filters: {
  },
  mounted() {
    this.getCountryRegion();
    this.getSalesTotalAmount('');
    this.getEurInvoiceCount();
    this.initTBox()
    this.getInvoiceTotalByYear();
    this.getSalesContractAmountGroupByCust();
    this.getSalesBusinessData();
    this.collectionMonth = today.getFullYear()
    this.getInvoiceGoalByYear(this.collectionMonth);
    this.getPhotoDetail()
    this.getUpdateTime()
    this.getCarNum()
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  components: { saleBoardDialog, Upload, dataReport, vinCheckData, accountsReceivable },
  methods: {
    async refleshData() {
      let res = await clearRedis()
      debounce(this.initTBox, this, 1000, 'reflesh')
    },
    async getCarNum(){
      let res = await getAllYearLicenseInvoiceCount()
      console.log(res)
      if(res.data.code===200||res.data.code===0){
        this.invoiceOfflineCount = res.data.data.invoiceOfflineCount
        this.invoiceOnlineCount = res.data.data.invoiceOnlineCount
      }
    },
    async getUpdateTime(){
      let res = await getUpdateTime()
      if(res.data.code===200||res.data.code===0){
        this.updateTime = res.data.data
      }   
    },
    async clearCache() {

    },
    async initTBox() {
      await this.getLicenseCountAndYear()
      // await this.getAllAreaActiveCount();
      await this.getLicenseCountAndMonth('');

      await this.getLicenseCountAndMonthByYear('');
    },
    async getPhotoDetail() {
      let res = await photoWallApi.albumDetailByName({ name: '销售数据看板' })
      this.fileList = res.data.data.photoInfoList
      this.fileList.map(ele => {
        ele.progress = 100
        ele.uid = ele.id
        ele.link = ele.url
      })
      this.photoWallId = res.data.data.id
    },
    preview(item) {
      this.dialogImageUrl = item.url
      this.dialogVisibleImg = true
    },
    async submitPhoto() {
      this.photoInfoList = []
      this.fileList.map(ele => {
        this.photoInfoList.push({ type: 0, url: ele.originalUrl || ele.link })
      })
      let Api = this.photoWallId ? photoWallApi.update : photoWallApi.add
      let res = await Api({
        photoInfoList: this.photoInfoList,
        albumName: '销售数据看板',
        id: this.photoWallId
      })
      if (res.data.code === 0) {
        this.$message.success(this.$t('salesAmountWaterfullBoard.operationSuccess'))
      } else {
        this.$message.error(res.data.message)
      }
    },
    tabClick(v) {
      if (this.activeName === 'fifth') {
        this.getPhotoDetail()
      }
    },

    getFileList(data) {
      console.log(data)
      this.fileList = data
    },
    getCountryRegion() {
      getOptions({
        code: "COUNTRY_REGIN"
      }).then((res) => {
        this.countryRegionList = res.data.data;
      });
    },
    async getAllAreaActiveCount() {

      this.activeTotalCountByCountry = 0
      getAllAreaActiveCount({}).then(async(res) => {
        if (res.data.code == 0) {
          let arr = []
          arr = res.data.data;
          this.activeAcountList = res.data.data
          this.activeAcountList.forEach((ele,index) => {
            // this.otherActiveAcountList.push([ele.invoiceNum,ele.notInvoiceNum,ele.value])
            // if (ele.name === '离线导航') {
            //   ele.itemStyle = {
            //     color: 'red'
            //   }
            // }
            this.activeTotalCountByCountry = this.activeTotalCountByCountry + ele.value
          })
          this.otherActiveAcountList = [[],[],[],[]]
          this.otherActiveAcountList[0] = this.activeAcountList.map(ele=>ele.notInvoiceNum)
          this.otherActiveAcountList[1] = this.activeAcountList.map(ele=>ele.invoiceNum)
          this.otherActiveAcountList[3] = this.activeAcountList.map(ele=>ele.value)
          this.otherActiveAcountList[2] = this.activeAcountList.map(ele=>0)
          // this.activeAcountList.sort((a,b)=>{
          //   return Number(b.value) - Number(a.value)
          // })
          this.activeAcountList = this.activeAcountList.filter(ele=>{
            return ele.name!=='离线导航'
          })
          this.tableData[0].tbox = this.$formatAmt(this.activeTotalCount)
          this.tableData[0].online = this.$formatAmt(34828)
           const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts')
          showActiveDetail(this,echarts);
          showActiveDetailBar(this,echarts)
        }
      });
    },
    handleClick(row, column, cell, event) {
      if (column.property === "salesType" || column.property === 'shouldSignContract') return
      if (column.property === "shouldOpenInvoice" && (row.salesType === "License" || row.salesType === "Total")) return
      this.property = column
      this.$refs.saleBoardDialog.dialogVisible = true
      this.$refs.saleBoardDialog.getDetail(this.property, row)
    },
    showGoal() {
      return this.searchTableHead === 0 || this.searchTableHead === 1
    },
    showFact() {
      return this.searchTableHead === 0 || this.searchTableHead === 2
    },
    formatterNumber(row, column, cellValue, index) {
      return this.$formatAmt(cellValue)
    },
    getLicenseCountAndYear() {
      this.licenseCountAndYearX = []
      this.licenseCountAndYearY = []
      this.activeTotalCount = 0
      getLicenseCountAndYear().then(async(res) => {
        if (res.data.code == 0) {
          res.data.data.forEach((ele, index) => {
            if (ele.year == null) {
              ele.year = 'TBD';
            }
            this.licenseCountAndYearX.push(ele.year);
            this.licenseCountAndYearY.push(ele.licenseCount);
            console.log('setractiveTotalCount')
            this.activeTotalCount = this.activeTotalCount + ele.licenseCount;

            if (index == 0) {
              this.licenseCountAndYearDis.push(0);
            } else {
              let licenseCount = 0;
              this.licenseCountAndYearY.forEach((item, index2) => {
                if (index2 > 0) {
                  licenseCount = licenseCount + this.licenseCountAndYearY[index2 - 1]
                }
              });
              this.licenseCountAndYearDis.push(licenseCount);
            }
          })
          this.licenseCountAndYearX.push("累计TBOX");
          this.licenseCountAndYearY.push(this.activeTotalCount);
          this.licenseCountAndYearDis.push(0);
          this.getAllAreaActiveCount();
          const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts')
          showCurrentYearActiveAmount(this,echarts);
        }
      });
    },
    getLicenseCountAndMonth(params) {
      this.licenseMonthX = [];
      this.licenseMonthY = [];
      getLicenseCountAndMonth({
        countryReginCode: params
      }).then(async(res) => {
        if (res.data.code == 0) {
          this.licenseMonthY = res.data.data.map(ele => ele.licenseCount)
          let count = 12 - this.licenseMonthY.length
          if (count > 0) {
            let arr = new Array(count).fill(0)
            this.licenseMonthY = this.licenseMonthY.concat(arr)
          }
          this.licenseMonthX = ['JAN', "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]
           const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts')
          showMonthActiveAmount(this,echarts);
        }
      });
    },
    getLicenseCountAndMonthByYear(params) {
      this.licenseMonthByYearX = [];
      this.licenseMonthByYearY = [];
      getLicenseCountAndMonthByYear({
        tboxActiveYear: this.tboxActiveYear
      }).then(async(res) => {
        if (res.data.code == 0) {
          this.licenseMonthByYearY = res.data.data.map(ele => ele.licenseCount)
          let count = 12 - this.licenseMonthByYearY.length
          if (count > 0) {
            let arr = new Array(count).fill(0)
            this.licenseMonthByYearY = this.licenseMonthByYearY.concat(arr)
          }
          console.log(this.licenseMonthByYearY)
          console.log('licenseMonthByYearY')
          let monthList = this.$t('salesAmountWaterfullBoard.monthList')
          this.licenseMonthByYearX = monthList
          console.log(this.licenseMonthByYearX)
          const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts')
          showMonthActiveAmountByYear(this,echarts);
        }
      });

    },
    getInvoiceTotalByYear() {
      getInvoiceTotalByYear({
        salesYear: this.salesYear
      }).then((res) => {
        console.log(res.data.data)
        if (res.data.code == 0) {
          this.showSalesAmountByYear(res.data.data.licenseTotalAmount, res.data.data.nreTotalAmount, res.data.data.hardwareTotalAmount, res.data.data.totalAmount);
        }
      });
    },
    getSalesTotalAmount(fiscalYear) {
      getTotal({
        fiscalYear: fiscalYear
      }).then((res) => {
        if (res.data.code == 0) {
          this.totalAmount = (parseFloat(res.data.data.totalAmount) + parseFloat(res.data.data.totalAmountUsd) *
            7).toFixed(2);
          this.licenseTotalAmount = (parseFloat(res.data.data.licenseTotalAmount) + parseFloat(res.data.data
            .licenseTotalAmountUsd) * 7).toFixed(2);
          this.nreTotalAmount = (parseFloat(res.data.data.nreTotalAmount) + parseFloat(res.data.data
            .nreTotalAmountUsd) * 7).toFixed(2);
          this.hwTotalAmount = (parseFloat(res.data.data.hardwareTotalAmount) + parseFloat(res.data.data
            .hardwareTotalAmountUsd) * 7).toFixed(2);
          this.incubateTotalAmount = (parseFloat(res.data.data.incubateTotalAmount) + parseFloat(res.data.data
            .incubateTotalAmountUsd) * 7).toFixed(2);
          // this.showSalesAmountWaterfall();
        }
      });
    },
    getEurInvoiceCount() {
      getEurInvoiceCount().then((res) => {
        if (res.data.code == 0) {
          this.licenseCount = res.data.data.licenseCount;
          this.invoiceCount = res.data.data.invoiceCount;
          this.onTheWayCount = res.data.data.onTheWayCount;
          this.noDepartCount = res.data.data.noDepartCount;
          this.waitInvoicingCount = res.data.data.waitInvoicingCount;
          this.noInfoCount = res.data.data.noInfoCount;
        }
      });
    },
    getSalesBusinessData() {
      // getSalesBusinessData().then((res) => {
      //   if (res.data.code == 0) {
      //     this.receivableData3 = res.data.data;
      //   }
      // });
    },
    getInvoiceGoalByYear(collectionMonth) {
      this.isLoadingReceive = true
      getInvoiceGoalByYear({
        collectionMonth: collectionMonth
      }).then((res) => {
        if (res.data.code == 0) {
          this.receivableData1 = res.data.data;
          this.isLoadingReceive = false
          console.log(this.receivableData1)
        }
      });
    },
   async showSalesAmountWaterfall() {
      var chartDom = document.getElementById('salesTotalAmountChart');
      // 防御性：异步 import 后组件可能已卸载，避免 "Initialize failed: invalid dom"
      if (!chartDom) return;
      const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts')
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        title: {
          text: this.$t('salesAmountWaterfullBoard.salesAmount'),
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            var tar = params[1];
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          data: ['孵化', 'HW', 'NRE', 'License', '合计'],
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: [(this.totalAmount - this.licenseTotalAmount - this.nreTotalAmount - this.hwTotalAmount - this
            .incubateTotalAmount).toFixed(2), (this.totalAmount - this.licenseTotalAmount - this
              .nreTotalAmount - this.hwTotalAmount).toFixed(2), (this.totalAmount - this.licenseTotalAmount -
                this.nreTotalAmount).toFixed(2), (this.totalAmount - this.licenseTotalAmount).toFixed(2), 0]
        },
        {
          name: 'Sales',
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'inside'
          },
          data: [this.incubateTotalAmount, this.hwTotalAmount, this.nreTotalAmount, this.licenseTotalAmount,
          this.totalAmount
          ],
        }
        ]
      };
      myChart.setOption(option);
    },
   async showEurInvoice() {
      var chartDom = document.getElementById('eurInvoice');
      // 防御性：异步 import 后组件可能已卸载，避免 "Initialize failed: invalid dom"
      if (!chartDom) return;
      const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts')
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: this.$t('salesAmountWaterfullBoard.eurSettlement'),
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            var tar = params[1];
            return tar.name + '<br/>' + tar.seriesName + ' : ' + tar.value;
          }
        },
        xAxis: {
          type: 'category',
          splitLine: {
            show: false
          },
          data: ['总数量', '已开票', '待开票', '在途中', '无中国出港信息', '未流入MG EU物流系统'],
          axisLabel: {
            interval: 0
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: 'Placeholder',
          type: 'bar',
          stack: 'Total',
          itemStyle: {
            borderColor: 'transparent',
            color: 'transparent'
          },
          emphasis: {
            itemStyle: {
              borderColor: 'transparent',
              color: 'transparent'
            }
          },
          data: [0, this.licenseCount - this.invoiceCount, this.licenseCount - this.invoiceCount - this
            .onTheWayCount, this.licenseCount - this.invoiceCount - this.onTheWayCount - this.noDepartCount,
            this.licenseCount - this.invoiceCount - this.onTheWayCount - this.noDepartCount - this
              .waitInvoicingCount, this.licenseCount - this.invoiceCount - this.onTheWayCount - this
                .noDepartCount - this.waitInvoicingCount - this.noInfoCount
          ]
        },
        {
          name: this.$t('salesAmountWaterfullBoard.quantity'),
          type: 'bar',
          stack: 'Total',
          label: {
            show: true,
            position: 'inside'
          },
          data: [this.licenseCount, this.invoiceCount, this.onTheWayCount, this.noDepartCount, this
            .waitInvoicingCount, this.noInfoCount
          ],
        }
        ]
      };
      myChart.setOption(option);
    },
    sum(arr) {
      let tempArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < 12; j++) {
          tempArr[j] += Number(arr[i][j] || 0)
        }
      }
      return tempArr
    },
    async showSalesAmountByYear(licenseTotalAmount, nreTotalAmount, hardwareTotalAmount, totalAmount) {
      var chartDom = document.getElementById('salesTotalAmountByYearChart');
      if (!chartDom) {
        return
      }
      const echarts = await import(/* webpackChunkName: "echarts" */ 'echarts')
      var myChart = echarts.init(chartDom);
      var option;
      const rawData = [];
      rawData.push(licenseTotalAmount);
      rawData.push(hardwareTotalAmount);
      rawData.push(nreTotalAmount);
      let total = totalAmount
      const grid = {
        left: 100,
        right: 100,
        top: 50,
        bottom: 50
      };
      let series = [
        'License',
        'Hardware',
        'NRE'
      ].map((name, sid) => {
        return {
          name,
          type: 'bar',
          stack: 'total',
          barWidth: '60%',
          label: {
            rotate: 15,
            show: true,
            formatter: (params) => {
              return this.$formatAmt(params.value)
            }
          },
          data: rawData[sid]
        };
      });
      const that = this
      series.push({
        name: this.$t('salesAmountWaterfullBoard.total'),
        type: 'bar',
        stack: 'total',
        position: 'top',
        padding: 15,
        label: {
          show: true,
          formatter: function (params) {
            return [
              '{a|' + `${that.$formatAmt(total[params.dataIndex])}` + '}',
              '{b|}'
            ].join('\n')
          },
          rich: {
            a: {
              color: 'red',
              lineHeight: 10,
              height: 40,
            },
            b: {
              height: 40
            },
          }
        },
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      })
      option = {
        title: {
          text: this.$t('salesAmountWaterfullBoard.annualSalesData'),
        },
        legend: {
          selectedMode: false
        },
        grid,
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: this.$t('salesAmountWaterfullBoard.monthList')
        },
        series
      };
      myChart.setOption(option);
    },

    changeSalesYear(val) {
      this.getSalesTotalAmount(val);
    },
    changeSalesYear2(val) {
      this.getInvoiceTotalByYear(val);
    },
    countryRegionChange(val) {
      this.getLicenseCountAndMonth(val);
      this.countryReginCodeSel = val;
    },
    tboxActiveYearChange(val) {
      this.getLicenseCountAndMonthByYear(val);
    },
    getReceivableData() {
      this.receivableData2 = [
        {
          custom: "MGI",
          license: "0",
          hardware: "161.31",
          nre: "99.94",
          other: "0",
          total: "261.25"
        },
        {
          custom: "MGTT",
          license: "265.57",
          hardware: "0",
          nre: "0",
          other: "0",
          total: "265.57"
        },
        {
          custom: "总计",
          license: "265.57",
          hardware: "161.31",
          nre: "99.94",
          other: "0",
          total: "526.82"
        },
      ];
    },
    rowStyle({ row }) {
      if (row.type === "总计") {
        return { backgroundColor: '#f1f1f1' }
      }
      if (row.custom === "总计") {
        return { backgroundColor: '#f1f1f1' }
      }
      return {}
    },
    getSalesContractAmountGroupByCust() {
      getSalesContractAmountGroupByCust().then((res) => {
        if (res.data.code == 0) {
          this.receivableData2 = res.data.data;
        }
      });
    },
    columnStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 0 ) {
        let style = {
          background: '#D9ECFF',
        }
        return style;
      } else {
        return "background:#E9E9EB";
      }

    },
    changeCollectionMonth(val) {
      this.salesYear = val
      this.getInvoiceGoalByYear(val)
      this.getInvoiceTotalByYear(val)
    },
  },
};
</script>

<style scoped></style>
