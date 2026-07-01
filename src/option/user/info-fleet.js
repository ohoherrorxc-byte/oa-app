export default {
  tabs: true,
  tabsActive: 1,
  labelWidth: 150,
  group: [
    {
      // label: 'Modify password',
      title:"Modify password",
      prop: 'password',
      column: [{
        label: 'Original password',
        span: 12,
        row: true,
        type: 'password',
        prop: 'oldPassword',
        rules: [{
          required: true,
          message: "Please input old password",
          trigger: "blur"
        }]
      }, {
        label: 'New password',
        span: 12,
        row: true,
        type: 'password',
        prop: 'newPassword',
        rules: [{
          required: true,
          message: "Please input new password",
          trigger: "blur"
        },{min: 6, message: "New password must be more than 6 chars!"}],
      }, {
        label: 'Confirm password',
        span: 12,
        row: true,
        type: 'password',
        prop: 'newPassword1',
        rules: [{
          required: true,
          message: "Please input confirm password",
          trigger: "blur"
        },{min: 6, message: "New password must be more than 6 chars!"}],
      }]
    }
  ],
}
