<template>
  <div>
    <el-form>
      <div v-for="(item, index) in tableData" :key="index" class="">
        <el-row>
          <el-col span="8">
            <el-form-item label="零件号">{{
              item.partsNumber
            }}</el-form-item></el-col
          >
          <el-col span="8">
            <el-form-item label="零件名称">{{
              item.partsName
            }}</el-form-item></el-col
          >
          <el-col span="8">
            <el-form-item label="要求到货日期">
              {{ item.needDate | filter_date }}</el-form-item
            >
          </el-col>
          <el-col span="8">
            <el-form-item label="需求数量">{{
              item.needNumber
            }}</el-form-item></el-col
          >
          <el-col span="8">
            <el-form-item label="收货仓名称">{{
              item.storageName
            }}</el-form-item></el-col
          >
          <el-col span="8">
            <el-form-item label="收货联系人">{{
              item.takeOverConnect
            }}</el-form-item></el-col
          >
          <el-col span="8">
            <el-form-item label="联系人电话">{{
              item.connectNumber
            }}</el-form-item></el-col
          >
          <el-col span="8">
            <el-form-item label="收货地址">{{
              item.address
            }}</el-form-item></el-col
          >
          <el-col span="8">
            <el-form-item label="备注">{{ item.remark }}</el-form-item></el-col
          >
          <el-col span="8">
            <el-form-item label="订单号">{{
              item.orderPartNo
            }}</el-form-item></el-col
          >
          <el-col span="8" v-if="formData.orderType === 1">
            <el-form-item label="阶段">{{ item.stage }}</el-form-item></el-col
          >
        </el-row>
        <el-form-item style="width: 100%">
          <el-table :data="item.deliverList" style="width: 100%">
            <el-table-column fixed prop="date" label="计划交付日期" width="240">
              <template slot-scope="scope">
                <el-date-picker
                  v-if="!isApprove(scope.row)"
                  style="width: 100%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  clearable
                  v-model="scope.row.planDeliverDate"
                  type="date"
                ></el-date-picker>
                <div v-else>{{ scope.row.planDeliverDate | filter_date }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="计划交付数量">
              <template slot-scope="scope">
                <el-input
                  v-if="!isApprove(scope.row)"
                  v-model="scope.row.deliverNumber"
                ></el-input>
                <div v-else>{{ scope.row.deliverNumber }}</div>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="province" >
                            <template slot-scope="scope">            
                                <div>{{ statusObj[scope.row.deliverStatus] }}</div>
                            </template>
                        </el-table-column> -->
            <!-- <el-table-column prop="province" label="状态">
                            <template slot-scope="scope">
                                <div>{{ statusObj[scope.row.deliverStatus] }}</div>
                            </template>
                        </el-table-column> -->
            <!-- <el-table-column label="审核日期">
                            <template slot-scope="scope">
                                <div>{{ scope.row.planApplyDate | filter_date }}</div>
                            </template>
                        </el-table-column> -->
            <!-- <el-table-column label="收货联系人">
                            <template slot-scope="scope">
                                <el-input v-if="!isApprove(scope.row)" v-model="scope.row.takeOverConnectDetail"></el-input>
                                <div v-else>{{ scope.row.takeOverConnectDetail }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="联系人电话">
                            <template slot-scope="scope">
                                <el-input v-if="!isApprove(scope.row)" v-model="scope.row.connectNumberDetail"></el-input>
                                <div v-else>{{ scope.row.connectNumberDetail }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="收货地址">
                            <template slot-scope="scope">
                                <el-input type="textarea" v-if="!isApprove(scope.row)"
                                    v-model="scope.row.addressDetail"></el-input>
                                <div v-else>{{ scope.row.addressDetail }}</div>
                            </template>
                        </el-table-column> -->
            <!-- 0:计划未提交，1：计划待审核，2：计划审核拒绝，3：待交付，4：交付审核中，5：交付审核拒绝，6：审核完成
                    7:上传入场单（管理员操作）；8：可交货（计划员操作）；9.签收审核（管理员操作）-->
            <!-- <el-table-column prop="address" label="交付操作">
                            <template slot-scope="scope">
                                <div>
                                    <el-button @click="updateStatus(1, scope.row, item)" type="text"
                                        v-if="scope.row && (scope.row.deliverStatus === 0 || scope.row.deliverStatus === 2)">交付计划申请</el-button>
                                    <el-button @click="updateStatus(2, scope.row, item)" type="text"
                                        v-if="scope.row && scope.row.deliverStatus === 1 && !isPlanor">拒绝</el-button>
                                    <el-button @click="updateStatus(3, scope.row, item)" type="text"
                                        v-if="scope.row && scope.row.deliverStatus === 1 && !isPlanor">同意</el-button>
                                    <el-button type="text"
                                        v-if="scope.row && scope.row.deliverStatus === 1 && isPlanor">审核中</el-button>
                                    <el-button
                                        v-if="scope.row && (scope.row.deliverStatus === 3 || scope.row.deliverStatus === 5)"
                                        @click="openDialog(scope.row, item)" type="text">交付申请</el-button>
                                    <el-button @click="openDialog(scope.row, item)" type="text"
                                        v-if="scope.row && scope.row.deliverStatus === 4">交付审批</el-button>
                                    <el-button style="color: #67C23A;" @click="openDialog(scope.row, item)" type="text"
                                        v-if="scope.row && scope.row.deliverStatus === 6">审批详情</el-button>
                                    <el-button type="text" @click="openDialog(scope.row, item)"
                                        v-if="scope.row && scope.row.deliverStatus === 7 && !isPlanor">上传进仓单</el-button>
                                    <el-button type="text" @click="openDialog(scope.row, item)"
                                        v-if="scope.row && (scope.row.deliverStatus === 8||scope.row.deliverStatus === 10) && isPlanor">交货</el-button>
                                    <el-button type="text" @click="openDialog( scope.row, item)"
                                        v-if="scope.row && scope.row.deliverStatus === 9 && !isPlanor">签收审核</el-button>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="附件">
                            <template slot-scope="scope">
                                <el-button type="text" @click="openDialog(scope.row, item, 'seeView')">查看</el-button>
                            </template>
                        </el-table-column> -->
            <el-table-column label="操作">
              <template slot-scope="scope">
                <i
                  v-if="scope.$index === 0"
                  @click="addPayList(item, scope.row)"
                  class="el-icon-circle-plus-outline"
                ></i>
                <i
                  v-if="scope.row && scope.row.deliverStatus === 0"
                  @click="delPayList(item, scope.$index)"
                  class="el-icon-remove-outline"
                ></i>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </div>
    </el-form>
    <!-- <table style="width:100%" border>
            <thead>
                <tr>
                    <th rowspan="4">零件号</th>
                    <th rowspan="4">零件名称</th>
                    <th rowspan="4">要求到货日期</th>
                    <th rowspan="4">需求数量</th>
                    <th rowspan="4" style="width: 200px;">项目名称</th>
                    <th rowspan="4">阶段</th>
                    <th colspan="6">计划交付</th>
                </tr>
                <tr>
                    <th class="w130">计划交付日期</th>
                    <th class="w130">计划交付数量</th>
                    <th>状态</th>
                    <th>审核日期</th>
                    <th>交付操作</th>
                    <th>附件</th>
                    <th rowspan="4">操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in tableData">
                    <td>{{ item.partsNumber }}</td>
                    <td>{{ item.partsName }}</td>
                    <td>{{ item.needDate | filter_date }}</td>
                    <td>{{ item.needNumber }}</td>
                    <td>{{ item.projectName }}</td>
                    <td>{{ item.stage }}</td>
                    <td>
                        <div v-for="subItem in item.deliverList" class="pb5 m5  h33">
                            <el-date-picker v-if="!isApprove(subItem)" style="width: 100%"
                                value-format="yyyy-MM-dd HH:mm:ss" clearable v-model="subItem.planDeliverDate"
                                type="date"></el-date-picker>
                            <div v-else>{{ subItem.planDeliverDate | filter_date }}</div>
                        </div>
                    </td>
                    <td>
                        <div v-for="subItem in item.deliverList" class="pb5 m5  h33">
                            <el-input v-if="!isApprove(subItem)" v-model="subItem.deliverNumber"></el-input>
                            <div v-else>{{ subItem.deliverNumber }}</div>
                        </div>
                    </td>
                   
                    <td>
                        <div v-for="subItem in item.deliverList" class="pb5 m5  h33">
                            {{ statusObj[subItem.deliverStatus] }}
                        </div>
                    </td>
                    <td>
                        <div v-for="subItem in item.deliverList" class="pb5 m5  h33" :style="setHeight(item)">
                            {{ subItem.planApplyDate | filter_date }}
                        </div>
                    </td>
                    <td>
                        <div v-for="subItem in item.deliverList" class="pb5 m5  h33">
                            <div>
                                <el-button @click="updateStatus(1, subItem, item)" type="text"
                                    v-if="subItem && subItem.deliverStatus === 0">交付计划申请</el-button>
                                <el-button @click="updateStatus(2, subItem, item)" type="text"
                                    v-if="subItem && subItem.deliverStatus === 1 && !isPlanor">拒绝</el-button>
                                <el-button @click="updateStatus(3, subItem, item)" type="text"
                                    v-if="subItem && subItem.deliverStatus === 1 && !isPlanor">同意</el-button>
                                <el-button type="text"
                                    v-if="subItem && subItem.deliverStatus === 1 && isPlanor">审核中</el-button>
                                <el-button type="text" style="color: red;"
                                    v-if="subItem && subItem.deliverStatus === 2">计划审核拒绝</el-button>
                                <el-button type="text" style="color: red;"
                                    v-if="subItem && subItem.deliverStatus === 5">交付审核拒绝</el-button>
                                <el-button v-if="subItem && subItem.deliverStatus === 3" @click="openDialog(subItem, item)"
                                    type="text">交付申请</el-button>
                                <el-button @click="openDialog(subItem, item)" type="text"
                                    v-if="subItem && subItem.deliverStatus === 4">交付审批</el-button>
                                <el-button style="color: #67C23A;" @click="openDialog(subItem, item)" type="text"
                                    v-if="subItem && subItem.deliverStatus === 6">审批详情</el-button>
                                <el-button type="text" @click="openDialog(subItem, item)"
                                    v-if="subItem && subItem.deliverStatus === 7 && !isPlanor">上传进仓单</el-button>
                                <el-button type="text" @click="openDialog(subItem, item)"
                                    v-if="subItem && subItem.deliverStatus === 8 && isPlanor">交货</el-button>
                                <el-button type="text" @click="updateStatus(6, subItem, item)"
                                    v-if="subItem && subItem.deliverStatus === 9 && !isPlanor">签收审核</el-button>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div v-for="subItem in item.deliverList" class="pb5 m5  h33"
                            @click="openDialog(subItem, item, 'seeView')">
                            <el-button type="text">查看</el-button>
                        </div>
                    </td>
                    <td>
                        <div v-for="(subItem, subIndex) in item.deliverList" class="pb5 m5  h33">
                            <i v-if="subIndex === 0" @click="addPayList(item, subItem)"
                                class="el-icon-circle-plus-outline"></i>
                            <i v-if="subItem && subItem.deliverStatus === 0" @click="delPayList(item, subIndex)"
                                class="el-icon-remove-outline"></i>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table> -->
    <div class="text-center">
      <el-button type="success" @click="savePayPlan">保 存</el-button>
    </div>
    <el-dialog
      :title="titleStatus"
      :visible.sync="dialogFormVisible"
      :append-to-body="true"
      class="fileStyle"
    >
      <el-form :model="form">
        <el-form-item label="附件">
          <upload
            :fileList="form.fileList"
            ref="uploadList"
            :disabled="disableFile"
            btnName="上传"
            @handleRequest="handleRequest"
            :multiple="true"
            :showFileList="true"
          ></upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="!seeView">
        <el-button
          @click="dialogFormVisible = false"
          v-if="curItem.deliverStatus === 3"
          >取 消</el-button
        >
        <el-button
          type="primary"
          @click="submit(4, 9)"
          v-if="
            curItem.deliverStatus === 3 ||
            curItem.deliverStatus === 5 ||
            curItem.deliverStatus === 8 ||
            curItem.deliverStatus === 10
          "
          >提交</el-button
        >
        <el-button
          type="primary"
          @click="submit(8)"
          v-if="curItem.deliverStatus === 7"
          >提交</el-button
        >
        <el-button
          type="primary"
          @click="submit(5, 10)"
          v-if="curItem.deliverStatus === 4 || curItem.deliverStatus === 9"
          >拒绝</el-button
        >
        <el-button
          type="primary"
          @click="submit(7, 6)"
          v-if="curItem.deliverStatus === 4 || curItem.deliverStatus === 9"
          >同意</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>
   
<script>
import upload from "@/components/upload/index";
import substituteOrderManageApi from "@/api/substitute/orderManage";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      tableData: [
        {
          partsNumber: "",
          partsName: "",
          needDate: null,
          needNumber: null,
        },
      ],
      seeView: false,
      form: {
        fileList: [],
      },
      titleStatus: "交付申请",
      dialogFormVisible: false,
      parentRow: null,
      curItem: {
        deliverStatus: null,
      },
      statusObj: {
        0: "计划未提交",
        1: "计划待审核",
        2: "计划审核拒绝",
        3: "待交付",
        4: "交付审核中",
        5: "交付审核拒绝",
        6: "审核完成",
        7: "上传进仓单",
        8: "交货",
        9: "签收审核",
        10: "签收已拒绝",
      },
    };
  },
  filters: {
    filter_date(value) {
      if (value) {
        return value.substring(0, 11);
      }
      return " ";
    },
  },
  props: {
    formData: {
      type: Object,
      default: {},
    },
  },
  components: {
    upload,
  },
  watch: {
    formData() {
      this.tableData = this.formData.deliverDtos || [];
      this.tableData.map((ele) => {
        if (!ele.deliverList || ele.deliverList.length === 0) {
          this.$set(ele, "deliverList", [
            {
              planDeliverDate: null,
              deliverNumber: null,
              deliverStatus: 0,
              planApplyDate: null,
            },
          ]);
        }
      });
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
    isPlanor() {
      if (this.userInfo.role_name.includes("计划员")) {
        return true;
      } else {
        return false;
      }
    },
    disableFile() {
      return (
        this.curItem.deliverStatus !== 3 &&
        this.curItem.deliverStatus !== 7 &&
        this.curItem.deliverStatus !== 8 &&
        this.curItem.deliverStatus !== 5 &&
        this.curItem.deliverStatus !== 10
      );
    },
  },
  mounted() {},
  methods: {
    isApprove(subItem) {
      return subItem && subItem.deliverStatus === 6;
    },
    async savePayPlan() {
      this.tableData.map((ele) => {
        ele.orderId = this.$route.query.id;
      });
      //   console.log(this.tableData);
      let res = await substituteOrderManageApi.saveUpdatePlan(this.tableData);

      console.log(res);
    },
    addPayList(item, subItem) {
      console.log(subItem);
      item.deliverList.push({
        planDeliverDate: null,
        deliverNumber: null,
        deliverStatus: 0,
        planApplyDate: null,
        takeOverConnectDetail: subItem.takeOverConnectDetail,
        connectNumberDetail: subItem.connectNumberDetail,
        addressDetail: subItem.addressDetail,
      });
    },
    setHeight(item) {},
    handleRequest(data, arr) {
      console.log(data);
      console.log(arr);
      this.form.fileList = arr;
    },
    delPayList(item, subIndex) {
      item.deliverList.splice(subIndex, 1);
    },
    openDialog(subItem, item, seeView) {
      this.seeView = seeView;
      this.dialogFormVisible = true;
      this.parentRow = item;
      this.curItem = subItem;
      this.form.fileList = subItem.fileList;
      console.log(this.form.fileList);
      if (this.curItem.deliverStatus === 7) {
        this.titleStatus = "上传进仓单";
      } else if (seeView) {
        this.titleStatus = "查看附件";
      } else if (
        this.curItem.deliverStatus === 8 ||
        this.curItem.deliverStatus === 10
      ) {
        this.titleStatus = "上传签收单";
      }
      console.log(this.$refs.uploadList);
      this.$nextTick(() => {
        this.$refs.uploadList.getList(this.form.fileList);
      });
    },
    async submit(key, key2) {
      let obj = {
        orderId: this.formData.id,
        ...this.curItem,
        id: this.curItem.id,
        deliverStatus:
          this.curItem.deliverStatus === 8 ||
          this.curItem.deliverStatus === 9 ||
          this.curItem.deliverStatus === 10
            ? key2
            : key,
        detailId: this.parentRow.id,
        fileList: this.form.fileList,
      };
      let res = await substituteOrderManageApi.updatePlanStatus(obj);
      if (res.data.code === 0 || res.data.code === 200) {
        this.$emit("reflesh");
        this.dialogFormVisible = false;
      }
    },
    async updateStatus(key, subItem, item) {
      if (key === 1) {
        if (!subItem.planDeliverDate) {
          this.$message.error("请选择计划交付日期");
          return;
        }
        if (!subItem.deliverNumber) {
          this.$message.error("请输入计划交付数量");
          return;
        }
      }
      let obj = {
        orderId: this.formData.id,
        id: subItem.id,
        detailId: item.id,
        ...subItem,
        deliverStatus: key,
      };
      let res = await substituteOrderManageApi.updatePlanStatus(obj);
      if (res.data.code === 0 || res.data.code === 200) {
        this.$emit("reflesh");
      }
      console.log(res);
    },
  },
};
</script>

<style scoped lang="scss">
tr {
  text-align: center;
  font-size: 12px;
}

.el-button--text {
  color: #409eff;
}

.h33 {
  height: 33px;
}

.fileStyle {
  // button{
  //     color: #fff;
  // }
}

table {
  border: 1px solid #dcdfe6;
  color: #606266;
  font-size: 12px;
}

.w130 {
  width: 130px;
}

.el-icon-circle-plus-outline {
  font-size: 16px;
}

.el-icon-remove-outline {
  font-size: 16px;
}

.td {
  font-size: 12px;
}

.border-bottom {
  border-bottom: 1px solid #dcdfe6;
}
</style>