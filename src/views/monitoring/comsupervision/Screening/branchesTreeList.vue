<template>
    <div class="treeContent">
        <div class="inputContent tree-container">
            <el-input v-model.trim="from.websiteName" placeholder="请输入网点名称" class="input-with-select">
                <el-button @click="getTreeList()" slot="append" icon="el-icon-search"></el-button>
            </el-input>
            <el-tree
                    class="filter-tree "
                    :data="treeData.websites"
                    :props="defaultProps"
                    default-expand-all
                    :filter-node-method="filterNode"
                    :expand-on-click-node="false"
                    ref="tree">
                <div class="custom-tree-node" slot-scope="{ node, data}">
                    <div clsss="treeItem">
                        <div v-if="data.deviceAlarmSum!=null" class="solieBody" @click="() => treeClick(data,1)" :title="node.label">
                            <div class="yiji">
                                <span>{{ node.label}}</span>
                                <div class="solieContent">
                                    <span v-if="poleType.alarmSun=='1'">{{data.termOnlineSum}}/{{data.terminalSum}} </span >
                                    <span v-if="poleType.alarmSun=='1'&&poleType.alarm=='1'">,</span>
                                    <span v-if="poleType.alarm=='1'">
                                       充电桩告警:
                                       <span class="red-text">{{data.deviceAlarmSum}}</span>,
                                       机器人告警:
                                       <span class="red-text">{{data.robotAlarmSum}}</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                        <span v-else class="solieContentQ" :title="data.poleName+'桩'+data.gunNum+'终端'+(data.terminalType==1?data.robotName:'')">
                                <span class="imgBoxs" style="margin-right: 5px;display: inline-block" >
                                   <span v-if="data.alarmCount>0"   @click="openAlarm(data)">
                                        <img
                                             src="../../../../assets/monitoring/type/weiwangguanicon-defuben-.svg" alt="">
                                   </span>
                                </span>
                                <span class="imgBoxs" v-if="data.terminalStatus=='1'">
                                    <img src="../../../../assets/monitoring/type/lianjie.svg" alt="">
                                </span>
                                <span class="imgBoxs" v-if="data.terminalStatus=='0'">
                                    <img src="../../../../assets/monitoring/type/duankai.svg" alt="">
                                </span>
                                <span  class="one-line" :class="[data.terminalStatus=='0'?'textColor':'']"  @click="() => treeClick(data,2)">
                                     {{ data.poleName}}桩<span>{{data.gunNum}}终端</span>
                                    <span v-if="data.terminalType=='1'">({{data.robotName}}机器人)</span>
                                </span>
                        </span>
                    </div>
                </div>
            </el-tree>
        </div>
    </div>
</template>

<script>
    export default {
        name: "tree-list",
        data() {
            return {
                from: {
                    websiteName: "",
                },
                defaultProps: {
                    children: 'details',
                    label: 'websiteName',
                    type: 'type',
                    type1: 'types'
                }
            }
        },
        props: {
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
            treeData: {
                handler(newName, oldName) {
                    this.treeData = newName;
                },
                deep: true
            },
            poleType:{
                handler(newName, oldName) {
                    this.poleType = newName;
                },
                deep: true
            },
        },
        methods: {
            //树输入框检索
            filterNode(value, data) {
                if (!value) return true;
                return data.label.indexOf(value) !== -1;
            },
            treeClick(data,val){
                this.$emit('treeClick',data,val)
            },
            getTreeList(){
                this.$emit('getTreeList',this.from.websiteName)
            },
            //打开告警界面
            openAlarm(val){
                val.type=9
                this.$emit('clickOpen',val)
            },
        },
        created() {

        }
    }
</script>

<style scoped>

</style>