<template>
  <div class="detailBox">
     <div class="back" @click="goBack">
      <img src="@/assets/images/fanhui.png"/>
      <span>返回上一页</span>
    </div>
     <div class="searchBox">
        <div class="inputBox">
          <div class="inputItem">
            <!-- <div class="label"></div> -->
            <div class="value">
             <el-input v-model="searchConf.searchVal" clearable placeholder="请输入关键字查询"/>
            </div>
          </div>
        </div>
        <div class="search">
          <el-button type="primary" @click="toSearch">查询</el-button>
        </div>
      </div>
      <div class="tablePart">
      <div class="tableBox">
        <el-table
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
             :header-cell-style="tableHeaderStyle"
             border
             max-height="500"
          >
            <el-table-column
              prop="type"
              label="机构类型"
              align="center"
            >
              <template slot-scope="scope">
                {{scope.row.type === 1 ? '他有' : '自有'}}
              </template>
            </el-table-column>
             <el-table-column
              prop="orgName"
              label="机构名称"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column>
            <!-- <el-table-column
              prop="sonCapmentNum"
              label="子机构"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column> -->
            <!-- <el-table-column
              prop="department"
              label="部门"
              width="120"
              show-overflow-tooltip
              align="center"
            >
            </el-table-column> -->
            <el-table-column
              prop="provinceCn"
              label="省"
              align="center"
            >
            </el-table-column>
             <el-table-column
              prop="cityCn"
              label="市"
              align="center"
            >
            </el-table-column>
            <el-table-column
              prop="areaCn"
              label="区"
              align="center"
            >
            </el-table-column>
          </el-table>
      </div>
       <div class="pagination" v-if="tableData.length > 0">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="searchConf.pageNo"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="searchConf.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import { getWhiteInfo } from '@/api/financial/white'
export default {
    props: {
        rowRecSiteId: {
            type: String,
            default: null
        }
    },
    data() {
        return {
            searchConf: {
              pageNo: 1,
              pageSize: 10,
              searchVal: null,
            },
            total: 0,
            tableData: []
        }
  },
  created() {
    if(this.rowRecSiteId) {
      this.fetchInfo()
    }
  },
    methods: {
      async fetchInfo() {
        this.searchConf.recSiteId = this.rowRecSiteId
        const rsp = await getWhiteInfo(this.searchConf)
          if(rsp.code === 200) {
            this.tableData = rsp.data.list
            this.total = rsp.data.total
          }
      },
      handleCurrentChange(value) {
        this.searchConf.pageNo = value
        this.fetchInfo()
      },
      handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1
      this.searchConf.pageSize = pageSize
      this.fetchInfo()
    },
      toSearch() {
        this.searchConf.pageNo = 1
        this.fetchInfo()  
      },
      goBack() {
        this.$emit('closeDetail')
      },
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.detailBox {
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
  .searchBox {
    background-color: #fff;
    height: 55px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    padding: 0 35px 0 30px;
    .inputBox {
      display: flex;
      align-items: center;
      .inputItem {
        display: flex;
        align-items: center;
        margin-right: 38px;
        .label {
          color: $mainTitleColor;
          font-size: $fontSize14;
          margin-right: 12px;
        }
      }
    }
  }
  .tablePart { 
    margin-top: 10px;
    background-color: #fff;
    padding: 15px; 
    .pagination {
        margin-top: 10px;
        display: flex;
        justify-content: flex-end;
      }
  }
  
}
</style>