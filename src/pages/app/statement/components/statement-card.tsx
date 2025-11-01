import {
    ArrowUpCircle,
    ArrowDownCircle,
    RefreshCcw,
    Calendar,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { CreditMovementType } from "@/enums/CreditMovementType.enum";
import { IStatement } from "@/interfaces/statement/IStatement.type";
import { moneyFormat } from "@/utils/money.util";

interface StatementCardProps {
    statement: IStatement;
}

export function StatementCard({ statement }: StatementCardProps): JSX.Element {
    const getTypeLabel = (type: CreditMovementType): string => {
        switch (type) {
            case CreditMovementType.add:
                return "Adição";
            case CreditMovementType.remove:
                return "Remoção";
            case CreditMovementType.refund:
                return "Reembolso";
            default:
                return type;
        }
    };

    const getTypeColor = (type: CreditMovementType): string => {
        switch (type) {
            case CreditMovementType.add:
                return "text-green-600 dark:text-green-400";
            case CreditMovementType.remove:
                return "text-red-600 dark:text-red-400";
            case CreditMovementType.refund:
                return "text-blue-600 dark:text-blue-400";
            default:
                return "";
        }
    };

    const getTypeBadgeColor = (type: CreditMovementType): string => {
        switch (type) {
            case CreditMovementType.add:
                return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
            case CreditMovementType.remove:
                return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
            case CreditMovementType.refund:
                return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
            default:
                return "";
        }
    };

    const getTypeIcon = (type: CreditMovementType) => {
        switch (type) {
            case CreditMovementType.add:
                return <ArrowUpCircle className="w-5 h-5" />;
            case CreditMovementType.remove:
                return <ArrowDownCircle className="w-5 h-5" />;
            case CreditMovementType.refund:
                return <RefreshCcw className="w-5 h-5" />;
            default:
                return null;
        }
    };

    const isPositive =
        statement.type === CreditMovementType.add ||
        statement.type === CreditMovementType.refund;
    const amountColor = isPositive
        ? "text-green-600 dark:text-green-400"
        : "text-red-600 dark:text-red-400";

    return (
        <Card className="transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                    {/* Descrição */}
                    <div className="flex-1 min-w-0 w-full sm:w-auto">
                        {/* Ícone e Badge */}
                        <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-shrink-0 w-full sm:w-auto">
                            <div className={getTypeColor(statement.type)}>
                                {getTypeIcon(statement.type)}
                            </div>
                            <span
                                className={`px-2 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap ${getTypeBadgeColor(
                                    statement.type
                                )}`}
                            >
                                {getTypeLabel(statement.type)}
                            </span>
                            <div className="flex-1 sm:hidden flex items-center gap-2 text-xs text-muted-foreground ml-auto">
                                <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>
                                    {new Date(statement.created_at).toLocaleString("pt-BR", {
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </span>
                            </div>
                        </div>

                        <h3 className="font-semibold text-sm leading-tight mb-1">
                            {statement.description}
                        </h3>
                        <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>
                                {new Date(statement.created_at).toLocaleString("pt-BR", {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                    </div>

                    {/* Valores */}
                    <div className="flex items-center gap-4 sm:gap-6 flex-shrink-0 w-full sm:w-auto justify-end sm:justify-start">
                        <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-0.5">Valor</p>
                            <p className={`font-bold text-base ${amountColor}`}>
                                {isPositive ? "+" : "-"}
                                {moneyFormat(statement.amount)}
                            </p>
                        </div>

                        <div className="text-right border-l pl-4 sm:pl-6">
                            <p className="text-xs text-muted-foreground mb-0.5">Novo Saldo</p>
                            <p className="text-sm font-semibold text-primary">
                                {moneyFormat(statement.new_balance)}
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

