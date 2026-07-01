import website from "@/config/website";
import {uuid} from "vue-uuid";
import {getFileSuffix} from "@/util/util";
import store from '@/store'

export default {
  tabs: true,
  tabsActive: 1,
  labelWidth: 150,
  group: [
    {
      // label: 'User information',
      title:"User information",
      prop: 'info',
      column: [{
        label: 'Avatar',
        type: 'upload',
        listType: 'picture-img',
        propsHttp: {
          res: 'data',
          url: 'link',
        },
        canvasOption: {
          text: ' ',
          ratio: 0.1
        },
        action: '/api/oa-resource/oss/endpoint/put-file-attach-by-name',
        data: {
          fileName: '',
        },
        uploadBefore:(file, done, loading, column)=> {
          column.data.fileName = `${website.avatarPath}${uuid.v4()}.${getFileSuffix(file.name)}`;
          done();
        },
        //tip: '只能上传jpg/png用户头像，且不超过500kb',
        span: 12,
        row: true,
        prop: 'avatar'
      }, {
        label: 'Name',
        span: 12,
        row: true,
        prop: 'realName',
        rules: [{
          required: false,
          message: "Please input Name and Surname",
          trigger: "blur"
        },
          {
            pattern: /^.{1,30}$/,
            message: 'Wrong name format!'
          }],
      }, /*{
        label: '用户名',
        span: 12,
        row: true,
        prop: 'name'
      },*/ {
        label: 'Cell phone',
        span: 12,
        row: true,
        prop: 'phone',
        rules: store.state.userInfoIndex === 1 ? [] : [{
          required: true,
          message: "Please input Phone",
          trigger: "blur"
        },
          {
            pattern: /^[0-9]{5,15}$/,
            message: 'Wrong phone format!'
          }],
      }, {
        label: 'E-mail',
        prop: 'email',
        span: 12,
        row: true,
        rules: store.state.userInfoIndex === 1 ? [] : [{
          required: true,
          message: "Please input Email",
          trigger: "blur"
        },
          // {
          //   pattern: /^([a-zA-Z0-9._-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
          //   message: 'Wrong e-mail format!'
          // },
          {
            min: 3,
            max: 45
            // ,
            // message: 'Wrong e-mail format!'
          }],
      }]
    },
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
        rules: store.state.userInfoIndex === 0 ? [] : [{
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
        rules: store.state.userInfoIndex === 0 ? [] : [{
          required: true,
          message: "Please input new password",
          trigger: "blur"
        }, {
          pattern: /^(?=.*?[a-z|A-Z])(?=.*?\d)(?=.*?[~!#@$%^*&()_+{}\[\]|\\;:'",<.>\/?])[a-zA-Z\d~!#@$%^*&()_+{}\[\]|\\;:'",<.>\/?]*$/,
          message: 'password must contain numbers, letters, and special characters.'
        },{min: 6, message: "New password must be more than 6 chars!"}],
      }, {
        label: 'Confirm password',
        span: 12,
        row: true,
        type: 'password',
        prop: 'newPassword1',
        rules: store.state.userInfoIndex === 0 ? [] : [{
          required: true,
          message: "Please input confirm password",
          trigger: "blur"
        },{min: 6, message: "New password must be more than 6 chars!"}],
      }]
    }
  ],
}
