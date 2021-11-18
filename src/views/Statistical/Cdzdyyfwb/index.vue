<template>
  <div class="app-container">
    <div class="card">
      <el-form size="small" label-width="120px">
        <el-row :gutter="5">
          <el-col :span="6">
            <div class="orgList">
              <el-form-item prop="orgId">
                <template slot="label">
                 <span style="color: #f56c6c;margin-right: 4px">*</span>车辆所属机构
               </template>
                <treeselect
                  :clearable="false"
                  v-model="checkOrgId"
                  :default-expand-level="2"
                  :options="deptList"
                  :normalizer="normalizer"
                  @select="selectOrg"
                  @open="openOrgList"
                  placeholder="选择车辆所属机构"
                />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargGroupName" label="充电网点名称">
              <el-select
                v-model="searchConf.chargGroupId"
                clearable
                filterable
                @change="changeSite"
                placeholder="请选择充电网点名称"
              >
                <el-option
                  v-for="item in siteList"
                  :key="item.recSiteNum"
                  :label="item.chargGroupName"
                  :value="item.chargGroupId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="chargId" label="充电设备名称">
              <el-select
                v-model="searchConf.chargId"
                clearable
                filterable
                :placeholder="
                  searchConf.chargGroupId
                    ? '请选择充电设备名称'
                    : '请先选择充电网点名称'
                "
                @change="getchargNum"
              >
                <el-option
                  v-for="item in chargeList"
                  :key="item.assetsNum"
                  :label="item.chargName"
                  :value="item.chargId"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item prop="assetsNum" label="充电设备编码">
              <el-input
                v-model="searchConf.assetsNum"
                placeholder="请输入充电设备编码"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item label="是否分段计价">
              <el-select
                v-model="searchConf.isShowStage"
                clearable
                ref="stageSelect"
                placeholder="是否按分段计价"
              >
                <el-option label="是" value="0"> </el-option>
                <el-option label="否" value="1"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="timeList">
               <template slot="label">
                 <span style="color: #f56c6c;margin-right: 4px">*</span>订单结算时间
               </template>
              <el-date-picker
                :clearable="false"
                v-model="timeList"
                type="daterange"
                range-separator="至"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label-width="0" style="text-align: right">
              <el-button type="primary" @click="toSearch">查询</el-button>
              <el-button @click="resetSearch">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="statistical">
      <iframe id="reportFrame" frameBorder="0" :src="frStaffUrl"></iframe>
    </div>
  </div>
</template>

<script>
import { getEquipment } from '@/api/remotecontrol/chargingpile/params.js'
import { getchargGrou } from '@/api/statistical/cdzdyyfwb'
import { mapGetters } from 'vuex'
import moment from 'moment'
import qs from 'qs'
export default {
  data() {
    return {
      frStaffUrl: null,
      searchConf: {
        enterprise: null,
        orgId: null,
        chargGroupId: '', // 网点ids
        chargId: '', // 设备ID
        assetsNum: '', // 设备编码
        isShowStage: '', // 是否分段
        startTime: null,
        endTime: null
      },
      checkOrgId: null,
      checkChargGroupList: [], // 选择的充电网点
      timeList: [],
      siteList: [], // 充电网点列表
      chargeList: [] // 充电设备名称列表
    }
  },
  computed: {
    ...mapGetters(['deptList', 'userInfo'])
  },
  created() {
    this.searchConf.enterprise = this.userInfo.tenantId
    this.timeList = [
      moment(new Date())
        .subtract(1, 'months')
        .format('YYYY-MM-DD'),
      new Date().toLocaleDateString()
    ]
    this.searchConf.startTime = moment(new Date())
      .subtract(1, 'months')
      .format('YYYY-MM-DD')
    this.searchConf.endTime = new Date().toLocaleDateString()
    if (this.deptList.length > 0) {
      this.checkOrgId = this.deptList[0].id
      this.toFetchSite(this.deptList[0].id)
    }
     this.toSearch()
  },
  methods: {
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.nameCN,
        children: node.children
      }
    },
    selectOrg(val) {
      if (val) {
        this.toFetchSite(val.id)
      }
    },
    openOrgList() {
      this.$refs.stageSelect.blur();
    },
    async toFetchSite(id) {
      const rsp = await getchargGrou({ deptId: id })
      if (rsp.code === 200) {
        this.siteList = rsp.data.result.chargGroup
        this.searchConf.orgId = rsp.data.result.deptId
      }
    },
    toSearch() {
        if (this.timeList?.length > 0) {
        this.searchConf.startTime = moment(this.timeList[0]).format(
          'YYYY-MM-DD'
        )
        this.searchConf.endTime = moment(this.timeList[1]).format('YYYY-MM-DD')
      } else {
        this.searchConf.startTime = null
        this.searchConf.endTime = null
      }
      let pam = {}
      for (let i in this.searchConf) {
        if (this.searchConf[i]) {
          pam[i] = this.searchConf[i]
        }
      }
      this.frStaffUrl =
        window.location.origin +
        '/webroot/decision/view/report?viewlet=/air-port-test/rpt_充电终端运营服务报表.cpt&'
      this.frStaffUrl += qs.stringify(pam, { ignoreQueryPrefix: true })
        
    },
    resetSearch() {
      this.searchConf.chargGroupId = ''
      this.searchConf.chargId = ''
      this.searchConf.assetsNum = ''
      this.searchConf.isShowStage = ''
      this.checkChargGroupList = []
      this.checkOrgId = this.deptList.length > 0 ? this.deptList[0].id : null
      this.timeList = [
      moment(new Date())
        .subtract(1, 'months')
        .format('YYYY-MM-DD'),
      new Date().toLocaleDateString()
    ]
      // this.toSearch()
    },
    changeSite(val) {
      this.searchConf.chargId = null
      this.searchConf.assetsNum = null
      this.chargeList = []
      if(val) {
         getEquipment({ chargGroupId: val }).then((res) => {
        if (res.code === 200) {
          this.chargeList = res.data.result
        }
       }) 
      }
    
    },
    getchargNum(val) {
      this.searchConf.assetsNum = null
      const arr = this.chargeList.filter((item) => item.chargId === val)
      if (arr.length > 0) {
        this.searchConf.assetsNum = arr[0].assetsNum
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.statistical {
  width: 100%;
  height: calc(100vh - #{$headerHeight + 145px});
  overflow: hidden;
  display: flex;
  flex-direction: column;
  #reportFrame {
    flex: 1;
  }
}
</style>
