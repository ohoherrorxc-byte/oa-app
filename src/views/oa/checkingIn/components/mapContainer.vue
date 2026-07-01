
<template>
    <div>
        <div class="content">
            <div class="search-box">
                <div class="label">关键字搜索</div>
                <el-input v-model="input" placeholder="请输入内容" id="tipinput"></el-input>
            </div>
            <div ref="map" id="map-container"></div>
        </div>

    </div>
</template>
 
<script>
import AMapLoader from "@amap/amap-jsapi-loader";

window._AMapSecurityConfig = {
    // 设置安全密钥
    securityJsCode: "3b3fff5e830163c451ba8a1284459b32",
};

export default {
    props: {
        pointCenter: {
            type: Object,
            default: {
                longitude: 121.18158,
                latitude: 31.280245
            }
        }
    },
    data() {
        return {
            input: "",
            map: null,
            lnglat: [], //   [longitude,latitude]
            auto: null,
            placeSearch: null,
            markers: [],
            currentPoint: {},
            position: {}, //传给父组件的值【放经纬度和地址】
        };
    },

    mounted() {
        this.initMap();
    },
    beforeDestroy() {
        this.destroyMap();
    },
    deactivated() {
        this.destroyMap();
    },
    activated() {
        // 路由切回时若实例已销毁则重建
        if (this._destroyed && this.$refs.map) {
            this._destroyed = false;
            this.initMap();
        }
    },
    methods: {
        destroyMap() {
            try {
                if (this.map) {
                    this.map.off && this.map.off("click", this.clickMapHandler);
                    if (this.markers && this.markers.length) {
                        this.map.remove(this.markers);
                        this.markers = [];
                    }
                    this.map.destroy && this.map.destroy();
                    this.map = null;
                }
                if (this.auto) {
                    this.auto.off && this.auto.off("select", this.selectSite);
                    this.auto = null;
                }
                if (this.placeSearch) {
                    this.placeSearch.clear && this.placeSearch.clear();
                    this.placeSearch = null;
                }
                const el = document.getElementById("map-container");
                if (el) el.innerHTML = "";
                this._destroyed = true;
            } catch (e) {
                console.warn("[mapContainer] destroy error:", e);
            }
        },
        async initMap() {
            await this.$nextTick();
            console.log(this.$refs.map);
            AMapLoader.load({
                key: "6d27603d6b175f4cc63553dfb4d5ae34", // 申请好的Web端开发者Key，首次调用 load 时必填
                version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugins: ["AMap.AutoComplete", "AMap.PlaceSearch", "AMap.Geocoder"],
            })
                .then((AMap) => {
                    console.log(AMap);
                    let longitudeCenter = this.pointCenter.longitude || 121.18158
                    let latitudeCenter = this.pointCenter.latitude || 31.280245
                    this.map = new AMap.Map("map-container", {
                        // 设置地图容器id
                        viewMode: "3D", //  是否为3D地图模式
                        zoom: 18, // 初始化地图级别
                        center: [longitudeCenter, latitudeCenter], //中心点坐标
                        resizeEnable: true,
                    });
                    // 关键字查询
                    this.searchMap();
                    this.setMarker([longitudeCenter, latitudeCenter]);
                    // 监听鼠标点击事件
                    this.map.on("click", this.clickMapHandler);

                })
                .catch((e) => {
                    console.log(e);
                });
        },
        // 点击地图事件获取经纬度，并添加标记
        clickMapHandler(e) {
            this.lnglat = [e.lnglat.getLng(), e.lnglat.getLat()];
            this.setMarker(this.lnglat);
            console.log(e, "点击地图", this.lnglat);
            // 点击地图上的位置，根据经纬度转换成详细地址
            let geocoder = new AMap.Geocoder({});
            let that = this;
            geocoder.getAddress(this.lnglat, function (status, result) {
                console.log(status, result);
                if (status === "complete" && result.regeocode) {
                    console.log(result.regeocode);
                    that.address = result.regeocode.formattedAddress;
                    that.$emit('getPoint', that.lnglat, that.address)
                } else {
                    console.log("查询地址失败，请稍后再试");
                }
            });
            this.position = {
                longitude: e.lnglat.getLng(),
                latitude: e.lnglat.getLat(),
                address: that.address,
            };
            this.input = that.address //把查询到的地址赋值到输入框
        },
        // 关键字查询
        searchMap() {
            // 搜索框自动完成类
            this.auto = new AMap.AutoComplete({
                input: "tipinput", // 使用联想输入的input的id
            });
            //构造地点查询类
            this.placeSearch = new AMap.PlaceSearch({
                map: this.map,
            });
            // 当选中某条搜索记录时触发
            this.auto.on("select", this.selectSite);
            console.log(this.selectSite, "select");
        },
        //当选中某条搜索记录时触发
        selectSite(e) {
            if (e.poi.location) {
                console.log("经纬度", e);
                this.lnglat = [e.poi.location.lng, e.poi.location.lat];
                this.placeSearch.setCity(e.poi.adcode);
                this.placeSearch.search(e.poi.name); //关键字查询
                let geocoder = new AMap.Geocoder({});
                let that = this;
                geocoder.getAddress(this.lnglat, function (status, result) {
                    if (status === "complete" && result.regeocode) {
                        that.province = result.regeocode.addressComponent.province;
                        that.city = result.regeocode.addressComponent.city;
                        //自己想要赋的值，根据自己的做修改
                        that.$set(that.form, "province", that.province);
                        that.$set(that.form, "city", that.city);
                        that.$set(that.form, "address", e.poi.name);
                        that.$set(
                            that.form,
                            "coordinate",
                            e.poi.location.lng + "," + e.poi.location.lat
                        ); //纬度，经度
                        console.log(that.form, "地址");
                    } else {
                        console.log("查询地址失败，请稍后再试");
                    }
                });
            } else {
                this.$message.error("查询地址失败，请重新输入地址");
            }
        },
        //  添加标记
        setMarker(lnglat) {
            this.removeMarker();
            let marker = new AMap.Marker({
                position: lnglat,
            });
            marker.setMap(this.map);
            this.markers.push(marker);
            console.log(this.markers)
        },
        // 删除之前后的标记点
        removeMarker() {
            if (this.markers) {
                this.map.remove(this.markers);
            }
        },
    },
};
</script>
 
<style lang="scss">
.search-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    height: 50px;

    .label {
        width: 100px;
    }
}

.content {
    position: relative;
}

#panel {
    position: absolute;
    top: 50px;
    right: 20px;
}

#map-container {
    overflow: hidden;
    width: 100%;
    height: 500px;
    margin: 0;
}

.amap-sug-result {
    z-index: 2999 !important;
}
</style>
