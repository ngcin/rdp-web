
/**
 * 模块对象
 */
export interface MetaModule {
  /**
   * 模块编码
   */
  code?: string;

  /**
   * 模块ID
   */
  id?: number;
  /**
   * 模块名称
   */
  name?: string;
  /**
   * 排序号
   */
  serial?: number;
}


export interface ModuleTree {
  /**
   * 模块ID
   */
  id?: number;
  /**
   * 模块名称
   */
  name?: string;
  total?: number;
  tables?: TableItem[];
}


export interface TableItem {
  /**
  * 表ID
  */
  id?: number;
  /**
   * 表中文
   */
  comment?: string;

  /**
   * 表名称
   */
  tableName?: string;
}