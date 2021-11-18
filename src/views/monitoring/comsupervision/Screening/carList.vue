<template>
  <div
    class="car-list-container"
    :class="showTotalCarList ? 'show-total' : ''"
    :style="{ height: `${heights}px` }"
  >
    <div class="header">
      <div class="title">车辆信息监控列表</div>

      <div class="dialogContent car-list-dialog">
        <el-dialog
          :modal="false"
          title="表格信息设置"
          :visible.sync="dialogVisible"
          width="94%"
          :before-close="handleClose"
        >
          <div class="filter-container">
            <el-input
              placeholder="请输入关键字进行搜索"
              v-model="filterText"
              prefix-icon="el-icon-search"
            >
            </el-input>
            <el-tree
              :data="colOptsShow"
              show-checkbox
              node-key="label"
              :default-checked-keys="colOpts"
              :default-expanded-keys="['车辆信息']"
              :props="defaultProps"
              @check-change="handleCheckChange"
              :filter-node-method="filterNode"
              ref="typeTree"
            >
            </el-tree>
          </div>
        </el-dialog>
      </div>
      <div
        class="tieltImg"
        @click="handleClose"
        :class="dialogVisible ? 'tieltImgBg' : ''"
      >
        <svg
          class="icon"
          width="200px"
          height="198.64px"
          viewBox="0 0 1031 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          v-show="dialogVisible"
          fill="#fff"
        >
          <path
            fill="#fff"
            d="M544.24 870.052a24.08 24.08 0 0 1-24.053-24.054V434.555c0-5.755 2.063-11.32 5.816-15.678l182.513-212.265H213.545l167.578 213.074a24.151 24.151 0 0 1 5.145 14.869v245.637l72.458 72.453a23.849 23.849 0 0 1 6.887 17.024 23.916 23.916 0 0 1-7.173 16.958c-4.532 4.464-10.527 6.922-16.881 6.922s-12.355-2.453-16.88-6.922l-79.463-79.468a23.92 23.92 0 0 1-7.045-17.014V442.88L145.126 197.422a24.08 24.08 0 0 1 4.025-33.777 24.151 24.151 0 0 1 14.868-5.145h596.885a23.884 23.884 0 0 1 17.003 7.05 23.875 23.875 0 0 1 7.04 17.014 24.054 24.054 0 0 1-5.811 15.672L568.284 443.47v402.524a24.074 24.074 0 0 1-24.043 24.059z"
          />
          <path
            d="M660.951 805.99a23.885 23.885 0 0 1-16.998-7.055 23.905 23.905 0 0 1-7.03-17.019 24.084 24.084 0 0 1 24.033-24.033h186.117a24.084 24.084 0 0 1 24.028 24.074 24.084 24.084 0 0 1-24.033 24.033h0.005-186.122z m0-150.553a24.074 24.074 0 0 1-24.028-24.07 24.09 24.09 0 0 1 24.033-24.038h186.117a24.084 24.084 0 0 1 24.028 24.075 24.09 24.09 0 0 1-24.033 24.033h0.005-186.122z m0-148.823c-13.184-0.17-23.839-11.095-23.67-24.356a23.9 23.9 0 0 1 23.747-23.747h186.045c13.261 0 24.049 10.788 24.049 24.054s-10.788 24.054-24.049 24.054H660.951z"
          />
        </svg>
        <svg
          class="icon"
          width="200px"
          height="198.64px"
          viewBox="0 0 1031 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          v-show="!dialogVisible"
          fill="#06A0AF"
        >
          <path
            fill="#06A0AF"
            d="M544.24 870.052a24.08 24.08 0 0 1-24.053-24.054V434.555c0-5.755 2.063-11.32 5.816-15.678l182.513-212.265H213.545l167.578 213.074a24.151 24.151 0 0 1 5.145 14.869v245.637l72.458 72.453a23.849 23.849 0 0 1 6.887 17.024 23.916 23.916 0 0 1-7.173 16.958c-4.532 4.464-10.527 6.922-16.881 6.922s-12.355-2.453-16.88-6.922l-79.463-79.468a23.92 23.92 0 0 1-7.045-17.014V442.88L145.126 197.422a24.08 24.08 0 0 1 4.025-33.777 24.151 24.151 0 0 1 14.868-5.145h596.885a23.884 23.884 0 0 1 17.003 7.05 23.875 23.875 0 0 1 7.04 17.014 24.054 24.054 0 0 1-5.811 15.672L568.284 443.47v402.524a24.074 24.074 0 0 1-24.043 24.059z"
          />
          <path
            d="M660.951 805.99a23.885 23.885 0 0 1-16.998-7.055 23.905 23.905 0 0 1-7.03-17.019 24.084 24.084 0 0 1 24.033-24.033h186.117a24.084 24.084 0 0 1 24.028 24.074 24.084 24.084 0 0 1-24.033 24.033h0.005-186.122z m0-150.553a24.074 24.074 0 0 1-24.028-24.07 24.09 24.09 0 0 1 24.033-24.038h186.117a24.084 24.084 0 0 1 24.028 24.075 24.09 24.09 0 0 1-24.033 24.033h0.005-186.122z m0-148.823c-13.184-0.17-23.839-11.095-23.67-24.356a23.9 23.9 0 0 1 23.747-23.747h186.045c13.261 0 24.049 10.788 24.049 24.054s-10.788 24.054-24.049 24.054H660.951z"
          />
        </svg>
      </div>
    </div>
    <div class="tableContent">
      <el-table
        :data="tableData"
        :header-cell-style="tableHeaderStyle"
        style="width: 100%"
        :max-height="showTotalCarList ? heights - 100 : heights - 70"
        ref="tableDataRef"
        @current-change="handleTableCurrentChange"
        :highlight-current-row="!showTotalCarList"
        border
      >
        <el-table-column type="index" align="center" label="序号">
        </el-table-column>
        <template v-for="item in colData">
          <el-table-column
            :key="item.title"
            align="center"
            label="车头方向"
            v-if="item.title === '车头方向' && item.show"
          >
            <template slot-scope="scope">
              <img
                class="car-dire-img"
                src="@/assets/monitoring/carDirection/fangxiang-p.png"
                alt=""
                v-if="scope.row.stopStatus === 0"
              />
              <img
                class="car-dire-img"
                src="@/assets/monitoring/carDirection/fangxiang90.png"
                alt=""
                :style="{ transform: `rotate(${scope.row.direction}deg)` }"
                v-if="scope.row.carStatus === 1 && scope.row.stopStatus !== 0"
              />
              <img
                class="car-dire-img"
                src="@/assets/monitoring/carDirection/fangxiang90gray.png"
                alt=""
                :style="{ transform: `rotate(${scope.row.direction}deg)` }"
                v-if="scope.row.carStatus === 0 && scope.row.stopStatus !== 0"
              />
            </template>
          </el-table-column>
          <el-table-column
            :key="item.title"
            :min-width="item.width"
            align="center"
            show-overflow-tooltip
            label="车辆能源类型"
            v-if="item.title === '车辆能源类型' && item.show"
            :formatter="
              (row) => (row.carEnergyType === 2 ? '新能源车辆' : '燃油车')
            "
          >
          </el-table-column>
          <el-table-column
            :key="item.title"
            align="center"
            show-overflow-tooltip
            label="车辆类型"
            v-if="item.title === '车辆类型' && item.show"
            :formatter="
              (row) =>
                row.carType1 === 0
                  ? '特种车'
                  : row.carType1 === 1
                  ? '客车'
                  : '乘用车'
            "
          >
          </el-table-column>
          <el-table-column
            :key="item.title"
            align="center"
            show-overflow-tooltip
            label="车辆用途"
            v-if="item.title === '车辆用途' && item.show"
            :formatter="(row) => carType2Format(row.carType2)"
          >
          </el-table-column>
          <el-table-column
            :key="item.title"
            align="center"
            show-overflow-tooltip
            label="车辆状态"
            v-if="item.title === '车辆状态' && item.show"
          >
            <template slot-scope="scope">
              <span :class="scope.row.carStatus == 1 ? 'green-text' : ''">
                {{ scope.row.carStatus === 0 ? "离线" : "在线" }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            :key="item.title"
            align="center"
            show-overflow-tooltip
            label="充电状态"
            v-if="item.title === '充电状态' && item.show"
            :formatter="
              (row) =>
                row.chargingStatus != null &&
                chargingStatus[Number(row.chargingStatus)]
            "
          >
          </el-table-column>
          <el-table-column
            :key="item.title"
            align="center"
            :min-width="item.width"
            :prop="item.prop"
            show-overflow-tooltip
            :label="item.title"
            v-if="specialData.indexOf(item.title) === -1 && item.show"
          >
          </el-table-column>
        </template>
        <el-table-column
          fixed="right"
          width="90"
          align="center"
          label="操作"
          v-if="showTotalCarList"
        >
          <template slot-scope="scope">
            <el-button
              @click.native.prevent="carRowDetail(scope.row)"
              type="text"
            >
              详情
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination" v-if="tableData.length > 0">
        <el-pagination
          background
          @current-change="handleCurrentChange"
          :current-page.sync="pageNo"
          layout="total, prev, pager, next"
          :total="totalData.length"
          :page-size="10"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  props: {
    showTotalCarList: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      dialogVisible: false,
      tableData: [],
      totalData: [],
      pageNo: 1,
      colData: [
        { title: "车头方向", show: true, prop: "direction", width: 80 },
        { title: "车辆名称", show: true, prop: "carName", width: 80 },
        { title: "车牌号", show: true, prop: "plateNo", width: 80 },
        {
          title: "车辆能源类型",
          show: true,
          prop: "carEnergyType",
          width: 100,
        },
        { title: "车辆类型", show: true, prop: "carType1", width: 80 },
        { title: "车辆用途", show: true, prop: "carType2", width: 80 },
        { title: "车辆状态", show: true, prop: "carStatus", width: 80 },
        { title: "车辆SOC(%)", show: true, prop: "soc", width: 100 },
        { title: "告警计数", show: true, prop: "alarmCount", width: 80 },
        { title: "行驶速度(km/h)", show: true, prop: "speed", width: 120 },

        { title: "终端号", show: false, prop: "terminalNo", width: 80 },
        {
          title: "驾驶员（签登）",
          show: false,
          prop: "driverDynamic",
          width: 120,
        },
        { title: "车辆说明", show: false, prop: "carDesc", width: 80 },
        { title: "SIM卡号", show: false, prop: "sim", width: 80 },

        {
          title: "累计里程(km)",
          show: false,
          prop: "totalMileage",
          width: 100,
        },
        {
          title: "单体电池最高电压(V)",
          show: false,
          prop: "maxVoltage",
          width: 150,
        },
        {
          title: "单体电池最低电压(V)",
          show: false,
          prop: "minVoltage",
          width: 150,
        },
        {
          title: "电池温度(℃)",
          show: false,
          prop: "maxTemperature",
          width: 100,
        },
        {
          title: "驱动电机温度(℃)",
          show: false,
          prop: "motorTemperature",
          width: 120,
        },
        {
          title: "驱动电机控制器温度(℃)",
          show: false,
          prop: "controllerTemperature",
          width: 160,
        },
        { title: "车辆总电压(V)", show: false, prop: "voltage", width: 110 },
        { title: "车辆总电流(A)", show: false, prop: "current", width: 110 },

        { title: "休眠状态", show: false, prop: "dormancyStatus", width: 80 },
        { title: "充电状态", show: false, prop: "chargingStatus", width: 80 },

        { title: "通信信号", show: true, prop: "commSignal", width: 80 },

        { title: "经度", show: false, prop: "longitude", width: 80 },
        { title: "纬度", show: false, prop: "latitude", width: 80 },
        { title: "地理位置", show: true, prop: "localPosition", width: 80 },
      ],
      colOpts: [
        "车牌号",
        "车辆名称",
        "车辆能源类型",
        "车辆类型",
        "车辆用途",
        "告警计数",
        "车头方向",
        "行驶速度(km/h)",
        "车辆SOC(%)",
        "车辆状态",
        "通信信号",
        "地理位置",
      ],
      colSelect: [
        "车牌号",
        "车辆名称",
        "车辆能源类型",
        "车辆类型",
        "车辆用途",
        "终端号",
        "驾驶员（签登）",
        "车辆说明",
        "SIM卡号",
        "告警计数",
        "车头方向",
        "行驶速度(km/h)",
        "累计里程(km)",
        "单体电池最高电压(V)",
        "单体电池最低电压(V)",
        "电池温度(℃)",
        "驱动电机温度(℃)",
        "驱动电机控制器温度(℃)",
        "车辆SOC(%)",
        "车辆总电压(V)",
        "车辆总电流(A)",
        "车辆状态",
        "休眠状态",
        "充电状态",
        "通信信号",
        "经度",
        "纬度",
        "地理位置",
      ],
      colOptsShow: [
        {
          label: "车辆信息",
          children: [
            {
              label: "车牌号",
            },
            {
              label: "车辆名称",
            },
            {
              label: "车辆能源类型",
            },
            {
              label: "车辆类型",
            },
            {
              label: "车辆用途",
            },
            {
              label: "终端号",
            },
            {
              label: "驾驶员（签登）",
            },
            {
              label: "SIM卡号",
            },
            {
              label: "车辆说明",
            },
            {
              label: "告警计数",
            },
          ],
        },
        {
          label: "运行统计",
          children: [
            {
              label: "车头方向",
            },
            {
              label: "行驶速度(km/h)",
            },
            {
              label: "累计里程(km)",
            },
            {
              label: "单体电池最高电压(V)",
            },
            {
              label: "单体电池最低电压(V)",
            },
            {
              label: "电池温度(℃)",
            },
            {
              label: "驱动电机温度(℃)",
            },
            {
              label: "驱动电机控制器温度(℃)",
            },
            {
              label: "车辆SOC(%)",
            },
            {
              label: "车辆总电压(V)",
            },
            {
              label: "车辆总电流(A)",
            },
          ],
        },
        {
          label: "基本状态",
          children: [
            {
              label: "车辆状态",
            },
            {
              label: "休眠状态",
            },
            {
              label: "充电状态",
            },
          ],
        },
        {
          label: "信号线状态",
          children: [
            {
              label: "通信信号",
            },
          ],
        },
        {
          label: "定位扩展",
          children: [
            {
              label: "经度",
            },
            {
              label: "纬度",
            },
            {
              label: "地理位置",
            },
          ],
        },
      ],
      defaultProps: {
        children: "children",
        label: "label",
      },
      filterText: "",
      specialData: [
        "车辆能源类型",
        "车头方向",
        "车辆类型",
        "车辆用途",
        "车辆状态",
        "充电状态",
      ],
      chargingStatus: ["未充电", "充电", "充电完成", "异常", "无效"],
      currentRow: null,
    };
  },
  computed: {
    heights() {
      return this.showTotalCarList ? window.screen.availHeight - 205 : 240;
    },
    ...mapGetters(["dictInfo"]),
  },
  methods: {
    // 获取车辆类型
    carType1Format(val) {
      const typeArr = this.dictInfo.usebroaHead;
      let item = typeArr.find((x) => {
        return x.value == val;
      });
      return item ? item.label : "";
    },

    // 获取车辆用途
    carType2Format(val) {
      const typeArr = this.dictInfo.usesubcHead;
      let item = typeArr.find((x) => {
        return x.value == val;
      });
      return item ? item.label : "";
    },
    handleCurrentChange(page) {
      this.pageNo = page;
      this.tableData.splice(0, this.tableData.length);
      this.tableData = this.totalData.slice((page - 1) * 10, page * 10);
    },
    handleTableCurrentChange(val) {
      this.currentRow = val;
      this.$emit("rowClick", val);
    },
    carRowDetail(val) {
      this.$emit("carRowDetail", val);
    },
    handleClose() {
      this.dialogVisible = !this.dialogVisible;
    },
    changeTotalData(val) {
      const self = this;
      if (val instanceof Array) {
        this.totalData.splice(0, this.totalData.length);
        val.map((item) => {
          if (item.hasOwnProperty("plateNo")) {
            self.totalData.push(item);
          }
        });
        this.$refs.tableDataRef.setCurrentRow(null);
      } else {
        // 获取数据在列表中的位置
        const itemIndex = self.totalData.findIndex(
          (x) => x.carNo === val.carNo
        );
        // 存在则去除，不存在则加入
        if (itemIndex === -1) {
          self.totalData.unshift(val);
          this.$refs.tableDataRef.setCurrentRow(val);
        } else {
          self.totalData.splice(itemIndex, 1);
        }

        // // 判断数据是否为数组
        // let carInfos = val.carInfos;
        // if (carInfos instanceof Array) {
        //   // 判断数组里的是否都已在列表里
        //   let allInList = true;
        //   carInfos = carInfos.filter((item) => item.hasOwnProperty("plateNo"));
        //   carInfos.map((item) => {
        //     // 数组里不在列表里的数据放在列表第一个
        //     if (
        //       self.totalData.findIndex((x) => x.carNo === item.carNo) === -1
        //     ) {
        //       self.totalData.unshift(item);
        //       allInList = false;
        //     }
        //   });
        //   // 都在列表里则从列表中去除整个数组
        //   if (allInList) {
        //     carInfos.map((item) => {
        //       self.totalData.splice(
        //         self.totalData.findIndex((x) => x.carNo === item.carNo),
        //         1
        //       );
        //     });
        //   } else {
        //     this.$refs.tableDataRef.setCurrentRow(null);
        //   }
        // } else {
        //   // 获取数据在列表中的位置
        //   const itemIndex = self.totalData.findIndex(
        //     (x) => x.carNo === val.carNo
        //   );
        //   // 存在则去除，不存在则加入
        //   if (itemIndex === -1) {
        //     self.totalData.unshift(val);
        //     this.$refs.tableDataRef.setCurrentRow(val);
        //   } else {
        //     self.totalData.splice(itemIndex, 1);
        //   }
        // }
      }
    },
    handleCheckChange() {
      this.colOpts = this.$refs.typeTree.getCheckedKeys();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
  },
  watch: {
    colOpts(valArr) {
      let arr = this.colSelect.filter((i) => valArr.indexOf(i) < 0); // 将colSelect中的值筛选出来  作为未选中的
      this.colData.filter((i) => {
        if (arr.indexOf(i.title) != -1) {
          i.show = false;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout();
          });
        } else {
          i.show = true;
          this.$nextTick(() => {
            this.$refs.tableDataRef.doLayout(); // ref上面定义过，不懂的看一下vue官方文档
          });
        }
      });
    },
    filterText(val) {
      this.$refs.typeTree.filter(val);
    },
    totalData(val) {
      this.pageNo = 1;
      this.tableData = val.slice(0, 10);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/styles/global.scss";
.car-list-container {
  background-color: #fff;
  margin-top: 12px;
  padding: 7px 14px;
  // height: 240px;
}
.header {
  display: flex;
  justify-content: space-between;

  .title {
    font-size: 15px;
    color: #222;
  }

  img {
    width: 74px;
    height: 14px;
    transform: rotate(180deg);
    position: relative;
    top: -7px;
    left: 74px;
  }

  .tieltImg {
    text-align: right;
    height: 22px;
    max-width: 22px;
    line-height: 22px;
    border-radius: 3px;
    margin: 0 10px 4px 0;

    &.tieltImgBg {
      background-color: #41b8c3;
    }
    svg {
      width: 20px;
      height: 20px;
      cursor: pointer;
      top: 4px;
      left: unset;
    }
  }
}
.car-list-dialog {
  .el-dialog__wrapper {
    right: 50px;
    left: unset;
    top: unset;
    // bottom: 240px;
    width: 27% !important;
  }
  .el-checkbox-group {
    padding: 12px;

    label {
      display: inline-block;
      width: 40%;
    }
  }

  .filter-container {
    padding: 9px 16px 13px;
    background-color: #fff;

    ::v-deep .el-input--prefix .el-input__inner {
      line-height: 32px;
      height: 32px;

      &:hover,
      &:focus {
        border: 1px solid #30f1fd;
      }
    }
    ::v-deep .el-input__prefix {
      top: -3px;
    }

    ::v-deep .el-tree {
      margin-top: 10px;
      height: 300px;
      overflow: auto;
      // table滚动条样式
      &::-webkit-scrollbar {
        cursor: pointer;
        width: 7px;
        height: 7px;
        background-color: transparent;
      }
      /*定义滑块 内阴影+圆角*/
      &::-webkit-scrollbar-thumb {
        border-radius: 10px;
        cursor: pointer;
        box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.1);
        background-color: #f5f5f5;
      }

      .el-tree-node {
        border: 1px solid #dedede;
        color: #222;
        &::before,
        &::after {
          border: 0 !important;
        }
        &:not(:nth-last-child(2)) {
          border-bottom: 0;
        }
        .el-checkbox__input.is-checked .el-checkbox__inner,
        .el-checkbox__input.is-indeterminate .el-checkbox__inner {
          background-color: #41b8c3;
          border-color: #41b8c3;
        }
        .el-tree-node__content:hover,
        .el-tree-node__content:focus {
          background-color: transparent;
        }
        .el-tree-node__children {
          display: flex;
          flex-wrap: wrap;
          .el-tree-node {
            border: 0;
            width: 45%;
            padding: 0;
            left: -20px;
            color: #525252;
            line-height: 26px;

            .el-checkbox__input.is-checked .el-checkbox__inner {
              background-color: #fff;
              &::after {
                border-color: #41b8c3;
              }
            }

            .el-tree-node__label {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

.tableContent {
  .car-dire-img {
    width: 24px;
    height: 24px;
  }
  .green-text {
    color: #21bc17;
  }
  ::v-deep.el-table {
    td {
      padding: 8px 0;
    }
    .cell {
      font-size: 13px;
      line-height: 14px;
    }
  }
}
::v-deep.el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #18bbda !important;
}
.show-total {
  margin-top: 0;
  padding-top: 11px;
  .header {
    margin-bottom: 16px;
    .title {
      position: relative;
      left: -14px;
      &::before {
        content: "|";
        color: $btnMainColor;
        height: 24px;
        width: 3px;
        background: $btnMainColor;
        margin-right: 14px;
      }
    }

    .tieltImg {
      max-width: 30px;
      width: 30px;
      height: 30px;
      margin: 0;
      margin-right: 42px;
      text-align: center;
      line-height: 30px;
      -moz-box-shadow: inset 0 0 2px #c5c5c5;
      -webkit-box-shadow: inset 0 0 2px #c5c5c5;
      box-shadow: inset 0 0 2px #c5c5c5;
    }
  }
  .el-dialog__wrapper {
    top: 35px;
  }
}
</style>
