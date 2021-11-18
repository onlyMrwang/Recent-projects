<template>
    <div class="ditu">
        <!--<button @click="btnClick">删除</button>-->
        <!--<div id="allmap" :style="{width:widths, height:heights}"></div>-->
        <div id="allmap" :style="{ width: widthss, height: heightss }"></div>
    </div>
</template>

<script>
    import pileDetail from "./pileDetail";//桩详情
    import networkDetail from "./networkDetail";//网点详情
    import vehicleDetails from "./carDetails/vehicleDetails";
    import catDetails from "./carDetails";//车详情
    import Vue from "vue/dist/vue.js";
    import bus from "@/utils/bus";
    import {getCarInfo,getPileDetails,getProfileInfo,getStyleJson} from '@/api/monitoring/comsupervision.js'
    // 构建一个父组件
    var todoWarp = Vue.extend({
        props: ["username", "types"],
        template: `
            <div>
                <pileDetail :mapsId='username' v-if="types==2"></pileDetail>
                <networkDetail :mapsId='username' v-if="types==1"></networkDetail>
                <catDetails :mapsId='username' v-if="types==3"></catDetails>
            </div>
        `,
        //局部注册子组件
        components: {
            pileDetail,
            networkDetail,
            catDetails
        },
        methods: {},
        created(){
        }
    });
    //地图组件---按需引入
    export default {
        data() {
            return {
                indexNum:1,
                mapsLong: {lng: 113.22786798538483, lat: 28.196780087140837},
                newTreeDate: {},
                maps: {},
                pileInfoWindow: {},//桩弹出框对象
                pointInfoWindow: {},//网点弹出框对象
                carInfoWindow: {},//车辆弹出框对象
                mapsType: 1,
                dataTypes:1,
                carAngle:[],
                mapsObj:{
                    pileArray:[],//桩得数组
                    networkArray:[],//网点数组
                    carArray:[],//车辆数组
                    carAngle:[],//车辆角度单独存
                },

                loading:{},
            };
        },
        mounted() {},
        //接收父组件传来的值
        props: {
            carTreeData:{
                //接收树的参数渲染地图
                // type: Object,
                // required: false,
            },
            treeData: {
                //接收树的参数渲染地图
                // type: Object,
                required: false,
            },
            widthss: {
                // type:String,
                required: false,
            },
            heightss: {
                // type:String,
                required: false,
            },
            pileBox: {
                type: Array,
                required: false,
            }
        },
        //监听父组件给的值
        watch: {
            // 车辆数据监听
            carTreeData:{
                handler(newName, oldName) {
                    this.carTreeData = newName;
                    this.clearArr(3)
                    this.clearArr(4)
                    setTimeout(()=>{
                        this.carRendering();
                    },10)
                },
                deep: true,
            },
            // 网点 桩数据监听
            treeData: {
                handler(newName, oldName) {
                    this.newTreeDate = newName;
                    if(this.dataTypes==1){
                        console.log( this.newTreeDate );
                        this.loadingMaps(this.newTreeDate.devices);
                        this.dataTypes=2
                    }else {
                        this.clearArr(1)
                        this.clearArr(2)
                        this.networkFun();
                    }
                },
                immediate: true,
            },
            widthss: {
                handler(newName, oldName) {
                    this.widthss = newName;
                },
                immediate: true,
            },
            heightss: {
                handler(newName, oldName) {
                    this.heightss = newName;
                },
                immediate: true,
            },
            pileBox: {
                handler(newName, oldName) {
                    this.pileBox = newName;
                },
                immediate: true,
            },
        },
        methods: {
            //画三个框
            newInfoWindow(){
                //桩弹出框大小
                this.pileInfoWindow = new BMapGL.InfoWindow('<div id="fms"></div>', {
                    width: 500, // 信息窗口宽度
                    height: 210, // 信息窗口高度
                    offset: new BMapGL.Size(245, 145),
                });
                //网点弹出框大小
                this.pointInfoWindow = new BMapGL.InfoWindow('<div id="fms"></div>', {
                    width: 320, // 信息窗口宽度
                    height: 225, // 信息窗口高度
                    offset: new BMapGL.Size(160, 160),
                });
                //车辆弹出框大小
                this.carInfoWindow= new BMapGL.InfoWindow('<div id="fms"></div>', {
                    width: 450, // 信息窗口宽度
                    height: 210, // 信息窗口高度
                    offset: new BMapGL.Size(215, 154),
                });
            },
            //控制地图的3D视角
            upDateMapsPerspective(){
                //设置地图旋转角度
                this.maps.setHeading(90);
                //设置地图俯视角度
                this.maps.setTilt(60);
            },
            // 地图初始化创建
            loadingMaps(data) {
                this.maps = new BMapGL.Map("allmap",{minZoom:16,maxZoom:21}); // 创建Map实例
                this.maps.addControl(new BMapGL.NavigationControl3D());
                this.maps.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放
                this.networkFun();//调用网点渲染方法
                this.newInfoWindow()
                this.maps.setDisplayOptions({
                    poiIcon: false,//去掉多余的图标
                        poiText:true//是否去掉地图上的文字
                })
                let mapsTodu= JSON.parse(this.newTreeDate.mapsTodu);
                // this.maps.centerAndZoom(new BMapGL.Point(data[0].longitude, data[0].latitude),18); // 初始化地图,设置中心点坐标和地图级别
                this.maps.centerAndZoom(new BMapGL.Point(mapsTodu.longitude,mapsTodu.latitude),18); // 初始化地图,设置中心点坐标和地图级别

                // //创建地图鼠标滚动监听
                this.maps.addEventListener("zoomend",(event) => {
                    var zoom=this.maps.getZoom()//获取当前地图缩放等级
                    console.log(zoom);
                    if(zoom<=17){
                        // 加 mapsType判断  防止鼠标滚动的重复调用渲染方法
                        if(this.mapsType==2){
                            this.clearArr(2)//清楚渲染的网点信息 传2
                            this.clearArr(1)//清楚渲染的网点信息 传2
                            this.networkFun(1,2);//调用网点方法
                            this.mapsType=1
                        }
                    }else if(zoom>=19){
                        if(this.mapsType==1){
                            this.clearArr(1)//清楚渲染的桩信息 传1
                            this.clearArr(2)//清楚渲染的桩信息 传1
                            this.mapsType=2
                            this.pileRendering();//调用桩渲染方法
                        }
                    }
                })
                document.getElementsByClassName('anchorTR')[0].getElementsByTagName('button')[0].addEventListener('click',()=>{
                   //点击左侧旋转
                    this.upDatecarAngle(this.maps.getHeading()-180)
                })
                document.getElementsByClassName('anchorTR')[0].getElementsByTagName('button')[1].addEventListener('click',()=>{
                    //点击中间
                    this.upDatecarAngle(-90)
                })
                document.getElementsByClassName('anchorTR')[0].getElementsByTagName('button')[2].addEventListener('click',()=>{
                    //点击右侧旋转
                    this.upDatecarAngle(this.maps.getHeading())
                })

            },
            upDatecarAngle(val){
                this.clearArr(4)//清楚车辆角度4
                console.log(val);
                this.indexNum+=1;
                // this.carAngle=[];
                this.carTreeData.forEach((e, i) => {
                    let pointNumber
                    pointNumber = this.mpsWgs84(e.longitude, e.latitude)
                    //carTreeData里边有一级数据 加判断排除调用车辆渲染fun
                    if(!e.carInfos && !e.oriChild){
                        //画车辆方向
                        let carMarkers;
                        // 判断车辆在不在线 carStatus 1为在线
                        if(Number(e.carStatus)==1&&Number(e.stopStatus)==1){
                            let  imgRequire= require('../../../assets/monitoring/carDirection/fangxiang90-s.png');
                            carMarkers = new BMapGL.Marker(pointNumber, {
                                icon: new BMapGL.Icon(
                                    imgRequire,
                                    new BMapGL.Size(30,30)
                                )
                            });
                            let direction=0;
                            if((e.direction==''||e.direction==null?0:e.direction)+val+90>360){
                                direction=(e.direction==''||e.direction==null?0:e.direction)+val+90-360;
                            }else{
                                direction=(e.direction==''||e.direction==null?0:e.direction)+val+90;
                            }
                            carMarkers.setRotation(direction);
                        }
                        else{
                            carMarkers = new BMapGL.Marker(pointNumber, {
                                icon: new BMapGL.Icon(
                                    require('../../../assets/monitoring/carDirection/fangxiang-p-s.png'),
                                    new BMapGL.Size(30,30)
                                )
                            });
                        }
                        if(Number(e.carStatus)==1&&Number(e.stopStatus)!=2){
                            this.maps.addOverlay(carMarkers); // 将标注添加到地图中
                            carMarkers.mapsid='carDirection'+this.indexNum+e.plateNo
                            this.mapsObj.carAngle.push( carMarkers.mapsid)
                        }
                    }
                })
                // setTimeout(()=>{
                //     this.clearArr(4)//清楚车辆角度4
                // },1000)

            },
            //打开桩弹出框
            openInfoWindows(val) {
                this.maps.setZoom(19);
                setTimeout(()=>{
                    //调用AJAX 获取桩详情
                    this.getPileDetails(val,this.pileInfoWindow,1)
                    //mapsType 判断上次点击选中的是网点
                    //mapsType 网点  重新选中桩信息
                    if (this.mapsType == 1) {
                        this.clearArr(1);
                        this.pileRendering();
                        this.mapsType=2;
                    }
                },1000)

            },
            //桩数据处理
            pileRendering() {
                //全局存一个值 循环做递增
                let pileNumber=0;
                this.newTreeDate.devices.forEach((a, b) => {
                    // // 绘制网点的面积
                    let maxPoint = this.mpsGCJ(a.areaMaxLongitude, a.areaMaxLatitude);
                    let minPoint = this.mpsGCJ(a.areaMinLongitude, a.areaMinLatitude);
                    var polygon = new BMapGL.Polygon(
                        [
                            new BMapGL.Point(maxPoint.lng,maxPoint.lat),
                            new BMapGL.Point(maxPoint.lng,minPoint.lat),
                            new BMapGL.Point(minPoint.lng,minPoint.lat),
                            new BMapGL.Point(minPoint.lng,maxPoint.lat),

                        ],
                        {
                            fillColor: "#41b8c3",
                            strokeColor: "#41b8c3",
                            strokeWeight: 2,
                            strokeOpacity: 0.5,
                        }
                    );
                    // 区域取值以及加标识 后边清楚用到
                    polygon.siteNo = a.siteNo;
                    polygon.mapsid = "polygon"+b;
                    this.mapsObj.pileArray.push(polygon.mapsid);
                    this.maps.addOverlay(polygon);
                    //地图桩区域点击事件
                    polygon.addEventListener("click", function(e) {
                        //鼠标移动监听事件
                        let val = {};
                        val.siteNo = e.target.siteNo;
                        val.type = 5;
                        bus.$emit("clickOpen", val);
                    });
                    //循环画桩
                    a.details.forEach((e, i) => {
                        // 创建point, 将x,y值传入
                        let pointNumber =  this.mpsGCJ(e.longitude, e.latitude)
                        // 将data中的name加入地图中
                        let label = new BMapGL.Label(e.gunCount, {
                            offset: new BMapGL.Size(0, -17),
                        });
                        label.setStyle({
                            color: "#000",
                            border: "0px",
                            // backgroundColor: "0.000000000001", //通过这个方法，去掉背景色
                            fontSize: "14px",
                            fontWeight: "500",
                            height: "10px",
                            lineHeight: "10px",
                            transform:'translateX(-50%)',
                            borderRadius:'50%',
                        });
                        pileNumber+=1
                        let pileInfoWindow= this.pileInfoWindow;
                        //循环调用画桩方法
                        this.pileFun(pointNumber, pileInfoWindow, label, e,e.poleNo);
                    });
                });
            },
            // 桩渲染
            pileFun(points, infoWindows, label, datas,i) {
                let myIcon;
                //判断桩是不是在线  1为在线 0为离线
                if (datas.terminalStatus == "1") {
                    myIcon = new BMapGL.Icon(
                        require("@/assets/monitoring/dian/mark-green.png"),
                        new BMapGL.Size(30, 55)
                    );
                } else {
                    myIcon = new BMapGL.Icon(
                        require("@/assets/monitoring/dian/mark-gray.png"),
                        new BMapGL.Size(30, 55)
                    );
                }
                // 创建桩图标
                let markers = new BMapGL.Marker(points, {
                    icon: myIcon,
                });
                //判断终端有么有告警 alarmCount 大于 0为有告警
                if (datas.alarmCount > 0) {
                    let myIcons = new BMapGL.Icon(
                        require("@/assets/monitoring/dian/wht-chat1.png"),
                        new BMapGL.Size(30, 33)
                    );
                    let markerss = new BMapGL.Marker(points, {
                        icon: myIcons,
                        offset: new BMapGL.Size(0, -40),
                    });
                    this.maps.addOverlay(markerss);
                    markerss.mapsid='pileAlar'+i
                    this.mapsObj.pileArray.push( markerss.mapsid);
                    //告警图片点击事件
                    markerss.addEventListener(
                        "click",
                        (event) => {
                            datas.type=9
                            bus.$emit('clickOpen', datas);
                            //阻止冒泡事件
                            event.domEvent.stopPropagation();
                        }
                    )
                }
                markers.datas = datas;
                this.maps.addOverlay(markers); // 将标注添加到地图中
                markers.setLabel(label); // 将data中的name添加到地图中
                markers.mapsid='pile'+i
                this.mapsObj.pileArray.push(markers.mapsid);
                // 终端标注的点击事件
                markers.addEventListener(
                    "click",
                    (event) => {
                        this.getPileDetails(event.currentTarget.datas,infoWindows)
                        //阻止冒泡事件
                        event.domEvent.stopPropagation();
                    });
            },
            //网点渲染
            networkRendering(val) {
                this.maps.setZoom(17);
                setTimeout(()=>{
                    //调用网点详情
                    this.getProfileInfo(val,this.pointInfoWindow)
                    //mapsType 判断网点用不用重新渲染
                    if (this.mapsType == 2) {
                        this.mapsType = 1;
                        this.clearArr(2);
                        this.networkFun(1);
                    }
                },1000)

            },
            //网点渲染
            networkFun(val,type) {
                //首次加载取第一个桩为中心点
                if(type==undefined){
                    if (val == undefined) {
                        let mapsTodu= JSON.parse(this.newTreeDate.mapsTodu);
                        // this.maps.centerAndZoom(new BMapGL.Point(data[0].longitude, data[0].latitude),18); // 初始化地图,设置中心点坐标和地图级别
                        this.maps.centerAndZoom(new BMapGL.Point(mapsTodu.longitude,mapsTodu.latitude),18); // 初始化地图,设置中心点坐标和地图级别

                    }
                    this.upDateMapsPerspective()//修改地图3D视角
                }
                this.newTreeDate.devices.forEach((a, b) => {
                    let pointNumber =  this.mpsGCJ(a.longitude, a.latitude)
                    // 通过deviceAlarmSum 判断有么有告警 大于0 为有告警
                    if (a.deviceAlarmSum > 0) {
                        let myIcons = new BMapGL.Icon(
                            require("@/assets/monitoring/dian/wht-chat1.png"),
                            new BMapGL.Size(30, 33)
                        );
                        let markerss = new BMapGL.Marker(pointNumber, {
                            icon: myIcons,
                            offset: new BMapGL.Size(0, -40),
                        });
                        markerss.mapsid='deviceAlarmSum'+b
                        this.maps.addOverlay(markerss);
                        this.mapsObj.networkArray.push( markerss.mapsid)
                        //告警图标的点击事件
                        markerss.addEventListener(
                            "click",
                            (event) => {
                                a.type=9
                                bus.$emit('clickOpen', a);
                            }
                        )
                    }
                    let myIcon = new BMapGL.Icon(
                        require("../../../assets/monitoring/dian/map-chat.png"),
                        new BMapGL.Size(45, 53)
                    );
                    let markers = new BMapGL.Marker(pointNumber, {
                        icon: myIcon,
                    });
                    // 将data中的name加入地图中
                    let label = new BMapGL.Label(a.deviceCount, {
                        offset: new BMapGL.Size(0, -15),
                    });
                    label.setStyle({
                        color: "#000",
                        border: "0px",
                        // backgroundColor: "0.000000000001", //通过这个方法，去掉背景色
                        fontSize: "14px",
                        fontWeight: "500",
                        height: "10px",
                        lineHeight: "10px",
                        transform:'translateX(-50%)',
                        borderRadius:'50%',
                    });
                    markers.setLabel(label);
                    markers.datas = a;
                    markers.mapsid ='network'+b;
                    this.mapsObj.networkArray.push(markers.mapsid)
                    this.maps.addOverlay(markers); // 将标注添加到地图中
                    let pointInfoWindow=this.pointInfoWindow;
                    markers.addEventListener(
                        "click",
                        (event) => {
                            this.getProfileInfo(event.currentTarget.datas,pointInfoWindow)
                        },
                    );
                });
            },
            //打开车辆弹出框
            openCarInfoWindows(val){
                if(val) {
                   //通过carEnergyType 判断能源车 还是燃油车 调用不通的AJAX 获取详情
                    if(val.carEnergyType==1){
                        //能源车
                        this.getCarInfo(val,'monitor/car/vevcar/info',this.carInfoWindow)
                    }else{
                        //燃油车
                        this.getCarInfo(val,'monitor/car/fuelcar/info',this.carInfoWindow)
                    } 
                }
                
            },
            //地图上画车辆得接口
            carRendering() {
                this.carTreeData.forEach((e, i) => {
                    //carTreeData里边有一级数据 加判断排除调用车辆渲染fun
                    if(!e.carInfos && !e.oriChild){
                        this.carGetList(e,i);
                    }
                })

            },
            carGetList(e,i){
                let pointNumber
                if(e.longitude&&e.latitude){
                    pointNumber = this.mpsWgs84(e.longitude, e.latitude)
                }else{
                    pointNumber= new BMapGL.Point(this.mapsLong.lng, this.mapsLong.lat)
                }
                //绘制告警同时电池不能缺电
                if (e.alarmCount > 0 && e.batteryStatus != 1) {
                    let myIcons = new BMapGL.Icon(
                        require("@/assets/monitoring/dian/wht-chat1.png"),
                        new BMapGL.Size(30, 33)
                    );
                    let markerss = new BMapGL.Marker(pointNumber, {
                        icon: myIcons,
                        offset: new BMapGL.Size(-25, -30),
                    });
                    this.maps.addOverlay(markerss);
                    markerss.mapsid = 'alarm' + i
                    this.mapsObj.carArray.push(markerss.mapsid);
                    markerss.addEventListener(
                        "click",
                        (event) => {
                            e.carInfoName = '车辆告警详情'
                            e.type = 9
                            bus.$emit('clickOpen', e);
                        }
                    )
                }
                //绘制电池缺电
                if (e.batteryStatus == 1) {
                    let myIcon = new BMapGL.Icon(
                        require("@/assets/monitoring/dian/wht-chat2.png"),
                        new BMapGL.Size(30, 33)
                    );
                    let markers = new BMapGL.Marker(pointNumber, {
                        icon: myIcon,
                        offset: new BMapGL.Size(0, -22),
                    });
                    this.maps.addOverlay(markers);
                    markers.mapsid = 'battery' + i
                    this.mapsObj.carArray.push(markers.mapsid);
                }
                this.carFun(e, pointNumber);
            },
            //画车辆方法
            carFun(e,pointNumber) {
                let imgUrl="";
                let markers
                //判断车辆类型
                if(e.carType1==1){ //1 乘用车 2 客车 3特种车
                    imgUrl=this.carTypeFun(e,'cyc')
                    let myIconImg=new BMapGL.Icon(
                        imgUrl,
                        new BMapGL.Size(33,17)
                    );
                    markers = new BMapGL.Marker(pointNumber, {
                        icon: myIconImg,
                        offset: new BMapGL.Size(-25,0),
                    });
                }else if(e.carType1==2){
                    imgUrl=this.carTypeFun(e,'keche')
                    let myIconImg=new BMapGL.Icon(
                        imgUrl,
                        new BMapGL.Size(53,19),
                    );
                    markers = new BMapGL.Marker(pointNumber, {
                        icon: myIconImg,
                        offset: new BMapGL.Size(-35,0),
                    });
                }else{
                    imgUrl=this.carTypeFun(e,'qyc')
                    let myIconImg=new BMapGL.Icon(
                        imgUrl,
                        new BMapGL.Size(33,17)
                    );
                    markers = new BMapGL.Marker(pointNumber, {
                        icon: myIconImg,
                        offset: new BMapGL.Size(-25,0),
                    });
                }
                //画车辆方向
                let carMarkers;
                // 判断车辆在不在线 carStatus 1为在线
                if(Number(e.carStatus)==1){
                    let imgRequire;
                    //stopStatus 判断在线车辆 行驶还是停止 1为行驶 其他都为 停止
                    if(e.stopStatus==1){
                        imgRequire= require('../../../assets/monitoring/carDirection/fangxiang90-s.png');
                    }else{
                        imgRequire= require('../../../assets/monitoring/carDirection/fangxiang-p-s.png');
                    }
                    carMarkers = new BMapGL.Marker(pointNumber, {
                        icon: new BMapGL.Icon(
                            imgRequire,
                            new BMapGL.Size(30,30)
                        )
                    });
                    //判断图标加不加旋转 行驶车辆在原有的角度加90度 (地图顺时针旋转啦90度)
                    if(e.stopStatus==1){
                        // let direction=0;
                        // if(e.direction+90>=360){
                        //     direction= e.direction+90-360;
                        // }else{
                        //     direction=e.direction+90
                        // }
                        // carMarkers.setRotation(direction)
                        let direction=0;
                        if((e.direction==''||e.direction==null?0:e.direction)+this.maps.getHeading()>360){
                            direction=(e.direction==''||e.direction==null?0:e.direction)+this.maps.getHeading()-360;
                        }else{
                            direction=(e.direction==''||e.direction==null?0:e.direction)+this.maps.getHeading();
                        }
                        carMarkers.setRotation(direction);
                    }

                }else{
                    carMarkers = new BMapGL.Marker(pointNumber, {
                        icon: new BMapGL.Icon(
                            require('../../../assets/monitoring/carDirection/fangxiang-p-s.png'),
                            new BMapGL.Size(30,30)
                        )
                    });
                }
                markers.mapsid='car'+e.plateNo
                carMarkers.mapsid='carDirection'+e.plateNo
                this.maps.addOverlay(markers); // 将标注添加到地图中
                this.maps.addOverlay(carMarkers); // 将标注添加到地图中
                this.mapsObj.carArray.push( markers.mapsid)
                // console.log(e.stopStatus);
                if(e.stopStatus==1){
                    this.mapsObj.carAngle.push( carMarkers.mapsid)
                } else {
                    // 停车标志的ico存入车辆列表中
                    this.mapsObj.carArray.push( carMarkers.mapsid)
                }
                markers.datas=e;
                let infoWindows=new BMapGL.InfoWindow('<div id="fms"></div>', {
                    width: 500, // 信息窗口宽度
                    height: 210, // 信息窗口高度
                    offset: new BMapGL.Size(240, 154),
                });
                markers.addEventListener(
                    "click",
                    (event) => {
                        let carInfoWindow= this.carInfoWindow
                        if(event.currentTarget.datas.carEnergyType==1){
                            //能源车
                            this.getCarInfo(event.currentTarget.datas,'monitor/car/vevcar/info',carInfoWindow)
                        }else{
                            //燃油车
                            this.getCarInfo(event.currentTarget.datas,'monitor/car/fuelcar/info',carInfoWindow)
                        }
                    },
                );
            },
            // 根据逻辑返回不同的图片地址
            carTypeFun(e,type){
                let imgUrl=''
                // carStatus 判断车辆在不在线 1 在线
                if(e.carStatus==1){
                    // carEnergyType 判断是燃油车还是能源车 2能源车
                    if(e.carEnergyType==2){
                        imgUrl=require('../../../assets/monitoring/car/'+type+'-green.png')
                    }else{
                        imgUrl=require('../../../assets/monitoring/car/'+type+'-org.png')
                    }
                }else{
                    imgUrl=require('../../../assets/monitoring/car/'+type+'-gray.png')
                }
                return imgUrl
            },
            //通过ID 删除对应的点图标
            clearArr(type) {
                // type=1 网点, type=2, 桩 type=3 车辆 type=4 单独清理车辆方向
                let mapsDate = this.maps.getOverlays();
                // if(type==1||type==2){
                if(type!=4){
                    this.clerrInfowindow()
                }
                // if(type==3){
                //     this.carAngle=[];
                // }
                if(type==1&&this.mapsObj.networkArray.length>0){//清楚网点的方法
                    for (var i = 0; i < this.mapsObj.networkArray.length; i++) {
                        let  org=this.mapsObj.networkArray[i]
                        for(var z=0;z<mapsDate.length;z++){
                            if(org==mapsDate[z].mapsid){
                                this.maps.removeOverlay(mapsDate[z]);
                            }
                        }
                    }
                    this.mapsObj.networkArray=[];
                }
                if(type==2&&this.mapsObj.pileArray.length>0){//清楚桩的方法
                    for (var i = 0;i<this.mapsObj.pileArray.length;i++) {
                        let  org=this.mapsObj.pileArray[i]
                        for(var z=0;z<mapsDate.length;z++){
                            if(org==mapsDate[z].mapsid){
                                this.maps.removeOverlay(mapsDate[z]);
                            }
                        }
                    }
                    this.mapsObj.networkArray=[];
                }
                if(type==3&&this.mapsObj.carArray.length>0){//清楚车辆的方法
                    for (var i = 0;i<this.mapsObj.carArray.length;i++) {
                        let  org=this.mapsObj.carArray[i]
                        for(var z=0;z<mapsDate.length;z++){
                            if(org==mapsDate[z].mapsid){
                                this.maps.removeOverlay(mapsDate[z]);
                            }
                        }
                    }
                    this.mapsObj.carArray=[];
                    // this.mapsObj.carPIco.map(org => {
                    //     const index = mapsDate.findIndex(item=>{return item.mapsid === org})
                    //     if(~index){
                    //         this.maps.removeOverlay(mapsDate[index]);
                    //     }
                    // })
                }
                if(type==4&&this.mapsObj.carAngle.length>0){//清楚车辆的方法
                    for (var i = 0;i<this.mapsObj.carAngle.length;i++) {
                        let  org=this.mapsObj.carAngle[i]
                        for(var z=0;z<mapsDate.length;z++){
                            if(org==mapsDate[z].mapsid){
                                this.maps.removeOverlay(mapsDate[z]);
                            }
                        }
                    }
                    // this.mapsObj.carAngle=this.carAngle;
                    this.mapsObj.carAngle=[];
                }
            },
            clerrInfowindow(){
                let mapsDate = this.maps.getOverlays();
                for(var i=0;i<mapsDate.length;i++){
                    if(mapsDate[i].infoWindow){
                        this.maps.removeOverlay(mapsDate[i]);
                    }
                }
            },
            //获取百度地图两个对角得精度维度
            getBounds() {
                this.maps.getBounds();
            },
            mapsClick(val){
                //切换到对应的点
                this.maps.panTo(new BMapGL.Point(val.longitude, val.latitude))
            },
            //轨迹运行路线
            mapsAnimation(){
                let trackAni;
                var path = [{
                    'lng': 116.297611,
                    'lat': 40.047363
                }, {
                    'lng': 116.302839,
                    'lat': 40.048219
                }, {
                    'lng': 116.308301,
                    'lat': 40.050566
                }, {
                    'lng': 116.305732,
                    'lat': 40.054957
                }, {
                    'lng': 116.304754,
                    'lat': 40.057953
                }, {
                    'lng': 116.306487,
                    'lat': 40.058312
                }, {
                    'lng': 116.307223,
                    'lat': 40.056379
                }];
                var point = [];
                for (var i = 0; i < path.length; i++) {
                    point.push(new BMapGL.Point(path[i].lng, path[i].lat));
                }
                var pl = new BMapGL.Polyline(point);
                setTimeout('start()', 3000);
                trackAni = new BMapGLLib.TrackAnimation(this.maps, pl, {
                    overallView: true,
                    tilt: 30,
                    duration: 20000,
                    delay: 300
                });
                trackAni.start();
            },
            //打开车辆 网点 桩 详情的方法
            //获取车辆详情的方法
            async getCarInfo(data,url,infoWindow){
                //调用显示loading方法
                this.getLoading()
                //判断 taskId 来确定有么有任务
                if(data.taskId){
                    infoWindow._config.height=380
                    infoWindow._config.offset.height=250;
                }else{
                    infoWindow._config.height=210
                    infoWindow._config.offset.height=154;
                }
                let points
                const res = await getCarInfo({carNo:data.carNo},url);
                if(res.code === 200) {
                    if(data.longitude && data.latitude && Number(data.longitude)>0 && Number(data.latitude)>0){
                        points = this.mpsWgs84(data.longitude, data.latitude)
                    }else{
                        points= new BMapGL.Point(this.mapsLong.lng, this.mapsLong.lat)
                    }
                    this.maps.openInfoWindow(infoWindow, points); //参数：窗口、点  根据点击的点出现对应的窗口
                    var todoWarps = new todoWarp({
                        propsData: {
                            username: res.data,
                            types: 3,
                            listType: "",
                        },
                    }).$mount("#fms");
                    this.maps.setCenter(points,{
                        tilt: this.maps.getTilt(),
                        heading:this.maps.getHeading()
                    });

                }
                this.loading.close()
            },
            //获取桩的详情方法
            async getPileDetails(data,pileInfoWindow,types){
                let pointsNumber=this.mpsGCJ(data.longitude,data.latitude)
                let points =  new BMapGL.Point(pointsNumber.lng, pointsNumber.lat,19);
                // this.maps.centerAndZoom(points,19);
                // this.maps.panTo(points)
                this.getLoading()
                const res = await getPileDetails({poleNo:data.poleNo});
                if(res.code === 200) {
                    //判断当前点击设备类型 0为设备 1为机器人
                    res.data.terminalStatus=data.terminalType;
                    // types 判断是从树点击还是从地图上点击  有types值就是树 无值为地图上
                    if(types){
                        if(data.terminalType=='1'){
                            res.data.robotName=data.robotName
                        }else{
                            res.data.robotName=data.gunNum
                        }
                        res.data.alarmCount=data.alarmCount
                    }
                    this.maps.openInfoWindow(pileInfoWindow, points); //参数：窗口、点  根据点击的点出现对应的窗口
                    var todoWarps = new todoWarp({
                        propsData: {
                            username: res.data,
                            types: 2,
                            listType: "",
                        },
                    }).$mount("#fms");
                    this.maps.setCenter(points,{
                        tilt: this.maps.getTilt(),
                        heading:this.maps.getHeading()
                    });
                }
                this.loading.close()
            },
            //获取网点详情
            async  getProfileInfo(data,infoWindow){
                let pointsNumber=this.mpsGCJ(data.longitude,data.latitude)
                let points =  new BMapGL.Point(pointsNumber.lng, pointsNumber.lat,17);
                this.getLoading()
                const res = await getProfileInfo({siteNo:data.siteNo});
                if(res.code === 200) {
                    this.maps.openInfoWindow(infoWindow, points); //参数：窗口、点  根据点击的点出现对应的窗口
                    var todoWarps = new todoWarp({
                        propsData: {
                            username: res.data,
                            types: 1,
                        },
                    }).$mount("#fms");
                    this.maps.setCenter(points,{
                        tilt: this.maps.getTilt(),
                        heading:this.maps.getHeading()
                    });
                }
                this.loading.close()
            },
            //创建Loading弹出框
            getLoading(){
                this.loading = this.$loading({
                    lock:true,
                    text:'loading',
                    background:'rgba(255,255,255,.7)',
                    customClass:"loadingBody",
                });
            },
            mpsGCJ(mglng, mglat){
                const xPI = 3.14159265358979324 * 3000.0 / 180.0
                const PI = 3.1415926535897932384626
                const a = 6378245.0
                const ee = 0.00669342162296594323
                let z = Math.sqrt(mglng * mglng + mglat * mglat) + 0.00002 * Math.sin(mglat * xPI)
                let theta = Math.atan2(mglat, mglng) + 0.000003 * Math.cos(mglng * xPI)
                let bdlng = z * Math.cos(theta) + 0.0065
                let bdlat = z * Math.sin(theta) + 0.006
                return {lng: bdlng, lat: bdlat}
            },
            mpsWgs84 (lng, lat) {
                const xPI = 3.14159265358979324 * 3000.0 / 180.0
                const PI = 3.1415926535897932384626
                const a = 6378245.0
                const ee = 0.00669342162296594323
                // WGS84转GCj02
                let dlat = this.transformlat(lng - 105.0, lat - 35.0)
                let dlng = this.transformlng(lng - 105.0, lat - 35.0)
                let radlat = lat / 180.0 * PI
                let magic = Math.sin(radlat)
                magic = 1 - ee * magic * magic
                let sqrtmagic = Math.sqrt(magic)
                dlat = (dlat * 180.0) / ((a * (1 - ee)) / (magic * sqrtmagic) * PI)
                dlng = (dlng * 180.0) / (a / sqrtmagic * Math.cos(radlat) * PI)
                let mglat = lat + dlat
                let mglng = lng + dlng
                // 火星坐标系 (GCJ-02) 与百度坐标系 (BD-09) 的转换
                let z = Math.sqrt(mglng * mglng + mglat * mglat) + 0.00002 * Math.sin(mglat * xPI)
                let theta = Math.atan2(mglat, mglng) + 0.000003 * Math.cos(mglng * xPI)
                let bdlng = z * Math.cos(theta) + 0.0065
                let bdlat = z * Math.sin(theta) + 0.006
                return {lng: bdlng, lat: bdlat}
            },
            transformlat (lng, lat) {
                const PI = 3.1415926535897932384626
                let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng))
                ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
                ret += (20.0 * Math.sin(lat * PI) + 40.0 * Math.sin(lat / 3.0 * PI)) * 2.0 / 3.0
                ret += (160.0 * Math.sin(lat / 12.0 * PI) + 320 * Math.sin(lat * PI / 30.0)) * 2.0 / 3.0
                return ret
            },
            transformlng (lng, lat) {
                const PI = 3.1415926535897932384626
                let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng))
                ret += (20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0 / 3.0
                ret += (20.0 * Math.sin(lng * PI) + 40.0 * Math.sin(lng / 3.0 * PI)) * 2.0 / 3.0
                ret += (150.0 * Math.sin(lng / 12.0 * PI) + 300.0 * Math.sin(lng / 30.0 * PI)) * 2.0 / 3.0
                return ret
            },

        },
        created() {
            this.newInfoWindow()
        },
    };
</script>
<style lang="scss">
    // 隐藏左下角百度地图logo
    .anchorBL{display:none;}
    .shadow {
        display: none;
    }
    .BMap_bubble_pop > img {
        display: none;
        top: 50% !important;
        transform: rotate(50deg);
        left: -5% !important;
        z-index: -1 !important;
    }
    .BMap_bubble_pop {
        padding: 0 !important;
        position: relative;
        border-radius: 3px !important;
        border: 0 !important;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.25);
    }
    .BMap_bubble_pop:before {
        content: "";
        width: 0px;
        height: 0px;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
        border-right: 8px solid #fff;
        position: absolute;
        top: 50%;
        left: -8px;

    }
    .BMap_bubble_top {
        position: absolute;
    }
    .BMap_bubble_content {
        border-top-left-radius: 3px;
        border-top-right-radius: 3px;
        width: 100% !important;
        right: 0;
        left: 0;
        top: 0px !important;
        border: 0 !important;
    }
    .BMap_bubble_buttons div div {
        line-height: 32px !important;
    }
    /*}*/
</style>
<style scoped>
    .ditu {
        width: 100%;
        min-width: 900px;
        margin: 0 auto;
    }
    .BMap_cpyCtrl {
        display: none;
    }

    .anchorBL {
        display: none;
    }
</style>
