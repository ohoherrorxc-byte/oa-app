<template>
    <div>
      <canvas ref="qrcodeCanvas" :id='text'></canvas>
    </div>
  </template>
   
  <script>
  import QRCode from 'qrcode'
   
  export default {
    name: 'QrCodeComponent',
    props: {
      text: {
        type: String,
        required: true
      },
      height:{
        type:Number,
        default:132
      },
      width:{
        type:Number,
        default:132
      }
    },
    mounted() {
      this.generateQRCode()
    },
    methods: {
      generateQRCode() {
        const canvas = this.$refs.qrcodeCanvas
        console.log(canvas)
        console.log('eeeeeee')
        QRCode.toCanvas(canvas, this.text,{height:this.height,width:this.width}, error => {
          if (error) console.error(error)
        })
      }
    }
  }
  </script>