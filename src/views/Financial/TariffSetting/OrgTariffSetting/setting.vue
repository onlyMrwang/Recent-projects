<template>
  <!-- 配置网点信息 -->
  <el-dialog
    v-dialogDrag
    :title="`机构网点资费配置 - ${groupName}`"
    :visible.sync="showSetting"
    width="700px"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :before-close="closeSettingDialog"
  >
  <div>
    <div class="settingDialog">
      <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入网点名称查询"
        v-model="checkGroupList"
        :data="searchGroupList"
        :titles="['全选', '全选']"
      >
      </el-transfer>
    </div> 
    <div slot="footer" class="footer">
        <el-button type="primary" @click="submitSetting">确 定</el-button>
        <el-button
          style="margin-left: 10px"
          type="primary"
          plain
          @click="closeSettingDialog"
          >取消</el-button
        >
      </div>
   </div>
  </el-dialog>
</template>

<script>
import { getOrgSiteList, addSiteOrgRel } from '@/api/financial/tariffSetting'
import { getArrayProps } from '@/utils/utils'
import { mapGetters } from 'vuex'
export default {
  props: {
    groupId: {
      type: String,
      default: null,
    },
    groupName: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      showSetting: true,
      // 网点配置左侧未配置网点列表
      searchGroupList: [],
      // 网点配置选择配置网点列表
      checkGroupList: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
    }
  },
  computed: {
    ...mapGetters(['userInfo', 'deptList'])
  },
  created() {
      if(this.groupId) {
        this.fetchSettingSites()
      }
  },
  methods: {
    async fetchSettingSites() {
      const rsp = await getOrgSiteList({orgId: this.groupId})
      if(rsp.code === 200) {
        this.searchGroupList = this.formatData(rsp.data.notSetting).concat(this.formatData(rsp.data.setting))
        this.checkGroupList = rsp.data.setting.length > 0 ? getArrayProps(rsp.data.setting, 'resSiteId') : []
      }
    },
     formatData (arr) {
        const data = []
        if(arr.length > 0) {
          arr.forEach((item) => {
          data.push({
            label: item.resSiteName,
            key: item.resSiteId,
          })
         })
      }
        return data
    },
    closeSettingDialog() {
      this.$emit("closeSetting", 2);
    },
   async submitSetting() {
        const arr = []
        if(this.checkGroupList.length > 0) {
          this.checkGroupList.forEach(item => {
            arr.push({
              resSiteId: item,
              enterpriseId: this.userInfo.tenantId,
              oprUser: this.userInfo.userName
            })
          })
        }
        let data = {
          info: arr,
          id: this.groupId
        }
      const rsp = await addSiteOrgRel(data)
      if(rsp.code === 200) {
          this.$message({
            type: 'success',
            message: '配置成功'
          })
          this.$emit("closeSetting", 1);
      }
    }
  }
}
</script>

<style lang="scss">
.settingDialog {
    margin-top: -10px;
    padding: 15px 10px;
    border-radius: 4px;
    background-color: #fff;
    .el-transfer {
        display: flex;
        align-items: center;
        justify-content: center;
        .el-input--small .el-input__icon {
            line-height: 32px;
            margin-top: 2px;
        }
      .el-transfer__buttons {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        button {
            border-radius: 50%;
            padding: 6px 7px;
            &:first-child {
                margin-left: 8px;
            }
        }
      }
      .el-transfer-panel {
          width: 245px;
      }
     .el-input {
         width: 90%;
     }
     .el-input__inner {
        border-radius: 4px;
       }
    }
    .el-transfer-panel__list.is-filterable {
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
        background-color: #f5f5f5;
      }
    }
}
</style>
<style lang="scss" scoped>

.footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 10px;
}
</style>
