<template>
    <div class="carDetails carsDetauls">
        <div class="header">
            {{pileDetail.carName==null?'车辆详情':pileDetail.carName}}
        </div>
        <div class="carItem">
            <div class="carItemLt">
                <label>车牌号:</label>
                <span>{{pileDetail.plateNo}}</span>
            </div>
            <div class="carItemRt">
                <label>行驶速度:</label>
                <span>{{pileDetail.speed?pileDetail.speed:0}}km/h</span>
            </div>
        </div>
        <div class="carItem">
            <div class="carItemLt">
                <label>今日里程:</label>
                <span>{{pileDetail.mileage?pileDetail.mileage:0}}km</span>
            </div>
            <div class="carItemRt">
                <label>累计里程:</label>
                <span>{{pileDetail.totalMileage?pileDetail.totalMileage:0}}km</span>
            </div>
        </div>
        <div class="carItem">
            <div class="carItemLt">
                <label>车辆状态:</label>
                <span :style="pileDetail.carStatus=='1'?textColor:''">{{pileDetail.carStatus | carStatus}}</span>
            </div>
        </div>
        <div class="carItem">
            <div class="carItemRt" style="width: 100%">
                <label>地理位置信息:</label>
                <span >{{pileDetail.localPosition}}</span>
            </div>
        </div>
        <div class="taskContenet"  v-if="pileDetail.dispatch">
            <div class="taskHeader">
                <div class="carItem catItemLt">
                    <div class="ltCarItem">
                        <label>任务编号:</label>
                       {{pileDetail.dispatch.taskId}}
                    </div>
                    <div class="carItemRt">
                        <label>充电桩:</label>
                      {{pileDetail.dispatch.pileName}}
                    </div>
                </div>
            </div>
           <div class="stepsContent">
                <div class="stepItem">
                   <div class="itemHeader">
                       <div class="itemYuan yuanBgColor">1</div>
                       <div class="itemXian" :class="pileDetail.dispatch.status==1||pileDetail.dispatch.status==2?'itemXianBg':''"></div>
                   </div>

                </div>
               <div class="stepItem">
                   <div class="itemHeader">
                       <div class="itemXian" :class="pileDetail.dispatch.status==2?'itemXianBg':''"></div>
                       <div class="itemYuan itemXianCenter">2</div>
                       <div class="itemXian itemXianSize" :class="pileDetail.dispatch.status==2?'itemXianBg':''"></div>
                   </div>
               </div>
               <div class="stepItem" style="max-width: 30px;max-height: 30px;">
                   <div class="itemHeader">
                       <!--<div class="itemXian"></div>-->
                       <div class="itemYuan">3</div>

                   </div>
               </div>
           </div>
            <div class="stepsTextContent">
                <div class="itemText">
                    <div class="itemTextTitle">
                        派发
                    </div>
                    <div  class="itemTextDate">
                       {{pileDetail.dispatch.dispTime}}
                    </div>
                </div>
                <div class="itemText">
                    <div class="itemTextTitle">
                        充电中
                    </div>
                    <div  class="itemTextDate">
                        {{pileDetail.dispatch.status==2?getNewDates():'--'}}
                    </div>
                </div>
                <div class="itemText" >
                    <div class="itemTextTitle" style="color: #8E8E8E;">
                        已完成
                    </div>
                    <div  class="itemTextDate" style="color: #222;">
                        --
                    </div>
                </div>
            </div>
        </div>
        <div class="carItemFoot">
            <div class="carItemFootItem btnColorBlur"  @click="itemClick(pileDetail,8)" v-if="pileDetail.terminalTypes!=null&&pileDetail.terminalTypes.indexOf('加配')>-1">
                <svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M64 511.99984C64 264.584462 264.584462 64 511.99984 64 759.415218 64 959.99968 264.584462 959.99968 511.99984 959.99968 759.415218 759.415218 959.99968 511.99984 959.99968 264.584462 959.99968 64 759.415218 64 511.99984M414.843608 309.742846C386.052152 293.883651 362.66656 307.56258 362.66656 340.415901L362.66656 683.553912C362.66656 716.1683 386.022285 730.116029 414.843608 714.226968L729.070696 540.791296C757.802419 524.902235 757.862152 499.097445 729.070696 483.178517L414.843608 309.742846Z" fill="#1992A6"/>
                </svg>  视频
            </div>
            <div class="carItemFootItem btnColorBlur disabledBtn"  @click="itemClick(pileDetail,10)" >
                <svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M 510.977 1024 A 509.404 509.404 0 0 1 2.15028 515.173 a 29.422 29.422 0 0 1 28.8451 -28.8451 a 28.8451 28.8451 0 0 1 28.8451 28.8451 a 451.714 451.714 0 1 0 111.342 -296.527 c -10.9611 12.6918 -20.7685 25.3837 -30.5758 38.6524 a 28.8451 28.8451 0 0 1 -39.8062 7.49972 a 29.422 29.422 0 0 1 -7.49972 -40.3831 c 10.9611 -14.9994 22.4992 -29.422 34.6141 -43.8445 a 508.827 508.827 0 1 1 383.063 843.43 Z" fill="#aaa" /><path d="M 318.869 287.297 H 90.9931 a 28.8451 28.8451 0 0 1 -26.5375 -27.6913 v -230.761 a 28.8451 28.8451 0 0 1 57.6901 0 v 200.762 h 196.723 a 29.422 29.422 0 0 1 28.8451 28.8451 a 28.8451 28.8451 0 0 1 -28.8451 28.8451 Z M 397.905 765.548 a 29.422 29.422 0 0 1 -14.4225 -3.46141 a 28.8451 28.8451 0 0 1 -14.4225 -25.3837 V 337.487 a 28.8451 28.8451 0 0 1 41.5369 -25.3837 l 346.141 200.185 a 28.2682 28.2682 0 0 1 0 49.6135 l -346.141 200.185 a 32.8834 32.8834 0 0 1 -12.6918 3.46141 Z m 28.8451 -378.447 v 299.989 l 259.606 -149.994 Z" fill="#aaa" />
                </svg>回放
            </div>
            <div class="carItemFootItem btnColorBlur"  @click="itemClick(pileDetail,7)">
                <svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M305.6 293.8h418.2c13.6 0 24.7-11.1 24.7-24.7s-11.1-24.7-24.7-24.7H305.6c-13.6 0-24.7 11.1-24.7 24.7 0 13.7 11.1 24.7 24.7 24.7zM303.2 467h418.2c13.6 0 24.7-11.1 24.7-24.7s-11.1-24.7-24.7-24.7H303.2c-13.6 0-24.7 11.1-24.7 24.7 0 13.7 11.1 24.7 24.7 24.7zM579.4 615.5c0-13.6-11.1-24.7-24.7-24.7H306.3c-13.6 0-24.7 11.1-24.7 24.7s11.1 24.7 24.7 24.7h248.4c13.6 0 24.7-11.1 24.7-24.7z" fill="#1992A6 "  />
                    <path d="M889.6 676.8c0-0.1 0.1-0.1 0.1-0.2 0.3-0.4 0.5-0.8 0.8-1.2 0.1-0.1 0.2-0.3 0.2-0.4 0.3-0.4 0.5-0.9 0.8-1.3 0-0.1 0.1-0.2 0.1-0.3l0.6-1.2c0.1-0.1 0.1-0.3 0.2-0.4 0.2-0.5 0.4-1 0.6-1.4 0-0.1 0.1-0.2 0.1-0.2 0.1-0.4 0.3-0.9 0.4-1.3 0-0.1 0.1-0.3 0.1-0.4 0.1-0.5 0.3-1 0.4-1.5v-0.2c0.1-0.5 0.2-0.9 0.2-1.4v-0.4c0.1-0.5 0.1-1 0.1-1.6v-0.2-475c0-68.1-55.4-123.5-123.5-123.5H255.3c-68.1 0-123.5 55.4-123.5 123.5v648.3c0 68.1 55.4 123.5 123.5 123.5h346.5c0.4 0 0.8-0.1 1.2-0.1h0.4c0.3 0 0.5-0.1 0.8-0.1 0.2 0 0.4-0.1 0.5-0.1 0.2 0 0.4-0.1 0.7-0.1 0.2 0 0.4-0.1 0.6-0.1 0.2 0 0.4-0.1 0.6-0.1 0.2 0 0.4-0.1 0.5-0.1 0.2-0.1 0.4-0.1 0.6-0.2 0.2 0 0.3-0.1 0.5-0.2s0.5-0.1 0.7-0.2c0.1 0 0.3-0.1 0.4-0.2 0.2-0.1 0.5-0.2 0.7-0.3 0.1 0 0.2-0.1 0.3-0.1 0.3-0.1 0.5-0.2 0.8-0.4 0.1 0 0.2-0.1 0.3-0.1 0.3-0.1 0.5-0.3 0.8-0.4 0.1 0 0.2-0.1 0.2-0.1 0.3-0.2 0.6-0.3 0.8-0.5 0.1 0 0.1-0.1 0.2-0.1 0.3-0.2 0.6-0.3 0.8-0.5 0.1 0 0.1-0.1 0.2-0.1 0.3-0.2 0.5-0.4 0.8-0.6 0.1-0.1 0.2-0.1 0.2-0.2 0.2-0.2 0.5-0.4 0.7-0.6 0.1-0.1 0.2-0.2 0.4-0.3 0.2-0.2 0.4-0.3 0.6-0.5l0.9-0.9 268.9-273.1c0.4-0.4 0.8-0.8 1.1-1.2l0.3-0.3c0.6-0.6 0.9-1 1.3-1.4zM181.2 836.5V188.2c0-40.9 33.2-74.1 74.1-74.1h515.5c40.9 0 74.1 33.2 74.1 74.1v449.3H699.5C631.4 637.5 576 692.9 576 761v149.6H255.3c-40.9 0-74.1-33.2-74.1-74.1zM625.4 875V761c0-40.9 33.2-74.1 74.1-74.1h111.1L625.4 875z" fill="#1992A6 "  />
                </svg>详情
            </div>
            <div class="carItemFootItem btnColor btnColorBlur"  @click="itemClick(pileDetail,9)" v-if="pileDetail.alarmCount>0">
                <svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M512 167.808c17.664 0 32-14.528 32-32.448V70.464a32.256 32.256 0 0 0-32-32.448c-17.664 0-32 14.528-32 32.448v64.896c0 17.92 14.336 32.448 32 32.448zM131.84 282.56c12.608 12.288 32.576 12.16 44.864-0.384a32.768 32.768 0 0 0 0.448-45.44L131.84 190.72a31.68 31.68 0 0 0-44.864 0.384 32.768 32.768 0 0 0-0.448 45.44l45.312 45.952z m813.312-59.328a31.68 31.68 0 0 0-45.248 0l-45.248 45.888a32.768 32.768 0 0 0 0.384 45.44 31.68 31.68 0 0 0 44.864 0.448l45.248-45.888a32.768 32.768 0 0 0 0-45.888zM912 914.24h-48V557.248c0-197.12-157.632-356.992-352-356.992S160 360.128 160 557.248V914.24h-48c-17.664 0-32 14.528-32 32.448s14.336 32.448 32 32.448h800c17.664 0 32-14.528 32-32.448a32.256 32.256 0 0 0-32-32.448z m-368 0V784.448A32.256 32.256 0 0 0 512 752c-17.664 0-32 14.528-32 32.448V914.24H224V557.248c0-161.28 128.896-292.032 288-292.032s288 130.752 288 292.032V914.24H544z m-32-454.336c-70.72 0-128 58.112-128 129.792s57.28 129.856 128 129.856 128-58.112 128-129.856c0-71.68-57.28-129.792-128-129.792z m0 194.688a63.872 63.872 0 0 1-55.424-32.448 65.728 65.728 0 0 1 0-64.896 63.872 63.872 0 0 1 55.488-32.448c35.328 0 64 29.056 64 64.896S547.328 654.72 512 654.592z" fill="#F54038" />
                </svg>告警
            </div>
        </div>
    </div>
</template>

<script>
    import bus from '@/utils/bus'
    export default {
        name: "car-detail",
        props:['mapsId'],
        filters:{
            carStatus(val){
                var textType = '';
                if(val==1){
                    textType='在线'
                }else{
                    textType='离线'
                }
                return textType
            }
        },
        data(){
            return{
                loading: {},//loading加载对象
                pileDetail:{},
                addTodo:{},
                textColor:'color:#21BC17',
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
            itemClick(val,type){
                val.type=type
                if(type==9){
                    val.carInfoName='车辆告警详情'
                }
                console.log(val);
                bus.$emit('clickOpen', val);
            },
            getNewDates(){
                var date = new Date();
                this.year = date.getFullYear();
                this.month = date.getMonth() + 1;
                this.date = date.getDate();
                this.hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
                this.minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
                this.second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
                var currentTime = this.year + "-" + this.month + "-" + this.date + " " + this.hour + ":" + this.minute + ":" + this.second;
                return currentTime
            }
        },
        created(){
            this.pileDetail=this.mapsId
        },
    }
</script>
<style  lang="scss">
    .carsDetauls{
        .BMap_bubble_content{
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
        font-size: 13px;
    }
    .carItem div{
        width: 50%;
        display: inline-block;

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
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .carItemFoot{
        justify-content:space-evenly;
        font-size: 14px;
    }
    .carItemFootItem{
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
    }
    .taskContenet{
        border: 1px solid #D2D2D2;
        border-radius: 3px;
        margin: 12px;
        padding: 12px 0;

    }
    .taskContenet label{
        width: 60px;
        margin-right: 0;
    }
    .taskHeader .carItemLt,.taskHeader .carItemRt{
        height: 22px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .btnColorBlur svg{
        left: -5px !important;
    }
    .disabledBtn {
        border-color: #ddd;
        cursor: not-allowed;
        color: #ccc;
        background-color: #ddd;
    }
    .stepsContent{
        display: flex;
        margin: 12px 0;
        padding: 0 12%;
    }
    .stepsContent>div{
        flex: 1;
    }
    .taskContenet .carItem {
        display: flex;
    }
    .taskContenet .carItem>div{
        flex: 1;
    }
    .taskContenet .carItem .ltCarItem{
        min-width: 58% !important;
    }
    .itemHeader{
        position: relative;
        overflow: hidden;
   }

    .itemHeader .itemYuan{
        max-width: 22px;
        max-height: 22px;
        line-height: 22px;
        background: #FFFFFF;
        border: 2px solid #41B8C3;
        border-radius: 50%;
        text-align: center;
        font-size: 14px;
        color: #41B8C3;
        letter-spacing: 0;
        font-weight: 500;
    }
    .itemHeader .itemXian{
        height: 2px;
        position: absolute;
        width: 80%;
        left: 18%;
        top: 12px;
    }
    .stepsTextContent {
        display: flex;
    }
    .stepsTextContent>div{
        flex: 1;
        text-align: center;
    }
    .itemTextTitle{
        font-size: 13px;
        color: #222222;
        letter-spacing: 0;
        text-align: center;
        font-weight: 400;
    }
    .itemXianBg{
        background-color: #41B8C3 !important;
    }
    .yuanBgColor{
        background-color:rgba(65,184,195,1)!important;
        font-size: 14px !important;
        color: #FFFFFF !important;
        font-weight: 600 !important;
    }
    .itemTextDate{
        font-size: 12px;
        color: #8E8E8E;
        letter-spacing: 0;
        text-align: center;
        line-height: 16px;
        font-weight: 400;
    }
    .itemXianSize{
        background-size:50% 50% !important;
    }
</style>