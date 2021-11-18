<template>
  <div class="orgSettingBox">
    <el-row :gutter="10">
      <el-col :span="5">
        <div class="leftBox">
          <div class="search" style="margin: 0 20px">
            <el-input
              placeholder="请输入内容"
              suffix-icon="el-icon-search"
              v-model="filterText"
              clearable
            >
            </el-input>
          </div>
          <div class="line"></div>
          <div class="treeBox">
            <div class="myTree">
              <el-tree
                ref="tree"
                highlight-current
                :data="orgList"
                default-expand-all
                :expand-on-click-node="false"
                :filter-node-method="filterNode"
                :props="defaultProps"
                @node-click="handleNodeClick"
              >
                <div
                  class="custom-tree-node"
                  style="display: flex;"
                  slot-scope="{ node, data }"
                >
                  <i
                    v-if="data.siteState == '0'"
                    class="iconfont icon-dian"
                    style="color: red;margin-left: -13px;padding-top: 2px;"
                  />
                  <span
                    class="nodeLabel"
                    :title="`${node.label}`"
                  >
                    {{ node.label }}
                  </span>
                </div>
              </el-tree>
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="19">
        <div class="rightBox">
          <div class="top">
            <div class="title">
              <!-- <div class="sign"></div> -->
              <div class="name">机构网点资费配置 - {{ groupName }}</div>
            </div>
            <div class="options">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="toSettingGroup"
                >配置</el-button
              >
              <!-- <el-button
            type="primary"
            plain
            icon="el-icon-edit"
            @click="mulitEditNet"
            >修改</el-button
          > -->
              <el-button
                type="danger"
                plain
                icon="el-icon-delete"
                @click="mulitDelNet"
                >删除</el-button
              >
            </div>
          </div>
          <div class="tableBox">
            <el-table
              :data="netList"
              style="width: 100%"
              :header-cell-style="tableHeaderStyle"
              border
              @selection-change="handleSelectionChange"
            >
              <el-table-column
                v-if="selection"
                type="selection"
              ></el-table-column>
              <el-table-column
                align="center"
                v-for="(item, index, key) in table_columns"
                :item="item"
                :key="key"
                :index="index"
                :label="item.label"
              >
                <template slot-scope="scope">
                  <el-input-number
                    v-if="scope.row.edit && item.label !== '网点'"
                    :controls="false"
                    :min="0"
                    :precision="6"
                    v-model="scope.row[item.prop]"
                    :placeholder="'请输入' + item.label"
                  />
                  <span
                    v-if="
                      !scope.row.edit ||
                        (scope.row.edit && item.label === '网点')
                    "
                    >{{
                      item.label !== "网点" && Number(scope.row[item.prop]) > 0
                        ? scope.row[item.prop].toFixed(6)
                        : scope.row[item.prop]
                    }}</span
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                  <!-- 全局控制的修改 -->
                  <div
                    v-if="is_edit && scope.row.add == undefined"
                    style="display: inline-block;"
                  >
                    <!-- 修改 -->
                    <el-link
                      v-if="!scope.row.edit"
                      @click="handleEdit(scope.$index, scope.row)"
                      type="primary"
                      :underline="false"
                      style="margin-right: 10px;"
                      >修改</el-link
                    >
                    <!-- 保存 -->
                    <el-link
                      type="primary"
                      v-if="scope.row.edit"
                      style="margin-right: 10px;"
                      :underline="false"
                      @click="handleSave(scope.$index, scope.row)"
                      >保存</el-link
                    >
                    <!-- 取消 -->
                    <el-link
                      type="primary"
                      v-if="scope.row.edit"
                      :underline="false"
                      style="margin-right: 10px;"
                      @click="handleCancel(scope.$index, scope.row)"
                      >取消</el-link
                    >
                  </div>

                  <el-popconfirm
                    v-if="!scope.row.edit"
                    title="确定删除该网点配置?"
                    @confirm="handleDelete(scope.$index, scope.row)"
                  >
                    <el-link type="danger" :underline="false" slot="reference"
                      >删除</el-link
                    >
                  </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <div class="pagination" v-if="netList.length > 0">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="searchConf.pageNo"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="searchConf.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
              >
              </el-pagination>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 批量修改电费系数，服务费系数 -->
    <div v-if="showmulitEdit">
      <el-dialog
        v-dialogDrag
        title="批量修改电费系数，服务费系数"
        :visible.sync="isShow"
        width="30%"
        :destroy-on-close="true"
        :close-on-click-modal="false"
        :before-close="closeMutilEdit"
      >
        <div class="addBox">
          <div class="addItem">
            <div class="label">电费系数</div>
            <div class="value">
              <el-input-number
                v-model="mulitEditInfo.cElectricityFee"
                :precision="3"
                :controls="false"
                :min="0"
                placeholder="请填写电费系数"
              />
            </div>
          </div>
          <div class="addItem">
            <div class="label">服务费系数</div>
            <div class="value">
              <el-input-number
                v-model="mulitEditInfo.cServiceFee"
                :precision="3"
                :controls="false"
                :min="0"
                placeholder="请填写服务费系数"
              />
            </div>
          </div>
          <span slot="footer" style="margin: 20px 0;">
            <el-button type="primary" @click="submitMulitEdit">确 定</el-button>
          </span>
        </div>
      </el-dialog>
    </div>

    <Setting
      v-if="showSetting"
      :groupId="groupId"
      :groupName="groupName"
      @closeSetting="closeSetting"
    />
  </div>
</template>

<script>
import { getArrayProps } from "@/utils/utils";
import Setting from "./setting.vue";
import { mapGetters } from "vuex";
import {
  getNetworkList,
  batchUpdateFeeRate,
  delOrgSiteFee,
  getSettingOrgTree,
} from "@/api/financial/tariffSetting";
export default {
  components: { Setting },
  data() {
    return {
      showSetting: false,
      showmulitEdit: false,
      isShow: true,
      mulitEditInfo: {
        // 批量修改
        ids: null,
        cElectricityFee: undefined,
        cServiceFee: undefined,
      },
      addInfo: {
        resSiteId: null,
        cElectricityFee: undefined,
        cServiceFee: undefined,
      },
      filterText: "",
      groupId: null,
      groupName: "",
      defaultProps: {
        children: "children",
        id: "id",
        label: "nameCN",
      },
      new_data_json: {}, //数据结构
      multipleSelection: [], //复选框，数据
      is_edit: true, //是否可修改
      selection: true, //是否需要复选框
      //表头信息
      table_columns: [
        {
          prop: "resSiteName",
          label: "网点",
        },
        {
          prop: "cElectricityFee",
          label: "电费系数",
        },
        {
          prop: "cServiceFee",
          label: "服务费系数",
        },
      ],
      searchConf: {
        pageNo: 1,
        pageSize: 10,
        orgId: null,
      },
      //表格数据
      originTableData: [],
      netList: [],
      orgList: [], // 机构列表
      total: 0,
    };
  },
  computed: {
    ...mapGetters(["deptList"]),
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
  },
  created() {
    this.groupId = this.deptList.length > 0 ? this.deptList[0].id : null;
    this.groupName = this.deptList.length > 0 ? this.deptList[0].nameCN : null;
    this.fetchOrgList();
    if (this.groupId) {
      this.fetchNetList();
    }
  },
  methods: {
    async fetchOrgList() {
      const rsp = await getSettingOrgTree();
      if (rsp.code === 200) {
        this.orgList = [rsp.data];
      }
    },
    async fetchNetList() {
      this.originTableData = [];
      this.netList = [];
      this.searchConf.orgId = this.groupId;
      let rsp = await getNetworkList(this.searchConf);
      if (rsp.code === 200) {
        this.originTableData = rsp.data.list;
        this.total = rsp.data.total;
        this.initEditAttribute();
      }
    },
    handleNodeClick(value) {
      if(value.id !== this.groupId) {
         this.groupId = value.id;
         this.groupName = value.nameCN;
         this.searchConf.pageNo = 1
         this.fetchNetList();
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.nameCN.indexOf(value) !== -1;
    },
    toSettingGroup() {
      this.showSetting = true;
    },
    closeSetting(val) {
      if(val === 1) {
        this.fetchOrgList();
        this.fetchNetList();
      }
      this.showSetting = false;
    },
    // 批量编辑
    mulitEditNet() {
      this.netList.map((item) => (item.edit = true));
      // if (this.multipleSelection.length === 0) {
      //   this.$message({
      //     type: "warning",
      //     message: "请选择要修改系数的网点",
      //   });
      // }else {
      //   this.mulitEditInfo.ids = getArrayProps(this.multipleSelection, 'cId')
      //   this.showmulitEdit = true
      // }
    },
    closeMutilEdit() {
      this.showmulitEdit = false;
      this.mulitEditInfo = {
        ids: null,
        cElectricityFee: undefined,
        cServiceFee: undefined,
      };
    },
    submitMulitEdit() {
      if (
        !this.mulitEditInfo.cElectricityFee &&
        this.mulitEditInfo.cElectricityFee !== 0
      ) {
        this.$message({
          type: "warning",
          message: "请填写电费系数",
        });
      } else if (
        !this.mulitEditInfo.cServiceFee &&
        this.mulitEditInfo.cElectricityFee !== 0
      ) {
        this.$message({
          type: "warning",
          message: "请填写服务费系数",
        });
      } else {
        this.showmulitEdit = false;
      }
    },
    // 批量删除
    mulitDelNet() {
      if (this.multipleSelection.length === 0) {
        this.$message({
          type: "warning",
          message: "请选择要删除的网点",
        });
      } else {
        this.$confirm("是否确认删除选择网点资费配置?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.toDelSiteSetting();
        });
      }
    },
    async toDelSiteSetting() {
      const arr = getArrayProps(this.multipleSelection, "cId");
      const rsp = await delOrgSiteFee(arr.join(","));
      if (rsp.code === 200) {
        this.$message({
          type: "success",
          message: "删除成功",
        });
        this.fetchNetList();
      }
    },
    //多选框
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //修改
    handleEdit(index, row) {
      row.edit = true;
    },
    //删除
    handleDelete(index, row) {
      this.toDeleteOne(index, row);
    },
    handleCurrentChange(page) {
      this.searchConf.pageNo = page;
      this.fetchNetList();
    },
    handleSizeChange(pageSize) {
      this.searchConf.pageNo = 1;
      this.searchConf.pageSize = pageSize;
      this.fetchNetList();
    },
    async toDeleteOne(index, row) {
      const rsp = await delOrgSiteFee(row.cId);
      if (rsp.code === 200) {
        this.$message({
          message: "删除成功",
          type: "success",
        });
        this.netList.splice(index, 1);
      }
    },
    //保存
    async handleSave(index, row) {
      if (!row.cElectricityFee && row.cElectricityFee !== 0) {
        this.$message({
          type: "warning",
          message: "请填写电费系数",
        });
      } else if (!row.cServiceFee && row.cServiceFee !== 0) {
        this.$message({
          type: "warning",
          message: "请填写服务费系数",
        });
      } else {
        const data = [
          {
            cServiceFee: row.cServiceFee,
            cElectricityFee: row.cElectricityFee,
            cId: row.cId,
          },
        ];
        const rsp = await batchUpdateFeeRate(data);
        if (rsp.code === 200) {
          this.$message({
            message: "保存成功",
            type: "success",
          });
          // this.fetchNetList()
        }
        row.edit = false;
      }
    },
    // 取消
    handleCancel(index, row) {
      row.edit = false;
    },
    initEditAttribute() {
      let dataArray = JSON.parse(JSON.stringify(this.originTableData));
      if (dataArray.length > 0) {
        //添加编辑事件
        for (let index in dataArray) {
          dataArray[index]["edit"] = false;
          this.netList.push(dataArray[index]);
        }
      }
    },
  },
};
</script>
<style lang="scss">
@import "@/assets/styles/global.scss";
.leftBox .el-input__inner {
  border: 1px solid #bee1f1;
  border-radius: 30px;
}
.leftBox .el-input__inner:hover {
  border-radius: 30px;
}
 .search .el-input__prefix,
.search .el-input__suffix {
  color: #bee1f1;
  text-align: center;
  margin-top: -3px;
}
.el-tree-node__label {
  font-size: 13px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

 .el-input-number.is-without-controls .el-input__inner {
    padding-left: 15px;
    padding-right: 15px;
    text-align: left;
}

.nodeLabel {
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
}
</style>
<style lang="scss" scoped>
.orgSettingBox {
  @import "@/assets/styles/global.scss";
  // display: flex;
  .leftBox {
    color: #bee1f1;
    padding-top: 20px;
    text-align: center;
    // width: 245px;
    margin-right: 10px;
    background-color: #fff;
    border-radius: 4px;
    .line {
      width: 232px;
      height: 1px;
      background-color: #f3f4f8;
      margin: 14px 0 20px 7px;
    }
    .treeBox {
      padding: 0 15px 10px 0;
      height: calc(100vh - #{$headerHeight + 130px});
      overflow: auto;
      &::-webkit-scrollbar {
        width: 7px;
        height: 7px;
        background-color: transparent;
      }
      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        background-color: #cee4e8;
      }
    }
  }

  .rightBox {
    // flex: 1;
    background-color: #fff;
    border-radius: 4px;
    min-height: calc(100vh - #{$headerHeight + 30px});
    .top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 31px 0 0 20px;
      .title {
        display: flex;
        align-items: center;
        margin-bottom: 8px;
        .sign {
          width: 7px;
          height: 20px;
          background: $btnMainColor;
          margin-right: 8px;
        }
        .name {
          font-size: $fontSize16;
          color: $mainTitleColor;
          font-weight: 400;
        }
      }
      .options {
        margin: -10px 20px 0 0;
      }
    }
    .tableBox {
      padding: 10px;
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
        width: 90px;
      }
      .value {
        flex: 1;
      }
    }
  }
}
</style>
