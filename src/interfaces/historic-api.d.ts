import { INameFileDataTableRowProps } from "./name-file-data-table-row";

export interface IHistoricApi extends INameFileDataTableRowProps {
  origen: string;
  dateAndHour: string;
}
