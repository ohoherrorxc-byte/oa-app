<template>
    <div class="content">
        <!-- <iframe src="https://oa-flow.soimt.cn:30157/oa/allDataHtml/indexData.html" width="100%" height="100%" frameborder="0"></iframe> -->
    </div>
</template>

<script>
export default {
    data(){
        return{

        }
    },
    mounted(){
        // window.open('http://localhost:1888/allDataHtml/indexData.html')  ;
        window.open('https://oa-flow.soimt.cn:30157/oa/allDataHtml/indexData.html')  ;
        // this.$router.push('/oa/homePage/index')
    }
}

</script >

<style lang="scss" scoped>
::v-deep ep.avue-view{
    margin: 0!important;
}
iframe {
    width: 100%;
  height: 100%;
  object-fit: contain; /* 保持比例，内容完整显示 */
  /* 或 */
  object-fit: cover;
//   width: 100%;
//   aspect-ratio: 16/9; /* 根据图表比例调整 */
}
.content{
    height: 100vh;
}
</style>
