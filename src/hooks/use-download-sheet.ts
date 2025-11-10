/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { toast } from "sonner";
import { Checker } from "@/services/checker";

export interface SheetRow {
  id: string;
  ddd: string;
  number: string;
  anatel: string;
  type: string;
  operatorOrigem: string;
  operatorNow: string;
  portate: boolean;
  datePortate: string;
  municipalityRegion: string;
  municipality: string;
  uf: string;
  M: string;
}

export function useDownloadSheet() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [sheetData, setSheetData] = useState<SheetRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const checker = new Checker();

  const downloadAndProcessSheet = async (fileId: string) => {
    if (!fileId) {
      toast.error("ID do arquivo não disponível");
      return [];
    }

    setIsDownloading(true);
    setError(null);

    try {
      toast.loading("Baixando planilha...");

      // 1. Fazer requisição para o backend buscar o arquivo
      const response = await checker.downloadFile(fileId);

      toast.dismiss();

      let jsonData: any[][];

      // O backend retorna CSV como string
      if (typeof response === "string") {
        // Parsear CSV manualmente
        const lines = response.split("\n").filter((line) => line.trim());
        jsonData = lines.map((line) => {
          // Split por ponto e vírgula (delimitador do CSV)
          return line.split(";").map((cell) => cell.trim());
        });
      } else {
        throw new Error(
          `Formato de resposta não suportado. Esperado string (CSV), recebido: ${typeof response}`
        );
      }

      // 3. Processar dados
      if (jsonData.length < 2) {
        toast.dismiss();
        toast.warning("Planilha vazia ou sem dados");
        return [];
      }

      // Primeira linha são os headers (já em português do backend)
      const headers = jsonData[0].map((h) => String(h).toLowerCase().trim());

      // Mapear índices das colunas (nomes em português do backend)
      const columnIndexes = {
        ddd: findColumnIndex(headers, ["ddd"]),
        numero: findColumnIndex(headers, ["telefone", "Telefone", "numero", "Numero", "número", "Número"]),
        anatel: findColumnIndex(headers, ["anatel"]),
        tipo: findColumnIndex(headers, ["tipo"]),
        operadora_original: findColumnIndex(headers, ["operadora original"]),
        operadora_atual: findColumnIndex(headers, ["operadora atual"]),
        portado: findColumnIndex(headers, ["portado"]),
        data_portabilidade: findColumnIndex(headers, [
          "data da portabilidade",
        ]),
        municipio: findColumnIndex(headers, ["município", "municipio"]),
        uf: findColumnIndex(headers, ["uf"]),
        M: findColumnIndex(headers, ["m", "fidelidade"]),
      };

      // Processar linhas de dados
      const processedData: SheetRow[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];

        // Pular linhas vazias
        if (!row || row.every((cell) => !cell)) continue;

        const ddd = getCellValue(row, columnIndexes.ddd);
        const numero = getCellValue(row, columnIndexes.numero);

        // Pular se não tiver número
        if (!numero) continue;

        processedData.push({
          id: `${i}`,
          ddd: ddd || "-",
          number: numero,
          anatel: getCellValue(row, columnIndexes.anatel) || "-",
          type: getCellValue(row, columnIndexes.tipo) || "-",
          operatorOrigem:
            getCellValue(row, columnIndexes.operadora_original) || "-",
          operatorNow: getCellValue(row, columnIndexes.operadora_atual) || "-",
          portate: parsePortado(getCellValue(row, columnIndexes.portado)),
          datePortate: formatDate(
            getCellValue(row, columnIndexes.data_portabilidade)
          ),
          municipalityRegion: getCellValue(row, columnIndexes.municipio) || "-",
          municipality: getCellValue(row, columnIndexes.municipio) || "-",
          uf: getCellValue(row, columnIndexes.uf) || "-",
          M: getCellValue(row, columnIndexes.M) || "-",
        });
      }

      setSheetData(processedData);
      toast.dismiss();
      toast.success(`${processedData.length} registros carregados`);

      return processedData;
    } catch (err) {
      console.error("Erro ao processar planilha:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar planilha";
      setError(errorMessage);
      toast.dismiss();
      toast.error(errorMessage);
      return [];
    } finally {
      setIsDownloading(false);
    }
  };

  const reset = () => {
    setSheetData([]);
    setError(null);
  };

  return {
    downloadAndProcessSheet,
    isDownloading,
    sheetData,
    error,
    reset,
  };
}

// ============= Funções auxiliares =============

/**
 * Encontra o índice da coluna pelos possíveis nomes
 */
function findColumnIndex(headers: string[], possibleNames: string[]): number {
  for (const name of possibleNames) {
    const index = headers.findIndex((h) => h.includes(name));
    if (index !== -1) return index;
  }
  return -1;
}

/**
 * Obtém valor da célula de forma segura
 */
function getCellValue(row: any[], index: number): string {
  if (index === -1 || !row[index]) return "";
  return String(row[index]).trim();
}

/**
 * Parse do campo portado (pode vir como "sim", "true", "1", etc)
 */
function parsePortado(value: string): boolean {
  if (!value) return false;

  const normalized = value.toLowerCase().trim();
  return (
    normalized === "sim" ||
    normalized === "true" ||
    normalized === "1" ||
    normalized === "yes"
  );
}

/**
 * Formata data para o padrão brasileiro
 */
function formatDate(dateStr: string): string {
  if (!dateStr || dateStr === "-") return "-";

  try {
    // Tenta parsear diferentes formatos
    const date = new Date(dateStr);

    if (isNaN(date.getTime())) return dateStr; // Se não for data válida, retorna como está

    return date.toLocaleString("pt-BR", {
      year: "2-digit",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: undefined,
    });
  } catch {
    return dateStr;
  }
}