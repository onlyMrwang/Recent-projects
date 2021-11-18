<!--
 * @Description: 
 * @Autor: mengtao wang
 * @Date: 2021-08-20 10:48:40
 * @LastEditTime: 2021-09-12 16:37:47
-->
<template>
  <div class="firstMenu" id="menuBox">
       <div 
         v-for="(item, index) in firstMenuList" :key="item.id" @click="changeFirstMenu(item, index)"
         :class="item.path === topMenuIndex ? 'checkedMenuItem': 'menuItem'" 
         :style="(index === 0 && firstMenuList.length === 7) ? 'margin-left: 132px' : 
         (index === 0 && firstMenuList.length === 8) ? 'margin-left: 220px' : 
         (index === 0 && firstMenuList.length === 9) ? 'margin-left: 365px' :  
         (index === 0 && firstMenuList.length === 10) ? 'margin-left: 500px' : 
         (index === 0 && firstMenuList.length === 11) ? 'margin-left: 650px' : ''
         "
         >
          <div class="icon">
              <i :class="`iconfont ${item.icon}`" style="font-size: 16px;margin-right: 5px;"/>
          </div>
          {{item.name}} 
      </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters(['firstMenuList', 'routersList', 'topMenuIndex'])
    },
    methods: {
        changeFirstMenu(item, index) { 
            // 外部链接
            if(item.kind === '4') {
              window.open(item.path, '_blank');
              return
            }
            if(this.topMenuIndex !== index) {
               this.$store.commit('settings/changeSiderMenuIndex', null)
            }
            this.$store.commit('settings/changeTopMenuIndex', item.path)
            this.$store.commit('settings/changeFirstMenu', this.firstMenuList)
            if(this.$route.path !== item.path) {
                this.$router.push(item.path)
            }
            this.$store.commit('settings/changeRestMenu', [])
            let arr = this.routersList.filter(ritem => ritem.path === item.path)[0].children !== undefined ? this.routersList.filter(ritem => ritem.path === item.path)[0].children : []
            // 如果有二级菜单(侧边菜单，选择第一级菜单默认选择侧边第一个子菜单)
          
           if(arr.length > 0 && arr[0].children === undefined) {
                this.$store.commit('settings/changeSiderMenuIndex', arr[0].path)
                this.$router.push(arr[0].path)
            }else if(arr.length > 0 && arr[0].children.length > 0){
                this.$store.commit('settings/changeSiderMenuIndex', arr[0].children[0].path)
                this.$store.commit('settings/changeSiderParentIndex', arr[0].path)
                this.$router.push(arr[0].children[0].path)
            } 
           this.$store.commit('settings/changeRestMenu', arr)  
        },
    }
}
</script>

<style lang="scss" scoped>
.firstMenu {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 16px;
    .checkedMenuItem {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        cursor: pointer;
        padding: 18px 28px 11px 28px;
        background-image: linear-gradient(180deg, rgba(13,215,205,0.00) 0%, rgba(13,215,205,0.81) 100%);
        border-bottom: 4px solid #40FFDA;;
    }
    .menuItem {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        cursor: pointer;
        padding: 18px 28px;
    } 
}
</style>