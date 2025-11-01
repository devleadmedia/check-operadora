export interface ICheckerProps {
  id?: string;
  file?: string;
  datePortate?: string;
  upload?: "ok" | "erro";
  status?: "completed" | "processing" | "error";
  total?: string;
  invalid?: string;
  valid?: string;
  fixs?: string;
  moveis?: string;
  portate?: string;
  citys?: string;
  ddds?: string;
  uf?: string;
}
