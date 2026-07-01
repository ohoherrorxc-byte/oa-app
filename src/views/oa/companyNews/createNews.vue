<template>
    <basic-container>
      <avue-form
        :option="option"
        :table-loading="loading"
        :data="data"       
        v-model="form" 
      >      
      </avue-form>
    </basic-container>
  </template>
  
  <script>
  import { getList, remove, update, add, getNotice } from "@/api/desk/notice";
  import { mapGetters } from "vuex";
  
  export default {
    data() {
      return {
        form: {},
        query: {},
        loading: true,
        page: {
          pageSize: 10,
          currentPage: 1,
          total: 0,
        },
        selectionList: [],
        option: {
          height: "auto",
          calcHeight: 30,
          dialogWidth: 950,
          tip: false,
          searchShow: true,
          searchMenuSpan: 6,
          border: true,
          index: true,
          viewBtn: true,
          selection: true,
          excelBtn: true,
          dialogClickModal: false,
          column: [
            {
              label: "新闻标题",
              prop: "title",
              span: 24,
              row: true,
              search: true,
              rules: [
                {
                  required: true,
                  message: "请输入新闻标题",
                  trigger: "blur",
                },
              ],
            },
            {
              label: "",
              prop: "content",
              component: "AvueUeditor",
              options: {
                action: "/api/oa-resource/oss/endpoint/put-file",
                props: {
                  res: "data",
                  url: "link",
                },
              },
              hide: true,
              minRows: 6,
              span: 24,
            },
          ],
        },
        data: [],
      };
    },
    methods: {
      
    },
  };
  </script>
  
  <style></style>
  