<template>
  <div class="app-container">
    <div class="card">
      <el-form
        size="small"
        label-width="120px"
      >
        <el-row :gutter="5">
          <el-col :span="6">
            <el-form-item prop="chargGroupId" label="充电网点名称">
              <el-select
                v-model="searchConf.chargGroupId"
                clearable
                filterable
                @change="changeSite"
                placeholder="请选择充电网点名称"
              >
                <el-option
                  v-for="(item, index) in siteList"
                  :key="index"
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
                v-model="checkChargeList"
                multiple
                clearable
                filterable
                :placeholder="
                  searchConf.chargGroupName
                    ? '请选择充电设备名称'
                    : '请先选择充电网点名称'
                "
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
          <el-col :span="4">
            <el-form-item label-width="80px">
               <template slot="label">
                 <span style="color: #f56c6c;margin-right: 4px">*</span>粒度
               </template>
              <el-select
                v-model="searchConf.granularity"
                placeholder="请选择粒度"
              >
                <el-option label="月" value="month"></el-option>
                <el-option label="周" value="week"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item>
               <template slot="label">
                 <span style="color: #f56c6c;margin-right: 4px">*</span>时间选择
               </template>
              <div class="week" v-if="searchConf.granularity == 'week'">
                <el-date-picker
                  v-model="startWeek"
                  type="week"
                  :clearable="false"
                  placeholder="开始时间"
                  format="yyyy 第 WW 周"
                  :picker-options="startTimePicker"
                >
                </el-date-picker>
                &nbsp;&nbsp;
                <el-date-picker
                  v-model="endWeek"
                  :clearable="false"
                  type="week"
                  placeholder="结束时间"
                  format="yyyy 第 WW 周"
                  :picker-options="endTimePicker"
                >
                </el-date-picker>
              </div>
              <el-date-picker
                v-else
                :clearable="false"
                v-model="timeList"
                type="monthrange"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">
          <el-col :span="18">
            <!-- <div class="orgList">
             <el-form-item label="车辆所属机构">
                <treeselect
                  v-model="checkOrgList"
                  :multiple="true"
                  :flat="true"
                  :default-expand-level="2"
                  :options="deptList"
                  :normalizer="normalizer"
                  placeholder="请选择车辆所属机构"
                />
             </el-form-item>
             </div> -->
            <div class="orgs">
              <div class="label">车辆所属机构</div>
              <div class="treeselect">
                <treeselect
                  v-model="checkOrgList"
                  :multiple="true"
                  :flat="true"
                  :default-expand-level="2"
                  :options="deptList"
                  :normalizer="normalizer"
                  placeholder="选择车辆所属机构"
                />
              </div>
            </div>
          </el-col>
          <el-col :span="6">
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
import { listChargGroupCode } from '@/api/alarm/alarmmonitorcenter.js'
import { getchargGrou } from '@/api/statistical/cdzdyyfwb'
import { getEquipment } from '@/api/remotecontrol/chargingpile/params.js'
import qs from 'qs'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      frStaffUrl:
        window.location.origin +
        '/webroot/decision/view/report?viewlet=/air-port-test/rpt_充电桩运营服务报表（分车辆所属组织机构）汇总.cpt',
      searchConf: {
        orgId: null,
        chargGroupId: null,
        chargId: null,
        granularity: 'month',
        enterprise: null,
        startTime: moment(new Date())
          .subtract(1, 'months')
          .format('YYYY-MM-01 00:00:00'),
        endTime: moment(new Date())
          .add(0, 'months')
          .format('YYYY-MM-01 00:00:00')
      },
      checkOrgList: [],
      checkChargeList: [],
      startWeek: '',
      endWeek: '',
      startTimePicker: this.startTimeLimit(),
      endTimePicker: this.endTimeLimit(),
      timeList: [],
      siteList: [], // 充电网点列表
      chargeList: [] // 充电设备名称列表
    }
  },
  computed: {
    ...mapGetters(['deptList', 'userInfo'])
  },
  created() {
    this.getName()
    this.searchConf.enterprise = this.userInfo.tenantId
    this.timeList = [
      moment(new Date())
        .subtract(1, 'months')
        .format('YYYY-MM-01 00:00:00'),
      moment(new Date())
        .add(0, 'months')
        .format('YYYY-MM-01 00:00:00')
    ]
    if (this.deptList.length > 0) {
      this.toFetchSite(this.deptList[0].id)
    }
    this.toSearch()
  },
  methods: {
    async toFetchSite(id) {
      const rsp = await getchargGrou({ deptId: id })
      if (rsp.code === 200) {
        this.siteList = rsp.data.result.chargGroup
      }
    },
    //获取网点下拉数据
    async getName() {
      const res = await listChargGroupCode()
      if (res.code === 200) {
        this.siteList = res.data
      }
    },
  // 限制开始时间小于结束时间
    startTimeLimit() {
      const self = this
      return {
        disabledDate(time) {
          if (self.endWeek) {
            // 如果结束时间不为空，则小于结束时间
            return new Date(self.endWeek).getTime() < time.getTime()
          }
        },
        firstDayOfWeek: 7
      }
    },
    // 限制结束时间大于开始时间
    endTimeLimit() {
      const self = this
      return {
        disabledDate(time) {
          if (self.startWeek) {
            // 如果开始时间不为空，则大于开始时间
            return new Date(self.startWeek).getTime() > time.getTime()
          }
        },
        firstDayOfWeek: 7
      }
    },
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
    toSearch() {
      if (
        this.searchConf.granularity === 'week' &&
        !this.startWeek &&
        !this.endWeek
      ) {
        this.$message({
          type: 'warning',
          message: '请选择时间'
        })
        return
      }
      // if (this.checkOrgList.length === 0) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择车辆所属机构'
      //   })
      //   return
      // }
          if (
            this.timeList?.length > 0 &&
            this.searchConf.granularity === 'month'
          ) {
            this.searchConf.startTime =
              moment(this.timeList[0]).format('YYYYMMDD') + '0000'
            this.searchConf.endTime =
              moment(this.timeList[1]).format('YYYYMMDD') + '0000'
          } else if (
            this.startWeek &&
            this.endWeek &&
            this.searchConf.granularity === 'week'
          ) {
            this.searchConf.startTime =
              moment(this.startWeek).format('YYYYMMDD') + '0000'
            this.searchConf.endTime =
              moment(this.endWeek).format('YYYYMMDD') + '0000'
          } else {
            this.searchConf.startTime = null
            this.searchConf.endTime = null
          }

          if (this.checkChargeList.length > 0) {
            this.searchConf.chargId = this.checkChargeList.join(',')
          } else {
            this.searchConf.chargId = null
          }

          if(this.checkOrgList.length > 0) {
            let orgs = ''
            this.checkOrgList.forEach((item, index) => {
              if(index === this.checkOrgList.length - 1) {
                orgs += `'${item}'` 
              }else {
                 orgs += `'${item}',` 
              }
            })
            this.searchConf.orgId = orgs
          }else {
            this.searchConf.orgId = null
          }

          let pam = {}
          for (let i in this.searchConf) {
            if (this.searchConf[i]) {
              pam[i] = this.searchConf[i]
            }
          }

          this.frStaffUrl =
            window.location.origin +
            '/webroot/decision/view/report?viewlet=/air-port-test/rpt_充电桩运营服务报表（分车辆所属组织机构）汇总.cpt&'
          this.frStaffUrl += qs.stringify(pam, { ignoreQueryPrefix: true })
    },
    resetSearch() {
       this.searchConf.chargGroupId = null;
       this.searchConf.chargId = null
       this.checkChargeList = []
       this.checkOrgList = []
       this.searchConf.orgId = null
       this.searchConf.granularity = 'month'
       this.startWeek = ''
       this.endWeek = ''
       this.timeList = [
      moment(new Date())
        .subtract(1, 'months')
        .format('YYYY-MM-01 00:00:00'),
       moment(new Date())
        .add(0, 'months')
        .format('YYYY-MM-01 00:00:00')
    ]
    },

    changeSite(val) {
      getEquipment({ chargGroupId: val }).then((res) => {
        if (res.code === 200) {
          this.chargeList = res.data.result
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.orgs {
  display: flex;
  align-items: center;
  .label {
    font-size: 13px;
    color: #484848;
    width: 114px;
    margin: -10px 0 0 30px;

    // &::before {
    //   content: '*';
    //   color: #f56c6c;
    //   margin-right: 4px;
    // }
  }
}
.treeselect {
  flex: 1;
  margin: 0 0 10px -24px;
}
.week {
  display: flex;
}
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
