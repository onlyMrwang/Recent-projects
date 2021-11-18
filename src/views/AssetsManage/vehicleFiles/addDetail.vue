<template>
  <div class="car">
     <el-divider content-position="left">基本信息</el-divider>
    <el-form
      ref="baseForm"
      :model="baseForm"
      :rules="baserules"
      size="medium"
      label-width="160px"
    >
      <el-row>
        <el-col :span="8" >
          <el-form-item label="车辆编码 : " prop="carId">
            <el-input v-model="baseForm.carId" :disabled="true" />
          </el-form-item>
        </el-col>
         <el-col :span="8" >
          <el-form-item label="车辆名称 : " prop="carName">
            <el-input v-model.trim="baseForm.carName" maxlength="32" placeholder="请输入车辆名称" :disabled="listType" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆VIN : " prop="carVin">
            <el-input
              v-model.trim="baseForm.carVin"
              :disabled="listType"
              placeholder="请输入车辆VIN"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="车牌号 : " prop="carNumber">
            <el-input
              v-model.trim="baseForm.carNumber"
              maxlength="10"
              :disabled="listType"
              placeholder="请输入车牌号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆型号 : " prop="carModel">
            <el-input
              v-model.trim="baseForm.carModel"
              :disabled="listType"
              placeholder="请输入车辆型号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="能源类型 : " prop="carType">
            <el-select
              v-model="baseForm.carType"
              :disabled="listType || listTypes === 2"
              @change="changeEneryType"
              placeholder="请选择能源类型"
            >
              <el-option
                v-for="item in dictInfo.carType"
                :key="item.value"
                :label="item.label"
                 :value="Number(item.value)"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="8">
          <el-form-item label="车辆类型 : " prop="userBroaHead">
            <el-select
              :disabled="listType || listTypes === 2"
              v-model="baseForm.userBroaHead"
              @change="changeAddCar"
              placeholder="请选择车辆类型"
            >
              <el-option
                v-for="item in dictInfo.usebroaHead"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆用途 : " prop="userSubcHead">
            <el-select
              v-model="baseForm.userSubcHead"
              :disabled="listType"
              placeholder="请选择车辆用途"
            >
              <el-option
                v-for="item in addUserSubcHead"
                :key="item.value"
                :label="item.label"
                :value="Number(item.value)"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
            <el-form-item label="所属组织机构 : " prop="orgId" :show-message="!baseForm.orgId">
              <el-input v-if="listTypes === 2" disabled v-model="baseForm.nameCn"/> 
              <treeselect
                v-else
                placeholder="请选择所属组织机构"
                :options="deptList"
                v-model="baseForm.orgId"
                :default-expand-level="2"
                :normalizer="normalizer"
                :clearable="false"
                :disabled="listType"
              />
            </el-form-item>
        </el-col>
        </el-row>
        <el-row>
         <el-col :span="8">
          <el-form-item label="负责人 : " prop="chargePerson">
            <el-input
              v-model.trim="baseForm.chargePerson"
              maxlength="32"
              placeholder="请输入负责人"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话 : " prop="phone">
            <el-input
              maxlength="11"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model.trim="baseForm.phone"
              placeholder="请输入联系电话"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="车辆维保周期(月) : " prop="repairCycle">
            <el-input
              v-model.trim="baseForm.repairCycle"
              maxlength="32"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              placeholder="请输入车辆维保周期"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="8">
          <el-form-item label="整车厂商 : " prop="carFacturer">
            <el-select
              v-model="baseForm.carFacturer"
              :disabled="listType"
              placeholder="请选择整车厂商"
            >
              <el-option
                v-for="item in carFacturer"
                :key="item.facturerId"
                :label="item.facturerName"
                :value="item.facturerId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购时间 : " prop="purchTime">
            <el-date-picker
              :disabled="listType"
              class="input-width"
              v-model="baseForm.purchTime"
              type="date"
              placeholder="年/月/日"
            >
            </el-date-picker>
          </el-form-item>
        </el-col>
         <el-col :span="8" v-if="baseForm.carType == '2'">
          <el-form-item label="是否自动驾驶车辆 : " prop="isSelfDrivingCar">
               <el-radio-group v-model="baseForm.isSelfDrivingCar" :disabled="listType">
                    <el-radio  label="1">是</el-radio>
                    <el-radio  label="0">否</el-radio>
                </el-radio-group>
          </el-form-item>
        </el-col>
        </el-row>
        <el-row>
        <el-col :span="24">
          <el-form-item label="车载摄像头位置 : " prop="cameraLocation">
               <el-checkbox-group v-model="baseForm.cameraLocation">
                <el-checkbox v-for="item in dictInfo.cameraLocation" :key="item.value" :label="item.value">{{item.label}}</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
        </el-col>
        </el-row>
    </el-form>
 
    <!-- <div>车辆配件信息</div> -->

    <el-divider v-if="baseForm.carType" content-position="left">{{(baseForm.carType == '2' || baseForm.carType == '3')  ? '电机信息' : '充电机信息'}}</el-divider>
    <el-form
      ref="elecForm"
      :model="elecForm"
      :rules="elecrules"
      size="medium"
      label-width="160px"
    >
      <el-row>
        <el-col :span="8" v-if="(baseForm.carType == '2' || baseForm.carType == '3')">
          <el-form-item label="电机编号 : " prop="motorNumber">
            <el-input
              v-model="elecForm.motorNumber"
              disabled
              placeholder="请输入电机编号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="(baseForm.carType == '2' || baseForm.carType == '3')">
          <el-form-item label="电机名称 : " prop="motorName">
            <el-input
              placeholder="请输入电机名称"
              v-model.trim="elecForm.motorName"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="(baseForm.carType == '2' || baseForm.carType == '3')">
          <el-form-item label="电机厂商 : " prop="motorFacturer">
            <el-select
              clearable
              v-model="elecForm.motorFacturer"
              :disabled="listType"
              placeholder="请选择电机厂商"
            >
              <el-option
                v-for="item in motorFacturer"
                :key="item.facturerId"
                :label="item.facturerName"
                :value="item.facturerId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
     <el-col :span="8" v-if="(baseForm.carType == '2' || baseForm.carType == '3')">
          <el-form-item label="型号 : " prop="model">
            <el-select
              v-model="elecForm.model"
              :disabled="listType"
              placeholder="请选择型号"
            >
              <el-option
                v-for="item in dictInfo.elecFacturerModel"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="(baseForm.carType == '2' || baseForm.carType == '3')">
          <el-form-item label="额定功率(kW) : " prop="ratedPower">
            <el-input
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model.trim="elecForm.ratedPower"
              placeholder="请输入额定功率"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="(baseForm.carType == '2' || baseForm.carType == '3')">
          <el-form-item label="额定电压(V) : " prop="ratedVoltage">
            <el-input
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model.trim="elecForm.ratedVoltage"
              placeholder="请输入额定电压"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8" v-if="(baseForm.carType == '2' || baseForm.carType == '3')">
          <el-form-item label-width="160px" label="额定电流(A) : " prop="ratedCurrent">
            <el-input
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model.trim="elecForm.ratedCurrent"
              placeholder="请输入额定电流"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
          <el-col :span="8" v-if="(baseForm.carType == '1' || baseForm.carType == '3')">
          <el-form-item label="发动机型号  : " prop="engineModel">
            <el-input
              placeholder="请输入发动机型号"
              v-model.trim="elecForm.engineModel"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
         <el-col :span="8" v-if="(baseForm.carType == '1' || baseForm.carType == '3')">
          <el-form-item label="排量(L)  : " prop="emissions">
            <el-input
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              placeholder="请输入排量(L)"
              v-model.trim="elecForm.emissions"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-divider v-if="(baseForm.carType == '2' || baseForm.carType == '3')" content-position="left">电池信息</el-divider>
    <el-form
      v-if="(baseForm.carType == '2' || baseForm.carType == '3')"
      ref="batteryForm"
      :model="batteryForm"
      :rules="batteryrules"
      size="medium"
      label-width="168px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="电池BMS编号 : " prop="battertNum">
            <el-input
              v-model="batteryForm.battertNum"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电池保质期(月) : " prop="batteryQuality">
            <el-input
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model.trim="batteryForm.batteryQuality"
              placeholder="请输入电池保质期"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电池检测周期(月) : " prop="batteryCycle">
            <el-input
              maxlength="32"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model.trim="batteryForm.batteryCycle"
              placeholder="请输入电池检测周期"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item label="电池厂商 : " prop="batteryFacturer">
            <el-select
              clearable
              v-model="batteryForm.batteryFacturer"
              :disabled="listType"
              placeholder="请选择电池厂商"
            >
              <el-option
                v-for="item in batteryFacturer"
                :key="item.facturerId"
                :label="item.facturerName"
                :value="item.facturerId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电池组额定容量(Ah) : " prop="ratedCapacityAh">
            <el-input
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model.trim="batteryForm.ratedCapacityAh"
              placeholder="请输入电池组额定容量"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电池组额定电压(V) : " prop="batRatedVoltage">
            <el-input
              v-model.trim="batteryForm.batRatedVoltage"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              placeholder="请输入电池组额定电压"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="电池组额定功率(kWh) : " prop="ratedCapacityKwh">
            <el-input
             onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              v-model.trim="batteryForm.ratedCapacityKwh"
              placeholder="请输入电池额定功率"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 外接车载终端 -->
     <el-divider content-position="left">外接车载终端</el-divider>
     <el-form
      ref="outTerminalForm"
      :model="outTerminalForm"
      :rules="outTerminalrules"
      size="medium"
      label-width="160px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="终端号 : " prop="terminalCode">
            <el-input
              v-model="outTerminalForm.terminalCode"
              placeholder="请输入终端号"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="SIM卡号 : " prop="simCode">
            <el-input
              v-model.trim="outTerminalForm.simCode"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              placeholder="请输入SIM卡号"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终端厂商 : " prop="terminalFacturerId">
             <el-select
              clearable
              v-model="outTerminalForm.terminalFacturerId"
              :disabled="listType"
              placeholder="请选择终端厂商"
            >
              <el-option
                v-for="item in terminalFacturer"
                :key="item.facturerId"
                :label="item.facturerName"
                :value="item.facturerId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
       <el-row>
        <!-- <el-col :span="8">
          <el-form-item label="视频通道号 : " prop="videoChannel">
            <el-select
              clearable
              multiple
              v-model="outTerminalForm.videoChannel"
              :disabled="listType"
              placeholder="请选择视频通道号"
            >
              <el-option
                v-for="item in videoList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="是否注册 : " prop="ifReg">
              {{carTerminalForm.ifReg == '1' ? '是' : '否'}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="终端说明 : " prop="terminalDesc">
           <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入终端说明"
            v-model.trim="outTerminalForm.terminalDesc">
           </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 原厂车载终端 -->
      <el-divider content-position="left">原厂车载终端</el-divider>
     <el-form
      ref="carTerminalForm"
      :model="carTerminalForm"
      :rules="carTerminalrules"
      size="medium"
      label-width="160px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item label="终端号 : " prop="terminalCode">
            <el-input
              v-model="carTerminalForm.terminalCode"
              placeholder="请输入终端号"
              disabled
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="SIM卡号 : " prop="simCode">
            <el-input
              v-model.trim="carTerminalForm.simCode"
              onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"
              placeholder="请输入SIM卡号"
              :disabled="listType"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="终端厂商 : " prop="terminalFacturerId">
             <el-select
              clearable
              v-model="carTerminalForm.terminalFacturerId"
              :disabled="listType"
              placeholder="请选择终端厂商"
            >
              <el-option
                v-for="item in terminalFacturer"
                :key="item.facturerId"
                :label="item.facturerName"
                :value="item.facturerId"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <!-- <el-col :span="8">
          <el-form-item label="视频通道号 : " prop="videoChannel">
            <el-select
              clearable
              multiple
              v-model="carTerminalForm.videoChannel"
              :disabled="listType"
              placeholder="请选择视频通道号"
            >
              <el-option
                v-for="item in videoList"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> -->
        <el-col :span="8">
          <el-form-item label="是否注册 : " prop="ifReg">
              {{carTerminalForm.ifReg == '1' ? '是' : '否'}}
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="终端说明 : " prop="terminalDesc">
           <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入终端说明"
            v-model.trim="carTerminalForm.terminalDesc">
           </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="mini" type="primary" v-if="dataType != 3" :loading="loadingBtn" @click="submitFn">确 定</el-button>
      <el-button size="mini" @click="closeDialog">取 消</el-button>
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getChargManu } from '@/api/alarm/faultalarmBase'
import { addCarInfo, editCarInfo } from "@/api/asset/vehiclefiles";
import { getAreaId } from "@/api/asset/charggroupinfo";

export default {
  data() {
      var Phone = (rule, value, callback) => {
        var str = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if (value) {
            if (!str.test(value)) {
                callback(new Error("手机号格式不正确"));
            } else {
                callback();
            }
        } else {
            callback();
        }
    };
    return {
      dataType: 1,
      baseForm: {
        carId: null,
        carVin: null,
        carNumber: null,
        carModel: null,
        carType: null,
        userBroaHead: null,
        userSubcHead: null,
        orgId: null,
        nameCn: null,
        chargePerson: null,
        phone: null,
        repairCycle: null,
        carFacturer: null,
        purchTime: null,
        carCheck: null,
        isSelfDrivingCar: null,
        cameraLocation: null,
      },
      loadingBtn: false,
      elecForm: {},
      batteryForm: {},
      outTerminalForm: {
        simCode: null,
        terminalCode: null,
        terminalDesc: null,
        terminalFacturerId: null,
        terminalType: 2,
        // videoChannel: null
      },
      carTerminalForm: {
        simCode: null,
        terminalCode: null,
        terminalDesc: null,
        terminalFacturerId: null,
        terminalType: 1,
        // videoChannel: null
      },
      deptLists: [], //所属组织机构
      disabledType: false, //控制是否可以输入
      carPurp: [], //车辆用途下拉框
      batteryFacturer: [], //电池厂商数组
      terminalFacturer: [], // 终端厂商
      model: [], //型号数组
      motorFacturer: [], //电机厂商
      carFacturer: [], //整车厂商
      opeDept: [], //所属运营部门
      company: [], //所属公司
      group: [], //所属集团
      dictArr: [], //地址数组
      carType: [], //车辆类型
      userBroaHead: [], //车辆大类
      addUserSubcHead: [], //车辆小类
      province: [], //省
      city: [], //城市
      carAreaCode: [], //区
      areaId: [], //地区
      videoList: [ // 视频通道号列表
        1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
      ],
      // 表单校验
      baserules: {
        orgId: [
          { required: true, message: "请选择组织机构", trigger: "change" },
        ],
        carVin: [{ required: true, message: "请输入车辆VIN", trigger: "blur" },
         { min: 17, max: 17, message: "车辆VIN应为17位", trigger: "blur" }
        ],
        carModel: [{ required: true, message: "请输入车辆型号", trigger: "blur" }],
        carName: [{ required: true, message: "请输入车辆名称", trigger: "blur" },],
        carNumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
        ],
        carType: [
          { required: true, message: "请选择能源类型", trigger: "change" },
        ],
         userBroaHead: [
          { required: true, message: "请选择车辆类型", trigger: "change" },
        ],
        userSubcHead: [
          { required: true, message: "请选择车辆用途", trigger: "change" },
        ],
        carFacturer: [
          { required: true, message: "请选择整车厂商", trigger: "change" },
        ],
        purchTime: [
          { required: true, message: "请选择采购时间", trigger: "blur" },
        ],
        phone: [
          {required: false, message: "请输入联系电话", trigger: "blur"},
          { validator: Phone, trigger: "blur", message: "联系电话格式不正确"}],
      },
      elecrules: {
        // motorName: [
        //   { required: true, message: "请输入电机名称", trigger: "blur" },
        // ],
        // motorFacturer: [
        //   { required: true, message: "请选择电机厂商", trigger: "change" },
        // ],
        // model: [
        //   { required: true, message: "请选择型号", trigger: "change" },
        // ],
        // ratedVoltage: [
        //   { required: true, message: "请输入额定电压", trigger: "blur" },
        // ],
        // ratedCurrent: [
        //   { required: true, message: "请输入额定电流", trigger: "blur" },
        // ],
        // ratedPower: [
        //   { required: true, message: "请输入额定功率", trigger: "blur" },
        // ],
        // engineModel: [
        //   { required: false, message: "请输入发动机型号", trigger: "blur" },
        // ],
        // emissions: [
        //   { required: true, message: "请输入排量(L)", trigger: "blur" },
        // ],
      },
      batteryrules: {
        // batteryQuality: [
        //   { required: true, message: "请输入电池保质期", trigger: "blur" },
        // ],
        // batteryCycle: [
        //   { required: true, message: "请输入电池检测周期", trigger: "blur" },
        // ],
        // ratedCapacityAh: [
        //   { required: true, message: "请输入电池组额定容量", trigger: "blur" },
        // ],
        // batRatedVoltage: [
        //   { required: true, message: "请输入电池组额定电压", trigger: "blur" },
        // ],
        // ratedCapacityKwh: [
        //   { required: true, message: "请输入电池额定功率", trigger: "blur" },
        // ], 
      },
      outTerminalrules: {
        terminalCode: [
          // { required: true, message: "请输入终端编号", trigger: "blur" }
        ],
        simCode: [
          { required: false, message: "请输入SIM卡号", trigger: "blur" }
        ],
        terminalFacturerId: [
          { required: false, message: "请选择终端厂商", trigger: "change" }
        ]
      },
      carTerminalrules: {
        //  terminalCode: [
        //   { required: false, message: "请输入终端编号", trigger: "blur" }
        // ],
        simCode: [
          { required: false, message: "请输入SIM卡号", trigger: "blur" },
        ],
          terminalFacturerId: [
          { required: false, message: "请选择终端厂商", trigger: "change" }
        ]
      }
    };
  },
  props: {
    listDetail: {
      //定义接收报警级别数组
      type: Object, //数据类型
      required: true, //是否必传
    },
    listType: {
      required: true, //是否必传
    },
    listTypes: {
      required: true, //是否必传
    },
  },
  computed: {
    ...mapGetters(["deptList", 'dictInfo']),
  },
  created() {
    this.dataType = this.listTypes;
    if(this.listTypes !== 1) {
       this.baseForm = this.listDetail
    }
    this.elecForm = this.listDetail;
    this.batteryForm = this.listDetail;
    if(this.listDetail?.carTerminal?.length > 0) {
      this.outTerminalForm = this.listDetail.carTerminal.filter(item => item.terminalType === 2).length > 0 
      ? this.listDetail.carTerminal.filter(item => item.terminalType === 2)[0] : this.outTerminalForm
      this.carTerminalForm = this.listDetail.carTerminal.filter(item => item.terminalType === 1).length > 0 
      ? this.listDetail.carTerminal.filter(item => item.terminalType === 1)[0] : this.carTerminalForm
    }
    // if(!this.carTerminalForm.videoChannel) {
    //   this.carTerminalForm.videoChannel = []
    // }else {
    //   this.carTerminalForm.videoChannel = this.carTerminalForm.videoChannel.split(',')
    // }

    // if(!this.outTerminalForm.videoChannel) { 
    //   this.outTerminalForm.videoChannel = []
    // }else {
    //  this.outTerminalForm.videoChannel = this.outTerminalForm.videoChannel.split(',')
    // }

    this.getCarFacturer(); //整车厂商下拉框
    this.getBatteryFacturer(); //电池厂商下拉框
    this.getMotorFacturer(); //电机厂商下拉框
    this.getTerminalFacturer(); // 终端厂商
    this.getCity(); //获取地市列表
    if(Number(this.listDetail.userBroaHead) >= 0 ) {
        this.getSubList(this.listDetail.userBroaHead)
    }
    if(!this.baseForm.cameraLocation) {
      this.baseForm.cameraLocation = []
    }else {
      this.baseForm.cameraLocation = this.baseForm.cameraLocation.split(',')
    }
  },
  methods: {
     // 获取车辆用途列表
     getSubList(pVal) {
      if(Number(pVal) >= 0 && this.dictInfo.usesubcHead.length > 0 && this.dictInfo.usebroaHead.length > 0) {
          const parr = this.dictInfo.usebroaHead.filter(item => item.value == pVal)
          let arr = []
          if(parr.length > 0) {
            arr = this.dictInfo.usesubcHead.filter(item => item.parentValue == parr[0].id)   
          }
         this.addUserSubcHead = arr
      }else {
         this.addUserSubcHead = []
      }
    },
    changeEneryType(val) {
      if(val == '2') {
        this.baseForm.isSelfDrivingCar = '1'
      }else {
        this.baseForm.isSelfDrivingCar = null
      }
    },
    // 新增/修改车辆信息
    submitFn() {
        let list = [];
        if(!this.baseForm.carType) {
          this.$message({
            type: 'error',
            message: '请选择能源类型'
          })
          return
        }
        if(this.baseForm.carType == '2') {
          list.push(
          this.checkForm("baseForm"),
          this.checkForm("elecForm"),
          this.checkForm("batteryForm"),
          this.checkForm("outTerminalForm"),
          this.checkForm("carTerminalForm"))
        }else {
         list.push(
          this.checkForm("baseForm"),
          this.checkForm("elecForm"),
          this.checkForm("outTerminalForm"),
          this.checkForm("carTerminalForm")) 
        }

      Promise.all(list)
        .then(async () => {
                if(this.baseForm.cameraLocation.length > 0) {
                  this.baseForm.cameraLocation = this.baseForm.cameraLocation.join(',')
                }else {
                  this.baseForm.cameraLocation = null
                }
                // if(this.carTerminalForm.videoChannel.length > 0) {
                //     this.carTerminalForm.videoChannel = this.carTerminalForm.videoChannel.join(',')
                //   }else {
                //     this.carTerminalForm.videoChannel = null
                //   }
                // if(this.outTerminalForm.videoChannel.length > 0) {
                //   this.outTerminalForm.videoChannel = this.outTerminalForm.videoChannel.join(',')
                // }else {
                //    this.outTerminalForm.videoChannel = null
                // }
                this.outTerminalForm.terminalType = 2
                this.carTerminalForm.terminalType = 1
                const data = [this.outTerminalForm, this.carTerminalForm]
                this.loadingBtn = true
                if (this.dataType != 1) {
                  const res = await editCarInfo(
                    this.baseForm,
                    this.elecForm,
                    this.batteryForm,
                    data
                  );
                  if (res.code === 200) {
                    this.msgSuccess(res.message);
                    this.$emit("closeView", 1);
                    this.loadingBtn = false
                  }else {
                    this.loadingBtn = false
                    if(this.baseForm.cameraLocation) {
                      this.baseForm.cameraLocation = this.baseForm.cameraLocation.split(',')
                    }else {
                       this.baseForm.cameraLocation = []
                    }
                    // if(this.carTerminalForm.videoChannel) {
                    //   this.carTerminalForm.videoChannel = this.carTerminalForm.videoChannel.split(',')
                    // }else {
                    //   this.carTerminalForm.videoChannel = []
                    // }
                    // if(this.outTerminalForm.videoChannel) {
                    //   this.outTerminalForm.videoChannel = this.outTerminalForm.videoChannel.split(',')
                    // }else {
                    //   this.outTerminalForm.videoChannel = []
                    // }
                  }
                } else {
                  const res = await addCarInfo(
                    this.baseForm,
                    this.elecForm,
                    this.batteryForm,
                    data
                  );
                  if (res.code === 200) {
                    this.msgSuccess(res.message);
                    this.$emit("closeView", 1);
                    this.loadingBtn = false
                  }else {
                    this.loadingBtn = false
                     if(this.baseForm.cameraLocation) {
                      this.baseForm.cameraLocation = this.baseForm.cameraLocation.split(',')
                    }else {
                       this.baseForm.cameraLocation = []
                    }
                    //  if(this.carTerminalForm.videoChannel) {
                    //   this.carTerminalForm.videoChannel = this.carTerminalForm.videoChannel.split(',')
                    // }else {
                    //    this.carTerminalForm.videoChannel = []
                    // }
                    // if(this.outTerminalForm.videoChannel) {
                    //   this.outTerminalForm.videoChannel = this.outTerminalForm.videoChannel.split(',')
                    // }else {
                    //   this.outTerminalForm.videoChannel = []
                    // }
                  }
                }
              })
        .catch(() => {

      })
    },

    checkForm(formName) {
      return new Promise((resolve, reject) => {
        this.$refs[formName].validate(valid => {
          if (valid) {
            resolve();
          } else {
            reject()
          }
        });
      });
    },
    closeDialog() {
        this.$emit("closeView", 2); 
    },
    // 整车厂商下拉框
    async getCarFacturer() {
      const res = await getChargManu({ type: 2 });
      if (res.code === 200) {
        this.carFacturer = res.data;
      }
    },

    // 电池厂商下拉框
    async getBatteryFacturer() {
      const res = await getChargManu({ type: 6 });
      if (res.code === 200) {
        this.batteryFacturer = res.data;
      }
    },

    // 电机厂商下拉框
    async getMotorFacturer() {
      const res = await getChargManu({ type: 5 });
      if (res.code === 200) {
        this.motorFacturer = res.data;
      }
    },

    // 终端厂商
    async getTerminalFacturer() {
       const res = await getChargManu({ type: 4 });
      if (res.code === 200) {
        this.terminalFacturer = res.data;
      }
    },

    /** 转换部门数据结构 */
    normalizer(node) {
      //去掉children=[]的children属性
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.id,
        label: node.nameCN,
        children: node.children,
      };
    },

    // 获取地市列表
    async getCity() {
      const res = await getAreaId();
      if (res.code == 200) {
        this.city = res.data.result;
      }
    },

    // 车辆大类改变获取小类
     changeAddCar(val) {
      this.addUserSubcHead = []
      this.baseForm.userSubcHead = null
      this.getSubList(val)
    },
  },
};
</script>
<style lang="scss">
.car {
  .el-divider__text {
    position: absolute;
    background-color: #f5f5f5;
    padding: 0 10px; 
    font-weight: 500;
    color: #222;
    font-size: 13px;
}
}

</style>
<style lang="scss" scoped>
.dialog-footer {
  width: 100%;
  text-align: center;
  display: inline-block;
  margin-bottom: 30px;
}
</style>
