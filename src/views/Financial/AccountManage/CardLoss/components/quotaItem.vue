<template>
  <div>
     <el-table :data="cardList" style="width: 100%" border
      :header-cell-style="tableHeaderStyle">
            <el-table-column
              prop="cardCode"
              label="卡号"
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
              prop="cardMoney"
              label="当前金额(元)"
              align="center"
              show-overflow-tooltip
            >
             <template slot-scope="scope">
              {{scope.row.cardMoney ? scope.row.cardMoney.toFixed(6) : 0}}
          </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" align="center">
              <template slot-scope="scope">
                {{ dictInfo.cardStatusObj[scope.row.status] }}
              </template>
            </el-table-column>
            <el-table-column prop="x" label="操作" align="center">
              <template slot-scope="scope">
               <el-popconfirm
                :title="scope.row.status === 2 ? `确定要解挂该实体卡？`: '确定要挂失该实体卡？'"
                @confirm="toOption(scope.row)"
               >
                <el-link type="primary" slot="reference">{{scope.row.status === 1 ? '挂失' : '解挂'}}</el-link>
              </el-popconfirm>
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination" v-if="cardList.length > 0">
             <el-pagination
                background
                @size-change="handleCardSizeChange"
                @current-change="handleCardPage"
                :current-page="searchConf.pageNo"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="searchConf.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="cardTotal">
              </el-pagination>
          </div>
  </div>
</template>

<script>
import { getAccCardList, updateCardState } from '@/api/financial/account'
import { mapGetters } from 'vuex'
export default {
   props: {
    accId: {
      type: String,
      default: null,
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
      cardList: [],
      searchConf: {
        pageNo: 1,
        pageSize: 10,
        isPage: 'yes'
      },
      cardTotal: 0,
    }
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  created() {
    if(this.accId) {
      this.fetchCards()
    }
  },
  methods: {
     async fetchCards() {
      this.searchConf.accId = this.accId;
      this.searchConf.states = '1,2';
      this.searchConf = Object.assign(this.searchConf, this.searchInfo)
      const rsp = await getAccCardList(this.searchConf);
      if (rsp.code === 200) {
        this.cardList = rsp.data.list;
        this.cardTotal = rsp.data.total;
      }
    },
    handleCardPage(page) {
      this.searchConf.pageNo = page
      this.fetchCards()
    },
    handleCardSizeChange(pageSize) {
      this.searchConf.pageSize = pageSize;
      this.searchConf.pageNo = 1
      this.fetchCards()
    },
    async toOption(row) {
      const data = [{
        cardId: row.cardCode,
        status: row.status === 2 ? 1 : 2
      }]
      const msg = row.status === 1 ? '挂失成功' : '解挂成功'
      const rsp = await updateCardState(data)
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: msg
        })
        this.fetchCards()
      }
    }
  }
}
</script>