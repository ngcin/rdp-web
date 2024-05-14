import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { InterfaceForm, InterfaceVO, InterfaceQuery, InterfacePage } from "./types";

/**
 * 获取接口数据
 *
 * @param queryParams
 */
export function pageInterface(queryParams: InterfaceQuery): AxiosPromise<InterfacePage> {
  return request({
    url: "/api/v1/system-interfaces",
    method: "get",
    params: queryParams
  });
}


/**
 * 获取接口详情
 *
 * @param id
 */
export function getInterfaceForm(id: number): AxiosPromise<InterfaceForm> {
  return request({
    url: "/api/v1/system-interfaces/" + id,
    method: "get",
  });
}

/**
 * 添加接口
 *
 * @param data
 */
export function addInterface(data: InterfaceForm) {
  return request({
    url: "/api/v1/system-interfaces",
    method: "post",
    data: data,
  });
}

/**
 * 更新接口
 *
 * @param id
 * @param data
 */
export function updateInterface(id: number, data: InterfaceForm) {
  return request({
    url: "/api/v1/system-interfaces",
    method: "put",
    data: data,
  });
}

/**
 * 删除接口
 *
 * @param ids
 */
export function deleteInterfaces(ids: string) {
  return request({
    url: "/api/v1/system-interfaces/" + ids,
    method: "delete",
  });
}
