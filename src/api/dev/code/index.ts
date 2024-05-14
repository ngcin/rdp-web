import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { GenerationConfig, GenerationConfigQuery, GenerationConfigPage, CodeInfo } from "./types";

/**
 * 获取代码生成配置数据
 *
 * @param queryParams
 */
export function pageGenerationConfig(queryParams: GenerationConfigQuery): AxiosPromise<GenerationConfigPage> {
  return request({
    url: "/api/v1/generation-configs",
    method: "get",
    params: queryParams
  });
}


/**
 * 获取代码生成配置详情
 *
 * @param id
 */
export function getGenerationConfigForm(id: number): AxiosPromise<GenerationConfig> {
  return request({
    url: "/api/v1/generation-configs/" + id,
    method: "get",
  });
}

/**
 * 添加代码生成配置
 *
 * @param data
 */
export function addGenerationConfig(data: GenerationConfig) {
  return request({
    url: "/api/v1/generation-configs",
    method: "post",
    data: data,
  });
}

/**
 * 更新代码生成配置
 *
 * @param id
 * @param data
 */
export function updateGenerationConfig(id: number, data: GenerationConfig) {
  return request({
    url: "/api/v1/generation-configs",
    method: "put",
    data: data,
  });
}

/**
 * 删除代码生成配置
 *
 * @param ids
 */
export function deleteGenerationConfigs(ids: string) {
  return request({
    url: "/api/v1/generation-configs/" + ids,
    method: "delete",
  });
}


/**
 * 代码生成
 *
 */
export function generateCode(id?: number): AxiosPromise<CodeInfo> {
  return request({
    url: "/api/v1/generation-configs/code/" + id,
    method: "post"
  });
}
