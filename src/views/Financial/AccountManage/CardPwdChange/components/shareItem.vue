<template>
  <div style="padding: 10px">
    <div class="btn" style="margin-bottom: 10px">
      <el-button type="primary" @click="mulitResetPwd">批量重置</el-button>
    </div>
    <el-table :data="cardList" ref="cardTable" style="width: 100%"
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
          <el-link type="primary" @click="resetPwd(scope.row)">重置</el-link>
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
import { getAccCardList, updateCardPassword } from "@/api/financial/account";
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
        isPage: "yes",
      },
      cardTotal: 0,
      mulitList: [], // 多选列表
      oriStatus: null,
      oriCardCode: undefined, // 源卡号
      tagCardCode: undefined, // 目标卡号
    }
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
      this.searchConf.states = '1'
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
    mulitResetPwd() {
      if(this.mulitList.length === 0) {
        this.$message({
          type: 'warning',
          message: '请勾选要重置密码的实体卡'
        })
      }else {
         this.$confirm('此操作将重置实体卡密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
          const data = []
        this.mulitList.forEach(item => {
          data.push({
            cardId: item.cardId,
            password: '123456'
          })
        })
        const rsp = await updateCardPassword(data)
        if(rsp.code === 200) {
         this.$confirm('所勾选实体卡密码修改成功，新密码为123456，请知悉！', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'success',
          center: true
        })
        }
        this.$refs.cardTable.clearSelection();
        }).catch(() => {
         
        });
      }
    },
    resetPwd(row) {
       this.$confirm('此操作将重置实体卡密码, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(async () => {
         const data = [
            {
              cardId: row.cardId,
              password: '123456'
            }
          ]
        const rsp = await updateCardPassword(data)
        if(rsp.code === 200) {
          this.$confirm('实体卡密码修改成功，新密码为123456，请知悉！', '提示', {
              confirmButtonText: '确定',
              showCancelButton: false,
              type: 'success',
              center: true
            })
          } 
        }).catch(() => {});
     
    }
   }
}
</script>
