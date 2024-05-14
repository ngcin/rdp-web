<template>
  <div class="app-container">
    <el-card shadow="never" class="table-container">
      <template #header>
        <el-button type="success" @click="openDialog()"><i-ep-plus />新增</el-button>
        <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
      </template>

      <el-table ref="dataTableRef" v-loading="loading" :data="roleList" highlight-current-row border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column label="模块名称" prop="name" min-width="100" />
        <el-table-column label="模块编码" prop="code" width="150" />

        <el-table-column label="排序" align="center" width="80" prop="serial" />

        <el-table-column fixed="right" label="操作" width="220">
          <template #default="scope">
            <el-button type="primary" size="small" link @click="openDialog(scope.row.id)">
              <i-ep-edit />编辑
            </el-button>
            <el-button type="primary" size="small" link @click="handleDelete(scope.row.id)">
              <i-ep-delete />删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 模块表单弹窗 -->
    <el-dialog v-model="dialog.visible" :title="dialog.title" width="500px" @close="closeDialog">
      <el-form ref="roleFormRef" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="模块名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入模块名称" />
        </el-form-item>

        <el-form-item label="模块编码" prop="code">
          <el-input v-model="formData.code" placeholder="请输入模块编码" />
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.serial" controls-position="right" :min="0" style="width: 100px" />
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
  getMetaModuleList,
  updateMetaModule,
  getMetaModuleForm,
  addMetaModule,
  deleteMetaModules,
} from "@/api/dev/module";

import { MetaModule } from "@/api/dev/module/types";

defineOptions({
  name: "MetaModule",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);
const roleFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);

const roleList = ref<MetaModule[]>();

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<MetaModule>({
  serial: 1,
  code: "",
  name: "",
});

const rules = reactive({
  name: [{ required: true, message: "请输入模块名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入模块编码", trigger: "blur" }],
});

interface CheckedRole {
  id?: number;
  name?: string;
}
let checkedRole: CheckedRole = reactive({});

/** 查询 */
function handleQuery() {
  loading.value = true;
  getMetaModuleList()
    .then(({ data }) => {
      roleList.value = data;
    })
    .finally(() => {
      loading.value = false;
    });
}
/** 重置查询 */
function resetQuery() {
  handleQuery();
}

/** 行checkbox 选中事件 */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/** 打开模块表单弹窗 */
function openDialog(roleId?: number) {
  dialog.visible = true;
  if (roleId) {
    dialog.title = "修改模块";
    getMetaModuleForm(roleId).then(({ data }) => {
      Object.assign(formData, data);
    });
  } else {
    dialog.title = "新增模块";
  }
}

/** 模块保存提交 */
function handleSubmit() {
  roleFormRef.value.validate((valid: any) => {
    if (valid) {
      loading.value = true;
      const roleId = formData.id;
      if (roleId) {
        updateMetaModule(roleId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        addMetaModule(formData)
          .then(() => {
            ElMessage.success("新增成功");
            closeDialog();
            resetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭表单弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/** 重置表单 */
function resetForm() {
  roleFormRef.value.resetFields();
  roleFormRef.value.clearValidate();

  formData.id = undefined;
  formData.serial = 1;
}

/** 删除模块 */
function handleDelete(roleId?: number) {
  const roleIds = [roleId || ids.value].join(",");
  if (!roleIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    loading.value = true;
    deleteMetaModules(roleIds)
      .then(() => {
        ElMessage.success("删除成功");
        resetQuery();
      })
      .finally(() => (loading.value = false));
  });
}

onMounted(() => {
  handleQuery();
});
</script>
