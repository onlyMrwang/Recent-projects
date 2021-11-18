<!-- @author zhengjie -->
<template>
  <div class="icon-body">
    <el-input v-model="name" style="position: relative;" clearable placeholder="请输入图标名称" @clear="getList" @input.native="filterIcons">
      <i slot="suffix" class="el-icon-search el-input__icon" />
    </el-input>
    <div class="icon-list">
      <div v-for="(item, index) in iconList" :key="index" @click="selectedIcon(item)">
        <svg-icon :icon-class="item" style="height: 30px;width: 16px;" />
        <span :title="item">{{ item }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getName } from '@/api/system/image'
export default {
  name: 'IconSelect',
  data() {
    return {
      name: '',
      iconList: []
    }
  },
  methods: {
    getList(){
      getName().then(res=>{
        this.iconList = res.data
      })
    },
    filterIcons() {
      if (this.name) {
        var icon = this.iconList.filter(item => {
          if (item.includes(this.name)) {
            return item;
          }
        })
        if (icon){
          this.iconList = icon;
        } else{
         this.getList()
        }
      }else{
        this.getList()
      }
    },
    selectedIcon(name) {
      this.$emit('selected', name)
      document.body.click()
    },
    reset() {
      this.name = ''
      this.getList();
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .icon-body {
    width: 100%;
    padding: 10px;
    .icon-list {
      height: 200px;
      overflow-y: scroll;
      div {
        height: 30px;
        line-height: 30px;
        margin-bottom: -5px;
        cursor: pointer;
        width: 33%;
        float: left;
      }
      span {
        display: inline-block;
        vertical-align: -0.15em;
        fill: currentColor;
        overflow: hidden;
        text-overflow: ellipsis;
        -o-text-overflow: ellipsis;
        white-space:nowrap;
        width: 100px;
        margin-left: 5px;
      }
    }
  }
</style>
