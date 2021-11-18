<template>
  <div>
    <el-table :data="cardList" style="width: 100%"
     :header-cell-style="tableHeaderStyle" border>
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
          <el-link type="primary" :underline="false" @click="toOption(scope.row)">{{
            scope.row.status === 1 ? "换卡" : "补卡"
          }}</el-link>
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

    <!-- 补换卡弹窗 -->
    <div v-if="showDialog">
      <el-dialog
        v-dialogDrag
        :title="oriStatus === 1 ? '补卡' : '换卡'"
        :visible.sync="showDialog"
        width="40%"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :before-close="closeDialog"
      >
        <div class="replaceCardBox">
          <div class="item">
            <div class="label">新卡号</div>
            <div class="value">
               <el-input v-model.number="tagCardCode" placeholder="请输入新卡号" onkeyup="this.value = this.value.replace(/[^\d.]/g,''); if(this.value.length > 16) this.value = this.value.slice(0, 16)" />
            </div>
          </div>
        </div>
        <span slot="footer">
          <el-button type="primary" @click="submitReplaceCard">确定</el-button>
          <el-button style="margin-left: 10px" @click="closeDialog">取消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { getAccCardList, replaceCard } from "@/api/financial/account";
import { mapGetters } from 'vuex'
export default {
  props: {
    accId: {
      type: String,
      default: null,
    },
     accInfo: {
      type: Object,
      default: function() {
        return null
      }
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
      showDialog: false,
      cardList: [],
      searchConf: {
        pageNo: 1,
        pageSize: 10,
        isPage: "yes",
      },
      cardTotal: 0,
      oriStatus: null,
      oriCardCode: null, // 源卡号
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
      this.searchConf.states = "1,2";
      this.searchConf = Object.assign(this.searchConf, this.searchInfo)
      const rsp = await getAccCardList(this.searchConf);
      if (rsp.code === 200) {
        this.cardList = rsp.data.list;
        this.cardTotal = rsp.data.total;
      }
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
    closeDialog() {
      this.showDialog = false;
      this.tagCardCode = undefined;
      this.oriStatus = null;
    },
    async toOption(row) {
      this.oriCardCode = row.cardCode;
      this.oriStatus = row.status;
      this.showDialog = true
    },
    async submitReplaceCard() {
      if (!this.tagCardCode) {
        this.$message({
          type: "warning",
          message: "请输入卡号",
        });
      } else {
        const data = {
          orgCardCode: this.oriCardCode,
          tagCardCode: `${this.tagCardCode}`,
          orgId: this.accInfo.orgId
        };
        const msg = this.oriStatus === 1 ? "换卡成功" : "补卡成功";
        const rsp = await replaceCard(data);
        if (rsp.code === 200) {
          this.$message({
            type: "success",
            message: msg,
          });
          this.closeDialog()
          this.fetchCards();
        }
      }
    },
  },
};
</script>
<style lang="scss">
.replaceCardBox .el-input__inner {
    width: 300px !important;
    text-align: left;
}
</style>
<style lang="scss" scoped>
  .replaceCardBox {
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      margin-left: 120px;
      .label {
        color: #666;
        margin-right: 10px;
      }
      .value {
        flex: 1;
      }
    }
  }
</style>
