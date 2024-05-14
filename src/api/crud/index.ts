import request from "@/utils/request";
import { AxiosPromise } from "axios";
/**
 * 获取模块数据
 *
 * @param queryParams
 */
export function pageData(queryParams: any): AxiosPromise<any> {
  return request({
    url: "/api/v1/crud-data/page",
    method: "get",
    params: queryParams
  });
}

/**
 * 获取模块数据
 *
 * @param queryParams
 */
export function getById(biz: string, id: any): AxiosPromise<any> {
  return request({
    url: "/api/v1/crud-data/" + biz + "/" + id,
    method: "get",
  });
}


/**
 * 添加模块
 *
 * @param data
 */
export function saveData(biz: string, data: any) {
  return request({
    url: "/api/v1/crud-data/" + biz,
    method: "post",
    data: data,
  });
}


/**
 * 删除模块
 *
 * @param ids
 */
export function deleteDatas(biz: string, ids: string) {
  return request({
    url: "/api/v1/crud-data/" + biz + "/" + ids,
    method: "delete",
  });
}


/**
 * 下载导入模板
 *
 * @returns
 */
export function downloadTemplate(biz: string) {
  return request({
    url: "/api/v1/crud-data/template/" + biz,
    method: "get",
    responseType: "arraybuffer",
  });
}

/**
 * 导出用户
 *
 * @param queryParams
 * @returns
 */
export function exportData(biz: string, queryParams: any) {
  return request({
    url: "/api/v1/crud-data/export/" + biz,
    method: "get",
    params: queryParams,
    responseType: "arraybuffer",
  });
}

/**
 * 导入用户
 *
 * @param file
 */
export function importExcelData(biz: string, file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return request({
    url: "/api/v1/crud-data/import/" + biz,
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
