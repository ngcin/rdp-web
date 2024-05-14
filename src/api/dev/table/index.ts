import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { MetaTableVO, MetaTableForm, MetaTableQuery } from "./types";

/**
 * 获取模块数据
 *
 * @param queryParams
 */
export function page(queryParams: MetaTableQuery): AxiosPromise<MetaTableVO> {
  return request({
    url: "/api/v1/meta-tables",
    method: "get",
    params: queryParams
  });
}


/**
 * 获取模块详情
 *
 * @param id
 */
export function getMetaTableForm(id: number): AxiosPromise<MetaTableForm> {
  return request({
    url: "/api/v1/meta-tables/" + id,
    method: "get",
  });
}

/**
 * 添加模块
 *
 * @param data
 */
export function addMetaTable(data: MetaTableForm) {
  return request({
    url: "/api/v1/meta-tables",
    method: "post",
    data: data,
  });
}

/**
 * 更新模块
 *
 * @param id
 * @param data
 */
export function updateMetaTable(id: number, data: MetaTableForm) {
  return request({
    url: "/api/v1/meta-tables",
    method: "put",
    data: data,
  });
}

/**
 * 删除模块
 *
 * @param ids
 */
export function deleteMetaTables(ids: string) {
  return request({
    url: "/api/v1/meta-tables/" + ids,
    method: "delete",
  });
}
