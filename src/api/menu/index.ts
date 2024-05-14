import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { MenuQuery, MenuVO, MenuForm } from "./types";

/**
 * 获取路由列表
 */
export function listRoutes() {
  return request({
    url: "/api/v1/resources/routes",
    method: "get",
  });
}

/**
 * 获取菜单树形列表
 *
 * @param queryParams
 */
export function listMenus(queryParams: MenuQuery): AxiosPromise<MenuVO[]> {
  return request({
    url: "/api/v1/resources",
    method: "get",
    params: queryParams,
  });
}

/**
 * 获取菜单下拉树形列表
 */
export function getMenuOptions(includeBtns: boolean): AxiosPromise<IdNameOption[]> {
  return request({
    url: "/api/v1/resources/options?includeBtns=" + includeBtns,
    method: "get",
  });
}

/**
 * 获取菜单表单数据
 *
 * @param id
 */
export function getMenuForm(id: number): AxiosPromise<MenuForm> {
  return request({
    url: "/api/v1/resources/" + id,
    method: "get",
  });
}

/**
 * 添加菜单
 *
 * @param data
 */
export function addMenu(data: MenuForm) {
  return request({
    url: "/api/v1/resources",
    method: "post",
    data: data,
  });
}

/**
 * 修改菜单
 *
 * @param id
 * @param data
 */
export function updateMenu(id: string, data: MenuForm) {
  return request({
    url: "/api/v1/resources",
    method: "put",
    data: data,
  });
}

/**
 * 删除菜单
 *
 * @param id 菜单ID
 */
export function deleteMenu(id: number) {
  return request({
    url: "/api/v1/resources/" + id,
    method: "delete",
  });
}
