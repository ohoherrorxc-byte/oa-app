<template>
  <basic-container>
    <avue-crud
      :option="option"
      :table-loading="loading"
      :data="data"
      :page.sync="page"
      :permission="permissionList"
      :before-open="beforeOpen"
      v-model="form"
      ref="crud"
      @row-update="rowUpdate"
      @row-save="rowSave"
      @row-del="rowDel"
      @search-change="searchChange"
      @search-reset="searchReset"
      @selection-change="selectionChange"
      @current-change="currentChange"
      @size-change="sizeChange"
      @refresh-change="refreshChange"
      @on-load="onLoad"
    >
      <template slot="menuLeft">
        <!--<el-button type="danger"
                   
                   icon="el-icon-delete"
                   plain
                   v-if="permission.fleetuserblade_delete"
                   @click="handleDelete">Delete
        </el-button>-->
      </template>
      <template slot-scope="{ row, index }" slot="id">
        <el-button
          type="text"
          class="none-border"
          @click="$refs.crud.rowEdit(row, index)"
          >{{ row.id }}</el-button
        >
      </template>
      <template slot-scope="{ row }" slot="fleetCustomerState">
        <el-tag v-if="row.fleetCustomerState == 1">Available</el-tag>
        <el-tag color="#ccc" style="color: white" v-else>Disabled</el-tag>
      </template>
      <template slot-scope="{ row }" slot="accountType">
        <el-tag v-if="row.accountType == 1">Prepaid</el-tag>
      </template>
      <!--<template slot-scope="{row}" slot="createDate">
        {{ dateFormat(row.createDate, "yyyy-MM-dd") }}
      </template>-->
      <template slot-scope="scope" slot="menu">
        <el-button
          type="text"
          v-if="permission.fleetuserblade_edit"
          icon="el-icon-refresh"
          class="none-border"
          @click="handleReset(scope.row)"
          >Reset Password
        </el-button>
        <el-button
          type="text"
          icon="el-icon-plus"
          class="none-border"
          @click="bindCard(scope.row)"
          >Bind a card
        </el-button>
      </template>
      <template slot-scope="{ disabled, type }" slot="menuForm">
        <div>
          <el-button
            type="primary"
            icon="el-icon-check"
            :loading="disabled"
            plain
            v-if="type == 'add'"
            @click="$refs.crud.rowSave()"
            >Add
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-check"
            :loading="disabled"
            plain
            :disabled="editFormNotChanged"
            v-if="type == 'edit'"
            @click="$refs.crud.rowUpdate()"
            >Update
          </el-button>
          <el-button
            icon="el-icon-delete"
            :loading="disabled"
            plain
            @click="$refs.crud.closeDialog()"
          >
            Cancel
          </el-button>
        </div>
      </template>
    </avue-crud>
  </basic-container>
</template>

<script>
import {
  getList,
  getDetail,
  add,
  update,
  remove,
  resetPassword,
} from "@/api/portal/fleetuserblade";
import { mapGetters } from "vuex";
import { randomLenNum } from "@/util/util";
import Clipboard from "clipboard";
//import md5 from 'js-md5';
import { dateFormat } from "@/util/date";

export default {
  data() {
    /*const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          callback();
        }
      };
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };*/
    return {
      form: {},
      query: {},
      loading: true,
      page: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        layout: "total, pager",
      },
      selectionList: [],
      option: {
        height: "auto",
        calcHeight: 30,
        tip: false,
        searchShow: true,
        searchMenuSpan: 6,
        searchLabelWidth: 150,
        border: true,
        index: false,
        viewBtn: false,
        editBtn: false,
        delBtn: false,
        selection: false,
        dialogClickModal: false,
        menuTitle: "Operation",
        columnBtn: false,
        emptyText: "No data",

        //submitBtn: false,
        //emptyBtn: false,
        saveBtn: false,
        updateBtn: false,
        cancelBtn: false,

        column: [
          {
            label: "ID",
            prop: "id",
            display: false,
          },
          {
            label: "Fleet Customer Code",
            prop: "fleetCustomerCode",
            display: false,
          },
          {
            label: "Login Account",
            prop: "account",
            search: true,
            display: false,
          },
          {
            label: "Name and Surname",
            prop: "realName",
            search: true,
            display: false,
          },
          {
            label: "Company Name",
            prop: "companyName",
            display: false,
          },
          {
            label: "Mobile Phone",
            prop: "phone",
            display: false,
          },
          {
            label: "Account Type",
            prop: "accountType",
            slot: true,
            display: false,
          },
          {
            label: "State",
            prop: "fleetCustomerState",
            slot: true,
            display: false,
          },
          {
            label: "Create Date",
            prop: "createDate",
            type: "datetime",
            format: "HH:mm dd/MM/yyyy",
            //valueFormat: "yyyy-MM-dd",
            slot: true,
            display: false,
          },
          {
            label: "Email / Phone",
            prop: "emailPhone",
            hide: true,
            display: false,
            search: true,
          },
        ],
        group: [
          {
            label: "Basic Information",
            labelWidth: 160,
            prop: "baseInfo",
            icon: "el-icon-user-solid",
            column: [
              {
                label: "Name and Surname",
                prop: "realName",
                span: 24,
                rules: [
                  {
                    required: false,
                    message: "Please input Name and Surname",
                    trigger: "blur",
                  },
                  {
                    pattern: /^.{1,30}$/,
                    message: "Wrong name format!",
                  },
                ],
              },
              {
                label: "Fleet Customer Code",
                prop: "fleetCustomerCode",
                span: 24,
                rules: [
                  {
                    required: true,
                    message: "Please input Fleet Customer Code",
                    trigger: "blur",
                  },
                  {
                    pattern: /^\d{6}$/,
                    message: "Wrong code format!",
                  },
                ],
              },
              {
                label: "Login Account",
                prop: "account",
                editDisabled: true,
                span: 24,
                rules: [
                  {
                    required: true,
                    message: "Please input Login Account",
                    trigger: "blur",
                  },
                  {
                    pattern: /^[a-z][a-z0-9_-]{2,14}$/,
                    message: "Wrong format!",
                  },
                ],
              },
              {
                label: "Email",
                prop: "email",
                span: 24,
                rules: [
                  {
                    required: true,
                    message: "Please input Email",
                    trigger: "blur",
                  },
                  {
                    pattern:
                      /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
                    message: "Wrong e-mail format!",
                  },
                  {
                    min: 3,
                    max: 45,
                    message: "Wrong e-mail format!",
                  },
                ],
              },
              {
                label: "Mobile Phone",
                labelTip: "Please fill in the phone number in the DOL system.",
                prop: "phone",
                span: 24,
                rules: [
                  {
                    required: true,
                    message: "Please input Phone",
                    trigger: "blur",
                  },
                  {
                    pattern: /^[0-9]{5,15}$/,
                    message: "Wrong phone format!",
                  },
                ],
              },
              {
                label: "Company Name",
                prop: "companyName",
                span: 24,
                rules: [
                  {
                    required: true,
                    message: "Please input Company name",
                    trigger: "blur",
                  },
                  {
                    pattern: /^.{2,100}$/,
                    message: "Wrong name format!",
                  },
                ],
              },
              {
                label: "State",
                prop: "fleetCustomerState",
                type: "select",
                span: 24,
                dicData: [
                  { value: 1, label: "Available" },
                  { value: 0, label: "Disable" },
                ],
                value: 1,
                rules: [
                  {
                    required: true,
                    message: "Please input State",
                    trigger: "blur",
                  },
                ],
              },
            ],
          },
          {
            label: "Assigning Roles",
            labelWidth: 160,
            prop: "dutyInfo",
            icon: "el-icon-s-custom",
            column: [
              {
                label: "Role",
                prop: "accountType",
                type: "select",
                editDisabled: true,
                span: 24,
                dicData: [{ value: 1, label: "Prepaid Customer" }],
                value: 1,
                rules: [
                  {
                    required: true,
                    message: "Please input Role",
                    trigger: "blur",
                  },
                ],
              },
            ],
          },
        ],
      },
      data: [],
    };
  },
  computed: {
    ...mapGetters(["permission"]),
    permissionList() {
      return {
        addBtn: this.vaildData(this.permission.fleetuserblade_add, false),
        viewBtn: this.vaildData(this.permission.fleetuserblade_view, false),
        delBtn: this.vaildData(this.permission.fleetuserblade_delete, false),
        editBtn: this.vaildData(this.permission.fleetuserblade_edit, false),
      };
    },
    ids() {
      let ids = [];
      this.selectionList.forEach((ele) => {
        ids.push(ele.id);
      });
      return ids.join(",");
    },
    editFormNotChanged() {
      return (
        JSON.stringify(this.form) ===
        sessionStorage.getItem("fleet" + this.form.id)
      );
    },
  },
  created() {
    window.copyAccount = this.copyAccount;
  },
  methods: {
    rowSave(row, done, loading) {
      let pwd = randomLenNum(6);
      //row.password = md5(pwd);
      row.password = pwd;

      add(row).then(
        () => {
          this.onLoad(this.page);
          this.alertCopyDialog(`Account created successfully! `, row, pwd);
          done();
        },
        (error) => {
          loading();
          window.console.log(error);
        }
      );
    },
    rowUpdate(row, index, done, loading) {
      console.log(JSON.stringify(row));
      console.log(JSON.stringify(this.form));
      if (JSON.stringify(row) === sessionStorage.getItem("fleet" + row.id)) {
        this.$message.warning("Content not changed!");
        return;
      }
      update(row).then(
        () => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "Success!",
          });
          done();
        },
        (error) => {
          loading();
          console.log(error);
        }
      );
    },
    rowDel(row) {
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(row.id);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "Success!",
          });
        });
    },
    handleDelete() {
      if (this.selectionList.length === 0) {
        this.$message.warning("请选择至少一条数据");
        return;
      }
      this.$confirm("确定将选择数据删除?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          return remove(this.ids);
        })
        .then(() => {
          this.onLoad(this.page);
          this.$message({
            type: "success",
            message: "Success!",
          });
          this.$refs.crud.toggleSelection();
        });
    },
    beforeOpen(done, type) {
      if (["edit", "view"].includes(type)) {
        getDetail(this.form.id).then((res) => {
          this.form = res.data.data;
          console.log(JSON.stringify(this.form));
          sessionStorage.setItem(
            "fleet" + this.form.id,
            JSON.stringify(this.form)
          );
        });
      }
      done();
    },
    searchReset() {
      this.query = {};
      this.onLoad(this.page);
    },
    searchChange(params, done) {
      this.query = params;
      this.page.currentPage = 1;
      this.onLoad(this.page, params);
      done();
    },
    selectionChange(list) {
      this.selectionList = list;
    },
    selectionClear() {
      this.selectionList = [];
      this.$refs.crud.toggleSelection();
    },
    currentChange(currentPage) {
      this.page.currentPage = currentPage;
    },
    sizeChange(pageSize) {
      this.page.pageSize = pageSize;
    },
    refreshChange() {
      this.onLoad(this.page, this.query);
    },
    onLoad(page, params = {}) {
      this.loading = true;
      for (let i in this.query) {
        this.query[i] = this.query[i].trim();
      }
      getList(
        page.currentPage,
        page.pageSize,
        Object.assign(params, this.query)
      ).then((res) => {
        const data = res.data.data;
        this.page.total = data.total;
        this.data = data.records;
        this.loading = false;
        this.selectionClear();
      });
    },
    bindCard(row) {
      this.$router.push({
        path: "/portal/vehiclePrepaidCardEdit",
        query: {
          userId: row.id,
        },
      });
    },
    handleReset(row) {
      let pwd = randomLenNum(6);
      //row.password = md5(pwd);
      row.password = pwd;

      this.$confirm("Confirm to reset password?", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning",
      })
        .then(() => {
          this.loading = true;
          return resetPassword(row.id, row.password);
        })
        .then(() => {
          this.loading = false;
          this.alertCopyDialog("Password Reset", row, pwd);
        });
    },
    alertCopyDialog(title, row, pwd) {
      let copyArea =
        title.toLowerCase().indexOf("reset") >= 0
          ? `<span id="copyArea">New Password: ${pwd}</span>`
          : `<span id="copyArea">Fleet Customer Code: ${row.fleetCustomerCode}, Company Name:${row.companyName}, Account: ${row.account}, Password: ${pwd}</span>`;
      this.$alert(
        copyArea +
          `
                <button id="copyEvent" data-clipboard-action='copy' data-clipboard-target="#copyArea" onclick="copyAccount()">Copy</button>`,
        title,
        {
          dangerouslyUseHTMLString: true,
          center: true,
          customClass: "batch-add-result",
        }
      );
    },
    copyAccount() {
      new Clipboard("#copyEvent");
    },
    dateFormat,
  },
};
</script>

<style scoped>
.el-card .el-table .cell {
  text-overflow: clip;
}
</style>
