<template>
  <div class="menuBox">
    <div class="title">
      <div class="titleItem">主菜单</div>
      <div class="titleItem">可选菜单</div>
    </div>
    <div class="menuContent">
      <div class="menuLeft">
        <div class="checkMenuBox">
          <draggable :filter="topMenuIndex ? '.checkedMenuItem' : '.firstMenuItem'" :list="selectedMenu" group="menu">
            <div
              v-for="(item, index) in selectedMenu"
              :class="index === 0 ? 'firstMenuItem' : item.path === topMenuIndex ? 'checkedMenuItem' : 'menuItem'"
              :key="item.id"
              @click="moveMenu(item, index)"
            >
            <img v-if="topMenuIndex && item.path === topMenuIndex" :src="dingIcon" style="width: 13px;height: 13px;margin-left: -16px;"/>
            <img v-if="!topMenuIndex && index === 0" :src="dingIcon" style="width: 13px;height: 13px;margin-left: -16px;"/>  <i :class="`iconfont ${item.icon}` "/>
              {{ item.name }}
            </div>
          </draggable>
        </div>
      </div>

      <div class="menuRight">
        <div class="waitMenuBox">
          <draggable :list="waitMenu" group="menu">
            <div
              v-for="(item, index) in waitMenu"
              :key="item.path"
              class="waitItem"
              @click="selectMenu(item, index)"
            >
             <i :class="`iconfont ${item.icon}` "/>
              {{ item.name }}
            </div>
          </draggable>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from "vuedraggable";
import { mapGetters } from "vuex";
import { getDifferentArr } from "../../utils/utils";
export default {
  components: { draggable },
  data() {
    return {
      selectedMenu: [], // 选择菜单
      waitMenu: [], // 可选菜单
      dingIcon: require('@/assets/icons/ding.png')
    };
  },
  computed: {
    ...mapGetters([
      "firstMenuList",
      "topMenuList",
      "userInfo",
      "topMenuIndex"
    ]),
  },
  created() {
     this.selectedMenu = JSON.parse(JSON.stringify(this.firstMenuList));
        this.waitMenu = getDifferentArr(
          JSON.parse(JSON.stringify(this.topMenuList)),
          this.selectedMenu
        );
  },
  methods: {
    selectMenu(item) {
      this.selectedMenu.push(item);
      this.waitMenu = getDifferentArr(
        JSON.parse(JSON.stringify(this.topMenuList)),
        this.selectedMenu
      );
    },
    moveMenu(item, index) {
      if(item.path === this.topMenuIndex) {
        this.$message({
          type: 'warning',
          message: '当前选中此菜单无法移除'
        })
        return
      }
      // 未选择菜单时，第一个菜单不允许移除
      if(index === 0 && !this.topMenuIndex) {
         return
      }
       this.selectedMenu.splice(index, 1);
          this.waitMenu = getDifferentArr(
            JSON.parse(JSON.stringify(this.topMenuList)),
            this.selectedMenu
           );
         
    },
    saveSetting() {
      if(this.selectedMenu.length > 0) {
        this.$store.commit('settings/changeFirstMenu', JSON.parse(JSON.stringify(this.selectedMenu)))
        localStorage.setItem(this.userInfo.id, JSON.stringify(this.selectedMenu))
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.menuBox {
  i {
    width: 15px;
    height: 15px;
    margin-right: 5px;
  }
  position: relative;
  .title {
    display: flex;
    align-items: center;
 .titleItem {
    background: #41B8C3;
    flex: 1;
    font-size: 14px;
    color: #fff;
    font-weight: 500;
    display: flex;
    justify-content: center;
    margin: -13px -13px 0 -13px;
    padding: 10px 0;
}
  }
.menuContent {
  display: flex;
  justify-content: center;
  margin-top: 15px;
  .menuLeft {
    border-right: 1px dotted #cfcfcf;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .checkMenuBox {
      display: flex;
      align-items: center;
      .firstMenuItem {
        // cursor: no-drop;
        cursor: pointer;
        color: #666666;
        margin-bottom: 17px;
        font-size: 14px;
      }
      .menuItem {
        cursor: pointer;
        background: #ffffff;
        color: #666666;
        margin-bottom: 17px;
        font-size: 14px;
      }
      .checkedMenuItem {
        // cursor: no-drop;
        cursor: pointer;
        background: #ffffff;
        color: #666666;
        margin-bottom: 17px;
        font-size: 14px;
      }
    }
  }

  .menuRight {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    .waitMenuBox {
      display: flex;
      align-items: center;
      .waitItem {
        cursor: pointer;
        color: #999;
        margin-bottom: 17px;
        font-size: 14px;
      }
    }
  }
}
}
</style>
