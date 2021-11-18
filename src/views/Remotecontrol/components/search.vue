<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="100px"
    >
      <el-col :span="6">
        <el-form-item prop="businessType" label="网点">
          <el-select
            v-model="queryParams.outlets"
            placeholder="请选择网点"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in outletslist"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item prop="status" label="设备名称">
          <el-select
            v-model="queryParams.name"
            placeholder="请选择充电设备名称"
            clearable
            size="small"
            style="width: 200px"
          >
            <el-option
              v-for="dict in namelist"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            />
          </el-select>
        </el-form-item>
      </el-col>

      <el-col :span="6">
        <el-form-item prop="userName" label="设备编号">
          <el-input
            v-model="queryParams.code"
            placeholder="请输入充电设备编号"
            clearable
            style="width: 240px"
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item>
          <!-- icon="el-icon-search" -->
          <el-button size="mini" @click="handleQuery">
            查询
          </el-button>
          <el-button size="mini" @click="handleQuery">
            重置
          </el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: {
    outletslist: {
      type: Array,
      default: () => []
    },
    namelist: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      queryParams: {}
    }
  },
  methods: {
    handleQuery() {}
  }
}
</script>

<style></style>
