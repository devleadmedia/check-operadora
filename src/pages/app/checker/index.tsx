import { useState } from "react";
import { ArrowLeft, Check, ChevronsRight, File, Loader2 } from "lucide-react";

import { useCheckerController } from "./controllers/checker-controller";
import { DataTableChecker } from "./components/data-table-checker";
import { NameFileDataTableRow } from "./components/name-file-data-table-row";
import { Button } from "@/components/ui/button";
import { PhoneQuery } from "./components/phone-query";

import { CheckerFile } from "@/services/checker";
import { useDownloadSheet } from "@/hooks/use-download-sheet";

export function Checker() {
  const {
    listCheckers,
    totalCount,
    currentPage,
    currentPageSize,
    isLoadingChecker,
    setPage,
    setPageSize,
    queryKey,
    status,
  } = useCheckerController();
  const { downloadAndProcessSheet, sheetData, reset } = useDownloadSheet();
  const [selectedItem, setSelectedItem] = useState<CheckerFile | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleBack = () => {
    reset();

    setShowDetails(false);
    setSelectedItem(null);
  };

  const handleViewDetails = async (item: CheckerFile) => {
    reset();

    setSelectedItem(item);
    setShowDetails(true);

    if (item.s3_url) {
      await downloadAndProcessSheet(item.s3_url);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1">
          <button onClick={handleBack} className="flex items-center gap-1">
            <Check size={16} />
            <p
              className={`${
                showDetails ? "text-sm font-normal" : "text-sm font-bold"
              }`}
            >
              Checker
            </p>
          </button>
          {showDetails && (
            <div className="flex items-center gap-1">
              <ChevronsRight size={16} />
              <div className="flex items-center gap-1">
                <File size={16} />
                <p className="text-sm font-bold">
                  {selectedItem?.original_file_name}
                </p>
              </div>
            </div>
          )}
        </div>

        {showDetails && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {showDetails ? (
          <NameFileDataTableRow data={sheetData} stats={selectedItem?.stats} />
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-start gap-1">
              <h4 className="text-sm">Consulta simples:</h4>

              <PhoneQuery />
            </div>
            <div className="flex flex-col items-start gap-1">
              <div className="flex flex-col items-start gap-1 mb-6">
                <div className="flex flex-col items-start gap-1">
                  <h4 className="text-sm dark:text-neutral-200">
                    Consulta em massa:
                  </h4>

                  <p className="text-xs text-neutral-400">
                    Clique no botão "Nova Planilha" e faça o upload do arquivo
                    com os números que você deseja checar.
                  </p>
                </div>
              </div>
              {isLoadingChecker ? (
                <>
                  <div className="flex items-center justify-center w-full">
                    <Loader2 size={24} className="animate-spin" />
                  </div>
                </>
              ) : (
                <DataTableChecker
                  data={listCheckers}
                  totalCount={totalCount}
                  currentPage={currentPage}
                  pageSize={currentPageSize}
                  onPageChange={setPage}
                  onPageSizeChange={setPageSize}
                  isLoading={isLoadingChecker}
                  onViewDetails={handleViewDetails}
                  status={status}
                  queryKey={queryKey}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
