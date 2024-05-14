/**
 * 接口form对象
 */
export interface InterfaceForm {
  id?: number;
  name?: string;
  requestMethod?: string;
  path?: string;
  roleIds?: string[];
}


/**
 * 接口对象
 */
export interface InterfaceVO {
  id?: number;
  name?: string;
  requestMethod?: string;
  path?: string;
  roleNames?: string;
}


/**
 * 接口查询参数
 */
export interface InterfaceQuery extends PageQuery {
  /**
   * 关键词
   */
  keywords?: string;
}

export type InterfacePage = Page<InterfaceVO[]>;
