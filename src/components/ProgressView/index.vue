<template>
    <div class="progressContent">
       <div class="progressBody">
           <el-progress :text-inside="true" :stroke-width="28" :percentage="progre" status="success"></el-progress>
       </div>
        <div>
            <el-input-number   size="mini"  v-model="num" @blur="handleChange(num)" @change="handleChange" :min="1" :max="330" label="描述文字"></el-input-number>
        </div>
    </div>
</template>
<script>
    export default {
        name: "index",
        data(){
            return {
                progre:70,
                num:1
            }
        },
        methods:{
            handleChange(val){
                this.progre=parseInt((val/330)*100);
            },
        },
        watch:{
            progressNumber:{
                progressNumber(newName, oldName) {
                    console.log(newName)
                },
                immediate: true
            },
        },
        props:{
            progressNumber:{
                type:Number,
                required:true
            },
        },
        created(){
            console.log(this.progressNumber)
            this.num=this.progressNumber;
            this.handleChange(this.progressNumber);
            // this.num=this.progress
            // this.handleChange(this.progress)
        },
    }
</script>
<style lang="scss">
    .progressContent{
        .el-input--mini{
            .el-input__inner{
                width: 130px;
            }
        }
    }
</style>
<style scoped>
    .progressContent{
        display: flex;
    }
    .progressContent>div{
        flex: 1;
        line-height: 32px;
    }
    .progressBody{
        max-width: 75%;
        min-width: 75%;
        margin-right: 3%;
    }
</style>