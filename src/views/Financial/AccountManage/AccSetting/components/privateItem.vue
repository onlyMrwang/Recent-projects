<template>
  <div class="privateBox">
    <div class="add">
      <el-button type="primary" icon="el-icon-plus" @click="addChargObj"
        >新增</el-button
      >
    </div>
     <el-table :data="personList" style="width: 100%" border
      :header-cell-style="tableHeaderStyle"
      >
          <el-table-column
            prop="carNumber"
            label="车牌号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="user"
            label="用户"
            align="center"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
             <!-- {{scope.row.userName}}({{scope.row.workName}}) -->
             {{scope.row.workName}}
            </template>
          </el-table-column>
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
        <div class="pagination" v-if="personList.length > 0">
          <el-pagination
            background
            @size-change="handleCardSizeChange"
            @current-change="handlePersonPage"
            :current-page="searchConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
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
          <div class="label">人&nbsp;员&nbsp;&nbsp;&nbsp;</div>
          <div class="value">
            <el-select
              filterable
              v-model="addPersonList"
              multiple
              placeholder="请选择人员"
              @change="changeAddPerson"
            >
              <el-option
                v-for="item in waitPersonList"
                :key="item.workersId"
                :label="`${item.workName} (${item.orgName})`"
                :value="item.workersId"
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
            <th>人员</th>
          </tr>
          <tr v-for="(item, index) in matchCardList" :key="index">
            <td>{{ item }}</td>
            <td>{{ carObj[`${matchPersonList[index]}`] }}</td>
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
import { getAccountPrivate, checkCards, getStaffsAll, addPrivate, getCardList } from '@/api/financial/account'
import { mapGetters } from 'vuex'
import { personArrToObj } from '@/utils/utils'
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
    searchInfo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
    data() {
        return {
          searchConf: {
            pageNo: 1,
            pageSize: 10,
            states: 1,
            isPage: 'yes'
          },
          total: 0,
          showAddCardLoading: false,
          personList: [],
          showAddCard: false,
          startCardNum: undefined,
          endCardNum: undefined,
          addPersonList: [],
          carList: [],
          waitPersonList: [],
          showCardSetting: true, // 是否展示卡配置
          matchCardList: [], // 实体卡配置匹配成功卡号列表
          matchPersonList: [], // 实体卡配置匹配成功车辆列表
          carObj: null, // 车辆车牌号-id
          matchObj: null, // 匹配结果key-value
          checkCardList: [], // 实体卡匹配 - 选择卡列表
          waitCardList: [], // 实体卡匹配 - 卡列表待选
        }
    },
    computed: {
      ...mapGetters(['deptList'])
    },
    created() {
      if(this.accId) {
        this.fetchPrivateInfo()
      }
    },
    methods: {
      async fetchPrivateInfo() {
        this.searchConf.accId = this.accId
        this.searchConf = Object.assign(this.searchConf, this.searchInfo)
        const rsp = await getAccountPrivate(this.searchConf)
        if(rsp.code === 200) {
           this.personList = rsp.data.list
           this.total = rsp.data.total
        }
      },
      handlePersonPage(page) {
        this.searchConf.pageNo = page
        this.fetchPrivateInfo()
      },
      handleCardSizeChange(pageSize) {
        this.searchConf.pageSize = pageSize
        this.searchConf.pageNo = 1
        this.fetchPrivateInfo()
      },
      addChargObj() {
        this.fetchStaffs();
        this.fetchWaitCardList()
        this.showAddCard = true
      },
     async fetchStaffs() {
      const data = {
        pageNo: 1,
        pageSize: 1000
      }
      const rsp = await getStaffsAll(data)
      if(rsp.code === 200) {
        this.waitPersonList = rsp.data
      }
    },
     async fetchWaitCardList() {
      const rsp = await getCardList();
      if(rsp.code === 200) {
        this.waitCardList = rsp.data
      }
    },
    changeAddPerson(val) {
      this.addPersonList = val
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
      }else if (this.addPersonList.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择人员",
        });
      } else {
        // const data = {
        //   start: this.startCardNum,
        //   end: this.endCardNum,
        //   orgId: this.orgId,
        //   carIds: this.addPersonList.join(","),
        // };
        const data = {
          orgId: this.orgId,
          carIds: this.addPersonList.join(","),
          cardCodes: this.checkCardList.join(","),
        };
        this.showAddCardLoading = true
        const rsp = await checkCards(data);
        if (rsp.code === 200) {
           if(rsp.data.result) {
             this.matchCardList = Object.keys(rsp.data.result) 
             this.matchPersonList = Object.values(rsp.data.result) 
             this.matchObj = rsp.data.result
             this.carObj = personArrToObj(this.waitPersonList)
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
            cardRelPerson: this.matchObj
          }
          const rsp = await addPrivate(data)
          if(rsp.code === 200) {
            this.$message({
              type: 'success',
              message: '实体卡配置成功'
            })
            this.showAddCard = false
            this.closeAddCard()
            this.fetchPrivateInfo()
            this.$emit("fetchAccInfo");
          }
        }
    },
    closeAddCard() {
      this.addPersonList = [];
      this.matchCardList = []
      this.matchPersonList = []
      this.checkCardList = []
      this.waitCardList = []
      this.startCardNum = undefined
      this.endCardNum = undefined
      this.showCardSetting = true
      this.showAddCard = false;
    },
    }
}
</script>
<style lang="scss">
.settingAddBox .el-input__inner {
    width: 300px !important;
}
.cardDuan  .el-input__inner {
    width: 130px !important;
  }  
</style>
<style lang="scss" scoped>
.privateBox {
    position: relative;
    padding: 0 15px;
    .add {
     position: absolute;
     right: 15px;
     top: -40px;
  }
    .pagination {
      margin: 10px 0;
      display: flex;
      justify-content: flex-end;
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