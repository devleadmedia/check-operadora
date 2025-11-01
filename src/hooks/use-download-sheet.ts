/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

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
}

export function useDownloadSheet() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [sheetData, setSheetData] = useState<SheetRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const downloadAndProcessSheet = async (s3Url: string) => {
    if (!s3Url) {
      toast.error("URL da planilha não disponível");
      return [];
    }

    setIsDownloading(true);
    setError(null);

    try {
      // 1. Baixar o arquivo direto do S3
      const response = await fetch(s3Url, {
        method: "GET",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Erro ao baixar arquivo");
      }

      const blob = await response.blob();
      const arrayBuffer = await blob.arrayBuffer();

      // 2. Processar com XLSX
      const workbook = XLSX.read(arrayBuffer, { type: "array" });

      // Pegar a primeira planilha
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];

      // Converter para JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: "",
      }) as any[][];

      // 3. Processar dados
      if (jsonData.length < 2) {
        toast.warning("Planilha vazia ou sem dados");
        return [];
      }

      // Primeira linha são os headers
      const headers = jsonData[0].map((h) => String(h).toLowerCase().trim());

      // Mapear índices das colunas
      const columnIndexes = {
        ddd: findColumnIndex(headers, ["ddd"]),
        numero: findColumnIndex(headers, [
          "numero",
          "número",
          "telefone",
          "phone",
          "number",
        ]),
        anatel: findColumnIndex(headers, [
          "válido",
          "valido",
          "anatel",
          "status_anatel",
          "status anatel",
        ]),
        tipo: findColumnIndex(headers, ["tipo", "type"]),
        operadora_original: findColumnIndex(headers, [
          "operadora_original",
          "operadora original",
          "op_original",
          "operadora de origem",
        ]),
        operadora_atual: findColumnIndex(headers, [
          "operadora_atual",
          "operadora atual",
          "op_atual",
          "operadora",
        ]),
        portado: findColumnIndex(headers, ["portado", "portabilidade"]),
        data_portabilidade: findColumnIndex(headers, [
          "Portado",
          "portado",
          "data_portabilidade",
          "data portabilidade",
          "data",
          "date",
        ]),
        municipio: findColumnIndex(headers, [
          "municipio",
          "município",
          "cidade",
          "city",
          "municipio_registro",
        ]),
        municipio_regiao: findColumnIndex(headers, [
          "municipio_regiao",
          "município região",
          "regiao",
          "região",
        ]),
        uf: findColumnIndex(headers, ["uf", "estado", "state"]),
      };

      // Processar linhas de dados
      const processedData: SheetRow[] = [];

      for (let i = 1; i < jsonData.length; i++) {
        const row = jsonData[i];

        // Pular linhas vazias
        if (!row || row.every((cell) => !cell)) continue;

        const numero = getCellValue(row, columnIndexes.numero);

        // Pular se não tiver número
        if (!numero) continue;

        // Extrair DDD do número
        const ddd = extractDDD(numero, getCellValue(row, columnIndexes.ddd));

        processedData.push({
          id: `${i}`,
          ddd,
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
          municipalityRegion:
            getCellValue(row, columnIndexes.municipio_regiao) ||
            getCellValue(row, columnIndexes.municipio) ||
            "-",
          municipality: getCellValue(row, columnIndexes.municipio) || "-",
          uf: getCellValue(row, columnIndexes.uf) || "-",
        });
      }

      setSheetData(processedData);
      toast.success(`${processedData.length} registros carregados`);

      return processedData;
    } catch (err) {
      console.error("Erro ao processar planilha:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Erro ao processar planilha";
      setError(errorMessage);
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
 * Extrai DDD do número ou usa o valor da coluna DDD
 */
function extractDDD(numero: string, dddFromColumn?: string): string {
  // Se já tem DDD na coluna, usar ele
  if (dddFromColumn && dddFromColumn !== "-") {
    return dddFromColumn;
  }

  // Extrair dos 2 primeiros dígitos do número
  const cleanNumber = numero.replace(/\D/g, "");
  if (cleanNumber.length >= 10) {
    return cleanNumber.substring(0, 2);
  }

  return "-";
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
