<template>
  <div class="app-container">
    <div class="card">
      <el-form size="small" label-width="120px">
        <el-row :gutter="5">
          <el-col :span="12">
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
                  @open="openOrgList"
                  placeholder="请选择车辆所属机构"
                />
              </div>
            </div>
          </el-col>
          <el-col :span="12">
            <el-form-item label="车牌号">
              <!-- <template slot="label">
                 <span style="color: #f56c6c;margin-right: 4px">*</span>车牌号
               </template> -->
              <el-select
                v-model="checkCarNumber"
                filterable
                multiple
                clearable
                :placeholder="checkOrgList.length > 0 ? '请选择车牌号' : '请先选择车辆所属机构'"
              >
                <el-option
                  v-for="(item, index) in carList"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="5">  
          <el-col :span="6">
            <el-form-item label="机构类型">
              <el-select
                v-model="typeList"
                clearable
                multiple
                ref="orgTypeSelect"
                placeholder="请选择机构类型"
              >
                <el-option label="自用" value="0"></el-option>
                <el-option label="他用" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item label="粒度" label-width="80px" prop="granularity">
              <template slot="label">
                 <span style="color: #f56c6c;margin-right: 4px">*</span>粒度
               </template>
              <el-select
                v-model="searchConf.granularity"
                ref="granularitySelect"
                placeholder="请选择粒度"
              >
                <el-option label="月" value="month"> </el-option>
                <el-option label="周" value="week"> </el-option>
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
                  placeholder="开始时间"
                  :clearable="false"
                  format="yyyy 第 WW 周"
                  :picker-options="startTimePicker"
                >
                </el-date-picker>
                &nbsp;&nbsp;
                <el-date-picker
                  v-model="endWeek"
                  type="week"
                  :clearable="false"
                  placeholder="结束时间"
                  format="yyyy 第 WW 周"
                  :picker-options="endTimePicker"
                >
                </el-date-picker>
              </div>
              <el-date-picker
                v-else
                v-model="timeList"
                type="monthrange"
                :clearable="false"
                range-separator="至"
                value-format="yyyy-MM-dd HH:mm:ss"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              >
              </el-date-picker>
            </el-form-item>
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
import { getCarNumberByOrg } from '@/api/statistical/cdzdyyfwb'
import qs from 'qs'
import moment from 'moment'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      frStaffUrl:
        window.location.origin +
        '/webroot/decision/view/report?viewlet=/air-port-test/rpt_车辆充电记录报表_汇总.cpt',
      searchConf: {
        orgId: null,
        orgType: null,
        carNumber: null,
        granularity: 'month',
        startTime:  null,
        endTime: null
      },
      startWeek: '',
      endWeek: '',
      checkOrgList: [],
      checkCarNumber: [],
      startTimePicker: this.startTimeLimit(),
      endTimePicker: this.endTimeLimit(),
      timeList: [],
      carList: [],
      typeList: [],
    }
  },
  computed: {
    ...mapGetters(['deptList', 'userInfo'])
  },
  watch: {
      checkOrgList(newVal, oldVal) {
        if(newVal.length > 0) {
          this.fetchCarNumber(this.checkOrgList.join(","))
        }
      }
  },
  created() {
    this.searchConf.enterprise = this.userInfo.tenantId
     this.timeList = [
      moment(new Date())
        .subtract(1, 'months')
        .format('YYYY-MM-01 00:00:00'),
      moment(new Date())
        .add(0, 'months')
        .format('YYYY-MM-01 00:00:00')
    ]
    this.toSearch()
  },
  methods: {
     async fetchCarNumber(val) {
        this.carList = []
        const rsp = await getCarNumberByOrg({deptIdArray: val})
        if(rsp.code === 200) {
          this.carList = rsp.data.result
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
     openOrgList() {
      this.$refs.orgTypeSelect.blur();
      this.$refs.granularitySelect.blur();
    },
    toSearch() {
      if(this.searchConf.granularity === 'week' && !this.startWeek && !this.endWeek) {
          this.$message({
            type: 'warning',
            message: '请选择时间'
          })
          return
      }
        if (this.timeList?.length > 0 && this.searchConf.granularity === 'month') {
            this.searchConf.startTime =
              moment(this.timeList[0]).format('YYYYMMDD') + '0000'
            this.searchConf.endTime =
              moment(this.timeList[1]).format('YYYYMMDD') + '0000'
          } else if( this.startWeek && this.endWeek && this.searchConf.granularity === 'week'){
           this.searchConf.startTime =
              moment(this.startWeek).format('YYYYMMDD') + '0000'
            this.searchConf.endTime =
              moment(this.endWeek).format('YYYYMMDD') + '0000'
          }else {
            this.searchConf.startTime = null
            this.searchConf.endTime = null
          }

        if(this.typeList.length === 2 || this.typeList.length === 0) {
          this.searchConf.orgType = null
        }else {
          this.searchConf.orgType = this.typeList[0]
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

         if(this.checkCarNumber.length > 0) {
           let numbers = ''
            this.checkCarNumber.forEach((item, index) => {
              if(index === this.checkCarNumber.length - 1) {
                numbers += `'${item}'` 
              }else {
                numbers += `'${item}',` 
              }
            })
            this.searchConf.carNumber = numbers
            }else {
              this.searchConf.carNumber = null
            }
        
        let pam = {}
        for (let i in this.searchConf) {
          if (this.searchConf[i]) {
           pam[i] = this.searchConf[i]
          }
        }

        this.frStaffUrl =
          window.location.origin +
          '/webroot/decision/view/report?viewlet=/air-port-test/rpt_车辆充电记录报表_汇总.cpt&'
        this.frStaffUrl += qs.stringify(pam, { ignoreQueryPrefix: true })
        console.log('==========', this.frStaffUrl)
    },
    resetSearch() {
     this.searchConf.orgType = null
     this.checkCarNumber = []
     this.checkOrgList = []
     this.searchConf.orgId = null
     this.searchConf.carNumber = null
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
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.orgs {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  .label {
    font-size: 13px;
    color: #484848;
     width: 85px;
    margin:0 5px 0 30px;

    // &::before {
    //   content: '*';
    //   color: #f56c6c;
    //   margin-right: 4px;
    // }
  }
  .treeselect {
    flex: 1;
  }
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
