<template>
  <crud name="系统日志" biz="sysOperationLog" :searchable="false" :editable="false" :rowEditable="false" :importable="false"
    v-model="queryParams">
    <template v-slot:table>
      <el-table-column prop="method" align="center" show-overflow-tooltip label="方法名称" min-width="150" />
      <el-table-column prop="requestMethod" align="center" show-overflow-tooltip label="请求方式" min-width="150" />
      <el-table-column prop="type" align="center" show-overflow-tooltip label="日志类型(0用户登录,1操作日志)" min-width="150" />
      <el-table-column prop="userName" align="center" show-overflow-tooltip label="操作人员" min-width="150" />
      <el-table-column prop="userId" align="center" show-overflow-tooltip label="操作人员Id" min-width="150" />
      <el-table-column prop="url" align="center" show-overflow-tooltip label="请求URL" min-width="150" />
      <el-table-column prop="ip" align="center" show-overflow-tooltip label="主机地址" min-width="150" />
      <el-table-column prop="param" align="center" show-overflow-tooltip label="请求参数" min-width="150" />
      <el-table-column prop="result" align="center" show-overflow-tooltip label="返回参数" min-width="150" />
      <el-table-column prop="status" align="center" show-overflow-tooltip label="操作状态（0正常 1异常）" min-width="150" />
      <el-table-column prop="errorMsg" align="center" show-overflow-tooltip label="错误消息" min-width="150" />
      <el-table-column prop="costTime" align="center" show-overflow-tooltip label="消耗时间" min-width="150" />
    </template>
  </crud>
</template>

<script setup lang="ts">
const queryParams = reactive({
  name: ''
})
</script>

<style scoped></style>