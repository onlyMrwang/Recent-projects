<template>
  <div :class="isHiddenHeader ? 'siderItemFull' : 'siderItem'">
    <!-- 侧边展开菜单 -->
    <div v-show="!isCollapse">
      <el-menu
        :default-active="siderMenuIndex"
        :default-openeds="[siderParentIndex]"
        class="siderMenu"
        @select="selectMenu"
        background-color="#0E8CA1"
        :unique-opened="true"
        text-color="#CEE4E6"
        :router="true"
        active-text-color="#fff"
        >{{ siderMenuIndex }}
        <div
          v-for="(item, index) in JSON.parse(JSON.stringify(restMenuList))"
          :key="index"
        >
          <!-- 子菜单只有一级 -->
          <el-menu-item
            v-if="item.children === undefined && !item.hidden"
            :index="item.path"
          >
            <template slot="title">
              <div class="menuTitle">
                <img
                  :src="item.path === siderMenuIndex ? menuCheckBg : menuBg"
                />
                <div class="menuContet">
                  <div class="icon">
                    <i :class="`iconfont ${item.meta.icon}`" />
                  </div>
                  <div
                    :title="item.meta.title"
                    :class="
                      item.path === siderMenuIndex
                        ? 'onemenuCheckedName'
                        : 'onemenuName'
                    "
                  >
                    {{ item.meta.title }}
                  </div>
                </div>
              </div>
            </template>
          </el-menu-item>

          <!-- 子菜单多级 -->
          <el-submenu
            :index="item.path"
            v-if="item.children !== undefined && !item.hidden"
          >
            <template slot="title">
              <div class="menuTitle">
                <img
                  :src="
                    matchSonIndex(item.children).length > 0
                      ? menuCheckBg
                      : menuBg
                  "
                />
                <div class="menuContet">
                  <div class="icon">
                    <i :class="`iconfont ${item.meta.icon}`" />
                  </div>
                  <div
                    :title="item.meta.title"
                    :class="
                      item.path === siderMenuIndex
                        ? 'menuCheckedName'
                        : 'menuName'
                    "
                  >
                    {{ item.meta.title }}
                  </div>
                </div>
              </div>
            </template>
            <div class="sunMenuBox">
              <div class="subBox">
                <el-menu-item-group>
                  <el-menu-item
                    v-for="sitem in item.children"
                    :key="sitem.path"
                    :index="sitem.path"
                  >
                    <div class="subMenuItem">
                      <div class="subMenuSign">
                        <img
                          :src="
                            sitem.path === siderMenuIndex
                              ? submenuCheckBg
                              : submenuBg
                          "
                        />
                      </div>
                      <div
                        :title="sitem.meta.title"
                        :class="
                          sitem.path === siderMenuIndex
                            ? 'subMenuCheckName'
                            : 'subMenuName'
                        "
                      >
                        {{ sitem.meta.title }}
                      </div>
                    </div>
                  </el-menu-item>
                </el-menu-item-group>
              </div>
            </div>
          </el-submenu>
        </div>
      </el-menu>
    </div>
    <!-- 侧边收缩菜单 -->
    <div class="collapseSiderBox" v-show="isCollapse">
      <div
        v-for="item in JSON.parse(JSON.stringify(restMenuList))"
        :key="item.path"
        class="collapseSiderItem"
      >
        <div
          class="colSiderItem"
          :title="item.meta.title"
          v-if="item.children === undefined && !item.hidden"
        >
          <img :src="item.path === siderMenuIndex ? colMenuCheck : colMenu" />
          <div class="icon">
            <i :class="`iconfont ${item.meta.icon}`" />
          </div>
        </div>
        <div
          class="colSiderItem"
          :title="item.meta.title"
          v-if="item.children !== undefined && !item.hidden"
        >
          <img
            :src="
              matchSonIndex(item.children).length > 0 ? colMenuCheck : colMenu
            "
          />
          <div class="icon">
            <i :class="`iconfont ${item.meta.icon}`" />
          </div>
        </div>
      </div>
    </div>
    <div class="foldIcon" @click="foldMenu">
      <i
        v-show="isCollapse"
        class="el-icon-s-unfold"
        style="font-size: 20px;"
      ></i>
      <i
        v-show="!isCollapse"
        class="el-icon-s-fold"
        style="font-size: 20px;"
      ></i>
    </div>
  </div>
</template>

<script>
import MenuBg from '@/assets/icons/menu_bg1.png'
import MenuCheckedBg from '@/assets/icons/menu_bg2.png'
import subMenuBg from '@/assets/icons/submenu.png'
import subMenuCheckedBg from '@/assets/icons/submenuChecked.png'
import colMenu from '@/assets/icons/colMenu.png'
import colMenuCheck from '@/assets/icons/colMenuCheck.png'
import { siderWidth } from '@/assets/styles/global.scss'
import { mapGetters } from 'vuex'
import { treeToList } from '@/utils/utils'
export default {
  data() {
    return {
      siderWidth,
      menuBg: MenuBg,
      menuCheckBg: MenuCheckedBg,
      submenuBg: subMenuBg,
      submenuCheckBg: subMenuCheckedBg,
      colMenu,
      colMenuCheck,
      menuList: []
    }
  },
  computed: {
    ...mapGetters([
      'restMenuList',
      'siderMenuIndex',
      'isCollapse',
      'isHiddenHeader',
      'siderParentIndex'
    ])
  },
  methods: {
    selectMenu(index) {
      this.$store.commit('settings/changeSiderMenuIndex', index)
      // 将tree转成list
      const list = treeToList(this.restMenuList)
      // 查找选中路由项
      const arr = list.filter((item) => item.path === index)
      // 查找选择路由项父级
      const checkParent = list.filter((item) => item.id === arr[0].parentId)
      if (checkParent.length > 0) {
        // 如果有父级
        this.$store.commit(
          'settings/changeSiderParentIndex',
          checkParent[0].path
        )
      } else {
        // 没有父级
        this.$store.commit('settings/changeSiderParentIndex', index)
      }
    },
    matchSonIndex(data) {
      // 如果选中三级菜单，父菜单选中
      return data.filter((item) => item.path === this.siderMenuIndex)
    },
    foldMenu() {
      this.$store.commit('common/changeIsCollapse', !this.isCollapse)
    }
  }
}
</script>
<style lang="scss">
@import '@/assets/styles/global.scss';
.el-submenu__title i {
  color: #fff;
}
.siderMenu .el-menu-item,
.el-submenu__title {
  height: 42px;
  line-height: 42px;
  background: $topMenuActiveColor !important;
}
.siderMenu,
.el-menu .el-menu--inline {
  background: $topMenuActiveColor !important;
  width: 208px;
}
.siderMenu .el-submenu .el-menu-item {
  text-align: center;
  height: 32px;
  line-height: 32px;
  min-width: 0;
  padding: 0;
  margin: 0 10px;
  border-bottom: 1px solid rgba(8, 95, 110, 0.4);
}
.siderMenu .el-menu-item:last-child {
  border-bottom: none;
}
.siderMenu .el-menu-item-group__title {
  padding: 0;
}
.siderMenu .el-submenu__icon-arrow {
  position: absolute;
  color: #fff;
  top: 50%;
  right: 30px;
  margin-top: -15px;
  transition: transform 0.3s;
  font-size: 24px;
}
.siderMenu .el-icon-arrow-down:before {
  content: '\e6e0';
  font-size: 14px;
  font-weight: 700;
}
.siderMenu .el-submenu.is-opened > .el-submenu__title .el-submenu__icon-arrow {
  padding-top: 4px;
  transform: rotateZ(90deg);
}
.siderMenu .el-menu-item-group > ul > li {
  padding: 0 !important;
}
.siderMenu .el-menu-item .is-active {
  background: $siderMenuItem !important;
}
.el-submenu__title.is-active {
  background: $topMenuActiveColor !important;
}
.el-menu-item {
  background: $topMenuActiveColor !important;
}
.el-menu-item:hover {
  background: $topMenuActiveColor !important;
}
.el-submenu__title:hover {
  background: $topMenuActiveColor !important;
}

.subBox .el-menu-item {
  background-color: $siderMenuItem !important;
}
.subBox .el-menu-item .is-active {
  background-color: $siderMenuItem !important;
}
.siderItem {
  .el-submenu__title {
    height: 41px;
    line-height: 41px;
    width: 208px;
  }
}
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.siderItem {
  width: 100%;
  height: calc(100vh - #{$headerHeight});
  background-color: $topMenuActiveColor;
  padding-top: 10px;
  font-size: 14px;
  .collapseSiderBox {
    width: 56px;
    .collapseSiderItem {
      margin-left: 7px;
      cursor: pointer;
      .colSiderItem {
        position: relative;
        img {
          width: 42px;
          height: 32px;
        }
        .icon {
          position: absolute;
          left: 10px;
          top: 6px;
          i {
            font-size: 16px;
          }
        }
      }
    }
  }
  .foldIcon {
    cursor: pointer;
    position: absolute;
    bottom: 15px;
    left: 13px;
  }
  i {
    color: #fff;
  }
  .menuTitle {
    position: relative;
    img {
      width: 196px;
      height: 35px;
      margin-left: -14px;
      margin-top: -5px;
    }
    .svg {
      width: 196px;
      height: 35px;
      margin-left: -14px;
      margin-top: -7px;
    }
    .menuContet {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      .icon {
        margin-right: 10px;
      }
      .onemenuName {
        width: 135px;
        font-size: 14px;
        color: #daecee;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .onemenuCheckedName {
        width: 135px;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .menuName {
        width: 125px;
        font-size: 14px;
        color: #daecee;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .menuCheckedName {
        width: 125px;
        color: #fff;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
  .sunMenuBox {
    margin: 0 6px 5px 6px;
    background-color: $siderMenuItem !important;
    img {
      width: 100%;
      height: 15px;
    }
    .subBox {
      margin-top: -5px;
      padding: 9px 0;
      background-color: $siderMenuItem;
      .subMenuItem {
        display: flex;
        align-items: center;
        margin-left: 28px;
        .subMenuSign {
          margin-right: 16px;
          img {
            width: 2px;
            height: 10px;
          }
        }
        .subMenuName {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          color: #cee4e6;
          margin-top: 2px;
        }
        .subMenuCheckName {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 13px;
          color: #fff;
          margin-top: 2px;
        }
      }
    }
  }
}
.siderItemFull {
  width: 100%;
  height: 100vh;
  background-color: $topMenuActiveColor;
  padding-top: 10px;
  font-size: 14px;
  .collapseSiderBox {
    width: 56px;
    .collapseSiderItem {
      margin-left: 7px;
      cursor: pointer;
      .colSiderItem {
        position: relative;
        img {
          width: 42px;
          height: 32px;
        }
        .icon {
          position: absolute;
          left: 10px;
          top: 6px;
          i {
            font-size: 16px;
          }
        }
      }
    }
  }
  .foldIcon {
    cursor: pointer;
    position: absolute;
    bottom: 15px;
    left: 13px;
  }
  i {
    color: #fff;
  }
  .menuTitle {
    position: relative;
    img {
      width: 196px;
      height: 35px;
      margin-left: -14px;
      margin-top: -5px;
    }
    .svg {
      width: 196px;
      height: 35px;
      margin-left: -14px;
      margin-top: -5px;
    }
    .menuContet {
      position: absolute;
      top: 0;
      left: 0;
      display: flex;
      align-items: center;
      .icon {
        margin-right: 10px;
      }
      .menuName {
        font-size: 14px;
        color: #daecee;
      }
      .menuCheckedName {
        color: #fff;
      }
    }
  }
  .sunMenuBox {
    margin: -6px 6px 5px 6px;
    background-color: $siderMenuItem !important;
    img {
      width: 100%;
      height: 15px;
    }
    .subBox {
      margin-top: -5px;
      padding: 9px 0;
      background-color: $siderMenuItem;
      .subMenuItem {
        display: flex;
        align-items: center;
        margin-left: 28px;
        .subMenuSign {
          margin-right: 16px;
          img {
            width: 2px;
            height: 10px;
          }
        }
        .subMenuName {
          font-size: 13px;
          color: #cee4e6;
          margin-top: 2px;
        }
        .subMenuCheckName {
          font-size: 13px;
          color: #fff;
          margin-top: 2px;
        }
      }
    }
  }
}
</style>
