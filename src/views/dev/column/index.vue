<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- table树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <el-collapse v-model="activeName" accordion>
          <el-collapse-item v-for="mod in moduleTreeList" :title="mod.name + '(' + mod.total + ')'" :name="mod.id">
            <div class="table-row" v-for="tb in mod.tables" :class="{ active: activeTableId == tb.id }"
              @click="handleSelectTable(tb.id)">
              {{ tb.tableName }}
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-col>

      <!-- column列表 -->
      <el-col :lg="20" :xs="24">
        <el-card shadow="never" class="table-container">
          <template #header>
            <el-button v-hasPerm="['sys:dict_type:add']" type="success"
              @click="syncColumn(0)"><i-ep-refresh />同步新加字段</el-button>
            <el-button v-hasPerm="['sys:dict_type:add']" type="success"
              @click="syncColumn(1)"><i-ep-refresh />全量同步</el-button>
            <el-button v-hasPerm="['sys:dict_type:add']" type="primary"
              @click="generateTableCode()"><i-ep-tickets />代码生成</el-button>
            <el-button type="danger" :disabled="ids.length === 0" @click="handleDelete()"><i-ep-delete />删除</el-button>
          </template>
          <el-table v-loading="loading" highlight-current-row :data="records" border
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="name" align="center" sortable label="列名" width="150" />
            <el-table-column prop="comment" show-overflow-tooltip label="注释" width="180" />
            <el-table-column prop="cellIndex" align="center" sortable label="单元格序号" width="120" />
            <el-table-column prop="dataType" align="center" label="数据类型" width="110" />
            <el-table-column prop="length" align="center" label="长度限制" width="110" />
            <el-table-column prop="component" align="center" label="组件" width="110" />
            <el-table-column prop="format" align="center" label="数据格式(日期)" width="150" />
            <el-table-column prop="required" align="center" sortable label="必填" width="80">
              <template #default="scope">
                {{ scope.row.required ? '是' : '否' }}
              </template>
            </el-table-column>
            <el-table-column prop="queryMode" align="center" label="查询方式" width="120" />
            <el-table-column prop="allowValue" show-overflow-tooltip label="允许的内容列表" min-width="150" />

            <el-table-column fixed="right" label="操作" align="center" width="150">
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
      </el-col>
    </el-row>

    <el-dialog v-model="dialog.visible" :title="dialog.title" width="800px" @close="closeDialog">
      <el-form ref="dataFormRef" :model="formData" :rules="rules" label-width="120px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="列名" prop="name" verify>
              <el-input v-model="formData.name" placeholder="列名" clearable></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="是否必填" prop="required">
              <el-switch v-model="formData.required"></el-switch>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="数据类型" prop="dataType">
              <el-input v-model="formData.dataType" placeholder="数据类型"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="数据长度" prop="length">
              <el-input-number v-model="formData.length" :min="0" :style="{ 'width': '100%' }"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="单元格索引" prop="cellIndex" verify>
              <el-input-number v-model="formData.cellIndex" :min="0" :style="{ 'width': '100%' }"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="查询方式" prop="queryMode">
              <el-select v-model="formData.queryMode" placeholder="请选查询方式" :style="{ width: '100%' }">
                <el-option v-for="item in queryModes" :key="item" :label="item" :value="item" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="UI组件" prop="component">
          <el-select v-model="formData.component" placeholder="UI组件" :style="{ width: '100%' }">
            <el-option v-for="item in components" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="中文注释" prop="comment">
          <el-input v-model="formData.comment" placeholder="注释" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="数据格式(日期)" prop="format">
          <el-select v-model="formData.format" placeholder="数据格式(日期)" :style="{ width: '100%' }">
            <el-option v-for="item in dateFormats" :key="item" :label="item" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="允许的内容列表" prop="allowValue">
          <el-input v-model="formData.allowValue" placeholder="允许的内容列表，逗号分割" type="textarea"></el-input>
        </el-form-item>

      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>


    <el-dialog v-model="codeDialog.visible" title="代码" top="1vh" width="60%" append-to-body class="scrollbar"
      @close="closeCodeDialog">
      <div>
        <el-link :underline="false" icon="DocumentCopy" v-copyText="value" v-copyText:callback="copyTextSuccess"
          style="float:right">&nbsp;复制</el-link>
        <hljsVuePlugin.component :code="codeContent" />
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {
  getModuleTree,
} from "@/api/dev/module";

import { ModuleTree } from "@/api/dev/module/types";

import {
  pageColumn,
  getMetaColumnForm,
  syncMetaColumn,
  updateMetaColumn,
  deleteMetaColumns,
  generateCode,
} from "@/api/dev/column";

import { MetaColumnForm, MetaColumnVO, MetaColumnQuery } from "@/api/dev/column/types";

import 'highlight.js/styles/stackoverflow-light.css'
import 'highlight.js/lib/common';
import hljsVuePlugin from "@highlightjs/vue-plugin";


defineOptions({
  name: "MetaColumn",
  inheritAttrs: false,
});

const queryModes = ['like', 'equals', 'gt', 'lt', 'multiSelect', 'in']
const dateFormats = ['YYYY-MM-DD', 'YYYY-MM-DD HH:mm:ss', 'YYYY']
const components = ['input', 'input-number', 'select', 'switch', 'date']

const activeName = ref('1')
const moduleTreeList = ref<ModuleTree[]>(); // 模块下拉数据源
const activeTableId = ref(1)

const queryFormRef = ref(ElForm);
const dataFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<MetaColumnQuery>({
  pageNum: 1,
  pageSize: 13,
  tableId: 1
});

const dialog = reactive({
  title: "",
  visible: false,
});

const formData = reactive<MetaColumnForm>({});

const rules = reactive({
  name: [{ required: true, message: "请输入数据列配置名称", trigger: "blur" }],
  code: [{ required: true, message: "请输入数据列配置编码", trigger: "blur" }],
});

const records = ref<MetaColumnVO[]>();
/** 查询 */
function handleQuery() {
  loading.value = true;
  pageColumn(queryParams)
    .then(({ data }) => {
      records.value = data.records;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

function syncColumn(type: number) {
  syncMetaColumn(queryParams.tableId, type)
    .then(() => {
      ElMessage.success("同步成功");
      handleQuery();
    })
}

/************code generate */
const codeDialog = reactive({
  visible: false
})

const codeContent = ref('')

function generateTableCode() {
  codeDialog.visible = true
  generateCode(queryParams.tableId)
    .then((response) => {
      codeContent.value = response.data
    })
}

function closeCodeDialog() {
  codeDialog.visible = false;
}
/**
 * 重置查询
 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  handleQuery();
}

/** 行复选框选中  */
function handleSelectionChange(selection: any) {
  ids.value = selection.map((item: any) => item.id);
}

/**
 * 打开数据列配置表单弹窗
 *
 * @param id 数据列配置ID
 */
function openDialog(id?: number) {
  if (!id) return;
  dialog.visible = true;
  dialog.title = "修改数据列配置";
  getMetaColumnForm(id).then(({ data }) => {
    Object.assign(formData, data);
  });
}

/** 数据列配置表单提交 */
function handleSubmit() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      loading.value = false;
      const dictTypeId = formData.id;
      if (dictTypeId) {
        updateMetaColumn(dictTypeId, formData)
          .then(() => {
            ElMessage.success("修改成功");
            closeDialog();
            handleQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}

/** 关闭数据列配置弹窗 */
function closeDialog() {
  dialog.visible = false;
  resetForm();
}

/**  重置数据列配置表单 */
function resetForm() {
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();

  formData.id = undefined;
}

/** 删除数据列配置 */
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
    deleteMetaColumns(dictTypeIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

function handleSelectTable(id: number) {
  activeTableId.value = id
  queryParams.tableId = id
  handleQuery();
}
onMounted(() => {
  getModuleTree().then((response) => {
    moduleTreeList.value = response.data
    if (response.data) {
      const dt = response.data
      if (dt[0] && dt[0].tables) {
        activeName.value = dt[0].id
        handleSelectTable(dt[0].tables[0].id)
      }
    }
  })
});
</script>

<style scoped>
.table-row {
  display: block;
  font-weight: 500;
  cursor: pointer;
  padding: 5px 16px;
}

.active {
  font-weight: 600;
  color: #2472c8;
  background-color: #eff3f8;
  border-right: 2px solid #2472c8;
}

.el-dialog__body {
  height: 70vh;
  overflow: auto;
}

.el-dialog__wrapper.scrollbar .el-dialog .el-dialog__body {
  overflow: auto;
  overflow-x: hidden;
  max-height: 70vh;
  padding: 10px 20px 0;
}
</style>