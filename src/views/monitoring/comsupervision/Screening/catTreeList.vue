<template>
    <div class="treeContentBox">
        <div class="carContent"  v-show="poleType.carRadio=='2'">
            <div class="treeContent">
                <div class="inputContent tree-container">
                    <el-input v-model.trim="from.condition" placeholder="车辆名称|车牌号查询" class="input-with-select">
                        <el-button @click="getTreeList()" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <!--show-checkbox-->
                    <el-tree
                        show-checkbox
                        class="filter-tree "
                        node-key="carNo"
                        :default-checked-keys="newCarArray"
                        :data="treeData.groups.oriGroup"
                        :props="defaultProps"
                        default-expand-all
                        @check="handleCheckChange1"
                        :expand-on-click-node="false"
                        ref="tree1">
                        <div class="custom-tree-node" slot-scope="{ node, data}">
                            <!--<div clsss="treeItem">-->
                                <div class="solieBody" @click="() => treeClick(data,3,node)" v-if="data.oriChild" :title="data.orgName">
                                    <div class="yiji">
                                        <span>{{ data.orgName}}</span>
                                        <div class="solieContent">
                                            <span  v-if="poleType.alarmSun1==1">{{data.onlineSum}}/{{data.carSum}}</span>
                                            <span  v-if="poleType.alarmSun1==1&&poleType.alarmSun2==1">,</span>
                                            <span v-if="poleType.alarmSun2==1">
                                           行:
                                           <span class="red-text">{{data.runSum}}</span>,
                                           停:
                                           <span class="red-text" >{{data.stopSum}}</span>
                                        </span>
                                            <span v-if="poleType.alarmSun3==1">
                                            <span v-if="poleType.alarmSun1==1||poleType.alarmSun2==1">,</span>
                                            告警:
                                         <span class="red-text">{{data.carAlarmSum}}</span>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="solieContentQ" v-else :title=" data.carName+'【'+data.plateNo+'】'">
                                    <span class="imgBoxs" style="margin-right: 5px;display: inline-block"  >
                                       <span  v-if="data.alarmCount>0"  @click="openAlarm(data)">
                                            <img  src="../../../../assets/monitoring/type/weiwangguanicon-defuben-.svg" alt="">
                                       </span>
                                    </span>
                                    <span class="imgBoxs" v-if="data.carStatus=='1'">
                                        <img src="../../../../assets/monitoring/type/lianjie.svg" alt="">
                                    </span>
                                    <span class="imgBoxs" v-if="data.carStatus=='0'">
                                        <img src="../../../../assets/monitoring/type/duankai.svg" alt="">
                                    </span>
                                    <span class="one-line" :class="[data.terminalStatus=='0'?'textColor':'']"  @click="() => treeClick(data,4,node)" >
                                        {{ data.carName}}
                                       <b >[</b>
                                        {{data.plateNo}}
                                         <b>]</b>
                                    </span>
                                </div>

                            <!--</div>-->
                        </div>
                    </el-tree>
                </div>
            </div>
        </div>
        <div class="carTypeContent" v-show="poleType.carRadio=='1'">
            <div class="treeContent">
                <div class="inputContent tree-container">
                    <el-input v-model.trim="from.condition" placeholder="车辆名称|车牌号查询" class="input-with-select">
                        <el-button @click="getTreeList()" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-tree
                            show-checkbox
                            class="filter-tree "
                            :data="treeData.groups.carTypeGroups"
                            :props="propDefault"
                            default-expand-all
                            node-key="carNo"
                            :default-checked-keys="newCarArray"
                            :filter-node-method="filterNode"
                            :expand-on-click-node="false"
                            @check="handleCheckChange"
                            ref="tree">
                        <div class="custom-tree-node" slot-scope="{ node, data}">
                            <div clsss="treeItem">
                                <div class="solieBody" @click="() => treeClick(data,3,node)" v-if="data.carInfos">
                                    <div class="yiji" :title="getCarType(data.carType)">
                                        <div class="imgContent">
                                            <span v-if="data.energyType==3||data.energyType==2"><img :src="carTypeFun(data,2)" alt=""></span>
                                            <span v-if="data.energyType==3||data.energyType==1"><img :src="carTypeFun(data,1)" alt=""></span>
                                            {{getCarType(data.carType)}}
                                        </div>
                                        <div class="solieContent">
                                            <span  v-if="poleType.alarmSun1==1">{{data.onlineSum}}/{{data.carSum}}</span>
                                            <span  v-if="poleType.alarmSun1==1&&poleType.alarmSun2==1">,</span>
                                            <span v-if="poleType.alarmSun2==1">
                                           行:
                                           <span class="red-text">{{data.runSum}}</span>,
                                           停:
                                           <span class="red-text" >{{data.stopSum}}</span>
                                        </span>
                                            <span v-if="poleType.alarmSun3==1">
                                            <span v-if="poleType.alarmSun1==1||poleType.alarmSun2==1">,</span>
                                            告警:
                                         <span class="red-text">{{data.carAlarmSum}}</span>
                                        </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="solieContentQ" v-else  :title=" data.carName+'【'+data.plateNo+'】'">
                                   <span class="imgBoxs" style="margin-right: 5px;display: inline-block" >
                                       <span  v-if="data.alarmCount>0"  @click="openAlarm(data)">
                                            <img  src="../../../../assets/monitoring/type/weiwangguanicon-defuben-.svg" alt="">
                                       </span>
                                    </span>
                                    <span class="imgBoxs" v-if="data.carStatus=='1'">
                                        <img src="../../../../assets/monitoring/type/lianjie.svg" alt="">
                                    </span>
                                    <span class="imgBoxs" v-if="data.carStatus=='0'">
                                        <img src="../../../../assets/monitoring/type/duankai.svg" alt="">
                                    </span>
                                    <span class="one-line" :class="[data.terminalStatus=='0'?'textColor':'']"  @click="() => treeClick(data,4,node)" >
                                        <!--北汽EU7【京A7777812】-->
                                         {{ data.carName}}
                                        <b>【</b>
                                        {{data.plateNo}}
                                        <b>】</b>
                                    </span>
                                </div>

                            </div>
                        </div>
                    </el-tree>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        computed: {
            ...mapGetters(['dictInfo'])
        },
        name: "tree-list",
        data() {
            return {
                types:2,
                from: {
                    condition:"",
                },
                defaultProps: {
                    children: 'oriChild',
                    label: 'carNo',
                },
                propDefault:{
                    children: 'carInfos',
                    label: 'carNo',
                },
                newCarArray:[],
            }
        },
        props: {
            carTreeType:{
                type:Number,
            },
            treeData: {
                //接收树的参数渲染地图
                type: Object,
                required: false,
            },
            poleType:{
                //接收树的参数渲染地图
                type: Object,
                required: false,
            },
        },
        watch: {
            //监听从父组件来的值
            treeData: {
                handler(newName, oldName) {
                    console.log(this.carTreeType);
                    //赋值
                    this.treeData = newName;
                    if(this.carTreeType==1){
                        this.getKCarKey(newName);
                    }else{
                        this.treeItemFun(this.$refs.tree.getCheckedNodes())
                    }
                },
                deep: true
            },
            poleType:{
                handler(newName, oldName) {
                    this.poleType = newName;
                },
                deep: true
            },
            carTreeType:{
                handler(newName, oldName) {
                },
                deep: true
            },
        },
        methods: {
            // 判断车辆类型图片
            carTypeFun(e,types){
                let imgUrl=''
                let type=""
                if(e.carType==1){
                    type='cyc'
                }else  if(e.carType==2){
                    type='keche'
                }else{
                    type='qyc'
                }
                if(types==1){
                    imgUrl=require('../../../../assets/monitoring/car/'+type+'-green.png')
                }else{
                    imgUrl=require('../../../../assets/monitoring/car/'+type+'-org.png')
                }
                return imgUrl
            },
            //判断车辆类型
            getCarType(val){
                let carText=''
                for(var i=0;i<this.dictInfo.usebroaHead.length;i++){
                    if(Number(val)==Number(this.dictInfo.usebroaHead[i].value)){
                        carText=this.dictInfo.usebroaHead[i].label
                    }
                }
                return   carText

            },
            //树输入框检索
            filterNode(value, data) {
                // if (!value) return true;
                // return data.label.indexOf(value) !== -1;
            },
            // 树节点点击方法
            treeClick(data,val,node){
                if(node.checked&&data.carNo!=undefined){
                    this.$emit('treeClick',data,val)
                }
            },
            //点击搜索获取车辆列表
            getTreeList(){
                this.$emit('getTreeList',this.from.condition)
            },
            //单选框点击方法
            handleCheckChange(val,node){
                //判断选中得是不是一级
                if(val.carNo){
                    if(node.checkedKeys.indexOf(val.carNo)>-1){
                        this.treeClick(val,4,{checked:true})
                    }
                    this.$emit('treeClick',val,3)
                }
                if(val.carInfos){
                    // 判断一级下边有子级
                    if(val.carInfos.length!=0){
                        this.$emit('treeClick',this.$refs.tree.getCheckedNodes(),3)
                    }
                }
                this.$emit('mapsClick',this.$refs.tree.getCheckedNodes())
                this.treeItemFun(this.$refs.tree.getCheckedNodes())
            },
            //单选框点击方法
            handleCheckChange1(val,node){
                if(val.carNo){
                    if(node.checkedKeys.indexOf(val.carNo)>-1){
                        this.treeClick(val,4,{checked:true})
                    }
                    this.$emit('treeClick',val,3)
                }
                if(val.oriChild){
                    // 判断一级下边有子级
                    if(val.oriChild.length!=0){
                        this.$emit('treeClick',this.$refs.tree1.getCheckedNodes(),3)
                    }
                }
                this.$emit('mapsClick',this.$refs.tree1.getCheckedNodes())
                this.treeItemFun(this.$refs.tree1.getCheckedNodes())
            },
            //两个树数据同步
            treeItemFun(val){
                this.newCarArray=[];
                for (var i=0;i<val.length;i++){
                    if(val[i].carNo){
                        this.newCarArray.push(val[i].carNo)
                    }
                }
                this.$refs.tree.setCheckedKeys(this.newCarArray);
                this.$refs.tree1.setCheckedKeys(this.newCarArray);
            },
            //初始化加载
            getKCarKey(val){
                // 创建数组接收
                let newCarArray =[];
                let newArray=[]
                let datas=val.groups.carInfos
                for(var i=0;i<datas.length;i++){
                    if(datas[i].carStatus==1){
                        newArray.push(datas[i])
                        // 找到在线类型为1得车辆
                        newCarArray.push(datas[i].carNo)
                    }
                }
                this.newCarArray=newCarArray
                //调用父组件地图用
                this.$emit('mapsClick',newArray)
                //父组件底部列表展示
                this.$emit('treeClick',newArray,9)
            },
            //打开告警界面
            openAlarm(val){
                val.carInfoName='车辆告警详情';
                val.type=9;
               this.$emit('clickOpen',val)
            },
        },
        created() {}
    }
</script>

<style lang="scss">
    .treeContentBox{
        .carContent{
            max-width: 250px !important;
            .input-with-select{
                max-width: 230px !important;
            }
            .el-input__inner{
                width: 193px !important;
            }
        }
        .el-tree-node__content{
            padding: 1px;
        }
        .one-line{
            /*font-size: 12px !important;*/
        }
    }
    .textFont{
        font-weight: 600;
    }
    //组织机构类型
    .carContent{
        display: inline-block;
        .el-tree .el-tree-node__content{
            height: 40px !important;
        }
        .el-tree-node__children .el-icon-caret-right{
            display: block !important;
        }
        .yiji{
            margin-left:5px !important;
        }
        .el-tree-node{
            margin-bottom: 10px !important;
        }
        .el-tree-node__children .el-tree-node{
            margin-bottom: 0 !important;
        }
        .el-tree-node__content .el-checkbox{
            margin-left: 40px !important;
            margin-right: 0 !important;
            position: relative;
            top: -8px;
        }
        .el-tree-node__content .el-checkbox{
            margin-left: 30px !important;
        }
        .el-tree-node__children{
            .el-tree-node__content  .el-checkbox{
                top: -2px;
            }
            .solieContentQ{
                margin-left: -30px;
                .imgBoxs{
                    right: 13px;
                    position: relative;
                }
                .one-line{
                    line-height: 12px;
                    position: relative;
                    left: 8px;
                    width: 7rem;
                }
            }
        }
    }
    //车辆类型样式
    .carTypeContent{
        .el-tree-node__content .el-checkbox{
            margin-left: 20px !important;
            margin-right: 0 !important;
            position: relative;
            top: -8px;
        }
        .el-tree-node__children{
            .el-tree-node__content  .el-checkbox{
                top: -2px;
                left: 36px;
                margin-left: 4px !important;
            }
            .solieContentQ{
                margin-left: 6px;
                .imgBoxs{
                    right: 13px;
                    position: relative;
                }
                .one-line{
                    line-height: 12px;
                    position: relative;
                    left: 8px;
                }
            }
        }
        .yiji{
            margin-left: 10px !important;
        }
        .imgContent{
            img{
                width: 30px;
                height: 22px;
            }
        }
        .imgContent img{
            width: 26px;
            height: 12px;
        }
    }

</style>