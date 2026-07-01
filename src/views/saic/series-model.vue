<template>
  <avue-input-tree
    include-half-checked
    multiple
    v-model="treeModel"
    ref="tree"
    :placeholder="placeholder||'请选择车系车型'"
    :dic="dic"
    :props="treeProps"
    :tags="true"
  ></avue-input-tree>
</template>

<script>
import { getTree } from "@/api/saic/license";

export default {
  name: "series-model",
  props: ["value", "region", "empty", "placeholder", "supplierType"],
  data() {
    return {
      dic: [],
      //是否由选择国家后自动勾选的车系车型
      autoSet: false,
      //采用中间变量，不直接把外部的value.model绑定到内部avue-input-tree组件上
      treeModel: [],
      treeProps: {
        label: "title",
        value: "title",
      },
    };
  },
  created() {
    // this.initData();
    this.initData({ supplierType: this.supplierType });
  },
  watch: {
    treeModel: {
      handler() {
        //清空的时候，getHalfList还是能取到值，这里做下处理
        if (this.value.model) {
          //这里有bug，去掉这个键
          //this.value.series = this.$refs.tree.getHalfList().filter(item => !this.value.model.split(',').includes(item)).join();
          //这里model貌似会变成数组，是加了层级的关系？在这里转换为最初的字符串形式
          //如果给组件的model设置了初始值为string，这里也不会是Array，所以加个判断
          //if (typeof this.value.model === 'object') {
          if (this.$refs.tree.getHalfList().length > 0 && !this.autoSet)
            //为避免自动勾选造成getHalfList获取的是上一次的值
            this.value.model = this.$refs.tree.getHalfList().join();
          else {
            this.value.model = this.value.model.join();
            this.autoSet = false;
          }
          //}

          let leafList = this.$refs.tree.$refs.tree.getCheckedNodes(true, true);

          let fullCheckList = this.$refs.tree.$refs.tree
            .getCheckedNodes()
            .filter((ele) => ele.hasChildren);
          fullCheckList.forEach((ele) => (ele.children_new = ele.children));

          //本来想这里深拷贝给halfCheckList，但是下面的includes判断不了了，所以都新建一个键值children_new
          let halfCheckList = this.$refs.tree.$refs.tree.getHalfCheckedNodes();
          halfCheckList.forEach(
            (ele) =>
              (ele.children_new = ele.children.filter((item) =>
                leafList.includes(item)
              ))
          );

          let allCheckList = halfCheckList.concat(fullCheckList);

          let dataArray = [];
          allCheckList.forEach((item) => {
            let dataItem = {};
            dataItem.series = item.title;
            dataItem.model = [];
            item.children_new.forEach((child) =>
              dataItem.model.push(child.title)
            );
            dataArray.push(dataItem);
          });

          this.value.data = dataArray;
        } else {
          //this.value.series = '';
          this.value.data = "";
        }

        this.value.model = this.value.model.replace(/ \((.+?)\)/g, "");
        this.$emit("input", this.value);
      },
    },
    region: {
      handler() {
        // debugger
        this.initData({
          countryReginCode: this.region,
          supplierType: this.supplierType,
        });
      },
    },
  },
  methods: {
    initData(params) {
      // debugger
      getTree(params).then((res) => {
        //每个元素的重复次数
        let repeatedTimes = new Map();
        this.dic = res.data.data;
        //如果选择了国家，默认勾选其下所有车型
        if (this.region && !this.empty) {
          let allNodeValue = this.dic
            .filter((item) => {
              return item.hasChildren;
            })
            .map((item) => {
              item.children.forEach(
                (i) => (i.titleFull = i.title + " (" + item.title + ")")
              );
              return item.children;
            })
            .reduce((a, b) => {
              return a.concat(b);
            })
            .map((item) => {
              if (repeatedTimes.get(item.title)) {
                let times = repeatedTimes.get(item.title);
                //item.title = item.title + '(' + times + ')'
                item.title = item.titleFull;
                repeatedTimes.set(item.title, ++times);
              } else {
                repeatedTimes.set(item.title, 1);
              }
              return item.title;
            });
          //由leaf-only改为各层级节点都需要，这里初始化赋值也配合修改
          let seriesNodeValue = this.dic
            .filter((item) => {
              return item.hasChildren;
            })
            .map((item) => {
              return item.title;
            });
          this.treeModel = this.value.model = allNodeValue.concat(
            seriesNodeValue
          );
          this.autoSet = true;
        }
      });
    },
  },
};
</script>
