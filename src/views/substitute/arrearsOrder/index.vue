 <template>
  <basic-container>
    <el-row class="mt20">
      <SearchForm
        :searchForm="searchForm"
        @handleSubmit="search"
        @refresh="getList"
      >
      </SearchForm>
      <!-- <search-form></search-form> -->
    </el-row>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="partsName" label="零件名称"> </el-table-column>
      <el-table-column prop="partsNo" label="零件号"> </el-table-column>
      <el-table-column prop="unPaidPart" label="历史欠缴数">
        <template slot-scope="scope">
          <div>
            <div class="flex" v-if="scope.row.isEdit">
              <el-input v-model="scope.row.unPaidPart"></el-input>
              <el-button class="mr10 blue" type="text" @click="saveUnpaidPart(scope.row)">保 存</el-button>
            </div>
            <div v-else>{{ scope.row.unPaidPart }}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createUserName"
        :label="$t('partsMaint.createUserName')"
        align="center"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click="handleEdit(scope.$index, scope.row)"
            >编辑</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pageNum"
      :page-sizes="[2, 5, 10, 20, 50]"
      :page-size="queryInfo.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="queryInfo.total"
    ></el-pagination>
  </basic-container>
</template>

<script>
import { getList,exportReport,updatePartsUnPaid} from "@/api/contract/partsMaint";
import {downBlobFile} from "@/util/util"
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      searchForm: {
        uploadBtn: "/api/oa-portal/partsMaint/importPartsUnPaid",
        column: [
          {
            label: "零件号",
            prop: "partsNo",
            type: "input",
          },
        ],
        btnList: [
          {
            name: "导出",
            icon: "el-icon-download",
            onClick: () => {
              this.exportPart();
            },
          },
        ],
      },
      form: {
        type: 1,
        partsNo: null,
        partsName: null,
        bomPurchaseContractId: null,
        parentFunctionId: null,
        childrenFunctionId: null,
        supplierNo: null,
      },
      tableData: [],
    };
  },
  mounted() {
    this.getPartsMaintList();
  },
  methods: {
    getPartsMaintList() {
      getList(
        this.queryInfo.pageNum,
        this.queryInfo.pageSize,
        Object.assign(this.form)
      ).then((res) => {
        let data = res.data.data.records;
        data.map((ele) => {
          this.$set(ele, "isEdit", false);
        });
        console.log(data);
        this.tableData = data;
        this.queryInfo.total = res.data.data.total;
      });
    },
    async exportPart() {
      let res = await exportReport(this.form);
      // console.log(res)
      downBlobFile(res.data, "历史欠缴零件");
    },
    async saveUnpaidPart(row){
      let res = await updatePartsUnPaid({id:row.id,unPaidPart:row.unPaidPart})
      if(res.data.code===200||res.data.code===0){
        this.$message.success('已更新')
        row.isEdit = false
      }
    },
    handleEdit(index, row) {
      console.log(row);
      row.isEdit = true;
    },
    search(val) {
      this.form = val;
      this.form.type = 1;
      this.getPartsMaintList();
    },
    getList(val) {
      this.queryInfo.pageSize = 10;
      this.queryInfo.pageNum = 1;
      this.form = { type: 1 };
      this.getPartsMaintList();
    },
    handleSizeChange(pageSize) {
      this.queryInfo.pageSize = pageSize;
      this.getPartsMaintList();
    },
    handleCurrentChange(currentPage) {
      this.queryInfo.pageNum = currentPage;
      this.getPartsMaintList();
    },
  },
};
</script>