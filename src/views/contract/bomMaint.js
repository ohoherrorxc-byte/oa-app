const bomListFn = (that) => {
    let arr = [
        {
            title: 'License',
            name: "License",
            canAdd: true,
            children: [
                {
                    formKey: "Navigation",
                    labelValue: "Map & Navigation:",
                    showBomType:['FULL',"LITE","NAV","ISA BASE","ISA PLUS","STANDARD","服务订阅"]
                }, {
                    formKey: "TTS",
                    labelValue: "VR&TTS:",
                    showBomType:['FULL',"LITE","NAV","STANDARD","服务订阅"]
                },
                {
                    formKey: "Weather",
                    labelValue: "Weather:",
                    showBomType:['FULL',"STANDARD","服务订阅"]
                },
                {
                    formKey: "Online",
                    labelValue: "Online Music:",
                    showBomType:['FULL',"STANDARD","服务订阅"]
                },
                {
                    formKey: "OTA",
                    labelValue: "OTA:",
                    showBomType:['FULL',"LITE","STANDARD","服务订阅"]
                },
                {
                    formKey: "appStore",
                    labelValue: "应用商店:",
                    showBomType:['FULL','PREMIUM',"STANDARD","服务订阅"]
                },
                {
                    formKey: "ECOLOGICAL_PACK",
                    labelValue: "生态扩展包:",
                    showBomType:['FULL','PREMIUM',"STANDARD","服务订阅"]
                },
            ]
        },
        {

            title: '移动端',
            name: "移动端",
            canAdd: true,
            children: [
                {
                    formKey: "APP",
                    labelValue: "手机APP:",
                    showBomType:['FULL',"LITE","CONNECT","STANDARD","服务订阅"]
                },
            ]
        },
        {

            title: '云平台',
            name: "云平台",
            canAdd: true,
            children: [
                {
                    formKey: "TSP",
                    labelValue: "TSP:",
                    showBomType:['FULL',"LITE","CONNECT","STANDARD","服务订阅"]
                },
            ]
        },
        {

            title: '运营商',
            name: "运营商",
            canAdd: true,
            children: [
                {
                    formKey: "operator",
                    labelValue: "流量:",
                    showBomType:['FULL','流量',"STANDARD","服务订阅"],
                    bomType:['hardware','other']
                },
            ]
        },
        {

            title: '分摊费用',
            name: "分摊费用",
            canAdd: true,
            children: [
                {
                    formKey: "terrace",
                    labelValue: "平台:",
                   showBomType:['FULL'],
                   showSomeType:['LITE','NAV','CONNECT',"STANDARD","服务订阅"]
                },
            ]
        },
        {
            title: '硬件',
            name: "硬件",
            canAdd: false,
            children: [
                {
                    formKey: "TBOX",
                    labelValue: "TBOX:",

                }, {
                    formKey: "host",
                    labelValue: "主机:",
                },
                {
                    formKey: "screen",
                    labelValue: "显示屏:",

                },
                {
                    formKey: "monitor",
                    labelValue: "屏幕供电模块:",

                },
                {
                    formKey: "robot",
                    labelValue: "机器人:",

                }
            ]
        },
        // {
        //     show: that.otherExpenses,
        //     title: '其他费用',
        //     name: "其他费用",
        //     canAdd: true,
        //     children: [
        //         {
        //             formKey: "APP",
        //             labelValue: "APP:",
        //         },
        //         {
        //             formKey: "terrace",
        //             labelValue: "平台:",
        //         },
        //         {
        //             formKey: "manual",
        //             labelValue: "手册:",
        //         },
        //         {
        //             formKey: "operator",
        //             labelValue: "运营商:",
        //         },
        //     ]
        // }
    ]
    return arr
}

export default bomListFn
