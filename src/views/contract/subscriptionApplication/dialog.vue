<!--
 * @Author: xuefeng xuefeng@oimt.tech
 * @Date: 2023-05-26 10:14:21
 * @LastEditors: xuefeng xuefeng@oimt.tech
 * @LastEditTime: 2023-06-01 19:45:23
 * @FilePath: \icarx-ui\src\views\contract\subscriptionApplication\a.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <el-dialog
    title="提示"
    append-to-body
    :visible.sync="dialogVisible"
    width="66%"
  >
    <el-form :model="validateForm" ref="validateForm">
      <table border="1" width="100%" border-collapse>
        <tr>
          <td class="title">标题</td>
          <td colspan="3">
            <el-form-item prop="age">
              <el-input
                size="mini"
                v-model="validateForm.title"
                placeholder="请输入标题"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="title">申请人</td>
          <td>
            <el-form-item prop="age">
              <el-select
                v-model="validateForm.applyPerson"
                placeholder="请选择申请人"
                style="width: 100%"
                size="mini"
                clearable
                filterable
              >
                <el-option
                  v-for="item in userLists"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </td>
          <td class="title">申请部门</td>
          <td>
            <el-form-item prop="age">
              <el-select
                v-model="validateForm.applyDept"
                clearable
                filterable
                size="mini"
                placeholder="请选择申请部门"
                style="width: 100%"
              >
                <el-option
                  v-for="item in deptTrees"
                  :key="item.id"
                  :label="item.title"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td class="title">申请日期</td>
          <td>
            <el-form-item prop="date">
              <el-date-picker
                size="mini"
                type="date"
                placeholder="请选择日期"
                v-model="validateForm.applyDate"
                style="width: 100%"
              ></el-date-picker>
            </el-form-item>
          </td>
          <td class="title">申请编号</td>
          <td></td>
        </tr>
        <tr>
          <td class="title">认票说明</td>
          <td colspan="3">
            <el-form-item prop="desc">
              <el-input
                size="mini"
                type="textarea"
                placeholder="请输入认票说明"
                v-model="validateForm.subscribeDesc"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
      </table>
      <el-row type="flex" class="mt20" justify="space-between">
        <el-col :span="12"><p class="p-title">认证信息</p></el-col>
        <el-col :span="12" class="text-r">
          <el-button type="primary" size="mini" @click="addBtn">添加</el-button>
          <el-button type="primary" size="mini" @click="delBtn">删除</el-button>
        </el-col>
      </el-row>

      <el-table
        :data="validateForm.tbSubscribeInvoiceList"
        style="width: 100%"
        tooltip-effect="dark"
        header-row-class-name="tableHeader"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column label="序号" type="index" width="50"></el-table-column>
        <el-table-column prop="date" label="相关发票" width="180">
          <template slot-scope="scope">
            <el-form-item>
              <el-select
                v-model="scope.row.invoiceId"
                clearable
                filterable
                size="mini"
                placeholder="请选择相关发票"
              >
                <el-option
                  v-for="item in invoiceLists"
                  :key="item.id"
                  :label="item.invoiceName"
                  :value="item.id"
                >
                  <span>{{ item.invoiceName }}</span>
                  <span>{{ item.invoiceNo }}</span>
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="发票号码" width="180">
          <template slot-scope="scope">
            <el-form-item>
              <el-select
                v-model="scope.row.date"
                filterable
                clearable
                size="mini"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="相关合同信息" width="180">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="date" label="相关PO信息" width="180">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="date" label="币种" width="180">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="date" label="发票金额" width="180">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="date" label="本次应收金额" width="180">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="date" label="本次实收金额" width="180">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
        <el-table-column prop="date" label="备注" width="180">
          <template slot-scope="scope">{{ scope.row.date }}</template>
        </el-table-column>
      </el-table>
      <table border="1" width="100%" border-collapse>
        <tr>
          <td class="title">发票总金额</td>
          <td>{{ validateForm.invoiceTotalAmount }}</td>
          <td class="title">本次实收金额</td>
          <td>{{ validateForm.realReceivedTotalAmount }}</td>
        </tr>
        <tr>
          <td class="title">抵减/抵拥金额</td>
          <td colspan="3">{{ validateForm.deductionAmount }}</td>
        </tr>
      </table>
      <p class="mt20 p-title">其他信息</p>
      <table border="1" width="100%" border-collapse>
        <tr>
          <td class="title">银行收款凭证</td>
          <td>{{ validateForm.receiptVoucherUrl }}</td>
        </tr>
        <tr>
          <td class="title">相关附件</td>
          <td>
            {{ validateForm.attachmentUrl }}
            <upload
              class="flex-left"
              @handleRequest="handleRequest"
              :beforeUpload="beforeUpload"
            >
            </upload>
            <!-- <a :href="link">{{originalName}}</a> -->
          </td>
        </tr>
        <tr>
          <td class="title">备注</td>
          <td colspan="3">
            <el-form-item prop="remark">
              <el-input
                type="textarea"
                placeholder="请输入备注"
                v-model="validateForm.remark"
              ></el-input>
            </el-form-item>
          </td>
        </tr>
      </table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import upload from "@/components/upload";
import { mapGetters } from "vuex";
import {
  userList,
  getDeptTree,
  invoiceList,
} from "@/api/contract/subscriptionApplication";
export default {
  components: {
    upload,
  },
  data() {
    return {
      userLists: [],
      deptTrees: [],
      invoiceLists: [],
      link: "",
      dialogVisible: true,
      validateForm: {
        tbSubscribeInvoiceList: [{}],
      },
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄",
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄",
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄",
        },
      ],
      multipleSelection: [],
      options: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["userInfo"]),
  },
  created() {
    this.initData();
  },
  methods: {
    //获取创建人列表
    initData() {
      userList(this.userInfo.tenant_id).then((res) => {
        this.userLists = res.data.data;
      });
      getDeptTree(this.userInfo.tenant_id).then((res) => {
        this.deptTrees = res.data.data;
      });
      invoiceList(this.userInfo.tenant_id).then((res) => {
        this.invoiceLists = res.data.data;
      });
    },

    handleClose(done) {},
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    addBtn() {
      this.tableData.push({});
    },
    delBtn() {
      // console.log(this.tableData);
      console.log(this.multipleSelection);
      this.$confirm("确认要删除吗？")
        .then((_) => {})
        .catch((_) => {});
    },

    handleRequest(files) {
      console.log(files);
      this.link = files.link;
      this.originalName = files.originalName;
    },
  },
};
</script>
<style lang="scss" scoped>
tr {
  td {
    height: 28px;
    padding: 5px;
    width: 500px;

    &.title {
      color: #909399;
      background-color: #f5f7fa;
      width: 100px;
      margin-bottom: 0px;
    }
  }
}
.p-title {
  font-size: 16px;
  padding: 10px 5px;
  font-weight: bold;
  color: #000;
}
::v-deep .el-form-item {
  margin-bottom: 0;
  .el-form-item__content {
    line-height: 0;
  }
}
::v-deep .tableHeader th {
  background-color: #f5f7fa;
}
</style>
