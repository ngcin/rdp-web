<!--接口-->
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="name">
          <el-input v-model="queryParams.keywords" placeholder="接口名称" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"><i-ep-search />搜索</el-button>
          <el-button @click="resetQuery()"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button type="success" @click="openDialog()"><i-ep-plus />新增</el-button>
        <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
      </template>
      <el-table v-loading="loading" highlight-current-row :data="records" border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="接口名称" prop="name" width="200" />
        <el-table-column label="请求方式" prop="requestMethod" width="120" />
        <el-table-column label="可访问角色" prop="roleNames" width="250" />
        <el-table-column label="接口地址" prop="path" />
        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template #default="scope">
            <el-button type="primary" link size="small"
              @click.stop="openDialog(scope.row.id)"><i-ep-edit />编辑</el-button>
            <el-button type="primary" link size="small"
              @click.stop="handleDelete(scope.row.id)"><i-ep-delete />删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="800px" @close="closeDialog">
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="接口名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入接口名称" />
        </el-form-item>

        <el-form-item label="请求方式" prop="requestMethod">
          <el-select v-model="formData.requestMethod" placeholder="请选择请求方式">
            <el-option v-for="item in requestMethods" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="接口地址" prop="path">
          <el-input v-model="formData.path" placeholder="请输入接口地址" />
        </el-form-item>
        <el-form-item label="可访问角色" prop="roleIds">
          <el-select v-model="formData.roleIds" multiple placeholder="请选择可访问角色">
            <el-option v-for="item in roleList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  pageInterface,
  getInterfaceForm,
  addInterface,
  updateInterface,
  deleteInterfaces,
} from "@/api/system/interface";

import { getRoleOptions } from "@/api/role";

import { InterfaceForm, InterfaceVO, InterfaceQuery, InterfacePage } from "@/api/system/interface/types";

defineOptions({
  name: "SystemInterfaceTable",
  inheritAttrs: false,
});

const requestMethods = ['GET', 'POST', 'PUT', 'DELETE']

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);
const roleList = ref<OptionType[]>(); // 角色下拉数据源

const queryParams = reactive<InterfaceQuery>({
  pageNum: 1,
  pageSize: 10,
});

const records = ref<InterfaceVO[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<InterfaceForm>({});

const rules = reactive({
  name: [{ required: true, message: "请输入接口名称", trigger: "blur" }],
  requestMethod: [{ required: true, message: "请选择接口请求方式", trigger: "blur" }],
  path: [{ required: true, message: "请输入接口路径", trigger: "blur" }],
});


/** 查询 */
function handleQuery() {
  loading.value = true;
  pageInterface(queryParams)
    .then(({ data }) => {
      records.value = data.records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  queryParams.keywords = '';
  handleQuery();
}

/** 行复选框选中  */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 加载角色下拉数据源 */
async function loadRoleOptions() {
  getRoleOptions().then((response) => {
    roleList.value = response.data;
  });
}

/**
 * 打开接口表单弹窗
 *
 * @param id 接口ID
 */
async function openDialog(id?: number) {
  dialog.visible = true;
  await loadRoleOptions()
  if (id) {
    dialog.title = "修改接口";
    getInterfaceForm(id).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增接口";
  }
}

/** 接口表单提交 */
function handleSubmit() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      loading.value = false;
      const dictTypeId = formData.id;
      if (dictTypeId) {
        updateInterface(dictTypeId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addInterface(formData)
          .then(() => {
            ElMessage.success("新增成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭接口弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/**  重置接口表单 */
function resetForm() {
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();

  formData.id = undefined;
}

/** 删除接口 */
function handleDelete(dictTypeId?: number) {
  const dictTypeIds = [dictTypeId || ids.value].join(",");
  if (!dictTypeIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteInterfaces(dictTypeIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
