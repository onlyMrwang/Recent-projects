<template>
  <el-form>
    <el-form-item>
      <mark
        class="_mark"
        v-show="showSeason"
        @click.stop="showSeason=false"
      ></mark>
      <el-input placeholder="请选择季度" class="filter-item small" v-model="showValue" @focus="showSeason=true">
        <i slot="prefix" class="el-input__icon el-icon-date"></i>
      </el-input>
      <el-card
        class="box-card"
        v-show="showSeason"
      >
        <div slot="header" class="clearfix yearBtn">
          <button
            type="button"
            aria-label="前一年"
            class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
            @click="prev"
          ></button>
          <span role="button" class="el-date-picker__header-label">{{year}}年</span>
          <button
            type="button"
            aria-label="后一年"
            @click="next"
            class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
          ></button>
        </div>
        <div class="text item">
          <el-button
            type="text"
            size="medium"
            class="_left"
            @click="selectSeason(0)"
          >第一季度
          </el-button>
          <el-button
            type="text"
            size="medium"
            class="_right"
            @click="selectSeason(1)"
          >第二季度
          </el-button>
        </div>
        <div class="text item">
          <el-button
            type="text"
            size="medium"
            class="_left"
            @click="selectSeason(2)"
          >第三季度
          </el-button>
          <el-button
            type="text"
            size="medium"
            class="_right"
            @click="selectSeason(3)"
          >第四季度
          </el-button>
        </div>
      </el-card>
    </el-form-item>
  </el-form>
</template>
<script>
  export default {
    props: {
      valueArr: {
        default: () => {
          return ['01-03', '04-06', '07-09', '10-12']
        },
        type: Array
      },
      getValue: {
        default: () => {
        },
        type: Function
      },
      defaultValue: {
        default: '',
        type: String
      }
    },
    data() {
      return {
        showSeason: false,
        season: '',
        year: new Date().getFullYear(),
        showValue: ''
      }
    },
    created() {
      if (this.defaultValue) {
        debugger
        let value = this.defaultValue
        let arr = value.split('-')
        this.year = arr[0].slice(0, 4)
        let str = arr[0].slice(4, 6) + '~' + arr[1].slice(4, 6)
        let arrAll = this.valueArr
        this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
      }
    },
    watch: {
      defaultValue: function (value, oldValue) {
        // let arr = value.split('-')
        // this.year = arr[0].slice(0, 4)
        // let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6)
        let str = value.split('-')[1]
        let arrAll = this.valueArr
        this.showValue = `${this.year}年${arrAll.indexOf(str) + 1}季度`
      }
    },
    methods: {
      one() {
        this.showSeason = false
      },
      prev() {
        this.year = this.year * 1 - 1
      },
      next() {
        this.year = this.year * 1 + 1
      },
      selectSeason(i) {
        let that = this
        that.season = i + 1
        // let arr = that.valueArr[i].split('-')
        // const date = that.year + arr[0] + '-' + that.year + arr[1];
        const date = that.year + '-' + that.valueArr[i];
        that.getValue(date)
        that.showSeason = false
        that.showValue = `${that.year}年${that.season}季度`
        console.log(that.showValue)
        that.$emit('setQuarterDate',{value:date});
      },
    }
  }
</script>
<style scoped>
  ._mark {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 999;
  }
 
  .yearBtn {
    text-align: center;
    padding: 0
  }
 
  .box-card {
    width: 220px;
    padding: 0 3px 20px;
    margin-top: 0px;
    position: absolute;
    z-index: 9999
  }
 
  .text.item {
    text-align: center;
  }
 
  .text.item >>> .el-button {
    width: 40%;
    color: #606266;
  }
 
  .text.item ._left {
    float: left;
  }
 
  .text.item ._right {
    float: right;
  }
  
  .el-input__icon{
      line-height: 32px;
  }
</style>