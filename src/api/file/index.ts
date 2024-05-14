import request from "@/utils/request";
import { AxiosPromise } from "axios";
import { FileInfo } from "./types";

/**
 * 上传文件
 *
 * @param file
 */
export function uploadFileApi(file: File): AxiosPromise<FileInfo> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("module", "system")
  formData.append("model", "annex")
  formData.append("field", "annex")
  return request({
    url: "/api/v1/annexes/upload",
    method: "post",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 删除文件
 *
 * @param filePath 文件完整路径
 */
export function deleteFileApi(filePath?: string) {
  return request({
    url: "/api/v1/files",
    method: "delete",
    params: { filePath: filePath },
  });
}
