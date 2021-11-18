<template>
  <div class="privateBox">
     <div style="margin-bottom: 10px">
         <el-button type="primary" @click="mulitRecharge">批量充值</el-button>
        </div>
        <el-table ref="cardTable" :data="cardList" style="width: 100%" 
         :header-cell-style="tableHeaderStyle" border
        @selection-change="handleCard">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            prop="carNumber"
            label="车辆"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="user"
            label="人员"
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
            prop="currentMoney"
            label="当前余额(元)"
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
            <el-link type="primary" slot="reference" @click="toReCharge(scope.row)">充值</el-link>
            </template>
          </el-table-column>
        </el-table>
        <div class="pagination" v-if="cardTotal > 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="cardTotal">
          </el-pagination>
        </div>
       

    <!-- 充值弹窗 -->
    <div v-if="showRecharge">
      <el-dialog
        v-dialogDrag
        :title="dialogTitle"
        :visible.sync="showRecharge"
        width="30%"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :before-close="closeDialog">
          <div class="addBox">
            <div class="addItem">
              <div class="label">充值金额</div>
              <div class="value">
                <el-input-number :controls="false" v-model.trim="reChargeNum" placeholder="请输入金额"/>
              </div>
            </div>
          </div>
          <span slot="footer">
          <el-button type="primary" @click="submitRecharge">确 定</el-button>
          <el-button type="primary" plain @click="closeDialog">取消</el-button>
        </span>
        </el-dialog>
      </div>

     </div>
</template>

<script>
import { getAccountPrivate, reChargeMoney } from '@/api/financial/account'
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
    accInfo: {
      type: Object,
      default: function() {
        return null
      }
    },
     searchPrivateConf: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
    data() {
        return {
          showRecharge: false,
          searchConf: {
            pageNo: 1,
            pageSize: 10,
            isPage: 'yes'
          },
          cardList: [],
          cardTotal: 0,
          mulitCard: [],
          reChargeNum: undefined,
          rowInfo: null,
          dialogTitle: '账户充值'
        }
    },
    created() {
      if(this.accId) {
        this.fetchPrivateInfo()
      }
    },
    methods: {
      async fetchPrivateInfo() {
        this.searchConf.accId = this.accId
        this.searchConf = Object.assign(this.searchConf, this.searchPrivateConf)
        const rsp = await getAccountPrivate(this.searchConf)
        if(rsp.code === 200) {
           this.cardList = rsp.data.list
           this.cardTotal = rsp.data.total
        }
      },
      // 批量充值
      mulitRecharge() {
        if(this.mulitCard.length === 0) {
          this.$message({
            type: 'warning',
            message: '请选择充值对象'
          })
        }else {
          this.dialogTitle = '账户批量充值'
          this.showRecharge = true  
        }
      },
     handleCardCurrentChange(page) {
      this.searchConf.pageNo = page
      this.fetchPrivateInfo()
     },
     handleCardSizeChange(pageSize) {
      this.searchConf.pageNo = 1
      this.searchConf.pageSize = pageSize
      this.fetchPrivateInfo()
     },
      handleCard(val) {
        this.mulitCard = val
      },
      closeDialog() {
        this.dialogTitle = '账户充值'
        this.reChargeNum = undefined
        this.showRecharge = false
      },
        // 单个充值
      toReCharge(row) {
        this.rowInfo = row
        this.showRecharge = true
      },
      async submitRecharge() {
        if(this.reChargeNum === undefined) {
          this.$message({
            type: 'warning',
            message: '请填写充值金额'
          })
        }else if(this.reChargeNum >= 10000000){
         this.$message({
          type: 'warning',
          message: '充值金额不能大于9999999'
        })
      }else if(this.reChargeNum <= -10000000) {
         this.$message({
          type: 'warning',
          message: '充值金额不能小于-9999999'
        })
      }else {
          let data = []
          // 单个充值
          if(this.dialogTitle === '账户充值') {
           data = [{
                 accType: 3,
                 cardId: this.rowInfo.cardId,
                 orgId: this.orgId,
                 objId: this.rowInfo.cardCode,
                 cardType: 3,
                 orgName: this.accInfo.orgName,
                 arriveMoney: this.reChargeNum,
                 arriveBefore: this.rowInfo.cardMoney,
                 usingCardId: this.rowInfo.usingCardId
           }]
          }else {
              this.mulitCard.forEach(item => {
                data.push({
                 accType: 3,
                 cardId: item.cardId,
                 orgId: this.orgId,
                 objId: item.cardCode,
                 cardType: 3,
                 orgName: this.accInfo.orgName,
                 arriveMoney: this.reChargeNum,
                 arriveBefore: item.cardMoney,
                 usingCardId: item.usingCardId
                })
              })  
          }
          const rsp = await reChargeMoney(data)
          if(rsp.code === 200) {
            this.$message({
              type: 'success',
              message: '充值成功'
            })
             this.fetchPrivateInfo()
             this.closeDialog()
          }
        }
      }
    }
}
</script>
<style lang="scss">
.el-input-number.is-without-controls .el-input__inner {
    padding-left: 15px;
    padding-right: 15px;
    text-align: left;
}
</style>
<style lang="scss" scoped>
.privateBox {
    position: relative;
    padding: 0 15px;
    .add {
     position: absolute;
     right: 30px;
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
     .addBox {
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
      }
    }
  }
}
</style>