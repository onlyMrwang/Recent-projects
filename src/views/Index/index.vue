<!--
 * @Description: 
 * @Autor: mengtao wang
 * @Date: 2021-07-27 21:11:35
 * @LastEditTime: 2021-08-23 14:30:58
-->
<template>
  <div class="indexBox">
    <div class="indexTitle">欢迎使用{{title}}</div>
  </div>
</template>

<script>
import { sysTitle } from '../../../config/defaultSetting'
export default {
  data() {
    return {
       title: sysTitle
    }
  },
  created() {
       // 刷新页面回到主页面，菜单选中状态清除
      if(location.pathname === '/') {
        this.$store.commit('settings/changeTopMenuIndex', null)
        this.$store.commit('settings/changeSiderMenuIndex', null)
        this.$store.commit('settings/changeRestMenu', [])
      }
  },
  methods: {
   
  }
}
</script>

<style scoped lang='scss'>
@import '@/assets/styles/global.scss';

.indexBox {
  position: absolute;
  top: 55px;
  left: 0;
  width: 100%;
  height: calc(100vh - #{$headerHeight});
  background: url('../../assets/images/indexBg.png');
  background-size:cover;
  -moz-background-size:cover; /* 老版本的 Firefox */
  background-repeat:no-repeat;
  background-size:100% 100%;
  .indexTitle {
    position: absolute;
    left: 50%;
    top: 30%;
    transform: translate(-50%, -50%);
    color: #fff;
    font-size: 40px;
  }
  
}
</style>