export interface INameFileDataTableRowProps {
  id?: string;
  ddd?: string;
  number?: string;
  anatel?: "valid" | "invalied";
  operatorOrigem?: string;
  operatorNow?: string;
  datePortate?: string;
  portate?: boolean;
  type?: "moveis" | "fixos";
  municipalityRegion?: string;
  municipality?: string;
  uf?: string;
}
