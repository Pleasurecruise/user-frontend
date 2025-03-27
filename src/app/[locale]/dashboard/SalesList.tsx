import { Table, TableBody, TableColumn, TableHeader, TableRow, TableCell } from "@heroui/react";
import { RevenueType } from "@/app/[locale]/dashboard/page";
import {useTranslations} from "next-intl";

type PropsType = {
  listData: RevenueType[]
}

export default function SalesList({listData}: PropsType) {
  const t = useTranslations("Dashboard.dailyRecord");

  const columns = [
    {
      key: "date",
      label: t("date")
    },
    {
      key: "buy_count",
      label: t("amount")
    },
    {
      key: "amount",
      label: t("revenue")
    }
  ]

  const renderCell = (item: RevenueType, columnKey: string): React.ReactNode => {
    const value = item[columnKey as keyof RevenueType];
    if(columnKey === "date"){
      const date = new Date(item.activated_at);
      return <span>{date.getMonth() + 1 + "-" + date.getDate()}</span>;
    }
    return <span>{String(value)}</span>;
  };
  return (
    <>
      <Table
        isVirtualized
        isHeaderSticky
        className="h-full p-0 overflow-y-scroll scrollbar-hide"
      >
        <TableHeader columns={columns}>
          {(column) => (
              <TableColumn key={column.key}>
                {column.label}
              </TableColumn>
            )}
        </TableHeader>
        <TableBody items={listData}>
          {(item) => (
            <TableRow key={String(item.activated_at)}>
              {(columnKey) => <TableCell>{renderCell(item, String(columnKey))}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
