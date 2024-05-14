<!--数据表配置-->
<template>
  <div class="app-container">
    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button type="success" @click="openDialog()"><i-ep-plus />新增</el-button>
        <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
      </template>
      <el-table v-loading="loading" highlight-current-row :data="records" border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="表名" prop="tableName" width="350" />
        <el-table-column label="中文名称" prop="comment" />
        <el-table-column label="包名" prop="packageName" width="350" />
        <el-table-column label="实体名称" prop="domainName" align="center" width="200" />
        <el-table-column label="作者" prop="author" align="center" width="150" />
        <el-table-column fixed="right" label="操作" align="center" width="220">
          <template #default="scope">
            <el-button type="primary" link size="small"
              @click.stop="openCodeDialog(scope.row.id)"><i-ep-cpu />代码生成</el-button>
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

    <!-- <el-dialog v-model="codeDialog.visible" title="代码生成" top="5vh" append-to-body class="scrollbar" width="80%"
      @close="closeCodeDialog">
      <hljsVuePlugin.component :code="code" />
    </el-dialog> -->

    <el-dialog title="代码" v-model="codeDialog.visible" width="80%" top="5vh" append-to-body class="scrollbar"
      @close="closeCodeDialog">
      <!-- <div>{{ codeInfo?.types }}</div> -->
      <el-tabs v-model="activeName">
        <el-tab-pane v-for="(value, key) in codeInfo" :label="key" :name="key" :key="key">
          <el-link :underline="false" icon="DocumentCopy" v-copyText="value" v-copyText:callback="copyTextSuccess"
            style="float:right">&nbsp;复制</el-link>
          <hljsVuePlugin.component :code="value" />
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  pageGenerationConfig,
  getGenerationConfigForm,
  addGenerationConfig,
  updateGenerationConfig,
  deleteGenerationConfigs,
  generateCode
} from "@/api/dev/code";

import { CodeInfo, GenerationConfig, GenerationConfigQuery } from "@/api/dev/code/types";

import 'highlight.js/styles/stackoverflow-light.css'
import 'highlight.js/lib/common';
import hljsVuePlugin from "@highlightjs/vue-plugin";

defineOptions({
  name: "GenerationConfig",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<GenerationConfigQuery>({
  pageNum: 1,
  pageSize: 10,
});

const records = ref<GenerationConfig[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<GenerationConfig>({
});

const rules = reactive({
  name: [{ required: true, message: "请输入数据表配置名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入数据表配置编码", trigger: "blur" }],
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  pageGenerationConfig(queryParams)
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


/**
 * 打开数据表配置表单弹窗
 *
 * @param id 数据表配置ID
 */
async function openDialog(id?: number) {
  dialog.visible = true;
  if (id) {
    dialog.title = "修改数据表配置";
    getGenerationConfigForm(id).then(({ data }) => {
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
      const dataId = formData.id;
      if (dataId) {
        updateGenerationConfig(dataId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addGenerationConfig(formData)
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
}

/** 删除数据表配置 */
function handleDelete(dataId?: number) {
  const dataIds = [dataId || ids.value].join(",");
  if (!dataIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteGenerationConfigs(dataIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}


/*****************code dialog */
const codeDialog = reactive({
  visible: false,
});
const activeName = ref('controller')
const codeInfo = ref<CodeInfo>();
function openCodeDialog(id?: number) {
  codeDialog.visible = true
  generateCode(id).then(({ data }) => {
    codeInfo.value = data
  })
}

function closeCodeDialog() {
  codeDialog.visible = false
}
function copyTextSuccess() {
  ElMessage.success("复制成功");
}
onMounted(() => {
  handleQuery();
});
</script>

<style lang="css">
/* .el-dialog__wrapper.scrollbar .el-dialog .el-dialog__body {
  overflow: auto;
  overflow-x: hidden;
  max-height: 70vh;
  padding: 10px 20px 0;
} */
/* .el-dialog__body {
  height: 70vh;
  overflow: auto;
} */
</style>