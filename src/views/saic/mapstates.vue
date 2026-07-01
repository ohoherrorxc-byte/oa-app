<template>
  <basic-container>

    <el-card>
      <el-form :inline="true" :model="query" class="demo-form-inline">

        <el-form-item label="国家地区：">
          <el-select v-model="query.countryReginCode" placeholder="全部" style="width: 90%"  clearable>
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


        <el-form-item label="车辆是否统计：">
          <el-select v-model="query.needStatisticsMap" style="width: 90%"  clearable>
            <el-option v-for="item in statisticals"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="车型是否统计：">
          <el-select v-model="query.modelNeedStatisticsMap" style="width: 90%"  clearable>
            <el-option v-for="item in statisticals"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="地图激活时间：">
          <el-date-picker
            v-model="query.startAndEndMap"
            type="daterange"
            range-separator="至"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="TBOX激活时间：">
          <el-date-picker
            v-model="query.startAndEndTbox"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            value-format="yyyy-MM-dd"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="切换状态：">
          <el-select v-model="query.mapTransformedStatus"
                     @change="selectType"
                     style="width: 90%"  clearable>
            <el-option v-for="item in mapTransferStatuss"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value"

            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="VIN：">
          <el-input v-model.trim="query.vin" size="mini" clearable />
        </el-form-item>

<!--        <el-form-item label="TBOX激活时间：">-->
<!--          <el-date-picker-->
<!--            v-model="query.startActivationByTbox"-->
<!--            placeholder="开始日期"-->
<!--            type="date">-->
<!--          </el-date-picker>-->
<!--          <el-date-picker-->
<!--            v-model="query.endActivationByTbox"-->
<!--            placeholder="结束日期"-->
<!--            type="date">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->


<!--        <el-form-item label="地图激活时间：">-->
<!--          <el-date-picker-->
<!--            v-model="query.startActivationByMap"-->
<!--            placeholder="开始日期"-->
<!--            type="date">-->
<!--          </el-date-picker>-->
<!--          <el-date-picker-->
<!--            v-model="query.endActivationByMap"-->
<!--            placeholder="结束日期"-->
<!--            type="date">-->
<!--          </el-date-picker>-->
<!--        </el-form-item>-->




        <el-form-item label="导航付款订单号：">
          <el-input v-model.trim="query.orderIdByMap" size="mini" clearable/>
        </el-form-item>
        <el-form-item label="导航付款状态：">
          <el-select v-model="query.statusMap" style="width: 90%"  clearable>
            <el-option v-for="item in paymentStatuss"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收款状态：">
          <el-select v-model="query.statusTbox" style="width: 90%"  clearable>
            <el-option v-for="item in collectionStatuss"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>


        <el-form-item label="网联/非网联：">
          <el-select v-model="query.modelType" placeholder="全部" style="width: 90%"  clearable>
            <el-option v-for="item in modelTypes"
                       :key="item.value"
                       :label="item.name"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="图资付款订单号：">
          <el-input v-model.trim="query.orderIdByMapData" size="mini" clearable/>
        </el-form-item>
        <el-form-item label="图资付款状态：">
          <el-select v-model="query.statusMapData" style="width: 90%"  clearable>
            <el-option v-for="item in paymentStatuss"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="导航供应商：">
          <el-select v-model="query.supplierNameMap" placeholder="全部" style="width: 90%"  clearable>
            <el-option v-for="item in mapOptions"
                       :key="item.supplierName"
                       :label="item.supplierName"
                       :value="item.supplierName">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button icon="el-icon-search" size="mini" type="primary" v-on:click="searchChange">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card>
      <el-row>
        <el-col :span="24">
          <div class="tool-box">
            <el-button icon="el-icon-circle-export-outline" size="mini" type="primary" v-on:click="handleExport">导出
            </el-button>
          </div>
        </el-col>
      </el-row>

      <!-- table 列表 -->
      <el-row>
        <el-table :data="data" border style="width: 100%" @selection-change="selectChange">
<!--          <el-table-column type="selection" width="55"></el-table-column>-->
          <el-table-column align="center" label="VIN" prop="vin" width="180">
          </el-table-column>
<!--          <el-table-column align="center" label="供应商类型" prop="supplierType" width="100">
          </el-table-column>-->
          <el-table-column align="center" label="国家地区" prop="countryReginCode" v-bind:formatter="countryCodesFormat">
          </el-table-column>
          <el-table-column align="center" label="车系" prop="seriesName">
          </el-table-column>
          <el-table-column align="center" label="车型" prop="modelName" width="180">
          </el-table-column>
          <el-table-column align="center" label="地图激活时间" prop="mapActivatedTime" width="180">
          </el-table-column>
          <el-table-column align="center" label="TBOX激活时间" prop="activationTime" width="180">
          </el-table-column>
          <el-table-column align="center" label="导航供应商" prop="supplierNameMap" width="150">
          </el-table-column>
          <el-table-column align="center" label="导航付款状态" prop="statusMap" v-bind:formatter="formatterSupplierStatuss"
                           width="110">
          </el-table-column>
          <el-table-column align="center" label="导航付款订单号" prop="orderIdMap" v-bind:formatter="formatterData"
                           width="180">
          </el-table-column>

          <el-table-column align="center" label="图资付款状态" prop="statusMapData" v-bind:formatter="formatterSupplierStatuss"
                           width="110">
          </el-table-column>
          <el-table-column align="center" label="图资付款订单号" prop="orderIdMapData" v-bind:formatter="formatterData"
                           width="180">
          </el-table-column>




          <el-table-column align="center" label="收款状态" prop="statusTbox" v-bind:formatter="formatterTboxStatuss">
          </el-table-column>

          <el-table-column align="center" label="切换状态" prop="mapTransformedStatus" v-bind:formatter="formatterTransformData"
                           width="100">
          </el-table-column>



          <el-table-column align="center" label="是否网联" prop="modelType" v-bind:formatter="formatterModelData"
                           width="150">
          </el-table-column>




          <el-table-column align="center" label="车辆是否统计" prop="needStatisticsMap">

            <template  slot-scope="scope" v-if="scope.row.needStatisticsMap==1 || scope.row.needStatisticsMap==0">

              <el-tooltip class="item" effect="dark" open-delay="300" hide-after="1000"
                          :content="scope.row.isTestVehicle === 1 ? '工程车' : '非待收票'" placement="left" :disabled="!(scope.row.statusMap >= 3 || scope.row.isTestVehicle === 1)">
              <el-switch
                        :value="scope.row.needStatisticsMap"
                         :active-value="1"
                         :inactive-value="0"
                         :disabled="scope.row.statusMap>=3 ||scope.row.statusMap<=0 || scope.row.statusMap==null || scope.row.isTestVehicle === 1 "
                         @change="switchStat($event, scope.row)"></el-switch>
              </el-tooltip>

            </template>

ull
<!--            <template slot="needStatisticsMap" slot-scope="{row}">-->
<!--              <el-switch :value="row.needStatisticsMap.toString()"-->
<!--                         active-value="1" inactive-value="0"-->
<!--                         :disabled="row.statusMap >= 3" @change="switchStat($event, row)"></el-switch>-->
<!--            </template>-->



<!--            <template slot-scope="scope">-->
<!--              <div>-->

<!--                <div v-if="scope.row.needStatisticsMap == '-1'">-->

<!--                </div>-->
<!--                <div v-if="scope.row.needStatisticsMap == 0">-->
<!--                  <el-link :underline="false" @click="handleShow(scope.row)">否</el-link>-->
<!--                </div>-->
<!--                <div v-if="scope.row.needStatisticsMap ==1">-->
<!--                  <el-link :underline="false" @click="handleShow(scope.row)">是</el-link>-->
<!--                </div>-->
<!--              </div>-->
<!--            </template>-->
          </el-table-column>

          <el-table-column prop="modelNeedStatisticsMap" align="center" label="车型是否统计"
                           :formatter="booleanFormatter">
          </el-table-column>

        </el-table>

      </el-row>

      <!--      <el-row>-->
      <!--        <el-col :span="24">-->
      <!--          <div class="tool-box">-->
      <!--            <p v-show="isShow" style="color: red;"> * {{ promptWords }} 车型存在多个预设供应商，请确认查询结果是否正确 </p>-->
      <!--          </div>-->
      <!--        </el-col>-->
      <!--      </el-row>-->

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

    <!-- 弹框 -->
<!--    <el-row>-->
<!--      <el-col :span="24">-->
<!--        <div class="tool-box">-->
<!--          <p style="color: red;" v-show="isShow"> * {{ promptWords }} 车型存在多个预设供应商，请确认查询结果是否正确 </p>-->
<!--        </div>-->
<!--      </el-col>-->
<!--    </el-row>-->
    <!-- 弹框2 -->
<!--    <el-dialog-->
<!--      :append-to-body="true" :visible.sync="needStatisticsDialogVisible"-->
<!--      center-->
<!--      title="提示"-->
<!--      width="30%"-->
<!--      @close="resetForm()">-->
<!--      <div>车辆: {{ mapState.vin }} 是否取消统计/加入统计？</div>-->
<!--      <span slot="footer" class="dialog-footer">-->
<!--        <el-button type="primary" @click="needStatisticsCancel">取 消</el-button>-->
<!--        <el-button type="primary" @click="needStatisticsClick">确 定</el-button>-->
<!--      </span>-->
<!--    </el-dialog>-->
  </basic-container>
</template>

<script>
import {exportList, getList, getSupplier, update} from "@/api/saic/mapstates.js";
import {download} from "@/util/excel";
import {mapGetters} from "vuex";
import SeriesModel from "@/views/saic/series-model";
import constData from "@/config/constData";
import {findByvalue} from "@/util/util";

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
        supplierNameMap: '',
        countryReginCode: '',
        needStatisticsMap: '1' ,
        modelNeedStatisticsMap: '1' ,
        startActivationByTbox: '',
        endActivationByTbox: '',
        startActivationByMap:'',
        endActivationByMap: '',

        seriesModel: '',
        statusMap: '',
        modelType: '',
        mapTransformedStatus: 'first',
        startAndEndTbox:[],
        startAndEndMap:[],
        statusTbox: '',
        vin: '',
        orderIdByMap: '',
        orderIdByMapData:'',
        statusMapData:''
      },
      seriesModels: {model: ""},
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
      // 校验规则
      rules: {
        supplierName: [
          {required: true, message: '供应商不能为空 ', trigger: ['blur']},
        ],

      },
      // 表单映射模型
      supplierModel: {
        id: '',
        supplierName: '',
        carSeries: '',
        vehicleModel: '',
        snatched: '',
        price: '',
        currencyType: '',
        validity: ''
      },
      mapState: {
        vin: '',
        needStatisticsMap: '',


      },

      //收款状态
      collectionStatuss: constData.orderStatus,
      //付款状态
      paymentStatuss: constData.billStatus,
      statisticals: [

        {
          name: '是',
          value: '1'
        },
        {
          name: '否',
          value: '0'
        }
      ],
      modelTypes: [

        {
          name: '网联',
          value: 0
        },
        {
          name: 'Color Radio Lite',
          value: 1
        },
        {
          name: 'Color Radio',
          value: 2
        },
        {
          name: '待确认',
          value: 3
        }
      ],

      mapTransferStatuss: [

        {value: "first", name: "初次"},
        {value: "transformed", name: "切换"},
      //  {value: "空", name: "空"},
      ],

      countryCodes: [

        // {value: "3G02", name: "欧盟"},
        // {value: "3G08", name: "英国"},
        // {value: "3G05", name: "泰国"},
        // {value: "3G07", name: "印度"},
        // {value: "3F02", name: "澳洲设计标准"},
        // {value: "3G16", name: "印尼"},
      ],
      licenseSupplier: 3,
      mapOptions: [],
      needStatisticsDialogVisible: false,
      promptWords: '',
      isShow: false
    }
  },
  created() {
    //this.onLoad(this.page, this.query);
    this.countryCodes=constData.countryList;
    // this.query.orderIdMap = this.$route.query.orderNumber;
    // let orderType = this.$route.query.orderType;
    // if(orderType == 3){
    //     this.query.orderIdByMap = this.$route.query.orderNumber;
    // }else if(orderType == 4){
    //     this.query.orderIdByMapData = this.$route.query.orderNumber;
    // }
    // if(this.query.countryReginCode){
    //     this.onLoad(this.page, this.query);
    // }
    this.getMapOptions();
  },
  activated(){
      let orderType = this.$route.query.orderType;
      if(orderType == 3){
          this.query.orderIdByMap = this.$route.query.orderNumber;
          this.query.orderIdByMapData ='';
          //TODO
          // this.onLoad(this.page, this.query);
      }else if(orderType == 4){
          this.query.orderIdByMapData = this.$route.query.orderNumber;
          this.query.orderIdByMap='';
          //TODO
          // this.onLoad(this.page, this.query);
      }
      if (this.query.orderIdByMap || this.query.orderIdByMapData) {
        this.query.needStatisticsMap = this.query.modelNeedStatisticsMap = null
        this.onLoad(this.page, this.query)
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
    selectType(item){
      console.log("切换状态下拉框选择值 "+item);
      if(item=="transformed"){
        this.query.needStatisticsMap='';
      }












    },
    switchStat(value,row) {
      let head="车辆"+'“'+row.vin+'”';
      let message="是否取消统计?";
      console.log("row.needStatisticsMap",row.needStatisticsMap)
      if(row.needStatisticsMap==0)
        message="是否加入统计?"

      this.$confirm(head+message, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        //点击确定执行的逻辑
        console.log("value",value)
        this.mapState.needStatisticsMap=parseInt(value);
        this.mapState.vin=row.vin;
          update( this.mapState ).then(res => {
            if (res.data.success) {
              this.onLoad(this.page, this.query);
              this.$message({type: "success", message: "操作成功"});
            } else {
              this.$message({type: "error", message: res.data.msg});
            }
      })
    }).catch(
        //点击取消执行的逻辑
      ()=>{})
    },
    onLoad(page, params = {}) {
      this.loading = true;
debugger
      this.query.seriesModel = this.seriesModels.model


      if(this.query.startAndEndTbox!=null){
        this.query.startActivationByTbox= this.query.startAndEndTbox[0]
        this.query.endActivationByTbox= this.query.startAndEndTbox[1]
      }else{
        this.query.startActivationByTbox= null
          this.query.endActivationByTbox=null
      }

      if(this.query.startAndEndMap!=null){
        this.query.startActivationByMap= this.query.startAndEndMap[0]
        this.query.endActivationByMap= this.query.startAndEndMap[1]
      }else{
        //中间变量  第一次选了时间组件，变量成功赋值，第二次未选时间组件 清空
        this.query.startActivationByMap=null
        this.query.endActivationByMap=null
      }


      getList(page.currentPage, page.pageSize, Object.assign(params, this.query)).then(res => {

        this.data = res.data.data.records;

        this.page.total = res.data.data.total;
      });
      this.loading = false;
    },
    getMapOptions() {

      getSupplier(this.licenseSupplier).then(res => {
        let obj = res.data.data;
        this.mapOptions=obj;
       // this.mapOptions.push({supplierName: '空', id: ''});
      });
    },
    searchChange() {

      if ((this.query.countryReginCode == null || this.query.countryReginCode.length == 0)
        && (this.query.vin == null || this.query.vin.length == 0)
        && (this.query.orderIdByMap == null || this.query.orderIdByMap.length == 0)
        && (this.query.orderIdByMapData == null || this.query.orderIdByMapData.length == 0)
      ) {
        this.$message({type: "warning", message: '国家地区 / VIN / 导航付款订单号/ 图资付款订单号 必须选择其中一项'});
        return;
      }
      this.page.currentPage = 1;
      this.page.elementuiKey= 1;
      this.onLoad(this.page, this.query);
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
    formatterData(row, column) {
      const daterc = row[column.property];
      if (daterc == '-1') {
        return '';
      }else
        return daterc;
    },
    formatterTboxStatuss(row, column) {
      const daterc = row[column.property]
      return findByvalue(constData.orderStatus, parseInt(daterc))
    },

    formatterTransformData(row){
      switch (row.mapTransformedStatus) {
        case 'first':
          return '初次';
        case 'transformed':
          return '切换';
        default:
          return ' ';
      }

    },

    formatterModelData(row){
      switch (row.modelType) {
        case -1:
          return '';
        case 0:
          return '网联';
        case 1:
          return 'Color Radio Lite';
        case 2:
          return 'Color Radio';
        default:
          return ' ';
      }

    },










    formatterSupplierStatuss(row, column) {
      const daterc = row[column.property]
      return findByvalue(constData.billStatus, parseInt(daterc))
    },

    booleanFormatter(row, column) {
      return findByvalue(constData.booleanValue, row.modelNeedStatisticsMap)
    },

    // handleShow(row) {
    //   // this.needStatisticsdialogTitle ="提示";
    //     this.needStatisticsDialogVisible = true;
    //     this.mapState.vin = row.vin;
    //     this.mapState.needStatisticsMap = row.needStatisticsMap;
    //     this.mapState.statusMap=row.statusMap;
    // },
    // needStatisticsCancel() {
    //   this.needStatisticsDialogVisible = false;
    //   this.mapState = {};
    // },
    needStatisticsClick() {
      this.needStatisticsDialogVisible = false;
      if(!(this.mapState.statusMap==1 ||this.mapState.statusMap==2)){

       this.$message({type: "error", message: "当前状态不支持修改统计"});
       return;
      }
        console.log("222222222222222222");
      if ( this.mapState.needStatisticsMap == 0) {
        this.mapState.needStatisticsMap = 1;
      } else {
        this.mapState.needStatisticsMap = 0;
      }
      update(this.mapState).then(res => {
        if (res.data.success) {
          this.onLoad(this.page, this.query);
          this.$message({type: "success", message: "Submission successful!"});

        } else {
          this.$message({type: "error", message: res.data.msg});
        }
        //debugger

      })
    },

    handleExport() {
      if ((this.query.countryReginCode == null || this.query.countryReginCode.length == 0)
        && (this.query.vin == null || this.query.vin.length == 0)
        && (this.query.orderIdVoice == null || this.query.orderIdVoice.length == 0)
        && (this.query.orderIdByMapData == null || this.query.orderIdByMapData.length == 0)
      ) {
        this.$message({type: "warning", message: '国家地区 / VIN / 导航付款订单号/ 图资付款订单号 必须选择其中一项'});
        return;
      }
      this.$confirm("确定导出数据？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
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
</style>
