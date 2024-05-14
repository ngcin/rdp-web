/**
 * 代码生成配置对象
 */
export interface GenerationConfig {
  id?: number;
  comment?: string;
  tableName?: string;
  packageName?: string;
  domainName?: string;
  author?: string;
}

/**
 * 代码生成配置查询参数
 */
export interface GenerationConfigQuery extends PageQuery {
  /**
   * 关键词
   */
  keywords?: string;
}


/**
 * 代码生成配置对象
 */
export interface CodeInfo {
  domain?: string;
  mapper?: string;
  service?: string;
  serviceImpl?: string;
  controller?: string;
  mapperXml?: string;
  types?: string;
  apiIndex?: string;
  vue?: string;
}


export type GenerationConfigPage = Page<GenerationConfig[]>;
