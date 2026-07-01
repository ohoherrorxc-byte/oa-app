// lightCtrlSchedules.js
export default {
  height:'auto',
  width:'auto',
  calcHeight: 30,
  tip: false,
  searchShow: true,
  searchMenuSpan: 6,
  border: true,
  index: true,
  viewBtn: true,
  selection: true,
  dialogClickModal: false,
  // ...
  //menuWidth: 100, // 操作列宽度
  column: [
    {
      label: "",
      prop: "id",
      addDisplay: false,
      editDisplay: false,
      viewDisplay: false,
      hide: true,
    },
    {
      label: '开灯时间',
      prop: 'openTime',
      align: 'center',
      type: 'time',
      format: 'HH:mm',
      valueFormat: 'HH:mm'
    },
    {
      label: '关灯时间',
      prop: 'closeTime',
      align: 'center',
      type: 'time',
      format: 'HH:mm',
      valueFormat: 'HH:mm'
    },
    {
      label: "区域 ID",
      prop: "areaId",
      align: 'center',
      type: 'input',
      disabled: true, // 设置为只读
    },
    {
      label: '用户名称',
      prop: 'userName',
      align: 'center',
      type: 'input',
      disabled: true, // 设置为只读
    },
    // {
    //   label: '用户 ID',
    //   prop: 'userId',
    //   type: 'input',
    //   disabled: true, // 设置为只读
    //   display: false,
    // },
    {
      label: '修改时间',
      prop: 'updateTime',
      align: 'center',
      type: 'datetime',
      disabled: true, // 设置为只读
      format: 'yyyy-MM-dd HH:mm:ss',
      valueFormat: 'yyyy-MM-dd HH:mm:ss'
    },
    {
      label: '状态',
      prop: 'status',
      type: 'switch',
      align: 'center',
      dicData: [
        { label: '取消', value: 0 },
        { label: '启用', value: 1 },
      ],
      slots: {
        default: 'statusSlot' // 使用命名插槽
      }
    },
  ]
};
