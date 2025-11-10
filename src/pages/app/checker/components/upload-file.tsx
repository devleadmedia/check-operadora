/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Upload,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useFileUpload } from "@/hooks/use-file-upload";
import { useSheet } from "@/hooks/useSheet";

export function UploadFile() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [type, setType] = useState<"portabilidade">("portabilidade");
  const [fileInfo, setFileInfo] = useState<{
    name: string;
    size: string;
    rows: number;
    sheets: string[];
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState(false);

  const { uploadFile, isUploading } = useFileUpload();
  const { importXLSX } = useSheet();

  // Configurações de validação
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const ALLOWED_TYPES = [
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.ms-excel",
    "text/csv",
    "text/plain",
  ];
  const ALLOWED_EXTENSIONS = [".xlsx", ".txt", ".xls", ".csv"];

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    const extension = "." + file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return "Tipo de arquivo não suportado. Use apenas .xlsx, .xls ou .csv";
    }

    if (!ALLOWED_TYPES.includes(file.type) && file.type !== "") {
      return "Formato de arquivo inválido";
    }

    if (file.size > MAX_FILE_SIZE) {
      return `Arquivo muito grande. Tamanho máximo: ${formatFileSize(
        MAX_FILE_SIZE
      )}`;
    }

    return null;
  };

  const analyzeFile = async (file: File) => {
    setIsAnalyzing(true);
    setError("");

    try {
      const arrayBuffer = await file.arrayBuffer();
      let workbook: XLSX.WorkBook;
      let totalRows = 0;
      let sheets: string[] = [];

      if (file.name.endsWith(".csv")) {
        const data = new Uint8Array(arrayBuffer);
        const text = new TextDecoder().decode(data);
        const lines = text.split("\n").filter((line) => line.trim() !== "");
        totalRows = Math.max(0, lines.length - 1);
        sheets = ["Sheet1"];
      } else {
        workbook = XLSX.read(arrayBuffer);
        sheets = workbook.SheetNames;

        sheets.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          const nonEmptyRows = jsonData.filter(
            (row) =>
              Array.isArray(row) &&
              row.some(
                (cell) => cell !== null && cell !== undefined && cell !== ""
              )
          );
          totalRows += Math.max(0, nonEmptyRows.length - 1);
        });
      }

      setFileInfo({
        name: file.name,
        size: formatFileSize(file.size),
        rows: totalRows,
        sheets: sheets,
      });
    } catch (err) {
      console.error("Erro ao analisar arquivo:", err);
      setError(
        "Erro ao processar o arquivo. Verifique se não está corrompido."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setSelectedFile(null);
      setFileInfo(null);
      setError("");
      return;
    }

    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      setSelectedFile(null);
      setFileInfo(null);
      return;
    }

    setSelectedFile(file);
    await analyzeFile(file);
  };

  // Função para baixar o arquivo processado
  // const downloadProcessedFile = (file: File) => {
  //   const url = URL.createObjectURL(file);
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = file.name;
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  //   URL.revokeObjectURL(url);
  // };

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setError("");

      // Converter o arquivo usando useSheet
      const convertedData = await importXLSX(selectedFile);

      if (!convertedData || convertedData.length === 0) {
        setError("Não foi possível processar o arquivo");
        return;
      }

      // Extrair os dados da primeira planilha
      const firstSheet = convertedData[0];
      const data = firstSheet.data;

      // Validar se tem dados
      if (!data || data.length === 0) {
        setError("O arquivo está vazio");
        return;
      }

      // Encontrar a coluna de números/telefones
      const phoneNumbers: string[] = [];
      data.forEach((row: any) => {
        const phoneValue =
          row["Número"] ||
          row["Numero"] ||
          row["numero"] ||
          row["Telefone"] ||
          row["telefone"];

        if (phoneValue) {
          phoneNumbers.push(String(phoneValue).trim());
        }
      });

      if (phoneNumbers.length === 0) {
        setError(
          'Nenhum número encontrado. Certifique-se de que a coluna tem o título "Número" ou "Telefone"'
        );
        return;
      }

      // Se o arquivo original for XLSX ou XLS, converter para CSV
      let processedFile: File;

      if (
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls")
      ) {
        // Criar CSV com os números (header sem acento e minúsculo)
        const csvContent = ["numero", ...phoneNumbers].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });

        // Mudar extensão para .csv
        const originalName = selectedFile.name
          .split(".")
          .slice(0, -1)
          .join(".");
        processedFile = new File([blob], `${originalName}.csv`, {
          type: "text/csv",
        });
      } else {
        // Se já for CSV, manter como está
        const csvContent = ["numero", ...phoneNumbers].join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        processedFile = new File([blob], selectedFile.name, {
          type: "text/csv",
        });
      }

      // BAIXAR O ARQUIVO PROCESSADO NO PC
      // downloadProcessedFile(processedFile);

      // Enviar o arquivo processado
      uploadFile(
        { file: processedFile, type },
        {
          onSuccess: () => {
            resetForm();
            setOpen(false);
          },
          onError: (error: any) => {
            setError(
              error?.response?.data?.error ||
                error?.message ||
                "Erro ao fazer upload do arquivo"
            );
          },
        }
      );
    } catch (err: any) {
      console.error("Erro ao processar arquivo:", err);
      setError(err?.message || "Erro ao processar o arquivo");
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
    setFileInfo(null);
    setError("");
    setType("portabilidade");
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          className="flex items-center gap-1 text-white bg-[#8ac850] hover:bg-[#5e8e33] dark:bg-[#8ac850] dark:hover:bg-[#5e8e33]"
        >
          <Upload size={16} />
          Nova Planilha
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Upload de Planilha
          </DialogTitle>
          <DialogDescription>
            IMPORTANTE seguir as instruções abaixo!
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-lg border bg-muted/50 p-3 mb-4">
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                A plataforma aceita arquivos em XLSX, TXT, XLS e CSV tamanho
                máximo: {formatFileSize(MAX_FILE_SIZE)}
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                A coluna deve ter o título "Número" ou "Telefone" na linha 1
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>
                Outras colunas serão ignoradas, apenas a primeira com o título
                correto será processada
              </span>
            </li>
            <li className="flex gap-2">
              <span className="text-primary">•</span>
              <span>Se estiver com dúvidas, baixe o arquivo de exemplo</span>
            </li>
          </ul>
        </div>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="upload-sheet">Selecionar Planilha</Label>
            <Input
              type="file"
              id="upload-sheet"
              accept=".xlsx,.xls,.csv"
              onChange={handleFileChange}
              disabled={isAnalyzing || isUploading}
            />
          </div>

          {isAnalyzing && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>Analisando arquivo...</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {fileInfo && !error && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p>
                    <strong>Arquivo:</strong> {fileInfo.name}
                  </p>
                  <p>
                    <strong>Tamanho:</strong> {fileInfo.size}
                  </p>
                  <p>
                    <strong>Linhas de dados:</strong>{" "}
                    {fileInfo.rows.toLocaleString()}
                  </p>
                  <p>
                    <strong>Planilhas:</strong> {fileInfo.sheets.join(", ")}
                  </p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {isUploading && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Enviando arquivo para processamento...
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" disabled={isUploading}>
              Cancelar
            </Button>
          </DialogClose>
          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !!error || isAnalyzing || isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Enviando...
              </>
            ) : (
              "Confirmar Upload"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
