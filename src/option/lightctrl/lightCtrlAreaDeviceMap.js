export default {
  height:'auto',
  calcHeight: 30,
  tip: false,
  searchShow: true,
  searchMenuSpan: 6,
  border: true,
  index: true,
  viewBtn: true,
  selection: true,
  dialogClickModal: false,
  column: [
    {
      label: "",
      prop: "id",
      type: "input",
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      hide: true,
    },
    {
      label: "区域名称",
      prop: "areaName",
      type: "input",
    },
    {
      label: "区域ID",
      prop: "areaId",
      type: "input",
    },
    {
      label: "设备UUID",
      prop: "deviceUuid",
      type: "input",
    },
    {
      label: "排序Index",
      prop: "sortOrder",
      type: "input",
    },
    {
      label: "新建时间",
      prop: "createdAt",
      type: "input",
      disabled: true, // 设置为只读
    },
    {
      label: "更新时间",
      prop: "updatedAt",
      type: "input",
      disabled: true, // 设置为只读
    },
  ]
}
