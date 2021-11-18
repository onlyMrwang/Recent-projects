<template>
    <div class="carDetails netwoekDetail">
        <div class="header">
            {{pileDetail.websiteName}}
        </div>
        <div class="carItem">
            <div class="carItemLt">
                <label>所属组织机构:</label>
                <span>{{pileDetail.institutional}}</span>
            </div>
            <!-- <div class="carItemLt">
                <label>网点名称:</label>
                <span>{{pileDetail.websiteName}}</span>
            </div> -->
            <div class="carItemRt">
                <label>所属片区:</label>
                <span>{{pileDetail.area}}</span>
            </div>
        </div>
        <div class="carItem">
            
            <div class="carItemRt">
                <label>充电网点属性:</label>
                <span>{{property(pileDetail.property)}}</span>
            </div>
        </div>
        <div class="carItem">
            <div class="carItemRt">
                <label>总配电容量:</label>
                <span class="blue-text">{{Number(pileDetail.capacity).toFixed(3)}}kWh</span>
            </div>
            <div class="carItemLt">
                <label>运营启动时间:</label>
                <span>{{pileDetail.startTime!=undefined?pileDetail.startTime.split(' ')[0]:''}}</span>
            </div>
        </div>
        <div class="carItemFoot">
            <div class="carItemFootItem"  @click="itemClick(pileDetail,5)" style="margin-left: 35px;">
                <svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M305.6 293.8h418.2c13.6 0 24.7-11.1 24.7-24.7s-11.1-24.7-24.7-24.7H305.6c-13.6 0-24.7 11.1-24.7 24.7 0 13.7 11.1 24.7 24.7 24.7zM303.2 467h418.2c13.6 0 24.7-11.1 24.7-24.7s-11.1-24.7-24.7-24.7H303.2c-13.6 0-24.7 11.1-24.7 24.7 0 13.7 11.1 24.7 24.7 24.7zM579.4 615.5c0-13.6-11.1-24.7-24.7-24.7H306.3c-13.6 0-24.7 11.1-24.7 24.7s11.1 24.7 24.7 24.7h248.4c13.6 0 24.7-11.1 24.7-24.7z" fill="#1992A6 "  />
                    <path d="M889.6 676.8c0-0.1 0.1-0.1 0.1-0.2 0.3-0.4 0.5-0.8 0.8-1.2 0.1-0.1 0.2-0.3 0.2-0.4 0.3-0.4 0.5-0.9 0.8-1.3 0-0.1 0.1-0.2 0.1-0.3l0.6-1.2c0.1-0.1 0.1-0.3 0.2-0.4 0.2-0.5 0.4-1 0.6-1.4 0-0.1 0.1-0.2 0.1-0.2 0.1-0.4 0.3-0.9 0.4-1.3 0-0.1 0.1-0.3 0.1-0.4 0.1-0.5 0.3-1 0.4-1.5v-0.2c0.1-0.5 0.2-0.9 0.2-1.4v-0.4c0.1-0.5 0.1-1 0.1-1.6v-0.2-475c0-68.1-55.4-123.5-123.5-123.5H255.3c-68.1 0-123.5 55.4-123.5 123.5v648.3c0 68.1 55.4 123.5 123.5 123.5h346.5c0.4 0 0.8-0.1 1.2-0.1h0.4c0.3 0 0.5-0.1 0.8-0.1 0.2 0 0.4-0.1 0.5-0.1 0.2 0 0.4-0.1 0.7-0.1 0.2 0 0.4-0.1 0.6-0.1 0.2 0 0.4-0.1 0.6-0.1 0.2 0 0.4-0.1 0.5-0.1 0.2-0.1 0.4-0.1 0.6-0.2 0.2 0 0.3-0.1 0.5-0.2s0.5-0.1 0.7-0.2c0.1 0 0.3-0.1 0.4-0.2 0.2-0.1 0.5-0.2 0.7-0.3 0.1 0 0.2-0.1 0.3-0.1 0.3-0.1 0.5-0.2 0.8-0.4 0.1 0 0.2-0.1 0.3-0.1 0.3-0.1 0.5-0.3 0.8-0.4 0.1 0 0.2-0.1 0.2-0.1 0.3-0.2 0.6-0.3 0.8-0.5 0.1 0 0.1-0.1 0.2-0.1 0.3-0.2 0.6-0.3 0.8-0.5 0.1 0 0.1-0.1 0.2-0.1 0.3-0.2 0.5-0.4 0.8-0.6 0.1-0.1 0.2-0.1 0.2-0.2 0.2-0.2 0.5-0.4 0.7-0.6 0.1-0.1 0.2-0.2 0.4-0.3 0.2-0.2 0.4-0.3 0.6-0.5l0.9-0.9 268.9-273.1c0.4-0.4 0.8-0.8 1.1-1.2l0.3-0.3c0.6-0.6 0.9-1 1.3-1.4zM181.2 836.5V188.2c0-40.9 33.2-74.1 74.1-74.1h515.5c40.9 0 74.1 33.2 74.1 74.1v449.3H699.5C631.4 637.5 576 692.9 576 761v149.6H255.3c-40.9 0-74.1-33.2-74.1-74.1zM625.4 875V761c0-40.9 33.2-74.1 74.1-74.1h111.1L625.4 875z" fill="#1992A6 "  />
                </svg>
                网点详情
            </div>
            <!--<div class="carItemFootItem btnColor"  @click="itemClick(pileDetail,9)" >-->
            <div class="carItemFootItem btnColor"  @click="itemClick(pileDetail,9)" v-if="pileDetail.alarmCount>0">
                <svg class="icon" width="200px" height="200.00px" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                    <path d="M512 167.808c17.664 0 32-14.528 32-32.448V70.464a32.256 32.256 0 0 0-32-32.448c-17.664 0-32 14.528-32 32.448v64.896c0 17.92 14.336 32.448 32 32.448zM131.84 282.56c12.608 12.288 32.576 12.16 44.864-0.384a32.768 32.768 0 0 0 0.448-45.44L131.84 190.72a31.68 31.68 0 0 0-44.864 0.384 32.768 32.768 0 0 0-0.448 45.44l45.312 45.952z m813.312-59.328a31.68 31.68 0 0 0-45.248 0l-45.248 45.888a32.768 32.768 0 0 0 0.384 45.44 31.68 31.68 0 0 0 44.864 0.448l45.248-45.888a32.768 32.768 0 0 0 0-45.888zM912 914.24h-48V557.248c0-197.12-157.632-356.992-352-356.992S160 360.128 160 557.248V914.24h-48c-17.664 0-32 14.528-32 32.448s14.336 32.448 32 32.448h800c17.664 0 32-14.528 32-32.448a32.256 32.256 0 0 0-32-32.448z m-368 0V784.448A32.256 32.256 0 0 0 512 752c-17.664 0-32 14.528-32 32.448V914.24H224V557.248c0-161.28 128.896-292.032 288-292.032s288 130.752 288 292.032V914.24H544z m-32-454.336c-70.72 0-128 58.112-128 129.792s57.28 129.856 128 129.856 128-58.112 128-129.856c0-71.68-57.28-129.792-128-129.792z m0 194.688a63.872 63.872 0 0 1-55.424-32.448 65.728 65.728 0 0 1 0-64.896 63.872 63.872 0 0 1 55.488-32.448c35.328 0 64 29.056 64 64.896S547.328 654.72 512 654.592z" fill="#F54038" />
                </svg>
                告警详情
            </div>
        </div>
    </div>
</template>

<script>
    import {getProfileInfo ,getTypes} from '@/api/monitoring/comsupervision.js'
    import bus from '@/utils/bus'
    export default {
        name: "car-detail",
        props:['mapsId'],

        data(){
            return{
                pileDetail:{},
                addTodo:{},
                natureArray:[],
            }
        },
        watch: {
            mapsId: {
                handler(newName, oldName) {
                    this.pileDetail=newName;
                    this.pileDetail=this.mapsId;
                    this.getTypes();
                },
                immediate: true
            }
        },
        methods: {
            async getTypes(){
                const res = await getTypes({key:"charg_group_nature"});
                if(res.code === 200) {
                    this.natureArray = res.data.result;
                }
            },
            property(val){
                var texts=""
                for(var i=0;i<this.natureArray.length;i++){
                    if(this.natureArray[i].value==val){
                        texts=this.natureArray[i].label
                    }
                }
                return texts
            },
            itemClick(val,type){
                val.type=type
                bus.$emit('clickOpen', val);
            }
        },
        created(){
            this.pileDetail=this.mapsId;
            this.getTypes();
        },
    }
</script>
<style  lang="scss">
    .netwoekDetail{
        .BMap_bubble_content{
            border-top-left-radius: 3px;
            border-top-right-radius: 3px;
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
        padding-left: 11px;
    }
    .carItem{
        font-size: 13px;
    }
    .carItem .blue-text{
        color: #06A0AF ;
    }
    .carItem div{
        /*width: 50%;*/
        /*display: inline-block;*/
        /*padding-left: 10px;*/

    }
    .carItem label{
        margin-right: 10px;
        width: 120px;
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
        padding: 0 5px 0 2px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
    }
    .carItemFootItem svg{
        width: 12px;
        height: 16px;
        position: relative;
        top: 3px;
        left: 2px;
    }
    .btnColor{
        background-color: #41B8C3;
        color: #fff;
    }
</style>