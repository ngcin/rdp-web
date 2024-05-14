<!--数据表配置-->
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="name">
          <el-input v-model="queryParams.keywords" placeholder="表名/中文名" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"><i-ep-search />搜索</el-button>
          <el-button @click="resetQuery()"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button v-hasPerm="['sys:dict_type:add']" type="success" @click="openDialog()"><i-ep-plus />新增</el-button>
        <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
      </template>
      <el-table v-loading="loading" highlight-current-row :data="records" border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="表名" prop="tableName" width="350" />
        <el-table-column label="中文名称" prop="comment" />
        <el-table-column label="所属模块" prop="moduleName" width="150" />
        <el-table-column label="sheet索引" prop="sheetIndex" align="center" width="100" />
        <el-table-column label="起始行" prop="startRow" align="center" width="80" />
        <el-table-column label="序号" prop="serial" align="center" width="80" />
        <el-table-column fixed="right" label="操作" align="center" width="180">
          <template #default="scope">
            <el-button v-hasPerm="['sys:dict_type:edit']" type="primary" link size="small"
              @click.stop="openDialog(scope.row.id)"><i-ep-edit />编辑</el-button>
            <el-button v-hasPerm="['sys:dict_type:delete']" type="primary" link size="small"
              @click.stop="handleDelete(scope.row.id)"><i-ep-delete />删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="800px" @close="closeDialog">
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="80px">
        <el-form-item label="表名" prop="tableName">
          <el-input v-model="formData.tableName" placeholder="请输入表名" />
        </el-form-item>
        <el-form-item label="中文名称" prop="comment">
          <el-input v-model="formData.comment" placeholder="请输入中文名称" />
        </el-form-item>
        <el-form-item label="所属模块" prop="moduleId">
          <el-select v-model="formData.moduleId" placeholder="请选择模块">
            <el-option v-for="item in moduleList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="sheet索引" prop="sheetIndex">
          <el-input-number v-model="formData.sheetIndex" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="起始行" prop="startRow">
          <el-input-number v-model="formData.startRow" controls-position="right" :min="0" />
        </el-form-item>
        <el-form-item label="序号" prop="serial">
          <el-input-number v-model="formData.serial" controls-position="right" :min="0" />
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
  page,
  getMetaTableForm,
  addMetaTable,
  updateMetaTable,
  deleteMetaTables,
} from "@/api/dev/table";

import {
  getMetaModuleOptions
} from "@/api/dev/module";

import { MetaTableForm, MetaTableQuery, MetaTableVO } from "@/api/dev/table/types";

defineOptions({
  name: "MetaTable",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<MetaTableQuery>({
  pageNum: 1,
  pageSize: 10,
});

const records = ref<MetaTableVO[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<MetaTableForm>({
  status: 1,
});

const rules = reactive({
  name: [{ required: true, message: "请输入数据表配置名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入数据表配置编码", trigger: "blur" }],
});

const moduleList = ref<OptionType[]>(); // 模块下拉数据源
/** 查询 */
function handleQuery() {
  loading.value = true;
  page(queryParams)
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

/** 加载模块下拉数据源 */
async function loadModuleOptions() {
  getMetaModuleOptions().then((response) => {
    moduleList.value = response.data;
  });
}

/**
 * 打开数据表配置表单弹窗
 *
 * @param id 数据表配置ID
 */
async function openDialog(id?: number) {
  dialog.visible = true;
  await loadModuleOptions()
  if (id) {
    dialog.title = "修改数据表配置";
    getMetaTableForm(id).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增数据表配置";
  }
}

/** 数据表配置表单提交 */
function handleSubmit() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      loading.value = false;
      const dictTypeId = formData.id;
      if (dictTypeId) {
        updateMetaTable(dictTypeId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addMetaTable(formData)
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

/** 关闭数据表配置弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/**  重置数据表配置表单 */
function resetForm() {
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();

  formData.id = undefined;
  formData.status = 1;
}

/** 删除数据表配置 */
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
    deleteMetaTables(dictTypeIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
