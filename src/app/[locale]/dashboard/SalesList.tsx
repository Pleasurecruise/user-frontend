import { Table, TableBody, TableColumn, TableHeader, TableRow, TableCell } from "@heroui/react";
import { RevenueType } from "@/app/[locale]/dashboard/page";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { groupBy } from "lodash";

type PropsType = {
  listData: RevenueType[]
  date: string
}

type DataType = {
  amount: number
  revenue: number
  date: string
}

export default function SalesList({ listData, date }: PropsType) {
  const t = useTranslations("Dashboard.dailyRecord");

  const generateDateRange = () => {
    const currentYear = Number(date.slice(0, 4));
    const currentMonth = Number(date.slice(5));
    const month = [31,
      currentYear % 4 === 0 && currentYear % 100 !== 0 || currentYear % 400 === 0 ? 29 : 28,
      31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    const dates: number[] = [];
    const lastDay = month[currentMonth - 1];

    for (let i = 1; i <= lastDay; i++) {
      dates.push(i);
    }
    return dates;
  };

  // 初始化日期范围
  const processedData = useMemo(() => {
    const groupedData = groupBy(
      listData.map(item => ({ ...item, activated_at: `${date.slice(5)}-${new Date(item.activated_at).getDate()}` })),
      (item) => item.activated_at
    );
    const dateMap = new Map<string, DataType>();
    const dateRange = generateDateRange();

    dateRange.forEach((day) => {
      const key = `${date.slice(5)}-${day}`;

      if (groupedData[key] === undefined) {
        dateMap.set(key, {
          amount: 0,
          revenue: 0,
          date: key,
        });
      } else {
        const revenue = Number(groupedData[key].reduce((acc, cur) => acc + Number(cur.amount), 0).toFixed(2));
        const amount = Number(groupedData[key].reduce((acc, cur) => acc + Number(cur.buy_count), 0));
        dateMap.set(key, {
          amount,
          revenue,
          date: key,
        });
      }
    })
    return Array.from(dateMap.values());
  }, [listData]);


  const columns = [
    {
      key: "date",
      label: t("date")
    },
    {
      key: "amount",
      label: t("amount")
    },
    {
      key: "revenue",
      label: t("revenue")
    }
  ]

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
        <TableBody items={processedData}>
          {(item) => (
            <TableRow key={String(item.date)} className="hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-white">
              {(columnKey) => <TableCell>{item[columnKey as keyof DataType]}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}
