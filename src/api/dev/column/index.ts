import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { MetaColumnForm, MetaColumnVO, MetaColumnQuery } from "./types";

/**
 * 获取数据列数据
 *
 * @param queryParams
 */
export function pageColumn(queryParams: MetaColumnQuery): AxiosPromise<MetaColumnVO> {
  return request({
    url: "/api/v1/meta-columns",
    method: "get",
    params: queryParams
  });
}


/**
 * 获取数据列详情
 *
 * @param id
 */
export function getMetaColumnForm(id: number): AxiosPromise<MetaColumnForm> {
  return request({
    url: "/api/v1/meta-columns/" + id,
    method: "get",
  });
}

/**
 * 添加数据列
 *
 * @param data
 */
export function syncMetaColumn(tableId: number, type: number) {
  return request({
    url: "/api/v1/meta-columns/sync",
    method: "post",
    data: {
      tableId,
      type
    },
  });
}

/**
 * 更新数据列
 *
 * @param id
 * @param data
 */
export function updateMetaColumn(id: number, data: MetaColumnForm) {
  return request({
    url: "/api/v1/meta-columns",
    method: "put",
    data: data,
  });
}

/**
 * 删除数据列
 *
 * @param ids
 */
export function deleteMetaColumns(ids: string) {
  return request({
    url: "/api/v1/meta-columns/" + ids,
    method: "delete",
  });
}


/**
 * 代码生成
 *
 * @param data
 */
export function generateCode(tableId: number): AxiosPromise<string> {
  return request({
    url: "/api/v1/meta-columns/code/" + tableId,
    method: "post",
  });
}