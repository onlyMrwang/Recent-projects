<template>
  <div class="cancelBox">
        <el-table
            :header-cell-style="tableHeaderStyle"
            :data="tableData"
            style="width: 100%"
            max-height="530"
            border
          >
           <el-table-column
              prop="billCode"
              label="充值流水号"
              align="center"
              width="260"
              fixed="left"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="a"
              label="充电机构"
              align="center"
              width="200"
              show-overflow-tooltip
            >
            <template>
              {{accountInfo.orgName}}
            </template>
            </el-table-column>
            <!-- <el-table-column
              prop="cardId"
              label="卡号/账号"
              align="center"
              width="180"
              show-overflow-tooltip
            >
            </el-table-column>  -->
             <!-- <el-table-column
              prop="carNumber"
              label="车牌号"
              align="center"
            >
            </el-table-column>  -->
            <el-table-column
              prop="arriveBefore"
              label="充值前金额(元)"
              align="center"
              width="150"
            >
            <template slot-scope="scope">
                {{scope.row.arriveBefore ? scope.row.arriveBefore.toFixed(6) : 0}}
            </template>
            </el-table-column> 
            <el-table-column
              prop="arriveMoney"
              label="充值金额(元)"
              align="center"
              width="180"
            >
             <template slot-scope="scope">
                {{Number(scope.row.arriveMoney) > 0 ? scope.row.arriveMoney.toFixed(6) : 0}}
            </template>
            </el-table-column>
              <el-table-column
              prop="currentMoney"
              label="余额(元)"
              align="center"
              width="160"
            >
            <template slot-scope="scope">
                {{scope.row.currentMoney ? scope.row.currentMoney.toFixed(6) : 0}}
            </template>
            </el-table-column> 
            <el-table-column
              prop="payMethod"
              label="付款方式"
              align="center"
              width="90"
            >
             <template slot-scope="scope">
                 {{Number(scope.row.payMethod) >= 0 ? payMethodObj[scope.row.payMethod] : null}}
             </template>
            </el-table-column>
             <el-table-column
              prop="opeUser"
              label="操作人"
              align="center"
              width="120"
              show-overflow-tooltip
            >
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="充值时间"
              align="center"
              width="160"
            >
            </el-table-column>
             <el-table-column
              prop="billStatus"
              label="状态"
              align="center"
              width="120"
              show-overflow-tooltip 
            >
            <template slot-scope="scope">
              {{scope.row.billStatus === 0 ? '已充值' : '已撤销'}}
            </template>
            </el-table-column>
        </el-table>
          <div class="pagination" v-if="tableData.length > 0">
           <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handlePage"
            :current-page="searchConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>

  </div>
</template>

<script>
import { getRechargeList } from '@/api/financial/account'
export default {
    props: {
        accountInfo: {
            type: Object,
            default: function() {
                return null
            }
        },
        searchInfo: {
           type: Object,
            default: function() {
                return null
            }
        }
    },
    data() {
        return {
            tableData: [],
            payMethodObj: {
                0: '虚拟'
            },
            total: 0,
            searchConf: {
                pageNo: 1,
                pageSize: 10,
            }
        }
    },
    created() {
        if(this.accountInfo) {
            this.fetchRechargeList()
        }
    },
    methods: {
        async fetchRechargeList() {
            this.searchConf.orgId = this.accountInfo.orgId
            this.searchConf.accType = this.accountInfo.accType
            // this.searchConf = Object.assign(this.searchInfo, this.searchConf)
            const rsp = await getRechargeList(this.searchConf)
            if(rsp.code === 200) {
                this.tableData = rsp.data.list
                this.total = rsp.data.total
            }
        },
        handlePage(page) {
            this.searchConf.pageNo = page
            this.fetchRechargeList()
        },
         handleSizeChange(pageSize) {
          this.searchConf.pageNo = 1
          this.searchConf.pageSize = pageSize
          this.fetchRechargeList()
        }
    }
}
</script>
<style lang="scss" scoped>
.cancelBox {
    padding: 0 10px;
     .pagination {
        margin: 10px 0;
        display: flex;
        justify-content: flex-end;
      }
}
</style>