/**
 * 数据表form对象
 */
export interface MetaTableForm {
  id?: number;
  comment?: string;
  tableName?: string;
  serial?: number;
  moduleId?: number;
  startRow?: number;
  sheetIndex?: number;
}


/**
 * 数据表对象
 */
export interface MetaTableVO {
  id?: number;
  comment?: string;
  tableName?: string;
  serial?: number;
  moduleId?: number;
  startRow?: number;
  sheetIndex?: number;
  moduleName?: string;
}


/**
 * 数据表查询参数
 */
export interface MetaTableQuery extends PageQuery {
  /**
   * 关键词
   */
  keywords?: string;
  /**
   * 模块
   */
  moduleId?: number;
}