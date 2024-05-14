<template>
  <crud name="QHSE荣誉" biz="actHonor" v-model="queryParams" v-model:formData="formData" v-model:rules="rules">
    <template v-slot:search>
      <el-form-item label="获奖单位" prop="firmName">
        <el-input v-model="queryParams.firmName" :maxLength="200" placeholder="请输入获奖单位" clearable></el-input>
      </el-form-item>
      <el-form-item label="奖项类型" prop="type">
        <el-select v-model="queryParams.type" placeholder="奖项类型" :style="{ width: '150px' }">
          <el-option v-for="item in types" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
    </template>
    <template v-slot:table>
      <el-table-column prop="firmName" align="center" show-overflow-tooltip label="获奖单位" min-width="150" />
      <el-table-column prop="project" align="center" show-overflow-tooltip label="获奖项目" min-width="150" />
      <el-table-column prop="name" align="center" show-overflow-tooltip label="奖项名称" min-width="150" />
      <el-table-column prop="awardUnit" align="center" show-overflow-tooltip label="授奖单位" min-width="150" />
      <el-table-column prop="grade" align="center" show-overflow-tooltip label="奖项级别" min-width="150" />
      <el-table-column prop="awardDate" align="center" show-overflow-tooltip label="授奖时间" min-width="150" />
      <el-table-column prop="fileNo" align="center" show-overflow-tooltip label="表彰文件文号" min-width="150" />
      <el-table-column prop="type" align="center" show-overflow-tooltip label="奖项类型" min-width="150" />
      <el-table-column prop="annex" align="center" show-overflow-tooltip label="相关文件" min-width="150" />

    </template>

    <template v-slot:form>
      <el-form-item label="获奖单位" prop="firmName">
        <el-input v-model="formData.firmName" :maxLength="200" placeholder="请输入获奖单位，不能为空，最大长度为200字符"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="获奖项目" prop="project">
        <el-input v-model="formData.project" :maxLength="200" placeholder="请输入获奖项目，不能为空，最大长度为200字符"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="奖项名称" prop="name">
        <el-input v-model="formData.name" :maxLength="200" placeholder="请输入奖项名称，不能为空，最大长度为200字符" clearable></el-input>
      </el-form-item>
      <el-form-item label="授奖单位" prop="awardUnit">
        <el-input v-model="formData.awardUnit" :maxLength="200" placeholder="请输入授奖单位，不能为空，最大长度为200字符"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="奖项级别" prop="grade">
        <el-select v-model="formData.grade" placeholder="奖项级别" :style="{ width: '100%' }">
          <el-option v-for="item in grades" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="授奖时间" prop="awardDate">
        <el-date-picker v-model="formData.awardDate" type="date" format="YYYY-MM-DD" value-format="YYYY-MM-DD"
          placeholder="选择授奖时间" :style="{ width: '100%' }"></el-date-picker>
      </el-form-item>
      <el-form-item label="表彰文件文号" prop="fileNo">
        <el-input v-model="formData.fileNo" :maxLength="200" placeholder="请输入表彰文件文号，不能为空，最大长度为200字符"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="奖项类型" prop="type">
        <el-select v-model="formData.type" placeholder="奖项类型" :style="{ width: '100%' }">
          <el-option v-for="item in types" :key="item" :label="item" :value="item" />
        </el-select>
      </el-form-item>
      <el-form-item label="相关文件" prop="annex">
        <el-input v-model="formData.annex" :maxLength="1024" placeholder="请输入相关文件，不能为空，最大长度为1024字符"
          clearable></el-input>
      </el-form-item>
    </template>
  </crud>
</template>

<script setup lang="ts">
const queryParams = reactive({
  name: ''
})
const formData = reactive({
  serial: 0
})
const grades = ['国家级', '省部级']
const types = ['技术开发类', '社会公益类', '重大工程类']

const rules = reactive({

});
</script>

<style scoped></style>