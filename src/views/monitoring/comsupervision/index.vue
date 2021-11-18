<template>
    <div class="monitoringContent" >
        <div class="menu" v-show="widthType==1">
            <div class="menuBody">
                <div class="menuContents">
                    <div class="menuTitle">
                        <div class="tieltSt">
                            <el-select v-model="mapsValue" @change="mapsWebClick"   placeholder="请选择">
                                <el-option
                                        v-for="(item,index) in websiteList"
                                        :key="index"
                                        :label="item.mapName"
                                        :value="index">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="tieltImg" @click="handleClose" :class="dialogVisibleType==2?'tieltImgBg':''">
                            <svg
                                    class="icon"
                                    width="200px"
                                    height="198.64px"
                                    viewBox="0 0 1031 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    v-show="dialogVisibleType==1"
                                    fill="#fff"
                            >
                                <path fill="#fff" d="M544.24 870.052a24.08 24.08 0 0 1-24.053-24.054V434.555c0-5.755 2.063-11.32 5.816-15.678l182.513-212.265H213.545l167.578 213.074a24.151 24.151 0 0 1 5.145 14.869v245.637l72.458 72.453a23.849 23.849 0 0 1 6.887 17.024 23.916 23.916 0 0 1-7.173 16.958c-4.532 4.464-10.527 6.922-16.881 6.922s-12.355-2.453-16.88-6.922l-79.463-79.468a23.92 23.92 0 0 1-7.045-17.014V442.88L145.126 197.422a24.08 24.08 0 0 1 4.025-33.777 24.151 24.151 0 0 1 14.868-5.145h596.885a23.884 23.884 0 0 1 17.003 7.05 23.875 23.875 0 0 1 7.04 17.014 24.054 24.054 0 0 1-5.811 15.672L568.284 443.47v402.524a24.074 24.074 0 0 1-24.043 24.059z"  /><path d="M660.951 805.99a23.885 23.885 0 0 1-16.998-7.055 23.905 23.905 0 0 1-7.03-17.019 24.084 24.084 0 0 1 24.033-24.033h186.117a24.084 24.084 0 0 1 24.028 24.074 24.084 24.084 0 0 1-24.033 24.033h0.005-186.122z m0-150.553a24.074 24.074 0 0 1-24.028-24.07 24.09 24.09 0 0 1 24.033-24.038h186.117a24.084 24.084 0 0 1 24.028 24.075 24.09 24.09 0 0 1-24.033 24.033h0.005-186.122z m0-148.823c-13.184-0.17-23.839-11.095-23.67-24.356a23.9 23.9 0 0 1 23.747-23.747h186.045c13.261 0 24.049 10.788 24.049 24.054s-10.788 24.054-24.049 24.054H660.951z"  />
                            </svg>
                            <svg
                                    class="icon"
                                    width="200px"
                                    height="198.64px"
                                    viewBox="0 0 1031 1024"
                                    version="1.1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    v-show="dialogVisibleType==2"
                                    fill="#06A0AF"
                            >
                                <path fill="#06A0AF" d="M544.24 870.052a24.08 24.08 0 0 1-24.053-24.054V434.555c0-5.755 2.063-11.32 5.816-15.678l182.513-212.265H213.545l167.578 213.074a24.151 24.151 0 0 1 5.145 14.869v245.637l72.458 72.453a23.849 23.849 0 0 1 6.887 17.024 23.916 23.916 0 0 1-7.173 16.958c-4.532 4.464-10.527 6.922-16.881 6.922s-12.355-2.453-16.88-6.922l-79.463-79.468a23.92 23.92 0 0 1-7.045-17.014V442.88L145.126 197.422a24.08 24.08 0 0 1 4.025-33.777 24.151 24.151 0 0 1 14.868-5.145h596.885a23.884 23.884 0 0 1 17.003 7.05 23.875 23.875 0 0 1 7.04 17.014 24.054 24.054 0 0 1-5.811 15.672L568.284 443.47v402.524a24.074 24.074 0 0 1-24.043 24.059z"  /><path d="M660.951 805.99a23.885 23.885 0 0 1-16.998-7.055 23.905 23.905 0 0 1-7.03-17.019 24.084 24.084 0 0 1 24.033-24.033h186.117a24.084 24.084 0 0 1 24.028 24.074 24.084 24.084 0 0 1-24.033 24.033h0.005-186.122z m0-150.553a24.074 24.074 0 0 1-24.028-24.07 24.09 24.09 0 0 1 24.033-24.038h186.117a24.084 24.084 0 0 1 24.028 24.075 24.09 24.09 0 0 1-24.033 24.033h0.005-186.122z m0-148.823c-13.184-0.17-23.839-11.095-23.67-24.356a23.9 23.9 0 0 1 23.747-23.747h186.045c13.261 0 24.049 10.788 24.049 24.054s-10.788 24.054-24.049 24.054H660.951z"  />
                            </svg>
                        </div>
                    </div>
                    <div class="tableBar">
                        <span @click="menubarTab(1)" :class="[menubarSpan==1?'spanColor':'']"><img src="../../../assets/monitoring/type/cheliang-.svg" alt="">车辆信息</span>
                        <span @click="menubarTab(2)" :class="[menubarSpan==2?'spanColor':'']"><img src="../../../assets/monitoring/type/road-map-menu.svg" alt="">网点信息</span>
                    </div>
                    <!--//车辆信息树-->
                    <div v-show="menubarSpan==1" class="alarmContent">
                        <div class="statisticalContent" >
                            <div class="statisticalItem pdItem">
                                <span>在线/总量</span>
                                <div class="zx">
                                    {{carTreeData.totalonlineSum}}/{{carTreeData.totalCarSum}}
                                </div>
                            </div>
                            <div class="statisticalItem">
                                <span>行</span>
                                <div>
                                    {{carTreeData.totalRunSum}}
                                </div>
                            </div>
                            <div class="statisticalItem">
                                <span>停</span>
                                <div>
                                    {{carTreeData.totalStopSum}}
                                </div>
                            </div>
                            <div class="statisticalItem">
                                <span>告警</span>
                                <div>
                                    {{carTreeData.totalAlarmSum}}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-show="menubarSpan==2" class="alarmContent">
                        <div class="statisticalContent">
                            <div class="statisticalItem">
                                <span>在线/总量</span>
                                <div class="zx">
                                    {{treeData.onlineCount}}/{{treeData.deviceCount}}
                                </div>
                            </div>
                            <div class="statisticalItem">
                                <span>充电桩告警</span>
                                <div>
                                    {{treeData.poleAlarmCount}}
                                </div>
                            </div>
                            <div class="statisticalItem">
                                <span>机器人告警</span>
                                <div>
                                    {{treeData.robotAlarmCount}}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="treeContents" :style="{height:treeHeight}">
                    <catTreeList :carTreeType="carTreeType" :treeData="carTreeData"  @getTreeList="getCarTreeLists"  :poleType="treeSearcher" @treeClick="treeClick" v-show="menubarSpan==1" @mapsClick="mapsClick"  @clickOpen="clickOpen"></catTreeList>
                    <branchesTreeList :treeData="treeData" @getTreeList="getTreeList" :poleType="poleType" @treeClick="treeClick" v-show="menubarSpan==2"  @clickOpen="clickOpen"></branchesTreeList>
                </div>
            </div>
        </div>
        <div class="menuContent" :class="widthType==1?'':'menuContentLT'">
            <div>
                <robotDetails :infos="info"  v-if="listTyps==3"  @changeType="changeType"></robotDetails>
                <gunDetails :infos="info" @changeType="changeType" v-if="listTyps==2"></gunDetails>
                <alarmDetails :infos="info"  v-if="listTyps==4" @changeType="changeType"></alarmDetails>
                <branchesDetails :infos="info"  v-if="listTyps==5" @clickOpen="clickOpen" @changeType="changeType"></branchesDetails>
                <div class="map-container" :style="{width: `${widths}`}">
                    <div class="detailsIcon"  @click="detailsTab" v-if="listTyps == 1||listTyps == 6">
                        <img :src="listTyps == 6 ? detailImg1 : showTotalCarList ? detailImg1 : detailImg2">
                    </div>
                    <maps  :widthss="widths" :carTreeData="newCarArray" :heightss="heights" v-show="listTyps==1" :treeData="treeData" ref="maps"></maps>
                    <terminalList v-if="listTyps==6"></terminalList>
                </div>
                <vehicleDetails :infos="info"  v-if="listTyps==7" @changeType="changeType"></vehicleDetails>
                <img class="car-list-img" :class="!showCarList ? 'img-down' :''" v-show=" listTyps==1&& menubarSpan ===1 && !showTotalCarList" @click="toggleCarList" src="@/assets/monitoring/type/up.png" alt="" />
                <carList :showTotalCarList="showTotalCarList" @carRowDetail="carRowDetail" @rowClick="rowClick" v-show="showCarList && listTyps==1 && menubarSpan ===1" :style="{width: `calc(${carListWidths} - ${showTotalCarList ? 18 : 28}px)`}" ref="carList"></carList>
                <carVideo :showCarList="showCarList" @closeCarVideo="closeCarVideo" @changeVideoWidth="changeVideoWidth"  v-show="showCarVideo && listTyps==1 && menubarSpan ===1" :style="{height: `${heights}`,width: `calc(${carListWidths} - ${widths} - 16px)`}" ref="carVideo"></carVideo>
            </div>
        </div>
        <!--弹出框样式-->
        <div class="dialogContent">
            <div    v-if="menubarSpan==2">
                <el-dialog
                        :modal="false"
                        title="网点监控配置"
                        :visible.sync="dialogVisible"
                        width="90%"
                        :before-close="handleClose">
                    <terminalFilter @checkboxClick="checkboxClick" :menubarSpan="menubarSpan" ></terminalFilter>

                </el-dialog>
            </div>
            <div class="carComtent"  v-if="menubarSpan==1">
                <el-dialog
                        :modal="false"
                        title="车辆监控配置"
                        :visible.sync="dialogVisible"
                        width="90%"
                        :before-close="handleClose">
                    <div style="height: 450px;overflow-x: hidden">
                        <terminalFilter @checkboxClick="checkboxClick" :menubarSpan="menubarSpan" @treeSearch="treeSearch"></terminalFilter>
                    </div>
                </el-dialog>
            </div>
        </div>
    </div>
</template>

<script>
    import maps from './maps'//地图组件
    import robotDetails from './equipmentDetails/robotDetauls.vue'//机器人
    import gunDetails from './equipmentDetails/gunDetails'//枪
    import alarmDetails from './equipmentDetails/alarmDetails'//告警详情
    import branchesDetails from './equipmentDetails/branchesDetails'//网点详情
    import terminalFilter from './Screening/terminalFilter.vue'
    import branchesTreeList from './Screening/branchesTreeList.vue'//网点树
    import catTreeList from './Screening/catTreeList.vue'//车辆树
    import {getTreeList,getWebsiteList,getCarTreeList} from '@/api/monitoring/comsupervision.js'
    import terminalList from './Screening/terminalList'
    import carList from './Screening/carList'
    import carVideo from './Screening/carVideo'
    import vehicleDetails from './carDetails/vehicleDetails'
    import { mapGetters } from 'vuex'
    import { getArrayProps } from "@/utils/utils"
    import bus from '@/utils/bus'
    //地图组件---按需引入
    export default {
        computed: {
            ...mapGetters(['dictInfo','carPleType'])
        },
        components:{
            maps,
            terminalFilter,
            terminalList,
            robotDetails,
            gunDetails,
            alarmDetails,
            branchesDetails,
            branchesTreeList,
            catTreeList,
            vehicleDetails,
            carList,
            carVideo
        },
        data()  {
            return {
                treeValue:'',//缓存上次点击树的值
                carTreeType:1,//判断是不是定时器加载
                mapsItem:{},//缓存下当前点击的车辆信息
                poleType:{//控制网点是否显示数量报警数量
                    alarmSun:'1',
                    alarm:'1',
                },
                carTreeName:"",
                loading: {},//loading加载对象
                websiteList:[],
                menubarSpan:1,//控制树切换
                listTyps:1,//切换地图状态[1:地图,2:枪,3:机器人,4:告警界面,5:网点详情,6:地图网点列表]
                detailImg1:require('@/assets/monitoring/type/road-map-fill.svg'),
                detailImg2:require('@/assets/monitoring/type/liebiao.svg'),
                from:{
                    orgId:"",
                    websiteName:"",
                    queryType:'2',
                    queryStatus:'2',
                },
                carFrom:{},
                dialogVisible:false,//控制筛选条件是否显示
                dialogVisibleType:1,//控制筛选条件img是否显示
                widths:(window.screen.availWidth-300)+'px',
                heights:(window.screen.availHeight-170)+'px',
                treeHeight:(window.screen.availHeight-324)+'px',
                carListWidths:(window.screen.availWidth-300)+'px',
                widthType:1,
                mapsValue:'',
                tableList:[],//表格列表
                treeData: {},//tree树数组
                carTreeData: {},//tree树数组
                newCarArray:[],
                treeSearcher:{
                    alarmSun1:1,
                    alarmSun2:1,
                    alarmSun3:1,
                    carRadio:1,
                },
                info:{//给子组件传值对象

                },//充电枪
                showCarList: false,
                showTotalCarList: false,
                setIntervalObj:null,//定时器对象
                showCarVideo: false,
                carVideoTdh: 0
            }
        },

        methods: {
//....................车辆方法开始............................//
            getCarTreeLists(val){
                this.carTreeName=val;
                this.getCarTreeList(1)
            },
            //获取车辆列表
            async getCarTreeList(val){
                //初始化加载;
                if(val==undefined||val==1){
                    this.carFrom.condition='';
                    this.carFrom.carEnergyType='';
                    this.carFrom.carStatus=2;
                    this.carFrom.carType1=getArrayProps(this.dictInfo.usebroaHead, 'value').join(',');
                    this.carFrom.carType2=getArrayProps(this.dictInfo.usesubcHead, 'value').join(',')
                    this.carTreeType=(val==undefined?2:1);
                }else{
                    this.carTreeType=1;
                }
                this.carFrom.condition = this.carTreeName;
                this.carFrom.queryId= new Date().getTime()+Math.random()*10;
                const res = await getCarTreeList(this.carFrom);
                if(res.code === 200) {
                    this.carTreeData = JSON.parse(JSON.stringify(res.data));
                    this.carTreeType=(val==undefined?2:1);
                }else{
                    this.carTreeData = {};
                }
                this.loading.close();
            },
            //重构数据车辆地图上打点
            mapsClick(val){
                this.newCarArray=val;
            },
            toggleCarList() {
                this.showCarList = !this.showCarList
                this.heights=(window.screen.availHeight-`${this.showCarList ? 450 : 170}`)+'px';
            },
            treeSearch(val){
                if(val.type==2){
                    this.getLoading();
                    this.carFrom=val;
                    this.getCarTreeList(this.carFrom);
                }else{
                    this.treeSearcher=val;
                }

            },
            menubarTab(val) {
                this.menubarSpan=val;
                this.widths = (window.screen.availWidth-300)+'px';
                if(val === 2) {
                    this.heights=(window.screen.availHeight-170)+'px';
                } else {
                    if(this.showCarList) {
                        this.heights=(window.screen.availHeight-450)+'px';
                    }
                }
            },
            detailsTab() {
                this.showTotalCarList = !this.showTotalCarList
                if(this.menubarSpan === 2) {
                    this.listTyps=(this.listTyps==1?6:1)
                } else {
                    this.listTyps= 1
                    if(this.showTotalCarList) {
                        this.showCarList = true
                        this.heights='0px';
                    } else {
                        this.showCarList = false
                        this.heights=(window.screen.availHeight-`${this.showCarList ? 450 : 170}`)+'px';
                    }
                }
            },
            rowClick(val) {
                this.$refs.maps.openCarInfoWindows(val);
            },
            carRowDetail(val) {
                this.info = val
                this.listTyps = 7
            },
            changeVideoWidth(val) {
                this.carVideoTdh = val
                if(val === 4) {
                    this.widths = '0px'
                } else {
                    let width = 0
                    if(this.showCarList) {
                        width =   val === 0 ? 734 : val === 1 ? 940 : 830
                    } else {
                        width =  val === 0 ? 940 : val === 1 ? 670 : 830
                    }
                    this.widths = (window.screen.availWidth-width)+'px';
                }
                this.$refs.maps.openCarInfoWindows(this.mapsItem);

            },
            closeCarVideo() {
                this.showCarVideo = false;
                this.carVideoTdh = 0;
                this.widths = (window.screen.availWidth - 300)+'px';
            },
//...................车辆方法结束..............................//
            changeType(val) {
                this.treeValue='';
                if(val&&val.parentType){
                    this.listTyps = val.parentType
                }else{
                    this.listTyps = 1
                }

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
            //获取机场列表
            async getWebsiteList(){
                const res = await getWebsiteList(this.from);
                if(res.code === 200) {
                    this.websiteList = res.data;
                    this.mapsValue=0;
                    this.getTreeList();
                    this.getCarTreeList(1);
                }
            },
            mapsWebClick(val){
                this.$refs.maps.mapsClick(JSON.parse(this.websiteList[val].mapProperty));
            },
            //弹出框关闭方法
            handleClose(){
                this.dialogVisible=(this.dialogVisible==true?false:true);
                this.dialogVisibleType=(this.dialogVisibleType==1?2:1);
            },
            checkFull() {
                // 判断浏览器是否处于全屏状态 （需要考虑兼容问题）
                var isFull = document.mozFullScreen || document.fullScreen || document.webkitIsFullScreen || document.webkitRequestFullScreen || document.mozRequestFullScreen || document.msFullscreenEnabled
                if (isFull === undefined) {
                    isFull = false
                }
                return isFull;
            },
            //获取车辆得二级对象
            getSubList(pVal) {
                let subcHeadList =[]
                if(Number(pVal) >= 0 && this.dictInfo.usesubcHead.length > 0 && this.dictInfo.usebroaHead.length > 0) {
                    const parr = this.dictInfo.usebroaHead.filter(item => item.value == pVal)
                    let arr = []
                    if(parr.length > 0) {
                        arr = this.dictInfo.usesubcHead.filter(item => item.parentValue == parr[0].id)
                    }
                    subcHeadList = arr
                }else {
                    subcHeadList = []
                }
                return subcHeadList
            },
//..................网点交互方法................................//
            //获取网点树数据结构
            async getTreeList(val){
                if(val!=undefined){
                    this.from.websiteName=val;
                }
                this.from.queryId=new Date().getTime()+Math.random()*10;
                const res = await getTreeList(this.from);
                if(res.code === 200) {
                    res.data.mapsTodu=this.websiteList[0].mapProperty;
                    this.treeData = JSON.parse(JSON.stringify(res.data));
                    // this.treeData
                }else{
                    this.treeData = [];
                }
            },
            //网点树点击传修改地图上得坐标及弹出框展示
            treeClick(val,type){
                this.treeValue='';
                // type:9为初始化
                this.listTyps=1;
                if(type==1){
                    if(val.siteNo != this.treeValue){
                        this.treeValue=val.siteNo
                        this.$refs.maps.networkRendering(val);
                    }
                }else if (type==2){
                    if(val.poleNo+val.gunNum!=this.treeValue){
                        this.treeValue=val.poleNo+val.gunNum
                        this.$refs.maps.openInfoWindows(val);
                    }
                }else if(type==3){
                    //写你的逻辑
                    if(!this.showTotalCarList) {
                        this.heights=(window.screen.availHeight-450)+'px';
                    }
                    this.showCarList = true
                    this.$refs.carList.changeTotalData(val)
                }else if(type==4){
                    if(val.carNo!=this.treeValue){
                        this.mapsItem=val;
                        //点击被选中车辆 定位到当前被选中车辆
                        this.$refs.maps.openCarInfoWindows(val);
                        this.treeValue=val.carNo;
                    }
                }else if(type == 9){
                    //点击一级给数组
                    this.$refs.carList.changeTotalData(val)
                }
            },
            // 点击事件根据type切换不同组件
            clickOpen(val){
                this.treeValue='';
                // type值判断事件
                // 1 打开地图,2 枪详情, 3 机器人详情, 4 告警详情, 5 网点详情, 6 网点列表,8 视频, 10 回放
                if(val.type!=9){
                    if(val.type==11){
                        this.info=val;
                        this.listTyps=5;
                    }else if(val.type == 8){
                        // 右侧视频展示
                        if(!this.showCarVideo) {
                            let width = this.showCarList ? 734 : 940;
                            this.widths = (window.screen.availWidth-width)+'px';
                            this.showCarVideo = true
                        }
                        this.$refs.carVideo.getCarVideos(val.carId)
                        this.$refs.maps.openCarInfoWindows(this.mapsItem);
                    }else if(val.type==10){
                        this.$refs.maps.mapsAnimation(val);
                    }else{
                        this.info=val;
                        this.listTyps=val.type;
                    }
                }else{
                    let newQueryDate={};
                    // carInfoName 路径地址 存在为车辆详情跳转  不存在为网点详情跳转
                    if(val.carInfoName){
                        newQueryDate.plateNo=val.plateNo
                        newQueryDate.orgId=val.orgId
                    }else{
                        newQueryDate.poleName=val.poleName
                        newQueryDate.websiteName =val.websiteName;
                        newQueryDate.poleNo = val.poleNo;
                    }
                    var back=this.$router.resolve({
                        query:newQueryDate,
                        name:val.carInfoName==undefined?"告警监控中心":val.carInfoName
                    })
                    window.open(back.href,'_blank')
                }

            },
            checkboxClick(val){
                if(val.terminalType.length==2){
                    this.from.queryType='2';
                } else {
                    this.from.queryType=val.terminalType.length==1?val.terminalType[0]:null;
                }

                if(val.terminalOnlineType.length==2){
                    this.from.queryStatus='2';
                }else{
                    this.from.queryStatus=val.terminalOnlineType.length==1?val.terminalOnlineType[0]:null;
                }
                if(val.statisticalType.length==2){
                    this.poleType.alarmSun='1'
                    this.poleType.alarm='1'
                } else if(val.statisticalType.length==1){
                    if(val.statisticalType[0]=='1'){
                        this.poleType.alarmSun='1'
                        this.poleType.alarm='2'
                    }else{
                        this.poleType.alarm='1'
                        this.poleType.alarmSun='2'
                    }
                }else{
                    this.poleType.alarmSun='2'
                    this.poleType.alarm='2'
                }
                if(val.types==2){
                    this.getTreeList();
                }
            },
//...................网点交互结束................................//
        },
        mounted() {

        },
        destroyed(){
            // 通过ID销毁定时器
            clearTimeout( this.setIntervalObj)
        },
        created (){
            this.getLoading();
            //初始化获取值
            this.getWebsiteList();
            //定时器调用值
            this.setIntervalObj=setInterval(()=>{
                this.treeValue='';
                if(this.listTyps==1&&this.showCarList==false){
                    this.getCarTreeList();
                    this.getTreeList();
                }
            },(1000*60*5))
            bus.$on('clickOpen', (e) => {
                this.clickOpen(e);
            })
            //监听界面是不是全屏
            window.onresize = ()=> {
                this.heights=(Number(window.innerHeight)-80)+'px';
                if (!this.checkFull()) {
                    // 退出全屏后要执行的动作
                    this.widths=(Number(window.innerWidth)-300)+'px';
                    this.widthType=1
                } else {
                    this.widthType=2
                    this.widths=(Number(window.innerWidth)-30)+'px';
                }
            };
            //初始化获取值预备下全局防止后期做处理
            this.carPleType.carType1=['1','2','3'],//车辆类型
                this.carPleType.carStatus=['1','0'],//车辆在线状态
                this.carPleType.carEnergyType=['1','2'],//能源类型
                this.carPleType.carStatistical=["1","2","3"],//车辆显示统计
                this.carPleType.carRadio="1",//车辆类型
                this.carPleType.usebroaHead  =  JSON.parse(JSON.stringify( this.dictInfo.usebroaHead))
            for(var i=0;i<this.carPleType.usebroaHead.length;i++){
                this.carPleType.carIndex.push(this.carPleType.usebroaHead[i].value)
                this.carPleType.carType1.push(this.carPleType.usebroaHead[i].value)
                this.carPleType.carTypeObj[i]=getArrayProps(this.getSubList([this.dictInfo.usebroaHead[i].value]), 'value')
            }
            this.$store.commit('monitoring/changeCarPleType',this.carPleType);
        },
        watch: {
            showCarList(newVal,oldVal) {
                const allScreen = this.widths === '0px';
                if(this.showCarVideo && !allScreen) {
                    let width =  0
                    if(newVal) {
                        width =  this.carVideoTdh === 0 ?  734 : this.carVideoTdh === 1 ? 940 : 830
                    } else {
                        width =  this.carVideoTdh === 0 ? 940 : this.carVideoTdh === 1 ? 670 : 830
                    }
                    this.widths = (window.screen.availWidth-width)+'px';
                }
            },
            listTyps(newVal){},
        }
    }
</script>
<style  lang="scss">
    /*---滚动条默认显示样式--*/
    ::-webkit-scrollbar-thumb{
        background-color:#ccc;
        height:50px;
        outline-offset:-2px;
        outline:2px solid #fff;
        -webkit-border-radius:4px;
        border: 2px solid #fff;
    }

    /*---鼠标点击滚动条显示样式--*/
    ::-webkit-scrollbar-thumb:hover{
        background-color:#ccc;
        height:50px;
        -webkit-border-radius:4px;
    }

    /*---滚动条大小--*/
    ::-webkit-scrollbar{
        width:9px;
        height:9px;
    }

    /*---滚动框背景样式--*/
    ::-webkit-scrollbar-track-piece{
        background-color:#fff;
        -webkit-border-radius:0;
    }
    .loadingBody{
        top: 55px !important;
        /*z-index: 100 !important;*/
        background:rgba(255,255,255,.7) !important;
    }
    .menu{
        .treeItem{
            overflow: hidden;
        }
        .treeContents{
            overflow-y: auto;
            overflow-x: hidden;
            margin-top: 40px;
        }
        .menuBody{
            height: 150px;
            background-color: #fff;
        }
        /*树的样式*/
        .treeContent{
            margin: 0 10px;
            .input-with-select{
                margin-bottom: 7px;
            }
            .imgBoxs{
                min-width: 10px;
                img{
                    width: 10px;
                    height:10px;
                }
            }
            input{
                border: 1px solid #D9D9D9;
                border-radius: 2px;
            }
            .el-input-group__append{
                background-color: #fff;
                padding:0  14px !important;
            }
            .el-input__inner{
                width: 193px ;
            }
            input::-webkit-input-placeholder{
                color: #C1C1C1;
                font-size: 12px;
            }
        }
        .el-tree .el-tree-node__expand-icon.expanded {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }

        .el-tree .el-tree-node__expand-icon.expanded {
            -webkit-transform: rotate(0deg);
            transform: rotate(0deg);
        }
        /*.el-tree-node{*/
        /*!*padding-left: 0px !important;*!*/
        /*}*/
        .el-tree-node__children{
            /*margin-bottom: 14px !important;*/
        }
        //有子节点 且未展开
        .el-tree .el-icon-caret-right:before {
            background: url('../../../assets/monitoring/type/zhankai-2.svg') no-repeat;
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            font-size: 10px;
            background-size: 10px;
            /*background-size: 100% 100%;*/
        }

        //有子节点 且已展开
        .el-tree .el-tree-node__expand-icon.expanded.el-icon-caret-right:before {
            background: url('../../../assets/monitoring/type/zhankai.svg') no-repeat;
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            font-size: 10px;
            background-size: 10px;
        }

        //没有子节点
        .el-tree .el-tree-node__expand-icon.is-leaf::before {
            background: #fff;
            content: '';
            display: block;
            width: 10px;
            height: 10px;
            font-size: 10px;
            background-size: 10px;
        }
        .el-tree-node__content{
            height: 40px !important;
            position: relative;
        }
        .el-tree-node__children   .el-tree-node__content{
            height: unset !important;
            padding-left: 0 !important;
        }
        .el-icon-caret-right{
            padding: 0 6px !important;
            position: absolute;
            top: 8px;
        }
        .is-focusable{
            margin-bottom: 10px;
        }
        .el-tree-node__children .is-focusable{
            margin-bottom:0;
        }
        .el-tree-node__children .el-icon-caret-right{

            display: none;
        }
        .solieBody{
            font-size: 12px;

        }
        .treeItem{
            color: #333;
        }
        .yiji{
            margin-left: 25px;
        }
        .yiji>span{
            font-size: 13px;
            color: #333;
            letter-spacing: 0;
            line-height: 20px;
            font-weight: 600;
        }
        .yiji .solieContent{
            height: 16px;
            line-height: 16px;
        }
        .solieBody>span{
            font-weight: 700;
            color: #000;
            margin-left: 5px;
        }
        .solieContent{
            color: #4C7684 ;
        }
        .solieContent span.red-text{
            color: #FF1835 ;
        }
        .solieContentQ{
            font-size: 12px;
            margin-left: 10px;
        }
        .tieltSt,.tieltSt .el-input__inner,.el-select .el-input .el-select__caret{
            background-color:transparent ;
            border:0 !important;
            box-shadow: unset !important;
            color: #fff;
            font-size: 16px;
            transition: unset;
        }
        .tieltSt input {
            line-height: 32px;
        }
        .el-select .el-input .el-select__caret{
            position: relative;
            top: 0px;
            margin-top: 0;
            line-height: 32px !important;

            &.is-reverse{
                top: -5px
            }
        }
        .tieltImg{
            text-align: right;
            height: 22px;
            max-width: 22px;
            line-height: 22px;
            margin-right: 12px;
            border-radius: 3px;
            margin-top: 5px;
            margin-left: 10px;
        }
        .tieltImgBg{
            background-color: #fff;
        }
        .tieltImg svg{
            width: 20px;
            height: 20px;
            cursor: pointer;
            margin-top: 1px;
            top: 0;
            left: 0;
        }
        input::-webkit-input-placeholder{
            color:#fff;
            font-size: 16px;
        }
        input::-moz-placeholder{  /* Mozilla Firefox 19+ */
            color:#fff;
            font-size: 16px;
        }
        input:-moz-placeholder{   /* Mozilla Firefox 4 to 18 */
            color:#fff;
            font-size: 16px;
        }
        input:-ms-input-placeholder{ /* Internet Explorer 10-11 */
            color:#fff;
            font-size: 16px;
        }
        .imgBoxs{
            display: inline-block;
            width: 10px;
            height: 10px;
            /*margin-right: 10px;*/
        }
        .one-line{
            overflow: hidden;
            text-overflow: ellipsis;
            display: inline-block !important;
            width: 9rem;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
            line-height: 11px;
            padding-left: 2px;
        }
        .textColor{
            color:#969696;
        }
    }
    .monitoringContent{
        .btnColor{
            background-color: #FFF0F0;
            border: 1px solid #F02828;
            color: #F02828;
        }
        svg{
            width: 12px;
            height: 16px;
            position: relative;
            top: 3px;
            left: 2px;
        }
        .el-dialog__header .el-dialog__headerbtn{
            top: 7px !important;
            height: 12px !important;
            width: 12px !important;
            right: 12px !important;
        }
        .el-dialog__header .el-dialog__headerbtn .el-dialog__close{
            font-size: 12px !important;
            color: #C4C6CF !important;
        }
        .el-dialog__wrapper {
            width: 20% !important;
            left: 265px;
            top: 80px;
        }

        .carComtent .el-dialog__wrapper{
            width: 40% !important;
            overflow: hidden;
            top: 80px;
            left: 250px;
        }
        .el-dialog{
            box-shadow: 0 0 9px rgba(20,67,72,0.4) !important;
            margin-top: 0 !important;
        }
        .el-dialog__body{
            background-color: #fff !important;
            padding: 0 !important;
            margin: 0 !important;

        }
        .el-dialog__header{
            background-color: #E4F3F5 !important;
            height: 36px !important;
            line-height: 36px !important;
            padding: 0 12px;
            border-radius: 3px !important;

        }
        .el-dialog__title{
            font-size: 15px !important;
            color: #222222 !important;
            letter-spacing: 0 !important;
            font-weight: 500 !important;
        }
    }
    .car-list-img{
        width: 74px;
        height: 14px;
        transform: rotate(180deg);
        position: relative;
        left: 48%;
        top: 11px;
        float: left;
        cursor: pointer;

        &.img-down{
            transform: unset;
            top: -14px;
            z-index: 10;
        }
    }
</style>
<style scoped lang="scss">
    ::v-deep  .el-tree {
        left: -10px;
        width: calc(100% + 7px);
    }
    ::v-deep  .el-tree > .el-tree-node:after {
        border-top: none;
    }
    ::v-deep  .el-tree-node {
        position: relative;
        padding-left:5px;
    }
    //节点有间隙，隐藏掉展开按钮就好了,如果觉得空隙没事可以删掉

    ::v-deep  .el-tree-node__children {
        padding-left: 15px;
    }

    ::v-deep  .el-tree-node :last-child:before {
        height: 38px;
    }

    ::v-deep  .el-tree > .el-tree-node:before {
        top: 17px;
        left: 16px;
        height: 90%;
    }

    ::v-deep  .el-tree > .el-tree-node:after {
        border-top: none;
    }

    ::v-deep  .el-tree-node:before {
        content: "";
        left: 4px;
        position: absolute;
        right: auto;
        border-width: 1px;
    }

    ::v-deep  .el-tree-node:after {
        content: "";
        left: -4px;
        position: absolute;
        right: auto;
        border-width: 1px;
    }

    ::v-deep  .el-tree-node:before {
        border-left: 1px solid #D9D9D9 ;
        bottom: 0px;
        height: 100%;
        top: -26px;
        width: 1px;
    }

    ::v-deep  .el-tree-node:after {
        border-top: 1px solid #D9D9D9 ;
        height: 20px;
        top: 12px;
        width: 8px;
        left: 4px;
    }



    .monitoringContent{
        display: flex;
        .monitoringContent>div{
            flex: 1;
        }
        .menuTitle{
            display: flex;
            /*margin-bottom: 20px;*/
        }
        .menuTitle>div{
            flex: 1;
        }
        .menu{
            background-color: #fff;
            min-width: 260px;
            max-width: 260px;
            margin-right: 20px;
            position: fixed;
            height: 100%;
            z-index: 10;
        }
        .menuContents{
            background-image: linear-gradient(180deg, #41B8C3 32%, #76DDE3 100%);
            position: relative;
            padding-bottom: 40px;
            border-bottom-left-radius: 10px;
            border-bottom-right-radius: 10px;
            padding-top: 6px;
            padding-bottom: 40px;
        }
        /*导航栏样式*/
        .tableBar{
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            text-align: center;
            line-height: 17px;
            margin: 0 10px;
        }
        .tableBar img{
            width: 20px;
            height: 20px;
            vertical-align: middle;
            margin: -3px 5px 0 0;

        }
        .tableBar span{
            display: inline-block;
            width: 50%;
            color: #fff;
            text-align: center;
            cursor: pointer;
            border-bottom: 2px solid rgba(255,255,255,0.4);
            height: 35px;
            line-height: 35px;
            opacity: 0.5;
        }
        .tableBar .spanColor{
            opacity:1;
            border-bottom:2px solid  #fff;
            font-weight: 500;
        }
        /*展示告警信息 框样式*/
        .statisticalContent{
            display: flex;
            background-color: #fff;
            padding: 8px 0;
            position: absolute;
            left: 4%;
            width: 92%;
            top: 90px;
            border-radius: 2px;
            box-shadow:0 0 6px rgba(16,132,143,0.7);

        }
        .statisticalContent>div{
            flex: 1;
            color: #808080;
            font-size: 11px;
            text-align: center;
            border-right: 1px solid #DEDEDE;

            &:last-child{
                border-right: 0;
            }
        }
        .statisticalContent  .pdItem{
            /*padding: 8px;*/
            min-width: 30%;
        }
        .statisticalItem div{
            font-size: 14px;
            color: #FF1835;
        }
        .statisticalItem .zx{
            color: #222222;
            font-weight: 600;
        }

        /*地图的样式*/
        .menuContent{
            margin-left: 275px;
            position: relative;
            width: 100%;
            .tieltImg img{
                width: 30px;
                height: 30px;
            }
            .detailsIcon{
                position: absolute;
                width: 30px;
                height: 30px;
                right: 12px;
                top: 10px;
                z-index: 9;
                background-color: #fff;
                cursor: pointer;
                -moz-box-shadow: inset 0 0 2px #c5c5c5;
                -webkit-box-shadow: inset 0 0 2px #c5c5c5;
                box-shadow: inset 0 0 2px #c5c5c5;
                border-radius: 3px;
                text-align: center;
            }
            .detailsIcon img{
                width: 16px;
                height:16px;
                margin-top: 7px;
            }
        }
        .menuContentLT{
            margin-left: 0 !important;
        }
    }

    .map-container{
        position: relative;
    }

</style>
