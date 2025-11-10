import { useState } from "react";
import { Copy, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { usePhoneQuery } from "@/hooks/usePhoneQuery";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { formatPhoneNumber } from "@/utils/format-number";

export function PhoneQuery() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const { searchPhone, data, isLoading, hasResult, hasError, reset } =
    usePhoneQuery();

  const handleSearch = () => {
    if (!phoneNumber.trim()) {
      toast.error("Digite um número para consultar");
      return;
    }

    const cleanNumber = phoneNumber.replace(/\D/g, "");

    if (cleanNumber.length < 10 || cleanNumber.length > 11) {
      toast.error("Número inválido. Digite um número com DDD.");
      return;
    }

    reset();
    searchPhone(cleanNumber);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Dados copiados!");
  };

  const handleClearDataTable = () => {
    setPhoneNumber("");
    reset();
  };

  const formatRowData = () => {
    if (!data?.data) return "";

    const phoneData = data.data;
    const isPortado = phoneData.operadora_atual;

    let formattedData = `
Número: ${phoneData.numero}
Operadora Original: ${phoneData.operadora_original}`;

    if (isPortado) {
      formattedData += `
Operadora Atual: ${phoneData.operadora_atual}
Status: Portado
Data da Portabilidade: ${formatDate(phoneData.data_portabilidade)}`;
    } else {
      formattedData += `
Status: Não Portado`;
    }

    return formattedData.trim();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setPhoneNumber(formatted);
  };

  const extractDDD = (numero: string) => {
    if (!numero || numero.length < 10) return "-";
    return numero.substring(0, 2);
  };

  const result = data?.data;
  const isPortado = result && !!result.operadora_atual;

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Digite o número para consultar..."
          value={phoneNumber}
          onChange={handlePhoneChange}
          className="w-[250px] placeholder:text-xs"
          maxLength={15}
        />
        <Button
          type="button"
          onClick={handleSearch}
          className="flex items-center gap-2 text-white bg-[#8ac850] hover:bg-[#5e8e33] dark:bg-[#8ac850] dark:hover:bg-[#5e8e33]"
        >
          <Search size={16} />
          {isLoading ? "Consultando..." : "Consultar"}
        </Button>

        {(hasResult || hasError) && (
          <TooltipProvider delayDuration={0.5}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  variant={"outline"}
                  size={"icon"}
                  onClick={handleClearDataTable}
                >
                  <X size={16} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Limpar dados da consulta</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="bg-background/95 backdrop-blur">
                DDD
              </TableHead>
              <TableHead className="bg-background/95 backdrop-blur">
                Número
              </TableHead>
              <TableHead className="bg-background/95 backdrop-blur">
                Anatel
              </TableHead>
              <TableHead className="bg-background/95 backdrop-blur">
                Tipo
              </TableHead>
              <TableHead className="bg-background/95 backdrop-blur">
                Operadora de origem
              </TableHead>
              <TableHead className="bg-background/95 backdrop-blur">
                Operadora atual
              </TableHead>
              <TableHead className="bg-background/95 backdrop-blur">
                Portado
              </TableHead>
              <TableHead className="bg-background/95 backdrop-blur">
                Data Portabilidade
              </TableHead>
              <TableHead className="bg-background/95 backdrop-blur">
                Município de Registro
              </TableHead>
              <TableHead className="bg-background/95 backdrop-blur">
                UF
              </TableHead>
              <TableHead className="bg-background/95 backdrop-blur">
                M
              </TableHead>
              <TableHead className="text-right bg-background/95 backdrop-blur">
                Ações
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#8ac850] border-t-transparent rounded-full animate-spin" />
                    Consultando número...
                  </div>
                </TableCell>
              </TableRow>
            ) : hasError || data?.error ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="text-red-500">
                    {data?.error || "Erro ao consultar o número"}
                  </div>
                </TableCell>
              </TableRow>
            ) : result ? (
              <TableRow>
                <TableCell>
                  <p className="capitalize">{extractDDD(result.numero)}</p>
                </TableCell>
                <TableCell>
                  <p className="capitalize">{result.numero}</p>
                </TableCell>
                <TableCell>
                  <p className="capitalize">{data ? "Válido" : "Inválido"}</p>
                </TableCell>
                <TableCell>
                  <p className="capitalize">{result.tipo}</p>
                </TableCell>
                <TableCell>
                  <p className="capitalize">{result.operadora_original}</p>
                </TableCell>
                <TableCell>
                  <p className="capitalize">{result.operadora_atual || "-"}</p>
                </TableCell>
                <TableCell>
                  <p className="capitalize">{isPortado ? "Sim" : "Não"}</p>
                </TableCell>
                <TableCell className="capitalize">
                  <p className="capitalize">
                    {isPortado ? formatDate(result.data_portabilidade) : "-"}
                  </p>
                </TableCell>
                <TableCell>
                  <p className="capitalize">-</p>
                </TableCell>
                <TableCell>
                  <p className="capitalize">{result?.UF || '-'}</p>
                </TableCell>
                <TableCell>
                  <p className="capitalize">{result?.M || '-'}</p>
                </TableCell>
                <TableCell className="text-right">
                  <TooltipProvider delayDuration={0.5}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => handleCopy(formatRowData())}
                        >
                          <Copy size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Copiar dados da consulta</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-24 text-center text-muted-foreground"
                >
                  Digite um número e clique em "Consultar" para ver os
                  resultados
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
