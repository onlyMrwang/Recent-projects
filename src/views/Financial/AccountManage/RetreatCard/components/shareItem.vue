<template>
  <div style="padding: 10px">
    <div class="btn" style="margin-bottom: 10px">
      <el-button type="primary" @click="toRetreat">批量退卡</el-button>
    </div>
    <el-table :data="cardList" style="width: 100%"
     :header-cell-style="tableHeaderStyle" border
    @selection-change="handleSelectionChange">
    <el-table-column
      type="selection"
      width="55">
    </el-table-column>
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
    <el-table-column prop="status" label="状态" align="center">
        <template slot-scope="scope">
          {{ dictInfo.cardStatusObj[scope.row.status] }}
        </template>
      </el-table-column>
      <el-table-column prop="x" label="操作" align="center">
        <template slot-scope="scope">
        <el-popconfirm
          title="确定要退卡？"
          :disabled="scope.row.status === 4"
          @confirm="retreatCard(scope.row)"
          >
          <el-link type="primary" :disabled="scope.row.status === 4" :underline="false" slot="reference">退卡</el-link>
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
import { getAccCardList, retreatCard } from "@/api/financial/account";
import { mapGetters } from 'vuex';
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
        isPage: "yes",
      },
      cardTotal: 0,
      mulitList: [], // 多选列表
      oriStatus: null,
      oriCardCode: undefined, // 源卡号
      tagCardCode: undefined, // 目标卡号
    };
  },
  computed: {
    ...mapGetters(['dictInfo'])
  },
  created() {
    if (this.accId) {
      this.fetchCards();
    }
  },
  methods: {
    async fetchCards() {
      this.searchConf.accId = this.accId;
      this.searchConf.states = '1,2,4'
      this.searchConf = Object.assign(this.searchConf, this.searchInfo)
      const rsp = await getAccCardList(this.searchConf);
      if (rsp.code === 200) {
        this.cardList = rsp.data.list;
        this.cardTotal = rsp.data.total;
      }
    },
    handleSelectionChange(val) {
      this.mulitList = val
    },
    handleCardPage(page) {
      this.searchConf.pageNo = page;
      this.fetchCards();
    },
    handleCardSizeChange(pageSize) {
      this.searchConf.pageSize = pageSize;
      this.searchConf.pageNo = 1
      this.fetchCards()
    },
     toRetreat() {
      if(this.mulitList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要退的实体卡'
        })
      }else {
        const data = []
        this.mulitList.forEach(item => {
          data.push({
            cardId: item.cardCode,
            status: 4
          })
        })
        this.toSubmitRetreat(data)
      }
    },
     retreatCard(row) {
      const data = [{
        cardId: row.cardCode,
        status: 4,
      }]
     this.toSubmitRetreat(data)
    },
    async toSubmitRetreat(data) {
      const rsp = await retreatCard(data)
      if(rsp.code === 200) {
        this.$message({
          type: 'success',
          message: '退卡成功'
        })
        this.fetchCards()
      }
    }
  }
}
</script>