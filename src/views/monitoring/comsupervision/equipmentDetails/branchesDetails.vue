<template>
    <!--网点详情-->
    <div class="branchesDetails">
        <div class="branchesHerders">
            <div class="headerBox">
                <div class="title">&nbsp;&nbsp;网点详情</div>
                <div class="back" @click="goBack">
                    <img :src="backImg"  style="width: 16px;height: 14px;" />
                </div>
            </div>
                <div class="headerComtent">
                    <div v-for="(item,index) in headerComtent" :key="index" class="itemHeader"
                         :style="{backgroundImage: 'url(' + item.imgUrl + ')', backgroundSize:'100%,100%'}"
                         @click="cliclCheckList(item,index)"
                    >
                        <div class="typeBg">
                            <img src="../../../../assets/monitoring/typebg/checkbox1.png"    v-if="item.imgTypes==2">
                            <img src="../../../../assets/monitoring/typebg/checkbox2.png"    v-if="item.imgTypes==1">
                        </div>
                        <div class="labelText">{{item.label}}</div>
                        <div>
                            {{item.numBer}}
                        </div>
                    </div>
                </div>
        </div>
        <div class="branContent">
            <div class="branTypeContent">
                <label style="margin-left: 10px;">设备类型:</label>
                <div class="chakBoxContent">
                    <el-checkbox-group v-model="typeList" @change="checkLists">
                        <div class="typeComtent">
                            <div v-for="(item,index) in typeComtent" :key="index">
                                <el-checkbox   :label="item.value" >{{item.label}}</el-checkbox>
                            </div>
                        </div>
                    </el-checkbox-group>
                </div>
            </div>
            <div style="margin-top: 10px;">
                <div class="branItem" v-for="(item,index) in pileDetail.details" :key="index" @click.stop="itemClick(item,2)">
                    <div class="branItemHeader" :title="item.deviceNo+' - '+item.deviceName">
                        <b>{{item.deviceNo}} - {{item.deviceName==''||item.deviceName==null?'-':item.deviceName}}</b>
                    </div>
                    <div class="branItemComtent">
                        <div class="branItemLt">
                            <div class="jixiebi" @click.stop="itemClick(item,3)" v-if="item.robotName">
                                <img src="../../../../assets/monitoring/zhuang/jixiebi.png" alt="" >
                            </div>
                            <div class="jixiebi jixiebiBg" @click.stop="itemClick(item,3)" v-if="item.robotName">
                                <img src="../../../../assets/monitoring/zhuang/jixiebi-bg.png" alt="" >
                            </div>
                            <div v-if="item.deviceType==0">
                                <img src="../../../../assets/monitoring/zhuang/jlz-green.png" alt="" v-if="item.status=='1'">
                                <img src="../../../../assets/monitoring/zhuang/jlz-blue.png" alt="" v-if="item.status=='12'||item.status=='9'">
                                <img src="../../../../assets/monitoring/zhuang/jlz-red.png" alt=""  v-if="item.status=='4'">
                                <img src="../../../../assets/monitoring/zhuang/jlz-gry.png" alt=""  v-if="item.status=='10'">
                            </div>
                            <div v-else>
                                <img src="../../../../assets/monitoring/zhuang/zlz-green.png" alt="" v-if="item.status=='1'">
                                <img src="../../../../assets/monitoring/zhuang/zlz-blue.png" alt="" v-if="item.status=='12'||item.status=='9'">
                                <img src="../../../../assets/monitoring/zhuang/zlz-red.png" alt=""  v-if="item.status=='4'">
                                <img src="../../../../assets/monitoring/zhuang/zlz-gray.png" alt=""  v-if="item.status=='10'">
                            </div>

                        </div>
                        <div class="branItemRt">
                            <div class="branItemRtHaeder" :title="item.gunNo==''||item.gunNo==null?'-':item.gunNo+'枪'">
                                    {{item.gunNo==''||item.gunNo==null?'-':item.gunNo}}枪
                            </div>
                            <div class="branItemRtItem" :title="item.realVoltage==''||item.realVoltage==null?'-':item.realVoltage+'v'">
                                <label>电压:</label>
                                 <span>
                                       {{item.realVoltage==''||item.realVoltage==null?'-':item.realVoltage+'v'}}
                                 </span>
                            </div>
                            <div class="branItemRtItem" :title="item.realElectricity==''||item.realElectricity==null?'-':item.realElectricity+'A'">
                                <label>电流:</label>
                                  <span>
                                       {{item.realElectricity==''||item.realElectricity==null?'-':item.realElectricity+'A'}}
                                  </span>
                            </div>
                            <div class="branItemRtItem" :title="item.realPower==''||item.realPower==null?'-':item.realPower+'kW'">
                                <label>实时功率:</label>
                                 <span>
                                       {{item.realPower==''||item.realPower==null?'-':item.realPower+'kW'}}
                                 </span>

                            </div>
                            <div class="branItemRtItem" :title="item.soc==''||item.soc==null?'-':item.soc+'%'">
                                <label>SOC:</label>
                                   <span>
                                        {{item.soc==''||item.soc==null?'-':item.soc+'%'}}
                                   </span>
                            </div>
                            <div class="branItemRtItem" :title="textType(item.deviceType)">
                                <label>设备类型:</label>
                                    <span>
                                        {{textType(item.deviceType)}}
                                    </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {getDetails,getTypes} from '@/api/monitoring/comsupervision.js'
    import { mapGetters } from 'vuex'
    export default {
        computed: {
            ...mapGetters(['poleType'])

        },
        name: "branches-details",
        data(){
            return {
                backImg: require('@/assets/monitoring/type/fanhui.svg'),
                typeObj:{},
                typeComtent:[],
                typeList:[],
                checkList:["1",'12','9','4','10'],
                headerComtent:[
                    {
                        label:'充电中',
                        imgUrl:require('../../../../assets/monitoring/typebg/cdzbg.png'),
                        numBer:1,
                        types:"1",
                        imgTypes:1,
                    },
                    {
                        label:'空闲',
                        imgUrl:require('../../../../assets/monitoring/typebg/kxbg.png'),
                        numBer:2,
                        types:"12",
                        imgTypes:1,
                    },
                    {
                        label:'预约',
                        imgUrl:require('../../../../assets/monitoring/typebg/yybg.png'),
                        numBer:3,
                        types:"9",
                        imgTypes:1,
                    },
                    {
                        label:'故障',
                        imgUrl:require('../../../../assets/monitoring/typebg/gzbg.png'),
                        numBer:4,
                        types:'4',
                        imgTypes:1,
                    },
                    {
                        label:'离线',
                        imgUrl:require('../../../../assets/monitoring/typebg/lxbg.png'),
                        numBer:5,
                        types:'10',
                        imgTypes:1,
                    },
                ],
                pileDetail:{},
                newDate:{},
            }
        },
        props:['infos'],
        watch: {
            poleType: {
                handler(newName, oldName) {
                    this.poleTypes(newName)
                },
                deep:true
            },
            infos: {
                handler(newName, oldName) {
                    // this.info=newName;
                    this.getTypes()
                    this.getDetails()
                },
                immediate: true
            },
        },
        methods:{
            goBack() {
                this.$emit('changeType')
            },
            itemClick(val,types){
                let newVal={};
                newVal.deviceNo=val.deviceNo
                if(types==2){
                    newVal.gunNo=val.gunNo
                }else{
                    newVal.robotNo=val.robotNo
                }
                newVal.type=types;
                newVal.parentType=5;
                newVal.siteNo=this.infos.siteNo;
                this.$emit('clickOpen',newVal)
            },
            async getDetails(){
                const res = await getDetails({siteNo:this.infos.siteNo});
                if(res.code === 200) {
                    this.pileDetail = res.data;
                    this.newDate = JSON.parse(JSON.stringify( res.data))
                    this.headerComtent[0].numBer=res.data.chargingSum
                    this.headerComtent[1].numBer=res.data.leisureSum
                    this.headerComtent[2].numBer=res.data.appointmentSum
                    this.headerComtent[3].numBer=res.data.faultSum
                    this.headerComtent[4].numBer=res.data.offLineSum
                }
            },
            async getTypes(){
                const res = await getTypes({key:'charg_equip_type'});
                this.typeComtent=res.data.result
                this.poleTypes();

            },
            poleTypes(val){
                var poleTypeDta={};
                this.typeList=[];
                this.checkList=[];
                if(val==undefined){
                    poleTypeDta=this.poleType
                }else{
                    poleTypeDta=val
                }
                for(var z=0;z<poleTypeDta.terminalType.length;z++){
                    let orj=this.poleType.terminalType[z]
                    for(var i=0;i<this.typeComtent.length;i++){
                        if(orj==this.typeComtent[i].property||this.typeComtent[i].property==2){
                            this.typeList.push(this.typeComtent[i].value)
                        }
                    }
                }

                if(poleTypeDta.terminalOnlineType.length==0){
                    for(var i=0;i<this.headerComtent.length;i++){
                        this.headerComtent[i].imgTypes=2;
                        this.checkList=[];
                    }
                }else if(poleTypeDta.terminalOnlineType.length==1){
                    for(var z=0;z<this.headerComtent.length;z++){
                        if(poleTypeDta.terminalOnlineType[0]=='1'){
                            if(z<this.headerComtent.length-1){
                                this.headerComtent[z].imgTypes=1;
                            }else{
                                this.headerComtent[this.headerComtent.length-1].imgTypes=2;
                            }
                            this.checkList=["1",'12','9','4'];

                        }else{
                            this.checkList=['10'];
                            if(z<this.headerComtent.length-1){
                                this.headerComtent[z].imgTypes=2;
                            }else{
                                this.headerComtent[this.headerComtent.length-1].imgTypes=1;
                            }
                        }
                    }
                 }else{
                    this.checkList=["1",'12','9','4','10'];
                    for(var z=0;z<this.headerComtent.length;z++){
                       this.headerComtent[z].imgTypes=1;
                    }
                }
                this.checkLists();
            },
            textType(val){
                var text='';
                for(var i=0;i<this.typeComtent.length;i++){
                    if(val==this.typeComtent[i].value){
                        text=this.typeComtent[i].label;
                    }
                }
                return text;
            },
            //点击单选框数据重构
            checkLists(){
                let pileDetail=[];
                this.pileDetail.details=[];
                for(var i=0;i<this.newDate.details.length;i++){
                    var  old=this.newDate.details[i];
                    for(var z=0;z<this.checkList.length;z++){
                        if(old.status==this.checkList[z]){
                            var oldDate=this.newDate.details[i]
                            for(var x=0;x<this.typeList.length;x++){
                                if(old.deviceType==this.typeList[x]){
                                    pileDetail.push(this.newDate.details[i])
                                }
                            }
                        }
                    }
                }
                this.pileDetail.details=JSON.parse(JSON.stringify(pileDetail));
            },
            cliclCheckList(val,index){
               this.headerComtent[index].imgTypes=(this.headerComtent[index].imgTypes==1?2:1);
               var indexs = this.checkList.indexOf(val.types)
                if(indexs>-1){
                    this.checkList.splice(indexs,1)
                }else{
                    this.checkList.push(val.types)
                }
                this.checkLists()
            }
        },
        created(){

        }
    }
</script>
<style scoped lang="scss">
    @import "@/assets/styles/global.scss";
    //头部样式
    .headerBox {
        display: flex;
        align-items: center;
        justify-content: space-between;
        background-color: #fff;
        padding: 10px 20px 10px 0;
        .title {
            font-size: 16px;
            color: #222222;
            &::before {
                content: '|';
                color:  $btnMainColor;
                height: 5px;
                width: 2px;
                background: $btnMainColor;
            }
        }
        .back {
            width: 36px;
            cursor: pointer;
            border: 1px solid #DEDEDE;
            border-radius: 2px;
            text-align: center;
        }
    }
    .branchesHerders{
        background-color: #fff;
        overflow: hidden;
    }
    .headerComtent{
        padding-right: 22px;
        display: flex;
        padding:8px 0 19px 0 ;

        padding-right: 19px;
    }
    .headerComtent>div{
        flex: 1;
        margin-left: 22px;
        height: 70px;
        line-height: 70px;
        text-align: left;
        float: left;
        color: #fff;
        font-size: 18px;
        border-radius: 4px;
    }
    .itemHeader{
        display: flex;
        font-size: 18px;
        color: #FFFFFF;
        letter-spacing: 0;
        font-weight: 500;
        cursor: pointer;
    }
    .itemHeader>div{
        flex: 1;
    }
    .typeBg{
        margin-left: 22px;
        z-index: 200;
        max-width: 14px;
        height: 14px;
        margin-right: 6px;
    }
    .typeBg img{
        width: 100%;
        height: 100%;
    }
    .labelText{
        font-size: 14px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: right;
        font-weight: 500;
        margin-right: 30px;
        text-align: left;
    }
    .branContent{
        background-color: #fff;
        overflow: hidden;
        padding: 10px 0;
        margin-top: 10px;

        .el-checkbox__label{
            color: #fff;
        }
    }
    .branItem{
        background-color: #fff;
        width: 23.2%;
        overflow: hidden;
        border: 1px solid #DEDEDE;
        border-radius: 3px;
        color: #222222;
        float: left;
        margin-left: 12px;
        margin-bottom: 12px;
    }
    .branItemHeader{
        height: 30px;
        line-height: 30px;
        border-bottom: 1px solid #EDEDED;
        cursor: pointer;
    }
    .branItemHeader b{
       width: 90%;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .branItemRtHaeder,.branItemHeader{
        font-size: 12px;
        cursor: pointer;
    }
    .branItemHeader b{
        display: inline-block;
        margin-left: 10px;
    }
    .branItemComtent{
        
        padding: 10px;
        display: flex;
    }
    .branItemComtent>div{
        flex: 1;
        display: inline-block;
    }
    .branItemLt{
        max-width: 52px;
        max-height: 109px;
        margin-right: 15px;
        margin-left: 5px;
        position: relative;
    }
    .branItemRtItem{
        height: 20px;
        line-height: 20px;
        display: flex;
        cursor: pointer;
    }
    .jixiebi{
        position: absolute;
        left: 6px;
        max-width: 20px;
        max-height: 78px;
        bottom:0;
        z-index: 100;
        cursor: pointer;
    }
    .branItemLt:hover .jixiebiBg{
            display: block;
    }
    .jixiebiBg{
        display: none;
        z-index: 90;
        max-width: 25px;
        max-height: 85px;
        left: 2px;
        bottom:-1px;
    }
    .branItemLt img{
        max-width:100%;
        max-height: 120px;
        background-size: 100% 100%;
    }
    .branItemRt{
        font-size: 12px;
    }
    .branItemRtItem label,.branItemRtItem span{
        flex: 1;
    }
    .branItemRtItem span{
        display: inline-block;
        max-width: 60%;
        /*margin-left: 78px;*/
        overflow:hidden;
        white-space:nowrap;
        text-overflow:ellipsis;
    }
    .branItemRt label{
        color: #8E8E8E;
        max-width: 65px;
        /*min-width: 65px !important;*/
        display: inline-block;
    }
</style>
<style lang="scss">

    /* 设置鼠标经过对勾框，对勾框边框的颜色 */
    .headerComtent .el-checkbox__inner:hover{
        border-color: #38B901;
    }
    .branchesDetails{
        .el-checkbox__label{
            font-size: 14px;
            color: #FFFFFF !important;
            letter-spacing: 0 !important;
            text-align: right !important;
            font-weight: 500 !important;
        }
        .el-checkbox{
            margin-left: 22px;
            margin-right: 30px;
        }
    }
    .branTypeContent{
        .typeComtent{
            display: inline-block;
        }
        label{
            width: 78px;
            height: 18px;
            font-size: 13px;
            color: #222222;
            letter-spacing: 0;
            text-align: justify;
            font-weight: 400;
        }
        .typeComtent>div{
            height: 18px;
            line-height: 18px;
            font-size: 13px;
            letter-spacing: 0;
            font-weight: 400;
            display: inline-block;
        }
        .typeComtent>div{
            margin-right: 30px !important;

            &:first-child{
                margin-left: 10px;
            }
        }
        .typeComtent .el-checkbox{
            margin-left:5px;
            margin-right: 5px;
            width: fit-content;
        }
        .chakBoxContent{
            display: inline-block !important;
            width: calc(100% - 100px);
        }
        .el-checkbox__label{
            color: #222 !important;
            font-size: 13px !important;
        }
    }


</style>