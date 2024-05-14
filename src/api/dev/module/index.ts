import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { MetaModule, ModuleTree } from "./types";

/**
 * 获取模块数据
 *
 * @param queryParams
 */
export function getMetaModuleList(): AxiosPromise<MetaModule> {
  return request({
    url: "/api/v1/meta-modules",
    method: "get"
  });
}

/**
 * 获取模块下拉数据
 *
 */
export function getMetaModuleOptions(): AxiosPromise<OptionType[]> {
  return request({
    url: "/api/v1/meta-modules/options",
    method: "get",
    params: null,
  });
}


/**
 * 获取模块详情
 *
 * @param id
 */
export function getMetaModuleForm(id: number): AxiosPromise<MetaModule> {
  return request({
    url: "/api/v1/meta-modules/" + id,
    method: "get",
  });
}

/**
 * 添加模块
 *
 * @param data
 */
export function addMetaModule(data: MetaModule) {
  return request({
    url: "/api/v1/meta-modules",
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
export function updateMetaModule(id: number, data: MetaModule) {
  return request({
    url: "/api/v1/meta-modules",
    method: "put",
    data: data,
  });
}

/**
 * 删除模块
 *
 * @param ids
 */
export function deleteMetaModules(ids: string) {
  return request({
    url: "/api/v1/meta-modules/" + ids,
    method: "delete",
  });
}

/**
 *  模块数据表两层树
 * @returns  
 */
export function getModuleTree(): AxiosPromise<ModuleTree[]> {
  return request({
    url: "/api/v1/meta-modules/trees",
    method: "get",
    params: null,
  });
}
