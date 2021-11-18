<template>
  <div class="settingComponent">
    <div class="back" @click="goBack">
      <img src="@/assets/images/fanhui.png"/>
      <span>返回上一页</span>
    </div>
    <div class="yearListBox">
      <div
        v-for="(item, index) in yearListData"
        :key="index"
        :class="index === monthIndex ? 'yearItemChecked' : 'yearItem'"
        @click="checkMonth(item, index)"
      >
        <div class="yearText">{{ cyear }}年</div>
        <div class="monthText">{{ item.month }}</div>
        <div v-if="item.status === 1" class="noSetting">
          <img src="@/assets/images/noSetting.png" />
          <span>未配置</span>
        </div>
      </div>
    </div>
    <div class="settingBox">
      <div class="options">
        <div>
          <el-button type="primary" icon="el-icon-plus" @click="toAdd">新增</el-button>
          <!-- <el-button type="primary" plain icon="el-icon-edit" @click="toEdit">编辑</el-button> -->
          <el-button type="primary" plain icon="el-icon-copy-document" v-if="isSetting === 0" @click="toCopy">拷贝</el-button>
        </div>
        <div class="submit">
          <el-button type="primary" icon="el-icon-check" @click="submitSetting" v-if="settingData.length > 0">提交</el-button>
        </div>
      </div>
      <el-table
        :data="settingData"
        border
        style="width: 100%;"
        :header-cell-style="tableHeaderStyle"
        :span-method="cellMerge"
      >
        <el-table-column prop="y" label="充电峰值" align="center">
          <template slot-scope="scope">
            {{ typeObj[scope.row.cStage] }}
          </template>
        </el-table-column>
        <el-table-column prop="cStartTime" label="开始时间" align="center">
          <template slot-scope="scope">
            <div class="row">
            <el-time-select
                v-if="scope.row.isEdit"
                 :clearable="false"
                v-model="scope.row.cStartTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }"
                placeholder="选择时间">
              </el-time-select>
           <span v-else>{{scope.row.cStartTime}}</span>
           </div>
          </template>
        </el-table-column>
        <el-table-column prop="cEndTime" label="结束时间" align="center">
         <template slot-scope="scope">
           <div class="row">
            <el-time-select
                v-if="scope.row.isEdit"
                :clearable="false"
                v-model="scope.row.cEndTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }"
                placeholder="选择时间">
              </el-time-select>
            <span v-else>{{scope.row.cEndTime === '00:00' ? '24:00' : scope.row.cEndTime}}</span>
           </div>
          </template>
        </el-table-column>
        <el-table-column prop="cElectricityFee" label="电费" align="center">
          <template slot-scope="scope"> 
           <div class="row">
               <el-input-number 
                v-if="scope.row.isEdit" 
                v-model="scope.row.cElectricityFee"
                :controls="false"
                :precision="6"
                :min="0"
                placeholder="请填写电费"/>
           <span v-else>{{scope.row.cElectricityFee ? scope.row.cElectricityFee.toFixed(6) : 0}}</span>
          </div>
          </template>
        </el-table-column>
        <el-table-column prop="cServiceFee" label="服务费" align="center">
          <template slot-scope="scope">
            <div class="row">
              <el-input-number 
                v-if="scope.row.isEdit" 
                v-model="scope.row.cServiceFee"
                :controls="false"
                :precision="6"
                :min="0"
                placeholder="请填写服务费"/>
          <span v-else>{{scope.row.cServiceFee  ? scope.row.cServiceFee.toFixed(6) : 0}}</span>
          </div>
          </template>
        </el-table-column>
         <el-table-column prop="x" label="操作" align="center">
            <template slot-scope="scope"  >
              <div v-if="scope.row.isEdit">
              <el-link type="primary"  style="margin-right: 10px" :underline="false" @click="saveRow(scope.row, scope.$index)">保存</el-link>
              <el-link type="primary" :underline="false" @click="handleCancel(scope.row, scope.$index)">取消</el-link>
            </div>
            <div v-else>
              <el-link type="primary" icon="el-icon-edit" style="margin-right: 10px" :underline="false" @click="editRow(scope.row)">编辑</el-link>
              <el-link type="danger" icon="el-icon-delete" :underline="false" @click="deleteRow(scope.row, scope.$index)">删除</el-link>
            </div>
           </template>
           
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增 -->
    <div v-if="showAdd">
    <el-dialog
    v-dialogDrag
    title="新增充电峰值"
    :visible.sync="showAdd"
    width="400px"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :before-close="closeAddDialog">
      <div class="addBox">
        <div class="addItem">
          <div class="label">峰值类型</div>
          <div class="value">
            <el-select v-model="addChargObj.cStage" placeholder="请选择峰值类型">
              <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
          <div class="addItem">
          <div class="label">开始时间</div>
          <div class="timevalue">
             <el-time-select
                v-model="addChargObj.cStartTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }"
                placeholder="选择时间">
              </el-time-select>
          </div>
        </div>
         <div class="addItem">
          <div class="label">结束时间</div>
          <div class="timevalue">
             <el-time-select
                v-model="addChargObj.cEndTime"
                 :picker-options="{
                  start: '00:00',
                  step: '00:30',
                  end: '24:00'
                }"
                placeholder="选择时间">
              </el-time-select>
          </div>
        </div>
        <div class="addItem">
          <div class="label">电费</div>
          <div class="value">
             <el-input-number v-model="addChargObj.cElectricityFee"
                :controls="false"
                :min="0"
                placeholder="请填写电费"/>
          </div>
        </div>
        <div class="addItem">
          <div class="label">服务费</div>
          <div class="value">
             <el-input-number v-model="addChargObj.cServiceFee"
                :controls="false"
                :min="0"
                placeholder="请填写服务费"/>
          </div>
        </div>
      </div>
       <span slot="footer">
        <el-button type="primary" style="margin-right: 10px" @click="submitAdd">确 定</el-button>
        <el-button type="primary" plain @click="goOnAdd" v-if="addChargObj.endTime !== '24:00'">继续添加</el-button>
        <el-button type="primary" plain @click="closeAddDialog">取消</el-button>
    </span>
    </el-dialog>
</div>
  <!-- 网点资费配制拷贝 -->
  <div v-if="showCopy">
   <el-dialog
    v-dialogDrag
    title="网点资费配制拷贝"
    :visible.sync="showCopy"
    width="40%"
    :destroy-on-close="true"
    :close-on-click-modal="false"
    :before-close="closeCopyDialog">
      <div class="addBox">
        <div class="addItem">
          <div class="label">拷贝到</div>
          <div class="value">
             <el-radio-group v-model="copyType" @change="changeCopeType">
             <el-radio label="1">其他月份</el-radio>
             <el-radio label="2">其他网点</el-radio>
             </el-radio-group>
          </div>
        </div>
         <div class="addItems" v-if="copyType === '1'">
          <div class="label">月份</div>
          <div class="value">
            <el-select v-model="copyMonths" multiple placeholder="请选择月份">
              <el-option
                v-for="item in monthSelectList"
                :key="item"
                :label="`${item}月`"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
         <div class="addItems" v-else>
          <div class="label">网点</div>
          <div class="value">
            <el-select v-model="copyChargIds" multiple placeholder="请选择网点">
              <el-option
                v-for="item in charGroupList"
                :key="item.cId"
                :label="item.recSiteName"
                :value="item.cId"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
       <span slot="footer">
        <el-button type="primary" style="margin-right: 10px" @click="submitCopy">确 定</el-button>
        <el-button type="primary" plain @click="closeCopyDialog">取消</el-button>
    </span>
  </el-dialog>
  </div>

  </div>
</template>

<script>
import { getMonthSeetingDetail, addMonthSiteFee, siteFeeCopy, getNetFeeList } from '@/api/financial/tariffSetting'
import { mapGetters } from 'vuex'
export default {
  props: {
    netTitle: {
      type: String,
      default: "",
    },
    cid: {
      type: String,
      default: ''
    },
    cyear: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      showAdd: false,
      showCopy: false,
      copyType: '1', // 拷贝到 1：其他月份 2：其他网点
      copyMonths: [], // 拷贝月份(多选)
      copyChargIds: [], // 拷贝网点id(多选)
      monthIndex: 0,
      isSetting: 0, // 0: 已配置, 1: 未配置
      typeObj: { 
        0: "峰",
        1: "平",
        2: "谷",
        3: "尖",
      },
      typeList: [
        {id: 0, name: '峰'},
        {id: 1, name: '平'},
        {id: 2, name: '谷'},
        {id: 3, name: '尖'},
      ],
      addChargObj: {
        cStage: null,
        cStartTime: null,
        cEndTime: null,
        cElectricityFee: undefined,
        cServiceFee: undefined,
        isEdit: false,
      },
      charGroupList: [],
      month: 1,
      yearListData: [],
      settingData: [],
      originSettingData: [],
      rowInfo: null,
      spanArr: [],
      pos: null,
    }
  },
  computed: {
    monthSelectList() {
      let arr = []
      for(let i = 1; i <= 12; i ++) {
        if(this.month !== i) {
          arr.push(i)
        }
      }
      return arr
    },
    ...mapGetters(['userInfo'])
  },
  created() {
      if(this.cid) {
        this.fetchMonthDetail()
      }
  },
  methods: {
    async fetchMonthDetail() {
      const rsp = await getMonthSeetingDetail(this.cid)
      if(rsp.code === 200) {
        this.yearListData = rsp.data
        if(this.yearListData.length > 0 && this.yearListData[this.monthIndex].monthVos) {
          this.originSettingData = this.yearListData[this.monthIndex].monthVos
          this.isSetting = this.yearListData[this.monthIndex].status
          this.initEditAttribute()
        }
      }
    },
    async fetchNetFeeList() {
      const data = {
        pageNo: 1,
        pageNum: 1000,
        year: this.cyear,
        username: this.userInfo.userName
      }
      const rsp = await getNetFeeList(data)
      if(rsp.code === 200) {
        const arr = rsp.data.list
        if(arr.length > 0) {
          this.charGroupList = arr.filter(item => item.cId !== this.cid)
        }
      }
    },
     initEditAttribute() {
      let dataArray = JSON.parse(JSON.stringify(this.originSettingData));
      if (dataArray.length > 0) {
        //添加编辑事件
        for (let index in dataArray) {
          dataArray[index]["isEdit"] = false;
          this.settingData.push(dataArray[index]);
        }
        this.getSpanArr(this.settingData)
      }else {
         this.settingData = []
      }
    },
    goBack() {
      this.$emit("closeSetting");
    },
    checkMonth(item, index) {
      this.month = item.month
      this.monthIndex = index; 
      this.settingData = []
      this.originSettingData = []
      this.originSettingData = this.yearListData[index].monthVos
      this.isSetting = this.yearListData[index].status
      this.initEditAttribute()
    },
    closeAddDialog() {
      this.showAdd = false
      this.addChargObj = {
        cStage: null,
        cStartTime: null,
        cEndTime: null,
        cElectricityFee: undefined,
        cServiceFee: undefined,
        isEdit: false,
      }
    },
    toAdd() {
      this.showAdd = true
    },
    // 比较时间大小
    compareTime(t1,t2){
        var date = new Date();
        var a = t1.split(":");
        var b = t2.split(":");
        return date.setHours(a[0],a[1]) < date.setHours(b[0],b[1]);
    },
    // submitType 1: 表示添加确定(关闭弹窗)
    //  2: 表示继续添加(不关闭弹窗)
    beforeAddSubmit(submitType = 1) {
       if(this.addChargObj.cStage !== 0 && this.addChargObj.cStage !== 1
      && this.addChargObj.cStage !== 2 && this.addChargObj.cStage !== 3 ) {
          this.$message({
            type: 'warning',
            message: '请选择峰值类型'
          })
     }else if(!this.addChargObj.cStartTime) {
       this.$message({
            type: 'warning',
            message: '请选择开始时间'
          })
     }else if(!this.addChargObj.cEndTime) {
       this.$message({
            type: 'warning',
            message: '请选择结束时间'
          })
     }else if(!this.compareTime(this.addChargObj.cStartTime, this.addChargObj.cEndTime)) {
       this.$message({
            type: 'warning',
            message: '结束时间必须大于开始时间'
          })
     }else if(!this.addChargObj.cElectricityFee && this.addChargObj.cElectricityFee !== 0){
         this.$message({
            type: 'warning',
            message: '电费格式不正确'
          })
     }else if(!this.addChargObj.cServiceFee && this.addChargObj.cServiceFee !== 0){
         this.$message({
            type: 'warning',
            message: '服务费格式不正确'
          })
     }else { 
       this.addChargObj.isEdit = false
       this.settingData.push(this.addChargObj)
       this.getSpanArr(this.settingData)
       this.addChargObj = {
        cStage: null,
        cStartTime: null,
        cEndTime: null,
        cElectricityFee: undefined,
        cServiceFee: undefined,
        isEdit: false,
      }
      
       if(submitType === 1) {
          this.showAdd = false
       }else {
          this.showAdd = true
       } 
     }
    },
    submitAdd() {
      this.beforeAddSubmit(1)
    },
    goOnAdd() {
      this.beforeAddSubmit(2)
    },
    // 删除
    deleteRow(row, index) {
      this.settingData.splice(index, 1)
      this.getSpanArr(this.settingData)
    },
    // 编辑
    editRow(row) {
      this.rowInfo = row
      row.isEdit = true
    },
    handleCancel(row, index) {
      this.settingData[index] = this.rowInfo
      row.isEdit = false
    },
    saveRow(row) {
      row.isEdit = false
    },
    // 整体提交
    submitSetting() {
       const data = []
       if(this.settingData.length === 0) {
         this.$message({
           type: 'warning',
           message: '请配置后再提交'
         })
       }else {
        const startTimes = this.settingData.map(item => item.cStartTime)
        const endTimes = this.settingData.map(item => item.cEndTime)
        const starts = new Set(startTimes);
        const ends = new Set(endTimes);
        if(startTimes.length !== starts.size || endTimes.length !== ends.size) {
          this.$message({
            type: 'warning',
            message: '配置开始,结束时间重复'
          })
          return
        }
         this.settingData.forEach(item => {  
           data.push({
              cStage: item.cStage,
              cStartTime: item.cStartTime,
              cEndTime: item.cEndTime === '24:00' ? '00:00' : item.cEndTime,
              cElectricityFee: item.cElectricityFee,
              cServiceFee: item.cServiceFee,
              cMonth: item.cMonth || this.month,
              cYearId: item.cYearId || this.cid
           })
         })
         this.toSubMonthSetting(data)
       }
    },
    async toSubMonthSetting(data) {
      const rsp = await addMonthSiteFee(data)
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: '资费配置成功'
        }) 
        this.settingData = []
        this.originSettingData = []
        this.fetchMonthDetail()
      }
    },
    toEdit() {

    },
    toCopy() {
      this.showCopy = true
    },
    changeCopeType(value) {
      this.copyType = value
      if(value === '1') {
        this.copyChargIds = []
      }else {
        if(this.userInfo.userName) {
          this.fetchNetFeeList()
        }
        this.copyMonths = []
      }
    },
    submitCopy() {
      if(this.copyType === '1') {
        if(this.copyMonths.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择拷贝月份'
          })
        }else {
            let data = []
            this.copyMonths.forEach(item => {
              data.push({
                orgMonth: this.month,
                orgYearId: this.cid,
                tagMonth: item,
                tagYearId: this.cid
              })
            })
            this.tosubmitCopy(data)
        }
      }else {
       if(this.copyChargIds.length === 0) {
         this.$message({
            type: 'warning',
            message: '请选择拷贝网点'
          })
       }else {
         let data = []
            this.copyChargIds.forEach(item => {
              data.push({
                orgMonth: this.month,
                orgYearId: this.cid,
                tagMonth: this.month,
                tagYearId: item
              })
            })
            this.tosubmitCopy(data)
       }
      }
    },
    async tosubmitCopy(data) {
      const rsp = await siteFeeCopy(data)
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: '拷贝成功'
        })
        this.showCopy = false
        this.settingData = []
        this.originSettingData = []
        this.fetchMonthDetail()
      }
    },
    closeCopyDialog() {
      this.showCopy = false
    },
    getSpanArr(data) {
      this.spanArr = [];
      for (var i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同
          if (data[i].cStage === data[i - 1].cStage) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    cellMerge({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        }
      }
    }
  }
}
</script>
<style lang="scss">
.addBox  .el-input__inner {
  width: 220px !important;
  text-align: left;
}
.timevalue {
  .el-input__prefix {
    margin-top: -3px;
  }
  .el-input__suffix {
    margin-top: -3px;
    // margin-right: -20px;
  }
}
.row {
   .el-input__prefix {
    margin-top: -3px;
  }
  .el-input__suffix {
    margin-top: -3px;
    margin-right: -20px;
  }
  .el-input__inner {
  width: 190px !important;
  text-align: left;
}
}
</style>
<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.settingComponent {
  .back {
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    img {
      width: 20px;
      height: 20px;
    } 
    span {
        padding-left: 10px;
        color: $topMenuActiveColor;
        font-size: 14px;
      }
  }
  .yearListBox {
    display: flex;
    align-items: center;
    margin: 7px 0 11px 0;
    .yearItem {
      width: 110px;
      height: 58px;
      background-color: #fff;
      border-radius: 2px;
      color: #666666;
      text-align: center;
      margin-right: 15px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &:last-child {
        margin-right: 0;
      }
      .noSetting {
        font-size: 10px;
        color: red;
        img {
          width: 10px;
          height: 8.97px;
        }
      }
      .yearText {
        font-size: 12px;
        margin: 2px 0 4px 0;
      }
      .monthText {
        font-size: 14px;
      }
    }
    .yearItemChecked {
      width: 110px;
      height: 58px;
      background-color: $btnMainColor;
      border-radius: 2px;
      color: #ffffff;
      text-align: center;
      margin-right: 15px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      justify-content: center;
      &:last-child {
        margin-right: 0;
      }
      .noSetting {
        font-size: 10px;
        color: red;
        img {
          width: 10px;
          height: 8.97px;
        }
      }
      .yearText {
        font-size: 12px;
        margin: 2px 0 4px 0;
      }
      .monthText {
        font-size: 14px;
      }
    }
  }
  .settingBox {
    background-color: #fff;
    border-radius: 4px;
    padding: 15px;
    .options {
      margin: 10px 0;
      display: flex;
      justify-content: space-between;
    }
  }

  .addBox {
    margin-left: 20px;
    .addItem {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .label {
        width: 80px;
        color: $mainTitleColor;
        font-size: 14px;
        // &::before {
        //   margin-right: 3px;
        //   content: '*';
        //   color: red;
        // }
      }
      .value {
        font-size: 14px;
        color: #666;
      }
      .timevalue {
        font-size: 14px;
        color: #666;

      }
    }

    .addItems {
      display: flex;
      margin-bottom: 15px;
      .label {
        width: 80px;
        color: $mainTitleColor;
        font-size: 14px;
        line-height: 36px;
        // &::before {
        //   margin-right: 3px;
        //   content: '*';
        //   color: red;
        // }
      }
      .value {
        font-size: 14px;
        color: #666;
      }
    }

  }
}
</style>
