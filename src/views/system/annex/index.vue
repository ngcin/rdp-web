<!--数据表配置-->
<template>
  <div class="app-container">
    <div class="search-container">
      <el-form ref="queryFormRef" :model="queryParams" :inline="true">
        <el-form-item label="关键字" prop="name">
          <el-input v-model="queryParams.keywords" placeholder="文件名" clearable @keyup.enter="handleQuery" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery()"><i-ep-search />搜索</el-button>
          <el-button @click="resetQuery()"><i-ep-refresh />重置</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="never" class="table-container">
      <el-table v-loading="loading" highlight-current-row :data="records" border
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="name" align="center" show-overflow-tooltip label="文件名" min-width="150" />
        <el-table-column prop="path" align="center" show-overflow-tooltip label="文件存储路径" min-width="150" />
        <el-table-column prop="size" align="center" show-overflow-tooltip label="文件大小" min-width="150" />
        <!-- <el-table-column prop="mimeType" align="center" show-overflow-tooltip label="文件类型" min-width="150" /> -->
        <el-table-column prop="suffix" align="center" show-overflow-tooltip label="文件后缀" min-width="150" />
        <el-table-column prop="access" align="center" show-overflow-tooltip label="文件访问id" min-width="150" />
        <el-table-column prop="md" align="center" show-overflow-tooltip label="文件编码" min-width="150" />
        <el-table-column prop="module" align="center" label="文件所属模块" min-width="150" />
        <el-table-column prop="model" align="center" label="文件所属类别" min-width="150" />
        <el-table-column prop="field" align="center" label="文件所属字段" min-width="150" />
        <el-table-column fixed="right" label="操作" align="center" width="80">
          <template #default="scope">
            <el-button type="primary" link size="small"
              @click.stop="handleDelete(scope.row.id)"><i-ep-delete />删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-if="total > 0" v-model:total="total" v-model:page="queryParams.pageNum"
        v-model:limit="queryParams.pageSize" @pagination="handleQuery" />
    </el-card>

  </div>
</template>

<script setup lang="ts">
import {
  pageAnnex,
  deleteAnnexs,
} from "@/api/system/annex";

import { AnnexVO, AnnexQuery } from "@/api/system/annex/types";

defineOptions({
  name: "AnnexTable",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm);

const loading = ref(false);
const ids = ref<number[]>([]);
const total = ref(0);

const queryParams = reactive<AnnexQuery>({
  pageNum: 1,
  pageSize: 10,
});

const records = ref<AnnexVO[]>();

/** 查询 */
function handleQuery() {
  loading.value = true;
  pageAnnex(queryParams)
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

/** 删除数据表配置 */
function handleDelete(id?: number) {
  const dataIds = [id || ids.value].join(",");
  if (!dataIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除已选中的数据项?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    deleteAnnexs(dataIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

onMounted(() => {
  handleQuery();
});
</script>
