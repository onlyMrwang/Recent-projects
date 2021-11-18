<template>
<div class="layoutBox">
  <el-container>
  <el-header v-if="!isHiddenHeader">
      <Header :style="`height: ${headerHeight}px`"/>
  </el-header>
  <el-container>
    <el-aside :style="isCollapse ? `width: ${collpseSiderWidth}` : `width: ${siderWidth}`" v-if="restMenuList.length > 0 ">
        <Sider />
    </el-aside>
    <el-container>
         <div :class="isHiddenHeader ? 'mainContentFull' : 'mainContent'">
           <div v-if="isHiddenHeader" @click="toShowHeader" class="showHeaderIcon">
              <img src="@/assets/icons/showHeader@3x.png" title="展示顶部菜单"/>
           </div>
            <router-view :key="key"/>
         </div>
    </el-container>
  </el-container>
  </el-container>
</div>
</template>

<script>
import Header from './components/headerItem.vue'
import Sider from './components/siderItem.vue'
import { siderWidth, headerHeight, collpseSiderWidth } from '@/assets/styles/global.scss'
import { toCheckRescource } from '@/api/common'
import { mapGetters } from 'vuex'
export default {
    components: { Header, Sider },
    data() {
        return {
            siderWidth,
            headerHeight,
            collpseSiderWidth
        }
    },
    computed: {
      ...mapGetters(['restMenuList', 'isCollapse', 'isHiddenHeader', 'dictInfo', 'userInfo']),
     key() {
      return this.$route.path
     }
    },
    created() {
      if(window.location.pathname !== "/airweb" && window.location.pathname !== "/airweb/401") {
        // this.checkPath()
      }
      if(!sessionStorage.getItem("vuex") || 
      (sessionStorage.getItem("vuex") && JSON.parse(sessionStorage.getItem("vuex")).dict.dictInfo.chargEquipType.length === 0)) {
        this.$store.dispatch('dict/fetchDictInfo')
      }
      // 刷新页面回到主页面，菜单选中状态清除
      if(location.pathname === '/airweb') {
        this.$store.commit('settings/changeTopMenuIndex', null)
        this.$store.commit('settings/changeSiderMenuIndex', null)
        this.$store.commit('settings/changeRestMenu', [])
      }
      if(!localStorage.getItem('token')) {
          this.$message('登陆已过期，请重新登录')
          location.href = '/airweb/login'
      }else {
        this.$store.dispatch('user/getUserInfo').then(() => {
           this.$store.dispatch('settings/fetchRouter').then(() => {
             if(location.pathname === '/airweb') {
                if(location.href.indexOf("#")==-1){
                location.href=location.href+"#";
                location.reload();
              }
             }
           })
        })
      }
    },
    methods: {
      toShowHeader() {
        this.$store.commit('common/changeIsHiddenHeader', false)
      },
      async checkPath() {
        const rsp = await toCheckRescource({path: window.location.pathname})
        if(rsp.code === 200) {
          if(rsp.data === 0) {
             this.$message('无权限访问')
             location.href = '/airweb/401'
          }
        }
      }
    }
}
</script>

<style lang="scss">
@import '../assets/styles/global.scss';
.el-menu {
    border-right: $topMenuActiveColor;
}
.el-header {
    padding: 0 !important;
    height: #{$headerHeight} !important;
}
 .el-aside::-webkit-scrollbar{
    width: 7px;
    height: 7px;
    background-color: $topMenuActiveColor;
  }

  /*定义滑块 内阴影+圆角*/
  .el-aside::-webkit-scrollbar-thumb{
    background-image: linear-gradient(180deg, #00E5EC 0%, #1A9EB3 100%);
    border-radius: 35px;
  }
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.layoutBox {
    height: 100vh;
    overflow: hidden;
   .mainContent {
    background-color: $pageBgColor;
    width: 100%;
    padding: 12px ;
    height: calc(100vh - #{$headerHeight + 20px});
    max-height: calc(100vh - #{$headerHeight + 20px});
    overflow: auto;
      &::-webkit-scrollbar{
        width: 7px;
        height: 7px;
        background-color: transparent;
      }
      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb{
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
        background-color: #CEE4E8;
      }
   }
   .mainContentFull {
    background-color: $pageBgColor;
    width: 100%;
    padding: 30px 20px 20px 20px;
    height: 100vh;
    max-height: 100vh;
    overflow: auto;
    .showHeaderIcon {
      position: absolute;
      right: 10px;
      top: 2px;
      cursor: pointer;
      img {
        width: 15px;
        height: 12px;
      }
    }
      &::-webkit-scrollbar{
        width: 7px;
        height: 7px;
        background-color: transparent;
      }
      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb{
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, .1);
        background-color: #CEE4E8;
      }
   }
}

</style>