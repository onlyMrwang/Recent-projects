<template>
    <div>
        <div class="terminalFilter" v-if="menubarSpan==2">
            <el-checkbox-group v-model="poleType.terminalType" @change="handleCheckedCitiesChange">
                <div class="terminalItem">
                    <div class="header">
                        终端类型
                    </div>
                    <div class="checkContent">
                        <el-checkbox label="0" >直流</el-checkbox>
                        <el-checkbox label="1" >交流</el-checkbox>
                    </div>
                </div>
            </el-checkbox-group>
            <el-checkbox-group v-model="poleType.terminalOnlineType" @change="handleCheckedCitiesChange">
                <div class="terminalItem">
                    <div class="header">
                        终端在线情况过滤
                    </div>
                    <div class="checkContent">
                        <el-checkbox label="1"  >在线</el-checkbox>
                        <el-checkbox label="0"  >离线</el-checkbox>
                    </div>
                </div>
            </el-checkbox-group>
            <el-checkbox-group v-model="poleType.statisticalType">
                <div class="terminalItem">
                    <div class="header">
                        统计显示
                    </div>
                    <div class="checkContent" >
                        <el-checkbox label="1">在线统计</el-checkbox>
                        <el-checkbox label="2">报警统计</el-checkbox>
                    </div>
                </div>
            </el-checkbox-group>
        </div>
        <div class="carContent"  v-else>
            <div class="terminalItem">
                <div class="header">
                    树形展现方式
                </div>
                <div class="checkContent">
                    <el-radio-group v-model="carPleType.carRadio" @change="carClick">
                        <el-radio label="1" >按车辆类型</el-radio>
                        <el-radio label="2" >按组织机构</el-radio>
                    </el-radio-group>
                </div>
            </div>
            <div class="terminalItem">
                <div class="header">
                    统计显示
                </div>
                <div class="checkContent">
                    <el-checkbox-group v-model="carPleType.carStatistical" @change="carClick">
                        <el-checkbox label="1">在线统计</el-checkbox>
                        <el-checkbox label="2">行停统计</el-checkbox>
                        <el-checkbox label="3">报警统计</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="terminalItem">
                <div class="header">
                    车辆能源类型
                </div>
                <div class="checkContent">
                    <el-checkbox-group v-model="carPleType.carEnergyType" @change="carTypeClick">
                        <el-checkbox  label="2" >新能源车</el-checkbox>
                        <el-checkbox  label="1" >燃油车</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="terminalItem">
                <div class="header">
                    车辆在线状态
                </div>
                <div class="checkContent">
                    <el-checkbox-group v-model="carPleType.carStatus" @change="carTypeClick">
                        <el-checkbox label="1">在线</el-checkbox>
                        <el-checkbox label="0">离线</el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div class="terminalItem selectContent">
                <div class="header">
                    车辆类型
                </div>
                <div class="checkContent">
                    <el-checkbox-group v-model="carType1" @change="carTypeClick">
                        <div class="terminalItem" v-for="(item,index) in carPleType.usebroaHead" :key="index">
                            <div class="header">
                                <el-checkbox :label="item.value" @change="carChange(item.value,index)" >{{item.label}}</el-checkbox>
                            </div>
                            <div class="checkContent">
                                <el-select v-model="carPleType.carTypeObj[index]" multiple placeholder="请选择" @change="selectClick(index)" >
                                    <el-option
                                            v-for="item in getSubList(item.value)"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>

                            </div>
                        </div>
                    </el-checkbox-group>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import { getArrayProps } from "@/utils/utils"
    export default {
        name: "terminal-filter",
        computed: {
            ...mapGetters(['poleType','dictInfo','carPleType'])
        },
        data(){
            return {
                usebroaHead:[],
                carForm:{},
                options:[],
                value1:"",
                carIndex:[],
                carType1:['1','2','3']
            }
        },
        props:['menubarSpan'],
        watch:{
            carType1:{
                handler(newName) {

                },
                deep:true
            },
            usebroaHead:{
                handler(newName) {
                },
                deep:true
            },
            'carPleType.carType1':{
                handler(newName) {
                },
                deep:true
            },
            poleType:{
                handler(newName, oldName) {
                    this.poleType.types=1;
                    this.$emit('checkboxClick',this.poleType)
                },
                deep:true
            },
            menubarSpan(val){
                this.menubarSpan=val
            },
        },
        methods:{
            selectClick(Index){
                //如果当前点击的二级么有啦 取消一级
                //判断当前点击的数组是不是为空
                if(this.carPleType.carTypeObj[Index].length==0){
                    // 防止程序报错 判断多选框数组有么有这个值
                 if(this.carType1.indexOf(this.carPleType.usebroaHead[Index].value)>-1){
                     // 找到对应的下标 删除对应的数组值
                     this.carType1.splice(this.carType1.indexOf(this.carPleType.usebroaHead[Index].value),1)
                 }
                }else{
                    //如果不选中一级 直接选二级 一级被选中
                    // 判断点击多选框有么有被选中 若么有被选中则把值push 进去数组
                    if(this.carType1.indexOf(this.carPleType.usebroaHead[Index].value)<0){
                        this.carType1.push(this.carPleType.usebroaHead[Index].value);
                    }
                }
                if(this.carType1.indexOf(this.carPleType.usebroaHead[Index].value)>-1){
                    this.carForm.carEnergyType    = this.carPleType.carEnergyType.length==0?'-1':this.carPleType.carEnergyType.length==2?'':this.carPleType.carEnergyType[0];
                    this.carForm.carStatus    =   this.carPleType.carStatus.length==2?2:this.carPleType.carStatus.length==1?this.carPleType.carStatus[0]:-1;
                    this.carForm.carType1    =   this.carType1.join(',');
                    this.carForm.carType2 =this.carTypesFun();
                    this.carForm.type=2
                    this.$emit('treeSearch',this.carForm)
                }
            },
            carClick(){
                let carStatistical={};
                carStatistical.carRadio    =   this.carPleType.carRadio;
                 for(var i=0;i<this.carPleType.carStatistical.length;i++){
                    if(this.carPleType.carStatistical[i]=="1"){
                        carStatistical.alarmSun1=1
                    }
                     if(this.carPleType.carStatistical[i]=="2"){
                         carStatistical.alarmSun2=1
                     }
                     if(this.carPleType.carStatistical[i]=="3"){
                         carStatistical.alarmSun3=1
                     }
                 }
                carStatistical.type=1;
                 this.$emit('treeSearch',carStatistical)
            },
            carTypeClick(val){
                this.carForm.carEnergyType    = this.carPleType.carEnergyType.length==0?'-1':this.carPleType.carEnergyType.length==2?'':this.carPleType.carEnergyType[0];
                this.carForm.carStatus    =   this.carPleType.carStatus.length==2?2:this.carPleType.carStatus.length==1?this.carPleType.carStatus[0]:-1;
                this.carForm.carType1    =   this.carType1.join(',');
                this.carForm.carType2 =this.carTypesFun();
                this.carForm.type=2
                this.$emit('treeSearch',this.carForm)
            },
            //提交网点得搜索值改变
            handleCheckedCitiesChange(val){
                this.$store.commit('monitoring/changePoleType',this.poleType);
                this.poleType.types=2;
                this.$emit('checkboxClick',this.poleType)

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
            //获取选中得二级车辆类型
            carTypesFun(){
                let type2 =[];
                var textArray="";
                for(var i=0;i<3;i++){
                    for(var z=0;z<this.carPleType.carTypeObj[i].length;z++){
                        type2.push(this.carPleType.carTypeObj[i][z])
                    }
                }
                if(type2.length==0){
                    textArray=-1
                }else{
                    textArray=type2.join(',')
                }

                return textArray;
            },
            // 车辆检索得点击方法
            carChange(val,index){
                if(this.carType1.indexOf(val)<0){
                    this.carPleType.carTypeObj[index]=[];
                }else{
                    for(var i=0;i<this.getSubList(val).length;i++){
                        this.carPleType.carTypeObj[index].push(this.getSubList(val)[i].value);
                    }
                }
            },
        },
        created(){

        },
    }
</script>
<style lang="scss">
    .terminalFilter{
        .el-checkbox__label{
            font-size: 13px !important;
            color: #222222 !important;
            letter-spacing: 0 !important;
            font-weight: 400 !important;
        }
    }
    .carContent{
        .el-checkbox__input.is-checked+.el-checkbox__label{
            font-size: 13px !important;
            color: #222222 !important;
            letter-spacing: 0 ;
            font-weight: 400;
        }
        .el-tag.el-tag--info .el-tag__close{
            color: #1A1A1A !important;
        }
    }

</style>
<style scoped lang="scss">
    .terminalFilter{
        background-color: #fff;
        padding: 12px;
    }
    .header{
        font-size: 13px;
        color: #8E8E8E;
        letter-spacing: 0;
        font-weight: 400;
    }
    .terminalItem{
        border-bottom: 1px solid #E7E7E7;
        ::v-deep .el-radio__label {
            font-size: 13px;
        }
    }
    .carContent{
        margin-left: 12px;
        .terminalItem>div{
            display: inline-block;
        }
        .terminalItem .header{
            width: 100px;
            margin-right: 12px;
            font-size: 13px;
            color: #8E8E8E;
            letter-spacing: 0;
            text-align: right;
            line-height: 34px;
            font-weight: 400;
        }
        .checkContent{
            margin: 10px 0;
        }
        .checkContent .header{
            text-align: left;
            margin-right: 0;
            width: 79px;

        }
        /*.selectContent,.selectContent>.header{*/
            /*!*height: 135px;*!*/
        /*}*/
        .selectContent>div{
            float: left;
        }
        .selectContent .checkContent{
            margin: 0;
        }
        
        label{
            width: 94px !important;
        }

    }
</style>
<style lang="scss">
    .carContent{
        input{
            /*height: 32px !important;*/
            width: 300px !important;
        }
        .el-tag__close{
            /*background-color:#e9e9eb !important;*/
            background-color:transparent !important;
        }
        /*#e9e9eb*/
    }
    .selectContent{ 
        border-bottom: 0 !important;
        &>.header{
            margin-top: 22px
        }
        .terminalItem {
            padding: 8px 0;
        }
    }
</style>