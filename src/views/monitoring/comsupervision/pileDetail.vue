<template>
    <div class="carDetails carsDetauls">
        <div class="header">
           {{pileDetail.poleName}}
        </div>
       <div class="carItem">
          <div class="carItemLt">
              <label>枪数:</label>
              <span>{{pileDetail.gunSum}}个</span>
          </div>
           <div class="carItemRt">
               <label>额定功率:</label>
               <span>{{pileDetail.ratedPow}}kW</span>
           </div>
       </div>
        <div class="carItem">
            <div class="carItemLt">
                <label>设备类型:</label>
                <span>{{typeItem(pileDetail.deviceType)}}</span>
            </div>
            <div class="carItemRt">
                <label>充电设备状态:</label>
                <span style="color: #00B3FF">{{pileDetail.status==1?'在线':'离线'}}</span>
            </div>
        </div>
        <div class="carItem carItemList">
            <div class="carItemLt">
                <label>所属网点:</label>
                <span>{{pileDetail.websiteName}}</span>
            </div>
        </div>
        <div class="carItem carItemList">
            <div class="carItemLt">
                <label>所属组织机构:</label>
                <span>{{pileDetail.orgName}}</span>
            </div>
        </div>
        <div class="carItemFoot">
            <div v-if="pileDetail.terminalStatus">
                <div class="carItemFootItem"  :title="item.gunNum+'号枪'" v-for='(item,index) in pileDetail.armVos' :key="index" @click="itemClick(item,2)" v-if="item.terminalType=='0'&&pileDetail.terminalStatus=='0'&&pileDetail.robotName==item.gunNum">
                    {{item.gunNum}}号枪
                </div>
                <div class="carItemFootItem" :title="item.robotName+'机器人'" v-for='(item,index) in pileDetail.armVos' :key="index" @click="itemClick(item,3)" v-if="item.terminalType=='1'&&pileDetail.terminalStatus=='1'&&pileDetail.robotName==item.robotName">
                    {{item.robotName}}机器人
                </div>
            </div>
            <div v-else>
                <div class="carItemFootItem"  :title="item.gunNum+'号枪'" v-for='(item,index) in pileDetail.armVos' :key="index" @click="itemClick(item,2)" v-if="item.terminalType=='0'">
                    {{item.gunNum}}号枪
                </div>
                <div class="carItemFootItem" :title="item.robotName+'机器人'" v-for='(item,index) in pileDetail.armVos' :key="index" @click="itemClick(item,3)" v-if="item.terminalType=='1'">
                    {{item.robotName}}机器人
                </div>
            </div>
            <!--<div class="carItemFootItem btnColor"  @click="itemClick(pileDetail,9)">-->
            <div class="carItemFootItem btnColor"  @click="itemClick(pileDetail,9)" title="告警详情" v-if="pileDetail.alarmCount>0">
                <svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M512 167.808c17.664 0 32-14.528 32-32.448V70.464a32.256 32.256 0 0 0-32-32.448c-17.664 0-32 14.528-32 32.448v64.896c0 17.92 14.336 32.448 32 32.448zM131.84 282.56c12.608 12.288 32.576 12.16 44.864-0.384a32.768 32.768 0 0 0 0.448-45.44L131.84 190.72a31.68 31.68 0 0 0-44.864 0.384 32.768 32.768 0 0 0-0.448 45.44l45.312 45.952z m813.312-59.328a31.68 31.68 0 0 0-45.248 0l-45.248 45.888a32.768 32.768 0 0 0 0.384 45.44 31.68 31.68 0 0 0 44.864 0.448l45.248-45.888a32.768 32.768 0 0 0 0-45.888zM912 914.24h-48V557.248c0-197.12-157.632-356.992-352-356.992S160 360.128 160 557.248V914.24h-48c-17.664 0-32 14.528-32 32.448s14.336 32.448 32 32.448h800c17.664 0 32-14.528 32-32.448a32.256 32.256 0 0 0-32-32.448z m-368 0V784.448A32.256 32.256 0 0 0 512 752c-17.664 0-32 14.528-32 32.448V914.24H224V557.248c0-161.28 128.896-292.032 288-292.032s288 130.752 288 292.032V914.24H544z m-32-454.336c-70.72 0-128 58.112-128 129.792s57.28 129.856 128 129.856 128-58.112 128-129.856c0-71.68-57.28-129.792-128-129.792z m0 194.688a63.872 63.872 0 0 1-55.424-32.448 65.728 65.728 0 0 1 0-64.896 63.872 63.872 0 0 1 55.488-32.448c35.328 0 64 29.056 64 64.896S547.328 654.72 512 654.592z" fill="#F54038" />
                </svg>
                告警详情
            </div>
        </div>
    </div>
</template>

<script>
    import {getPileDetails} from '@/api/monitoring/comsupervision.js'
    import {getTypes} from '@/api/monitoring/comsupervision.js'
    import bus from '@/utils/bus'
    export default {
        name: "car-detail",
        props:['mapsId'],
        data(){
          return{
              pileDetail:{},
              addTodo:{},
              typeComtent:{},
          }
        },
        watch: {
            mapsId: {
                handler(newName, oldName) {
                    this.pileDetail=newName;
                },
                immediate: true
            },
        },
        methods: {
            async getTypes(){
                const res = await getTypes({key:'charg_equip_type'});
                this.typeComtent=res.data.result
            },
            typeItem(val){
                let typeText="";
                for(var i=0;i<this.typeComtent.length;i++){
                    if(val==Number(this.typeComtent[i].value)){
                        typeText=this.typeComtent[i].label;
                    }
                }
                return typeText
            },
            itemClick(val,type){
                let newDate={};
                if(type==9){
                    newDate=val
                }else{
                    newDate.deviceNo=this.pileDetail.poleNo
                    if(type==2){
                        newDate.gunNo=val.gunNum
                    }else if(type==3){
                        newDate.robotNo=val.robotNo
                    }
                }
                newDate.type=type

                bus.$emit('clickOpen', newDate);
            }
        },
        created(){
            this.getTypes()
            this.pileDetail=this.mapsId;
        },
    }
</script>
<style  lang="scss">
    .carsDetauls{
        .BMap_bubble_content{
            /*border-top-left-radius: 7px;*/
            /*border-top-right-radius: 7px;*/
            border-radius: 3px !important;
            width: 350px !important;
            right: 0;
            left: 0;
        }
    }
</style>
<style scoped>
    .header{
        background-color: #E4F3F5;
        padding: 6px 11px;
        margin-bottom: 10px;
        color: #222222;
        letter-spacing: 0;
        font-weight: 500;
        font-size: 15px;
    }
    .carItem{
        /*padding: 0 10px;*/
        /*margin-top: 10px;*/
        font-size: 13px;
    }
    .carItem div{
        width: 50%;
        display: inline-block;
    }
    .carItemList div{
        width:100%;
    }
    .carItem label{
        margin-right: 10px;
        width: 100px;
        text-align: right;
        display: inline-block;
        font-size: 13px;
        color: #8E8E8E;
        letter-spacing: 0;
        text-align: right;
        line-height: 24px;
    }
    .carItem span{
        font-size: 13px;
        color: #222222;
        letter-spacing: 0;
        line-height: 24px;
        font-weight: 400;
    }
    .carItemFoot{
        /*display: flex;*/
        justify-content:space-evenly;
        font-size: 14px;
    }
    .carItemFootItem{
        /*flex: 1;*/
        background-color: #F0FEFF;
        max-width: 74px;
        min-width: 74px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: #1992A6;
        border-radius: 3px;
        margin-top: 10px;
        border: 1px solid #1992A6;
        cursor: pointer;
        float: left;
        margin-left: 20px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
</style>