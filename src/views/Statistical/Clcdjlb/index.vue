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
                placeholder="请选择车牌号"
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
            <el-form-item label="是否分段计价">
              <el-select
                v-model="searchConf.isShowStage"
                clearable
                ref="stageSelect"
                placeholder="选择是否按分段计价显示"
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
import { getCarNumberByOrg } from '@/api/statistical/cdzdyyfwb'
import { mapGetters } from 'vuex'
import qs from 'qs'
import moment from 'moment'
export default {
  data() {
    return {
      frStaffUrl:
        window.location.origin +
        '/webroot/decision/view/report?viewlet=/air-port-test/rpt_车辆充电记录报表.cpt',
      searchConf: {
        orgId: null,
        carNumber: null,
        isShowStage: null,
        startTime: null,
        endTime: null
      },
      checkOrgList: [],
      checkCarNumber: [],
      timeList: [],
      checkOrgId: null,
      carList: [],
      chargeNoList: [] // 充电卡号列表
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
        .format('YYYY-MM-DD'),
      new Date().toLocaleDateString()
    ]
    this.searchConf.startTime = moment(new Date())
      .subtract(1, 'months')
      .format('YYYY-MM-DD')
    this.searchConf.endTime = new Date().toLocaleDateString()
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
      this.$refs.stageSelect.blur();
    },
    toSearch() {
      if(this.timeList?.length > 0) {
        this.searchConf.startTime = moment(this.timeList[0]).format(
          'YYYY-MM-DD'
        )
        this.searchConf.endTime = moment(this.timeList[1]).format('YYYY-MM-DD')
      } else {
        this.searchConf.startTime = null
        this.searchConf.endTime = null
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
        if (this.searchConf[i] || this.searchConf[i] == '0') {
          pam[i] = this.searchConf[i]
        }
      }
      this.frStaffUrl =
        window.location.origin +
        '/webroot/decision/view/report?viewlet=/air-port-test/rpt_车辆充电记录报表.cpt&'
      this.frStaffUrl += qs.stringify(pam, { ignoreQueryPrefix: true }) 
    },
    resetSearch() {
     this.searchConf.carNumber = ''
     this.searchConf.isShowStage = ''
     this.searchConf.orgId = null
     this.checkOrgList = []
     this.checkCarNumber = []
     this.timeList = [
      moment(new Date())
        .subtract(1, 'months')
        .format('YYYY-MM-DD'),
      new Date().toLocaleDateString()
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
  margin-bottom: 10px;
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
