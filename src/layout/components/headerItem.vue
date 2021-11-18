<template>
  <div class="headerItem">
      <div class="lunkuo"></div>
      <div class="logo" @click="toIndex">
          <img src="@/assets/logo.png" alt="logo">
          <span class="name">{{ title }}</span>
      </div>

      <div class="menus" id="topMenu">
           <div v-show="showLeftScroll" class="leftScroll" @click="moveToLeft">
                <i class="iconfont icon-arrow-right-double" style="color:#fff;font-size:20px;"/>
           </div>
          <FirstMenu />
          <div v-show="showRightScroll" class="rightScroll" @click="moveToRight">
              <i class="iconfont icon-arrow-right-double-copy" style="color:#fff;font-size:20px;"/>
          </div>
      </div>

      <div class="right">
        <div class="icons">
          <el-popover
            placement="bottom"
            title=""
            @hide="hidePopover"
            @show="showPopover"
            width="300"
            popper-class="mypopper"
            trigger="hover"
           >
            <div class="setting" slot="reference">
               <img src="@/assets/icons/shezhi@2x.png" /> 
            </div>

            <TopMenuSetting ref="topMenuSetting"/>
        </el-popover>

        <div class="notice">
           <img src="@/assets/icons/remind@2x.png"/>
        </div>
        </div>
        <el-dropdown @command="handleCommand">
           <div class="user">
             <img src="@/assets/avatar.png" alt="用户头像"/>
           <div class="username">{{userInfo && userInfo.fullName}}</div><i class="el-icon-caret-bottom el-icon--right"></i>
        </div>
            <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="toInfo">个人中心</el-dropdown-item>       
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </el-dropdown>
        <div class="headerRight">
            <Screenfull style="margin-left: 10px"/>
            <img style="width: 14px;height: 12px;margin-left: 10px;margin-top: 5px;cursor: pointer;"
               src="@/assets/icons/hiddenheader.png" :title="'收起顶部菜单'" @click="toHiddenHeader"/>
        </div>
      </div>
  </div>
</template>

<script>
import { sysTitle } from '../../../config/defaultSetting'
import FirstMenu from './firstMenu.vue'
import Screenfull from '@/components/FullScreen'
import TopMenuSetting from './topMenuSetting'
import { mapGetters } from 'vuex'
export default {
    components: { FirstMenu, Screenfull, TopMenuSetting },
    data() {
        return {
            title: sysTitle,
            showRightScroll: false,
            showLeftScroll: false,
            movePX: 0,
            moveRightTimes: 0,
            closePopover: false
        }
    },
    computed: {
        ...mapGetters(['userInfo', 'firstMenuList'])
    },
    mounted() {
         document.getElementById("topMenu").addEventListener('scroll',this.handleScroll)
    },
    watch: {
      firstMenuList(newVal, oldVal) {
           if(newVal.length > 6) {
            this.showRightScroll = true
           }else {
            this.showRightScroll = false
          }
          if(newVal.length > 6) {
              this.moveRightTimes = newVal.length - 6
          }
      },
      moveRightTimes(newVal, oldVal) {
          if(this.firstMenuList.length > 6 && newVal === 0) {
             this.showRightScroll = false 
          }else if(this.firstMenuList.length > 6 && newVal !== 0){
             this.showRightScroll = true
          }
      }  
    },
    methods: {
        toIndex() {
            this.$router.push('/airweb')
            this.$store.commit('settings/changeTopMenuIndex', null)
            this.$store.commit('settings/changeSiderMenuIndex', null)
            this.$store.commit('settings/changeRestMenu', [])
        },
        handleCommand(command) {
           if(command === 'logout') {
               this.$store.dispatch('user/logout').then(rsp => {
                  if(rsp.code === 200) {
                    localStorage.removeItem('token')
                    sessionStorage.removeItem('vuex')
                    location.href = '/airweb/login'  
                  }
              })  
           }else if(command === 'toInfo') {
                this.$store.commit('settings/changeTopMenuIndex', null)
                this.$store.commit('settings/changeSiderMenuIndex', null)
                this.$store.commit('settings/changeRestMenu', [])
                this.$router.push('/airweb/user/profile')
           }
        },

        handleScroll(){
        let scrollLeft = document.getElementById("topMenu").scrollLeft;
        if(scrollLeft > 0) { 
            this.showLeftScroll = true
        }else {
            this.showLeftScroll = false
        }
    },
    moveToRight() {
      if(this.moveRightTimes > 0) {
        this.moveRightTimes --  
        this.movePX += 160
        document.getElementById("topMenu").scrollLeft =  this.movePX   
      }
    },
    moveToLeft() {
        if(this.movePX !== 0) {
            this.moveRightTimes ++
            this.movePX -= 160
            document.getElementById("topMenu").scrollLeft =  this.movePX  
        }
    }, 
    toHiddenHeader() { 
        // 首页不能隐藏顶部菜单
        if(location.pathname !== '/airweb') {
            this.$store.commit('common/changeIsHiddenHeader', true)
        }
    },
    hidePopover() {
      this.$refs.topMenuSetting.saveSetting()
    },
    showPopover() { },
    
  }
}
</script>
<style lang="scss">
.el-popper[x-placement^=bottom].mypopper .popper__arrow::after {

    border-bottom-color: #41B8C3 !important;
}
.el-popper[x-placement^=bottom].mypopper .popper__arrow {

    border-bottom-color: #41B8C3 !important;
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.headerItem {
    height: $headerHeight;
    width: 100%;
    background-image: linear-gradient(90deg, #05A1AF 28%, #0E8CA0 100%);
    position: relative;
    border-radius: 1px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .lunkuo {
        position: absolute;
        left: 0;
        right: 0;
        width: 340px;
        height: $headerHeight;
        background-image: linear-gradient(90deg, #05AAB8 0%, #0E7DA0 100%);
        border-radius: 0 0 80px 0;
        z-index: 1;
    }
    .logo {
       display: flex;
       align-items: center;
       color: #fff;
       margin: 0 80px 0 20px;
       cursor: pointer;
       z-index: 3;
       img {
           width: 32px;
           height: 32px;
           margin-right: 10px;
       } 
       .name {
           font-size: 18px;
       }
    }
    .menus {
        flex: 1;
        // overflow: auto;
        overflow-x: scroll;
        min-width: 0;
        margin-right: 30px;
        &::-webkit-scrollbar{
        width: 0;
        height: 0;
        background-color: transparent;
      }
      .rightScroll {
          cursor: pointer;
          position: absolute;
          right: 270px;
          top: 0;
          width: 30px;
          height: 55px;
          background-image: linear-gradient(90deg, #0C92A4 0%, #087c8b 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          img {
              width: 12px;
              height: 12px;
          }
      }
       .leftScroll {
          cursor: pointer;
          position: absolute;
          left: 354px;
          top: 0;
          width: 30px;
          height: 55px;
          background-image: linear-gradient(90deg, #05A0AE 0%, #057f8a 100%);
        //   box-shadow: 7px 0px 16px 0px #05A0AE;
          display: flex;
          align-items: center;
          justify-content: center;
          img {
              width: 12px;
              height: 12px;
          }
      }
    }
    .right {
        // margin-left: 80px;
        display: flex;
        align-items: center;
        .icons {
            display: flex;
            align-items: center; 
            img {
                width: 18px;
                height: 18px;
            }
            .question {
              margin-right: 31px;
              cursor: pointer;
              display: flex;
              align-items: center;
            }
            .setting {
                margin-right: 31px;
                cursor: pointer;
                display: flex;
                align-items: center;
            }
            .notice {
                margin-right: 31px;
                cursor: pointer;
                display: flex;
                align-items: center;
            }
            i {
                color: #fff;
                font-size: 6px;
                padding-top: -10px;
            }
        }
        .user {
        margin-right: 20px;
        display: flex;
        align-items: center;
        color: #fff;
        cursor: pointer;
        img {
              width: 28px;
              height: 28px;
        }
        .username {
            font-size: 14px;
            margin-left: 8px;
        }
        i {
           color: #fff;
           font-size: 6px;   
        }
      }
      .screenfull {
          margin-right: 10px;
      }
      .headerRight {
            width: 32px;
            height: 55px;
            background-image: linear-gradient(90deg, #05A1AF 28%, #0E8CA0 100%);
            border-radius: 50%;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
      }
    }
}
</style>