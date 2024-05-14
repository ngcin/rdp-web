
/**
 * 数据表对象
 */
export interface AnnexVO {
  id?: number;
  name?: string;
  path?: string;
  size?: number;
  mimeType?: string;
  suffix?: string;
  access?: string;
  md?: string;
  module?: string;
  model?: string;
  field?: string;
}


/**
 * 数据表查询参数
 */
export interface AnnexQuery extends PageQuery {
  /**
   * 关键词
   */
  keywords?: string;
  /**
   * 模块
   */
  module?: string;
  /**
  * 对象
  */
  model?: string;
  /**
 * 字段
 */
  field?: string;
}

/**
 * 附件分页类型声明
 */
export type AnnexPage = Page<AnnexVO[]>;
