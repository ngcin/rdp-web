import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { AnnexVO, AnnexQuery, AnnexPage } from "./types";

/**
 * 获取附件
 *
 * @param queryParams
 */
export function pageAnnex(queryParams: AnnexQuery): AxiosPromise<AnnexPage> {
  return request({
    url: "/api/v1/annexes",
    method: "get",
    params: queryParams
  });
}

/**
 * 删除模块
 *
 * @param ids
 */
export function deleteAnnexs(ids: string) {
  return request({
    url: "/api/v1/annexes/" + ids,
    method: "delete",
  });
}
