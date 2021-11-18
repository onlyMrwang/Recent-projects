<template>
  <div class="privateBox">
     <div class="searchBox">
        <div class="item">
         <div class="label">卡号</div>
         <div class="value">
           <el-input v-model="searchConf.cardCode" placeholder="请输入卡号"/>
         </div>
       </div>
       <el-button type="primary" @click="toSearch">查询</el-button>
       <el-button @click="reset">重置</el-button>
    </div>
     <el-table :data="personList" style="width: 100%" border
      :header-cell-style="tableHeaderStyle">
          <el-table-column
            prop="carNumber"
            label="车牌号"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="workName"
            label="用户"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="cardCode"
            label="实体卡"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
           <el-table-column
            prop="status"
            label="卡状态"
            align="center"
            show-overflow-tooltip
          >
          <template slot-scope="scope">
              {{scope.row.status ? dictInfo.cardStatusObj[scope.row.status] : null}}
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
          </template></el-table-column>
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
  </div>
</template>

<script>
import { getAccountPrivate } from '@/api/financial/account'
import { mapGetters } from 'vuex'
export default {
  props: {
    accId: {
      type: String,
      default: null 
    }
  },
    data() {
        return {
            personList: [],
            searchConf: {
              pageNo: 1,
              pageSize: 10,
              cardCode: null,
              states: 1,
              isPage: 'yes'
            },
            total: 0,
        }
    },
    computed: {
      ...mapGetters(['dictInfo'])
    },
    created() {
       if(this.accId) {
         this.fetchAccPrivate()
       }
    },
    methods: {
      async fetchAccPrivate() {
        this.searchConf.accId = this.accId
        const rsp = await getAccountPrivate(this.searchConf)
        if(rsp.code === 200) {
          this.personList = rsp.data.list
          this.total = rsp.data.total
        }
      },
        handlePersonPage(page) {
            this.searchConf.pageNo = page
            this.fetchAccPrivate()
        },
        handleCardSizeChange(pageSize) {
          this.searchConf.pageSize = pageSize
          this.searchConf.pageNo = 1
          this.fetchAccPrivate()
        },
        toSearch() {
          this.searchConf.pageNo = 1
          this.fetchAccPrivate()
        },
        reset() {
          this.searchConf.cardCode = null
        }
    }
}
</script>

<style lang="scss" scoped>
.privateBox {
    padding: 0 15px;
    .pagination {
      margin: 10px 0;
      display: flex;
      justify-content: flex-end;
    }
    .searchBox {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .item {
         display: flex;
         align-items: center;
         margin-right: 30px;
        .label {
          margin-right:15px;
          font-size: 14px;
          color: #555;
        }
      }
    }
}
</style>