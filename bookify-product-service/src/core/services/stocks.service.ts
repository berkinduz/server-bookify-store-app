import { Stock } from "../types";
import { STOCK_TABLE_NAME } from "../util/globals";
import { BaseService } from "./base.service";

export class StocksService extends BaseService<Stock> {
  protected override tableName: string = STOCK_TABLE_NAME;
  constructor() {
    super();
  }
}
