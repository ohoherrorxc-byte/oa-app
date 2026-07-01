<template>
    <fullscreen ref="fullScreenRef" class="fullscreenL" v-model:fullscreen="isFullscreen" @click="toggleFullScreen">
        <div class="fillcontain">
            <div class="exitFull" @click="ExitFull"><i class="el-icon-arrow-left"></i>
                返回</div>
            <el-carousel ref='carousel' :autoplay="false"  @change="handleChange" style="height: 100vh;">
                <el-carousel-item v-for="(item,index) in list" :key="item.id" style="height: 100vh;">
                    <div class="img-style">
                        <!-- <video-player v-if="item.type === 1" class="video-player vjs-custom-skin" style="width: 100%"
                            ref="videoPlayer" :playsinline="true" :options="playerOptions"
                            :x5-video-player-fullscreen="true" @play="onPlayerPlay($event)" @ended="onPlayerEnded($event)"
                            @loadeddata="onPlayerLoadeddata($event)">
                        </video-player> -->
                        <img :src="item.url" alt="" class="img-inner" />
                    </div>
                </el-carousel-item>
            </el-carousel>
        </div>
    </fullscreen>
</template>

<script>

export default {
    data() {
        return {
            isFullscreen: false,
            currentInterval: 8000,
            duration: 2000,
            autoPlayTimer: null,
            isOpen: false,
            playerOptions: {
                playbackRates: [0.7, 1.0, 1.5, 2.0], //播放速度
                autoplay: true, //如果true,浏览器准备好时开始回放。
                muted: false, // 默认情况下将会消除任何音频。
                loop: false, // 导致视频一结束就重新开始。
                preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
                language: 'zh-CN',
                aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
                fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
                controlBar: {
                    timeDivider: true,
                    durationDisplay: true,
                    remainingTimeDisplay: false,
                    // fullscreenToggle: true  //全屏按钮
                },
                sources: [],
                type: 'video'
            },
            list: []
        }
    },
    props: {
        albumList: {
            type: Array,
            default: []
        }
    },
    watch: {
        albumList: {
            handler(newValue, oldValue) {
                this.list = newValue
                this.playerOptions.sources = []
                newValue.map(ele => {
                    if (ele.type === 1) {
                        this.playerOptions.sources.push({
                            autoplay: true,
                            type: "video/mp4",
                            src: ele.url
                        })
                    }
                })
            },
            deep: true
        }
    },
    async mounted() {
        this.addFullscreenChangeListener()
        await this.handleVedio(0)
        this.startAutoPlay()
    },
    beforeDestroy() {
        this.stopAutoPlay();
    },
    methods: {
        addFullscreenChangeListener() {
            document.addEventListener('fullscreenchange', this.handleFullscreenChange)
        },
        toggle() {
            this.isFullscreen = !this.isFullscreen
        },
        ExitFull(){
            this.isFullscreen = false
            this.$emit('hideSwiper')
        },
        handleFullscreenChange() {
            this.isOpen = !this.isOpen
            if (!this.isOpen) {
                this.$emit('hideSwiper')
            }

        },
        startAutoPlay(index) {
            this.autoPlayTimer = setInterval(() => {
                // 切换到下一个轮播项
                // 例如，使用 el-carousel 的 ref 属性和 next() 方法切换到下一个轮播项
                this.$refs.carousel.next();
            }, this.currentInterval);
        },
        stopAutoPlay() {
            clearInterval(this.autoPlayTimer);
        },
        handleVedio(index) {
            if (this.list.length === 0) return
            if (this.list[index].type === 1) {
                this.playerOptions["sources"][0]["src"] = this.list[index].url; //把获取来的视频赋值给sources的src
                this.$refs.videoPlayer[0].player.src(
                    this.playerOptions["sources"][0]["src"]
                ); // 重置进度条,再次轮播时让视频重新播放
                this.currentInterval = this.duration * 1000;
            } else {
                this.currentInterval = 8000
            }
        },
        async handleChange(index) {
            await this.handleVedio(index)
            this.stopAutoPlay();
            this.startAutoPlay(index);
        },
        onPlayerEnded(player) {
            //视频播放停止时候触发的事件
            this.currentInterval = 8000;
        },
        onPlayerLoadeddata(player) {
            this.duration = player.cache_.duration;
        },
        onPlayerPlay(player) {
        },
    }

}
</script>

<style lang="scss">
.explain_text {
    margin-top: 20px;
    text-align: center;
    font-size: 20px;
    color: #333;
}

.img-style {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.img-inner {
    min-width: 100%;
    max-height: 100%;
    object-fit: contain;
}
.exitFull{
    position: absolute;
    padding: 20px;
    color: transparent;
    z-index: 1000;
}
.exitFull:hover{
    color: #fff;
}
.fillcontain {
    background-color: black;
    z-index: 999999;
    position: fixed !important;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
}

.fullscreenL {
    background-color: black;
    z-index: 999999;
    position: fixed !important;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    height: 100vh;
    width: 100vw;
}
</style>
