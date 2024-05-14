<template>
  <crud name="功能清单" biz="sysFeature" :searchable="false" :editable="false" :importable="false" v-model="queryParams"
    v-model:formData="formData" v-model:rules="rules">
    <template v-slot:table>
      <el-table-column prop="name" align="center" label="功能" width="150" />
      <el-table-column prop="role" align="center" label="使用角色" width="150" />
      <el-table-column prop="status" align="center" label="完成状态" width="150" />
      <el-table-column prop="comment" show-overflow-tooltip label="具体描述" min-width="150" />
    </template>

    <template v-slot:form>
      <el-form-item label="功能" prop="name" verify>
        <el-input v-model="formData.name" :maxLength="128" placeholder="请输入功能，不能为空，最大长度为128字符" clearable></el-input>
      </el-form-item>
      <el-form-item label="具体描述" prop="comment" verify>
        <el-input v-model="formData.comment" :maxLength="512" placeholder="请输入具体描述，不能为空，最大长度为512字符"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="使用角色" prop="role" verify>
        <el-input v-model="formData.role" :maxLength="32" placeholder="请输入使用角色，不能为空，最大长度为32字符" clearable></el-input>
      </el-form-item>
      <el-form-item label="完成状态" prop="status" verify>
        <el-input v-model="formData.status" :maxLength="8" placeholder="请输入完成状态，不能为空，最大长度为8字符" clearable></el-input>
      </el-form-item>

    </template>
  </crud>
</template>

<script setup lang="ts">
const queryParams = reactive({
  name: ''
})
const formData = reactive({
  name: '',
  comment: '',
  role: '',
  status: ''
})

const rules = reactive({
  name: [{ required: true, message: "请输入名称", trigger: "blur" }],
});
</script>

<style scoped></style>