/**
 * 数据表form对象
 */
export interface MetaColumnForm {
  id?: number;
  tableId?: number;
  comment?: string;
  name?: string;
  cellIndex?: number;
  length?: number;
  dataType?: string;
  format?: string;
  //允许的内容列表，逗号分割
  allowValue?: string;
  //是否必填
  required?: boolean;
  queryMode?: string;
  //组件
  component?: string;
}


export interface MetaColumnVO {
  id?: number;
  tableId?: number;
  tableName?: string;
  comment?: string;
  name?: string;
  cellIndex?: number;
  length?: number;
  dataType?: string;
  format?: string;
  //允许的内容列表，逗号分割
  allowValue?: string;
  //是否必填
  required?: boolean;
  queryMode?: string;
  //组件
  component?: string;
}


/**
 * 数据表查询参数
 */
export interface MetaColumnQuery extends PageQuery {
  /**
   * 关键词
   */
  keywords?: string;
  /**
   * 模块
   */
  tableId: number;
}