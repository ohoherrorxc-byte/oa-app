<template>
  <basic-container>
    <p class="table-title">
      <span></span>{{ $t('scrappingApplication.scrappingInfo') }}
    </p>
    <el-form :disabled="disabled" ref="form" :rules="rules" :model="form" label-width="100px">
      <el-form-item :label="$t('scrappingApplication.scrappingRemark')" prop="scrapRemark" style="width: 98%;">
        <el-input type="textarea" v-model="form.scrapRemark"></el-input>
      </el-form-item>
      <el-form-item :label="$t('scrappingApplication.scrappingMethod')" prop="scrapWay">
        <el-select v-model="form.scrapWay">
          <el-option :value="$t('scrappingApplication.sell')" :label="$t('scrappingApplication.sell')"></el-option>
          <el-option :value="$t('scrappingApplication.dispose')" :label="$t('scrappingApplication.dispose')"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('scrappingApplication.scrappingDate')" prop="scrapTime">
        <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" class="w-100" v-model="form.scrapTime"
          type="datetime"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('scrappingApplication.totalAmount')" prop="scrapTotalAmount">
        {{ scrapTotalAmount }} {{ $t('commonContent.yuan') }}
      </el-form-item>
      <el-form-item :label="$t('scrappingApplication.amountInWords')" prop="totalAmountCapital">
        {{ form.totalAmountCapital }} {{ $t('commonContent.yuan') }}
      </el-form-item>
      <!-- <el-input v-model="form.scrapTotalAmount"></el-input> -->
      <el-form-item label-width="0" style="width: 100%;">
        <div class="fr" v-if="!disabled">
          <div class="flex">
            <span class="add-icon" @click="addRow">+</span>
            <upload v-if="isPartManage" @handleRequest="handleRequestExport" :showTip="false" class="mx10"
              url="/api/oa-portal/partsManagement/getScrapByFile"></upload>
          </div>
          <!-- <el-button @click="exprotData">导 入</el-button> -->
        </div>
        <el-table ref="multipleTable" :data="form.partBasicDtoList" @selection-change="handleSelectionChange"
          class="mb20 table-now">
          <el-table-column prop="chooseStatus" type="index" width="50"
            :label="$t('commonContent.serialNumber')"></el-table-column>
          <el-table-column property="partName" :label="$t('parts.name')" align="center" width="180">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partName'"
                :rules="rules.partName">
                <el-select filterable :remote-method="remoteMethodPartName" remote clearable v-model="scope.row.partName"
                  @change="getPartsDetail(scope.row, scope.$index, 'partName')">
                  <el-option v-for="item in partsList" :key="item.id"
                    :label="item.partName + ' ' + item.specificationAndModel + ' ' + item.partNumber"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="partNumber" :label="$t('parts.number')" align="center" width="280">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.partNumber'"
                :rules="rules.partNumber">
                <el-select filterable clearable v-model="scope.row.partNumber" remote :remote-method="remoteMethodPartNameNumber"
                  @change="getPartsDetail(scope.row, scope.$index, 'partNumber')"  >
                  <el-option v-for="item in partsList" :key="item.id" :label="item.partNumber"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="quantity" :label="$t('parts.quantity')" align="center"></el-table-column>
          <el-table-column prop="partsProject" :label="$t('parts.applicableProject')" align="center"></el-table-column>
          <el-table-column prop="specificationAndModel" :label="$t('parts.specModel')" align="center" width="300">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :prop="'partBasicDtoList.' + scope.$index + '.specificationAndModel'"
                :rules="rules.specificationAndModel">
                <el-select filterable clearable v-model="scope.row.specificationAndModel"
                  :remote-method="(query) => { remoteMethodPartName(query, '', 'specificationAndModel') }"
                  @change="getPartsDetail(scope.row, scope.$index, 'specificationAndModel')">
                  <el-option v-for="item in partsList" :key="item.id" :label="item.specificationAndModel"
                    :value="item.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="storageLocation" :label="$t('parts.storageLocation')" align="center"></el-table-column>
          <el-table-column  prop="unitPrice" v-if="!isZengjieYanshulei" :label="$t('parts.unitPrice')" align="center"></el-table-column>
          <el-table-column  prop="" v-else :label="$t('parts.unitPrice')" align="center"></el-table-column>
          <!-- unitPrice -->
          <el-table-column property="lossRate" :label="$t('parts.lossRate')" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;" :rules="rules.lossRate">
                {{ "1‰/" + $t('commonContent.day') }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="warehousingTime" :label="$t('parts.warehousingDate')" align="center"></el-table-column>
          <el-table-column prop="dayNumber" :label="$t('parts.days')" align="center">
            <template slot-scope="scope">
              <el-form-item>
                {{ getRowDay(scope.row) }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="netWorth" :label="$t('parts.netWorth')" align="center">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                {{ getNetWorth(scope.row) }}
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="remark" :label="$t('commonContent.remark')" align="center"></el-table-column>
          <el-table-column :label="$t('commonContent.operation')" align="center" v-if="!disabled">
            <template slot-scope="scope">
              <el-form-item style="width: 100%;">
                <el-button type="text" @click="deleteRow(scope.row)" style="color:red">{{ $t('commonContent.delete')
                }}</el-button>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </basic-container>
</template>

<script>
import PartsApplyApi from "@/api/partsApply/index";
import { getPlace, getPartCategories } from "../util";
import { mixins } from "../Mixin";
import { mapGetters } from 'vuex'
import upload from '@/components/upload/index'
import { numberToTraditionalChinese, daysBetween } from "@/util/util";
export default {
  mixins: [mixins],
  data() {
    return {
      categoriesList: [],
      placeList: [],
      form: {
        scrapRemark: "",
        scrapTotalAmount: 0,
        totalAmountCapital: "",
        scrapTime: "",
        scrapWay: "",
        partBasicDtoList: [
          {
            partName: "",
            partNumber: "",
            lossRate: "",
            dayNumber: "",
            partsProject: "",
            remark: "",
            unitPrice: "",
            quantity: "",
            money: "",
            netWorth: "",
            storageLocation: "",
          },
        ],
      },
      rules: {
        scrapWay: [
          { required: true, message: this.$t('scrappingApplication.scrapWayRequired'), trigger: "change" },
        ],
        scrapRemark: [
          { required: true, message: this.$t('scrappingApplication.scrapRemarkRequired'), trigger: "blur" },
        ],
        partName: [
          { required: true, message: this.$t('scrappingApplication.partNameRequired'), trigger: "change" },
        ],
        lossRate: [
          { required: true, message: this.$t('scrappingApplication.lossRateRequired'), trigger: "blur" },
        ],
      },
      businessId: null,
      multipleSelection: [],
      isEdit: false,
    };
  },
  components: { upload },
  mounted() {
    this.businessId = this.$route.query.businessId;
    this.isEdit = this.$route.query.isEdit;
    if (this.businessId) {
      this.getDetail();
    }
    this.init();
    // console.log(this.userInfo)
    this.remoteMethodPartName("start", this.isPartManage ? '' : '已领用', "start")
  },
  computed: {
    disabled() {
      return this.businessId && !this.isEdit;
    },
    isZengjieYanshulei(){
      return this.userInfo.account === 'yanshulei' || this.userInfo.account === 'zengjie'
    },
    isPartManage() {
      return this.userInfo.account === 'huxiaochen' || this.userInfo.account === 'zengjie'
    },
    ...mapGetters(["userInfo"]),
    // scrapTotalAmount() {
    //   //this.form.scrapTotalAmount = 0;
    //   if (this.form.partBasicDtoList.length > 0) {
    //     const values = this.form.partBasicDtoList.map((item) =>
    //       Number(item.unitPrice)
    //     );
    //     if (!values.every((value) => isNaN(value))) {
    //       this.form.scrapTotalAmount = values.reduce((prev, curr) => {
    //         const value = Number(curr);
    //         if (!isNaN(value)) {
    //           return prev + curr;
    //         } else {
    //           return prev;
    //         }
    //       }, 0);
    //       this.form.scrapTotalAmount += 0;
    //     } else {
    //       this.form.scrapTotalAmount = 0;
    //     }
    //   }
    //
    //   this.form.scrapTotalAmount =  this.form.scrapTotalAmount.toFixed(2)
    //   // if(this.isZengjieYanshulei){
    //   //   this.form.scrapTotalAmount = 0
    //   // }
    //   this.form.totalAmountCapital = numberToTraditionalChinese(
    //     this.form.scrapTotalAmount
    //   );
    //   return this.form.scrapTotalAmount;
    // },
    scrapTotalAmount() {
      // 初始化报废总金额为 0
      this.form.scrapTotalAmount = 0;
      // 检查 partBasicDtoList 是否有数据
      if (this.form.partBasicDtoList.length > 0) {
        // 遍历 partBasicDtoList，对每个子项计算 netWorth 并求和
        this.form.scrapTotalAmount = this.form.partBasicDtoList.reduce((prev, curr) => {
          // 调用 getNetWorth 方法获取当前行的 netWorth
          const netWorth = this.getNetWorth(curr);
          // 如果 netWorth 是有效数字（不是 NaN），则累加到总和中
          if (!isNaN(Number(netWorth))) {
            return prev + Number(netWorth);
          } else {
            return prev;
          }
        }, 0);
        // 保留两位小数
        this.form.scrapTotalAmount = this.form.scrapTotalAmount.toFixed(2);
      } else {
        // 如果 partBasicDtoList 无数据，报废总金额设为 0
        this.form.scrapTotalAmount = 0;
      }
      // 将报废总金额转为大写（假设 numberToTraditionalChinese 方法已正确实现）
      this.form.totalAmountCapital = numberToTraditionalChinese(this.form.scrapTotalAmount);
      return this.form.scrapTotalAmount;
    },
  },
  methods: {
    async init() {
      this.categoriesList = await getPartCategories();
      this.placeList = await getPlace();
    },
    handleRequestExport(data, arr) {
      this.form.partBasicDtoList = data
    },
    getRowDay(row) {
      if (row.warehousingTime) {
        row.dayNumber = daysBetween(row.warehousingTime)
        return row.dayNumber
      }
    },
    getNetWorth(row) {
      if (row.dayNumber && row.unitPrice) {
        // 计算净值：(单价 - 单价 * 0.001 * 天数)，保留三位小数
        return (Number(row.unitPrice) - Number(row.unitPrice) * 0.001 * Number(row.dayNumber)).toFixed(3)
      }
    },
    async remoteMethodPartName(query, key = 'partName') {
      let type = !this.isPartManage ? '已领用' : ""
      if (!query) return
      let obj = {
        partName: key !== 'partName' ? '' : query === "isStart" ? "" : query,
        partNumber: key !== 'partNumber' ? '' : query,
        specificationAndModel: key !== 'specificationAndModel' ? '' : query,
        currentState: type
      }
      if (type === '已领用') {
        obj.recipient = this.userInfo.nick_name || this.userInfo.realName || this.userInfo.user_name
      }
      let res = await PartsApplyApi.getBasicList(obj)
      if (res.data.code === 0) {
        this.partsList = res.data.data
        if (this.partsList.length > 100 && type !== '已领用' && type !== '在库中') {
          this.partsList = this.partsList.splice(0, 100)
          // console.log(this.partsList)
        }
      }
    },
    async remoteMethodPartNameNumber(query) {
      let type = !this.isPartManage ? '已领用' : ""
      let obj = {
        partNumber: query,
        currentState: type
      }
      if (type === '已领用') {
        obj.recipient = this.userInfo.nick_name || this.userInfo.realName || this.userInfo.user_name
      }
      let res = await PartsApplyApi.getBasicList(obj)
      if (res.data.code === 0) {
        this.partsList = res.data.data
        if (this.partsList.length > 100 && type !== '已领用' && type !== '在库中') {
          this.partsList = this.partsList.splice(0, 100)
          // console.log(this.partsList)
        }
      }
    },
    async getLoss(row) {
      let obj = JSON.parse(JSON.stringify(row));
      obj.lossRate =
        Number(obj.unitPrice || 0) *
        Number(obj.lossRate || 0) *
        Number(obj.dayNumber || 0) *
        -1 +
        Number(obj.unitPrice || 0);
      console.log(obj);
    },
    async getDetail() {
      // let res = await PartsApplyApi.details(this.businessId);
      let res = await PartsApplyApi.scrapDetails(this.businessId);
      if (res.data.code === 200) {
        this.form = res.data.data;
        this.$emit("getFormData", this.form);
      }
    },
    addRow() {
      this.form.partBasicDtoList.push({
        key: Date.now(),
      });
    },
    deleteRow(row) {
      this.form.partBasicDtoList = this.form.partBasicDtoList.filter((ele) => {
        return ele !== row;
      });
    },
    testForm() {
      let partCategoryList = this.form.partBasicDtoList.map(ele=>ele.partsCategory)
      partCategoryList = Array.from(new Set(partCategoryList));
      // if(partCategoryList.length>1&&(partCategoryList.includes('插拔SIM卡')||partCategoryList.includes('贴片SIM卡'))){
      //   this.$message.error('SIM类需单独申请，不能和其它大类一起申请')
      //   return
      // }
      if (partCategoryList.includes('插拔SIM卡')||partCategoryList.includes('贴片SIM卡')){
        if (partCategoryList.length>2 || (partCategoryList.length===2 && !(partCategoryList.includes('插拔SIM卡')&&partCategoryList.includes('贴片SIM卡')))){
          this.$message.error('SIM类需单独申请，SIM卡类另由运营商及零件管理领域负责人专门管理!')
          return
        }
      }
      if (partCategoryList.includes('第三方应用账号')){
        if (partCategoryList.length>1){
          this.$message.error('第三方应用账号类需单独申请，APP账号类另由功能测试及车辆领域负责人专门管理!')
          return
        }
      }
      return new Promise((resolve) => {
        this.$refs.form.validate((valid) => {
          resolve(valid);
          if (!valid) {
            return false;
          }
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.el-form {
  display: flex;
  flex-wrap: wrap;
}

@media (min-width: 768px) {
  .el-form-item {
    width: 48%;
  }
}

.fullscreenL {
  overflow: scroll;
}

.add-icon {
  color: #1d76ff;
  background-color: #deebff;
  padding: 3px 6px;
  margin-right: 10px;
  border-radius: 2px;
}

.w-100 {
  width: 100%;
}

.dec-icon {
  color: #979797;
  background-color: #eaeaea;
  padding: 3px 6px;
  border-radius: 2px;
  margin-right: 20px;
}

.exitFull {
  position: absolute;
  padding: 20px;
  color: transparent;
  z-index: 1000;
}

.exitFull:hover {
  color: #fff;
  background-color: #000;
}

.botton-row {
  margin-top: 50px;
  display: flex;
  justify-content: center;
}

.table-now {}
</style>
