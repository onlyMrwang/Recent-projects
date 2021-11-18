<template>
  <div class="shareBox">
    <div class="add">
      <el-button type="primary" icon="el-icon-plus" @click="addChargObj"
        >新增</el-button
      >
    </div>
    <div class="tabs">
      <div class="tabList">
        <div
          v-for="item in tabList"
          :key="item.id"
          :class="
            item.value === accSettingTab
              ? 'activeItem'
              : 'item'
          "
          @click="handleClick(item)"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="line"></div>
    </div>
    <div class="tables">
      <!-- 车辆 -->
      <div v-if="accSettingTab === 'car'" class="carTable">
        <el-table :data="carList" style="width: 100%" border
         :header-cell-style="tableHeaderStyle">
          <el-table-column
            prop="objAcc"
            label="车辆编号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="carNumber"
            label="车牌号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="carVin"
            label="车辆vin码"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="carModel"
            label="车辆型号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="carType"
            label="能源类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{dictInfo.carTypeObj[scope.row.carType]}}
            </template>
          </el-table-column>
          <el-table-column
            prop="userBroaHead"
            label="车辆类型"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
               {{Number(scope.row.userBroaHead) >= 0 ? dictInfo.usebroaHeadObj[scope.row.userBroaHead] : null }}
            </template>
          </el-table-column>
          <el-table-column
            prop="userSubcHead"
            label="车辆用途"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{(Number(scope.row.userBroaHead) >= 0 && Number(scope.row.userSubcHead) >= 0) ? formatSubName(scope.row.userBroaHead, scope.row.userSubcHead) : null}}
            </template>
          </el-table-column>
          <el-table-column
            prop="cardMoney"
            label="当前金额(元)"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.cardMoney ? scope.row.cardMoney.toFixed(6) : 0}}
          </template>
          </el-table-column>
          <el-table-column
            prop="x"
            label="操作"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-popconfirm
                title="确定删除该车辆？"
                @confirm="deleteCar(scope.row)"
              >
                <el-link type="danger" :underline="false" slot="reference">删除</el-link>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="carList.length > 0">
           <el-pagination
            background
            @size-change="handleCarSizeChange"
            @current-change="handleCarPage"
            :current-page="seaCarConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="seaCarConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="carTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 人员 -->
      <div v-if="accSettingTab === 'person'" class="personTable">
        <el-table :data="personList" style="width: 100%" border
         :header-cell-style="tableHeaderStyle">
          <el-table-column
            prop="cardId"
            label="司机账号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="workName"
            label="用户名"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="staffCode"
            label="工作编号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
            <el-table-column
            prop="cardMoney"
            label="当前金额(元)"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.cardMoney ? scope.row.cardMoney.toFixed(6) : 0}}
          </template>
          </el-table-column>
           <el-table-column
            prop="x"
            label="操作"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <el-popconfirm
                title="确定删除该人员？"
                @confirm="deletePerson(scope.row)"
              >
                <el-link type="danger" :underline="false" slot="reference">删除</el-link>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="personList.length > 0">
           <el-pagination
            background
            @size-change="handlePersonSizeChange"
            @current-change="handlePersonPage"
            :current-page="seaPersonConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="seaPersonConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="personTotal">
          </el-pagination>
        </div>
      </div>
      <!-- 实体卡 -->
      <div v-if="accSettingTab === 'card'" class="cardTable">
        <el-table :data="cardList" style="width: 100%" border
         :header-cell-style="tableHeaderStyle">
          <el-table-column
            prop="carNumber"
            label="车牌号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="cardCode"
            label="实体卡"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
           <el-table-column
            prop="cardMoney"
            label="当前金额(元)"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              {{scope.row.cardMoney ? scope.row.cardMoney.toFixed(6) : 0}}
          </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="cardList.length > 0">
          <el-pagination
            background
            @size-change="handleCardSizeChange"
            @current-change="handleCardPage"
            :current-page="seaCardConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="seaCardConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="cardTotal">
          </el-pagination>
        </div>
      </div>
    </div>

      <!-- 新增车辆 -->
    <div v-if="showAddCar">
    <el-dialog
      v-dialogDrag
      title="新增车辆"
      :visible.sync="showAddCar"
      width="45%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="closeAddCar"
    >
      <div class="settingAddBox">
        <div class="addItem">
          <div class="label">车辆</div>
          <div class="value">
            <el-select
              v-model="addCarList"
              multiple
              filterable
              placeholder="请选择车辆"
              @change="changeAddCar"
            >
              <el-option
                v-for="item in noOpenCarList"
                :key="item.id"
                :label="item.carNumber"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="submitAddCar" :loading="showAddCarLoading">确 定</el-button>
        <el-button style="margin-left: 10px" @click="closeAddCar"
          >取消</el-button
        >
      </span>
    </el-dialog>
    </div>

    <!-- 新增人员 -->
    <div v-if="showAddPerson">
    <el-dialog
      v-dialogDrag
      title="新增人员"
      :visible.sync="showAddPerson"
      width="45%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="closeAddPerson"
    >
      <div class="settingAddBox">
        <div class="addItem">
          <div class="label">人员</div>
          <div class="value">
            <el-select
              v-model="addPersonList"
              multiple
              filterable
              placeholder="请选择人员"
              @change="changeAddPerson"
            >
              <el-option
                v-for="item in waitPersonList"
                :key="item.workersId"
                :label="item.workName"
                :value="item.workersId"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <span slot="footer">
        <el-button type="primary" @click="submitAddPerson" :loading="showAddPersonLoading">确 定</el-button>
        <el-button style="margin-left: 10px" @click="closeAddPerson"
          >取消</el-button
        >
      </span>
    </el-dialog>
   </div>

    <!-- 实体卡配置 -->
    <div v-if="showAddCard">
    <el-dialog
      v-dialogDrag
      :title="showCardSetting ? `实体卡配置` : `匹配结果`"
      :visible.sync="showAddCard"
      width="45%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      :before-close="closeAddCard"
    >
      <div v-if="showCardSetting" class="settingAddBox">
        <!-- <div class="addItem">
          <div class="label">卡号段</div>
          <div class="value">
             <div class="cardDuan">
              <el-input v-model.number="startCardNum" onkeyup="this.value = this.value.replace(/[^\d.]/g,''); if(this.value.length > 16) this.value = this.value.slice(0, 16)" />
              <div class="gap">-</div>
              <el-input v-model.number="endCardNum" onkeyup="this.value = this.value.replace(/[^\d.]/g,''); if(this.value.length > 16) this.value = this.value.slice(0, 16)" />
            </div>
          </div>
        </div> -->
         <div class="addItem">
          <div class="label">卡  号&nbsp;&nbsp;</div>
          <div class="value">
            <el-select
              v-model="checkCardList"
              multiple
              filterable
              placeholder="请选择卡号"
            >
              <el-option
                v-for="item in waitCardList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </div>
        </div>
        <div class="addItem">
          <div class="label">车牌号</div>
          <div class="value">
            <el-select
              v-model="addCardList"
              multiple
               filterable
              placeholder="请选择车牌号"
              @change="changeAddCard"
            >
              <el-option
                v-for="item in noOpenCarListOfCard"
                :key="item.id"
                :label="item.carNumber"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </div>
        </div>
      </div>
      <div v-else>
        <table>
          <tr>
            <th>卡号</th>
            <th>车牌号</th>
          </tr>
          <tr v-for="(item, index) in matchCardList" :key="index">
            <td>{{ item }}</td>
            <td>{{ carObj[`${matchCarList[index]}`] }}</td>
          </tr>
        </table>
      </div>
      <span slot="footer" v-if="showCardSetting">
        <el-button type="primary" @click="matchAddCard">下一步</el-button>
        <!-- <el-button style="margin-left: 10px" @click="closeAddCard">取消</el-button> -->
      </span>
      <span slot="footer" v-if="!showCardSetting">
        <el-button type="primary" v-if="matchCardList.length > 0" :loading="showAddCardLoading" @click="submitAddCard">确定</el-button>
        <el-button style="margin-left: 10px" @click="closeAddCard">取消</el-button>
      </span>
    </el-dialog>
  </div>

  </div>
</template>

<script>
import { getAccCardList, getAccPersonList, getAccCarList, getNoOpenCarList, addCars,
 addPersons, addCards, delAccountObj, getStaffsPerson, checkCards, getNoOpenCarOfCard, getCardList} from '@/api/financial/account'
import { mapGetters } from "vuex";
import { arrToObj, carArrToObj } from '@/utils/utils'
export default {
  props: {
    accId: {
      type: String,
      default: null
    },
    orgId: {
      type: String,
      default: null
    },
    searchConf: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      showAddCar: false,
      showAddPerson: false,
      showAddCard: false,
      carTotal: 0,
      cardTotal: 0,
      personTotal: 0,
      showAddCarLoading: false,
      showAddPersonLoading: false,
      showAddCardLoading: false,
      seaCarConf: {
          pageNo: 1,
          pageSize: 10,
          isPage: 'yes'
      },
      seaPersonConf: {
          pageNo: 1,
          pageSize: 10,
          isPage: 'yes'
      },
      seaCardConf: {
          pageNo: 1,
          pageSize: 10,
          states: 1,
          isPage: 'yes'
      },
      tabList: [
        { id: 1, name: "车辆", value: "car" },
        { id: 2, name: "人员", value: "person" },
        { id: 3, name: "实体卡", value: "card" },
      ],
      carList: [],
      personList: [],
      cardList: [],
      waitPersonList: [], // 添加司机待选司机列表
      noOpenCarList: [], // 添加车辆待选列表
      noOpenCarListOfCard: [], // 添加实体卡车辆待选列表
      addCarList: [], // 新增车辆列表(多选)
      addPersonList: [], // 新增人员列表(多选)
      addCardList: [], // 实体卡配置车牌列表(多选)
      startCardNum: undefined, // 卡号段开始卡号
      endCardNum: undefined, // 卡号段结束卡号
      showCardSetting: true, // 是否展示卡配置
      matchCardList: [], // 实体卡配置匹配成功卡号列表
      matchCarList: [], // 实体卡配置匹配成功车辆列表
      carObj: null, // 车辆车牌号-id
      matchObj: null, // 匹配结果key-value
      checkCardList: [], // 实体卡匹配 - 选择卡列表
      waitCardList: [], // 实体卡匹配 - 卡列表待选
    }
  },
  computed: {
    ...mapGetters(['deptList', 'accSettingTab', 'dictInfo'])
  }, 
  created() {
    if(this.accId) {
       if(this.accSettingTab === 'car') {
        this.fetchCars()
       }else if(this.accSettingTab === 'person') {
        this.fetchPersons()
       }else {
        this.fetchCards()
       }
    }
  },
  watch: {
    accSettingTab(newVal, oldVal) {
        if(newVal === 'car') {
          this.fetchCars()
        }else if(newVal === 'person') {
          this.fetchPersons()
        }else {
          this.fetchCards()
        }
    }
  },
  beforeDestroy() {
    this.$store.commit('account/changeAccSettingTab', 'car')
  },
  methods: {
    async fetchCars() {
      this.seaCarConf.accId = this.accId
      this.seaCarConf = Object.assign(this.seaCarConf, this.searchConf)
      const rsp = await getAccCarList(this.seaCarConf)
      if(rsp.code === 200) {
        this.carList = rsp.data.list
        this.carTotal = rsp.data.total
      }
    },
     async fetchPersons() {
      this.seaPersonConf.accId = this.accId
      this.seaPersonConf = Object.assign(this.seaPersonConf, this.searchConf)
      const rsp = await getAccPersonList(this.seaPersonConf)
      if(rsp.code === 200) {
        this.personList = rsp.data.list
        this.personTotal = rsp.data.total
      }
    },
    async fetchCards() {
      this.seaCardConf.accId = this.accId
      this.seaCardConf = Object.assign(this.seaCardConf, this.searchConf)
      const rsp = await getAccCardList(this.seaCardConf)
      if(rsp.code === 200) {
        this.cardList = rsp.data.list
        this.cardTotal = rsp.data.total
      }
    },
    addChargObj() {
      if (this.accSettingTab === "car") {
        this.fetchNoOpenList();
        this.showAddCar = true;
        this.showAddPerson = false;
        this.showAddCard = false;
      } else if (this.accSettingTab === "person") {
        this.fetchStaffs();
      } else {
        this.fetchNoOpenListOfCard();
        this.fetchWaitCardList()
        this.showAddCard = true;
        this.showAddPerson = false;
        this.showAddCar = false;
      }
    },
    async fetchNoOpenList() {
      const rsp = await getNoOpenCarList(this.orgId);
      if (rsp.code === 200) {
        this.noOpenCarList = rsp.data;
      }
    },
    async fetchNoOpenListOfCard() {
      const rsp = await getNoOpenCarOfCard(this.orgId);
      if (rsp.code === 200) {
        this.noOpenCarListOfCard = rsp.data;
      }
    },
    async fetchStaffs() {
      const data = {
        orgId: this.orgId,
        type: 0
      }
      const rsp = await getStaffsPerson(data)
      if(rsp.code === 200) {
        this.waitPersonList = rsp.data
        this.showAddCar = false
        this.showAddPerson = true
        this.showAddCard = false
      }
    },
    handleClick(item) {
      this.$store.commit("account/changeAccSettingTab", item.value);
      if(item.value === 'car') {
        this.fetchCars()
      }else if(item.value === 'card') {
        this.fetchCards()
      }else {
        this.fetchPersons()
      }
    },
   async deleteCar(row) {
     const rsp = await delAccountObj(row.cardId)
     if(rsp.code === 200) {
       this.$message({
         type: 'success',
         message: '删除成功'
       })
       this.fetchCars()
        this.$emit('fetchAccInfo')
     }
    },
    async deletePerson(row) {
      const rsp = await delAccountObj(row.cardId)
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: '删除成功'
        })
        this.fetchPersons()
        this.$emit('fetchAccInfo')
      }
    },
    handleCarPage(page) {
      this.seaCarConf.pageNo = page
      this.fetchCars()
    },
    handleCarSizeChange(pageSize) {
      this.seaCarConf.pageSize = pageSize;
      this.seaCarConf.pageNo = 1
      this.fetchCards()
    },
    handlePersonPage(page) {
      this.seaPersonConf.pageNo = page
      this.fetchPersons()
    },
    handlePersonSizeChange(pageSize) {
      this.seaPersonConf.pageSize = pageSize;
      this.seaPersonConf.pageNo = 1
      this.fetchPersons()
    },
    handleCardPage(page) {
      this.seaCardConf.pageNo = page
      this.fetchCards()
    },
     handleCardSizeChange(pageSize) {
      this.seaCardConf.pageSize = pageSize;
      this.seaCardConf.pageNo = 1
      this.fetchCards()
    },
    changeAddCar(val) {
      this.addCarList = val
    },
    async submitAddCar() {
       if(this.addCarList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择车辆'
        })
        return
      }
      this.showAddCarLoading = true
      const data = {
        carIds: this.addCarList,
        accId: this.accId
      }
      const rsp = await addCars(data)
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: '车辆添加成功'
        })
        this.addCarList = []
        this.showAddCar = false
        this.fetchCars()
        this.$emit('fetchAccInfo')
      }
      this.showAddCarLoading = false
    },
    closeAddCar() {
      this.addCarList = []
      this.showAddCar = false
    },
    changeAddPerson(val) {
      this.addPersonList = val
    },
    // 添加司机账号
   async submitAddPerson() {
       if(this.addPersonList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择人员'
        })
        return
      }
       const data = {
        workersIds: this.addPersonList,
        accId: this.accId
      }
      this.showAddPersonLoading = true
      const rsp = await addPersons(data)
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: '人员添加成功'
        })
        this.addPersonList = []
        this.showAddPerson = false
        this.fetchPersons()
        this.$emit('fetchAccInfo')
      }
      this.showAddPersonLoading = false
    },
    closeAddPerson() {
      this.addPersonList = []
      this.showAddPerson = false
    },
    changeAddCard(val) {
      this.addCardList = val
    },
     async fetchWaitCardList() {
      const rsp = await getCardList();
      if(rsp.code === 200) {
        this.waitCardList = rsp.data
      }
    },
    async matchAddCard() {
      // if (!this.startCardNum || !this.endCardNum) {
      //   this.$message({
      //     type: "warning",
      //     message: "请输入卡段号",
      //   });
      // } 
      if(this.checkCardList.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择卡号",
        });
      }
      else if (this.addCardList.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择车牌号",
        });
      } else {
        // const data = {
        //   start: this.startCardNum,
        //   end: this.endCardNum,
        //   orgId: this.orgId,
        //   carIds: this.addCardList.join(","),
        // };
         const data = {
          orgId: this.orgId,
          carIds: this.addCardList.join(","),
          cardCodes: this.checkCardList.join(","),
        };
        this.showAddCardLoading = true;
        const rsp = await checkCards(data);
        if (rsp.code === 200) {
           if(rsp.data.result) {
             this.matchCardList = Object.keys(rsp.data.result) 
             this.matchCarList = Object.values(rsp.data.result) 
             this.matchObj = rsp.data.result
             this.carObj = carArrToObj(this.noOpenCarListOfCard)
           }
           this.showCardSetting = false
        }
        this.showAddCardLoading = false
      }
    },
    // 实体卡匹配提交
    async submitAddCard() {
        if(this.matchCardList.length > 0) {
          const data = {
            accountId: this.accId,
            cardRelCar: this.matchObj
          }
          const rsp = await addCards(data)
          if(rsp.code === 200) {
            this.$message({
              type: 'success',
              message: '实体卡添加成功'
            })
            this.closeAddCard()
            this.fetchCards()
            this.$emit("fetchAccInfo");
          }
        }
    },
    closeAddCard() {
      this.addCardList = [];
      this.matchCardList = []
      this.matchCarList = []
      this.waitCardList = []
      this.checkCardList = []
      this.startCardNum = undefined
      this.endCardNum = undefined
      this.showCardSetting = true
      this.showAddCard = false;
    },
    formatSubName(pVal, sVal) {
        if(Number(pVal) >= 0 && Number(sVal) >= 0 && this.dictInfo.usesubcHead.length > 0 && this.dictInfo.usebroaHead.length > 0) {
            const parr = this.dictInfo.usebroaHead.filter(item => item.value == pVal)
            let arr = []
           if(parr.length > 0) {
             arr = this.dictInfo.usesubcHead.filter(item => item.parentValue == parr[0].id)   
           }
            if(arr.length > 0) {
              const obj = arrToObj(arr)
              return obj[sVal]   
            }else {
                return null
            }
        }else {
            return null
        }
    }
  }
}
</script>
<style lang="scss">
.el-popconfirm__action button {
  margin-top: 10px;
  padding: 5px 8px;
}
.settingAddBox .el-input__inner {
    width: 300px !important;
}
.cardDuan  .el-input__inner {
    width: 130px !important;
  }  
</style>
<style lang="scss" scoped>
@import '@/assets/styles/global.scss';
.shareBox {
  position: relative;
  margin-top: 30px;
    .add {
    position: absolute;
    right: 10px;
    top: -40px;
  }
  .tabs {
    display: flex;
    .tabList {
      display: flex;
      align-items: center;
      margin: -40px 0 10px 10px;
      .item {
        padding: 10px 30px;
        font-size: 14px;
        color: #666666;
        cursor: pointer;
        border-bottom: 1px solid $tableBorderColor;
      }
      .activeItem {
        padding: 10px 30px;
        font-size: 14px;
        cursor: pointer;
        color: $btnMainColor;
        border-bottom: 2px solid $btnMainColor;
      }
    }
    .line {
      height: 0.5px;
      flex: 1;
      margin-right: 10px;
      background-color: $tableBorderColor;
      margin-top: 0.5px;
    }
  }
  .tables {
    .pagination {
      margin: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
  }
  .settingAddBox {
    display: flex;
    flex-direction: column;
    align-items: center;
    .addItem {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .label {
        color: #666;
        margin-right: 10px;
        // &::before {
        //   content: '*';
        //   color: red;
        // }
      }
      .value {
          flex: 1;
          .cardDuan {
            display: flex;
            align-items: center;
            .gap {
                margin: 0 15px;
            }
          }
      }
    }
  }
   table {
      border-collapse: collapse;
      width: 60%;
      margin: 10px 0 20px 20%;
    }

    th,
    td {
      text-align: center;
      padding: 8px;
      color: #666;
      border: 1px solid #cfcfcf;
    }

    th {
      background-color: #f2f2f2;
      color: #666;
    }
}
</style>
