<!--数据表配置-->
<template>
  <div class="app-container">
    <div class="search-container" v-if="searchable">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <slot name="search"></slot>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"><i-ep-search />搜索</el-button>
          <el-button @click="resetQuery()"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <template #header>
        <div class="flex justify-between">
          <div v-if="editable">
            <el-button v-hasPerm="['sys:dict_type:add']" type="success"
              @click="openDialog('form')"><i-ep-plus />新增</el-button>
            <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
          </div>
          <div>
            <el-dropdown split-button v-if="importable">
              导入
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="handDownloadTemplate">
                    <i-ep-download />下载模板</el-dropdown-item>
                  <el-dropdown-item @click="openDialog('import')">
                    <i-ep-top />导入数据</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-button class="ml-3" @click="handleExport" v-if="exportable"><template
                #icon><i-ep-download /></template>导出</el-button>
          </div>
        </div>
      </template>
      <el-table v-loading="loading" highlight-current-row :data="records" border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <slot name="table"></slot>
        <el-table-column fixed="right" label="操作" align="center" width="180" v-if="rowEditable">
          <template #default="scope">
            <el-button v-hasPerm="['sys:dict_type:edit']" type="primary" link size="small"
              @click.stop="openDialog('form', scope.row.id)"><i-ep-edit />编辑</el-button>
            <el-button v-hasPerm="['sys:dict_type:delete']" type="primary" link size="small"
              @click.stop="handleDelete(scope.row.id)"><i-ep-delete />删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryForm.pageNum"
        v-model:limit="queryForm.pageSize" @pagination="handleQuery" />
    </el-card>

    <el-dialog v-model="dialog.visible" :title="dialog.title" :width="dialog.width" @close="closeDialog">
      <el-form v-if="dialog.type === 'form'" ref="dataFormRef" :model="formData" :rules="rules" label-width="120px">
        <slot name="form"></slot>
      </el-form>

      <el-form v-else-if="dialog.type === 'import'" :model="importData" label-width="100px">
        <el-form-item label="Excel文件">
          <el-upload ref="uploadRef" action="" drag
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            :limit="1" :auto-upload="false" :file-list="importData.fileList" :on-change="handleFileChange"
            :on-exceed="handleFileExceed">
            <el-icon class="el-icon--upload">
              <i-ep-upload-filled />
            </el-icon>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
            <template #tip>
              <div>xls/xlsx files</div>
            </template>
          </el-upload>
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
  pageData,
  getById,
  saveData,
  deleteDatas,
  downloadTemplate,
  exportData,
  importExcelData
} from "@/api/crud";

import { genFileId } from "element-plus";
import type { UploadInstance } from "element-plus";

defineOptions({
  name: "CRUD",
  inheritAttrs: false,
});

const props = defineProps({
  name: {
    type: String
  },
  biz: {
    type: String
  },
  searchable: {
    type: Boolean,
    default: true
  },
  editable: {
    type: Boolean,
    default: true
  },
  rowEditable: {
    type: Boolean,
    default: true
  },
  importable: {
    type: Boolean,
    default: true
  },
  exportable: {
    type: Boolean,
    default: true
  },
})

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);
const uploadRef = ref<UploadInstance>(); // 上传组件


const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryForm = reactive({
  pageNum: 1,
  pageSize: 13,
})

const queryParams = defineModel()
const formData = defineModel("formData")
const rules = defineModel("rules")

const records = ref<any[]>();

const dialog = reactive({
  title: "",
  type: 'form',
  width: 1200,
  visible: false,
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  console.log(queryForm)
  let query: any = { ...queryForm }
  query.params = queryParams.value
  query.m = props.biz
  pageData(query)
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
async function openDialog(type: string, id?: number) {
  dialog.visible = true;
  dialog.type = type;

  if (dialog.type === "form") {
    if (id) {
      dialog.title = "修改" + props.name;
      getById(props.biz, id).then(({ data }) => {
        Object.assign(formData.value, data);
      });
    } else {
      dialog.title = "新增" + props.name;;
    }
  } else if (dialog.type === "import") {
    // 用户导入弹窗
    dialog.title = "导入" + props.name;
    dialog.width = 600
  }
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  if (dialog.type === "form") {
    dataFormRef.value.validate((isValid: boolean) => {
      if (isValid) {
        loading.value = false;
        const fd = formData.value
        saveData(props.biz, formData.value)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      }
    });
  } else if (dialog.type === "import") {
    if (!importData?.file) {
      ElMessage.warning("上传Excel文件不能为空");
      return false;
    }
    importExcelData(props.biz, importData?.file).then((response) => {
      ElMessage.success(response.data);
      closeDialog();
      resetQuery();
    });
  }
}, 3000);


/** 关闭数据表配置弹窗 */
function closeDialog() {
  dialog.visible = false;
  if (dialog.type === "form") {
    resetForm();
  } else if (dialog.type === "import") {
    importData.file = undefined;
    importData.fileList = [];
  }
}

/**  重置数据表配置表单 */
function resetForm() {
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
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
    deleteDatas(props.biz, dataIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

/****************import */
// 导入数据
const importData = reactive({
  file: undefined,
  fileList: [],
});

/** 下载导入模板 */
function handDownloadTemplate() {
  downloadTemplate(props.biz).then((response: any) => {
    const fileData = response.data;
    const fileName = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    );
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";

    const blob = new Blob([fileData], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  });
}

/** Excel文件 Change */
function handleFileChange(file: any) {
  importData.file = file.raw;
}

/** Excel文件 Exceed  */
function handleFileExceed(files: any) {
  uploadRef.value!.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
  importData.file = file;
}

/** 导出用户 */
function handleExport() {
  let query: any = { ...queryForm.value }
  query.params = queryParams.value
  query.m = props.biz
  exportData(props.biz, query).then((response: any) => {
    const fileData = response.data;
    const fileName = decodeURI(
      response.headers["content-disposition"].split(";")[1].split("=")[1]
    );
    const fileType =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";

    const blob = new Blob([fileData], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = downloadUrl;
    downloadLink.download = fileName;

    document.body.appendChild(downloadLink);
    downloadLink.click();

    document.body.removeChild(downloadLink);
    window.URL.revokeObjectURL(downloadUrl);
  });
}
onMounted(() => {
  handleQuery();
});
</script>
