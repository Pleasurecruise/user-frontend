import { useEffect, useState, useMemo } from "react";
import { Card, Button, Skeleton } from "@heroui/react";
import { useTranslations } from "next-intl";
import { clsx } from "clsx";
import { debounce } from "lodash";
import { RevenueType } from "@/app/[locale]/dashboard/page";
import {PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend} from "recharts";

type PropsType = {
  revenueData: RevenueType[]
  onLogOut: () => void
  date: string
  rid: string
}

type ChartDataItem = {
  name: string;
  value: number;
  count?: number;
  percentage?: number;
}

export default function Revenue({ revenueData, onLogOut, rid, date }: PropsType) {
  const t = useTranslations("Dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!revenueData) {
      return onLogOut();
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Prepare chart data
  const applicationData = useMemo(() => {
    const data = prepareChartData(revenueData, 'application');
    return calculatePercentages(data);
  }, [revenueData]);

  const userAgentData = useMemo(() => {
    const data = prepareChartData(revenueData, 'user_agent');
    return calculatePercentages(data);
  }, [revenueData]);

  const planData = useMemo(() => {
    const data = prepareChartData(revenueData, 'plan');
    return calculatePercentages(data);
  }, [revenueData]);

  function calculatePercentages(data: ChartDataItem[]): ChartDataItem[] {
    const total = data.reduce((sum, item) => sum + item.value, 0);

    return data.map(item => ({
      ...item,
      percentage: parseFloat(((item.value / total) * 100).toFixed(1))
    }))
        .sort((a, b) => b.value - a.value); // 按值从大到小排序
  }

  // Function to prepare chart data by grouping
  function prepareChartData(data: RevenueType[], key: keyof RevenueType): ChartDataItem[] {
    const grouped: Record<string, {value: number, count: number}> = data.reduce((acc, item) => {
      const keyValue = String(item[key]);
      const amount = parseFloat(item.amount) * item.buy_count;
      const count = Number(item.buy_count);

      if (!acc[keyValue]) {
        acc[keyValue] = { value: 0, count: 0 };
      }
      acc[keyValue].value += amount;
      acc[keyValue].count += count;
      return acc;
    }, {} as Record<string, {value: number, count: number}>);

    return Object.entries(grouped).map(([name, { value, count }]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
      count
    }));
  }

  // CSV export handler
  const handleExport = debounce(async () => {
    const filename = `MirrorChyan Sales ${rid} ${date}.csv`;
    const csvContent = "\uFEFF" + "activated_at,application,user_agent,plan,buy_count,amount\n" +
        revenueData.map(d =>
            `${d.activated_at},${d.application},${d.user_agent},${d.plan},${d.buy_count},${d.amount}`)
            .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }, 500);

  // Reusable Pie Chart component
  const SalesPieChart = ({ data, title }: { data: ChartDataItem[], title: string }) => {
    const [activeSliceIndex, setActiveSliceIndex] = useState<number | undefined>(undefined);
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#DC143C', '#9370DB', '#20B2AA'];

    const renderLabel = ({ name, percentage }: ChartDataItem) => {
      return percentage && percentage > 10 ? `${name} ${percentage}%` : null;
    };

    const customTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
            <div className="bg-white p-2 shadow rounded border">
              <p className="font-medium">{data.name}</p>
              <p>{data.percentage}% {data.count}份 {data.value}元</p>
            </div>
        );
      }
      return null;
    };

    return (
        <div className="h-full">
          <h3 className="mb-4">{title}</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  innerRadius={30}
                  fill="#8884d8"
                  dataKey="value"
                  activeIndex={activeSliceIndex}
                  onMouseEnter={(_, index) => setActiveSliceIndex(index)}
                  onMouseLeave={() => setActiveSliceIndex(undefined)}
                  label={renderLabel}
              >
                {data.map((_entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={customTooltip} />
              <Legend
                  layout="vertical"
                  align="left"
                  verticalAlign="top"
                  wrapperStyle={{
                    maxHeight: '140px',
                    overflowY: 'auto',
                    direction: 'rtl',
                    paddingRight: '10px',
                    textAlign: 'left'
                  }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
    );
  };

  if (isLoading) {
    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
          <Skeleton className="w-1/2 h-20 rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className={clsx(
                    "rounded-xl", i === 2 ? "h-20" : "h-52"
                )} />
            ))}
          </div>
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3].map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-1 gap-6 mb-6">
            {[1, 2].map((_, i) => (
                <Skeleton key={i} className={clsx(
                    "h-52 rounded-xl",
                    i === 0 ? "lg:col-span-1" : "lg:col-span-2"
                )} />
            ))}
          </div>
        </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* 标题区 */}
      <h1 className="text-4xl indent-0 font-bold mb-6 sm:indent-6">
        {t("dashboardTitle", { rid, date })}
      </h1>

        <div className="max-w-7xl mx-auto">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <div className="p-4 sm:p-8">
                <h3 className="text-gray-500">{t("totalAmount")}</h3>
                <p className="text-2xl sm:text-3xl font-bold">
                  {revenueData.reduce((acc, cur) => acc + Number(cur.buy_count), 0)}份
                </p>
              </div>
            </Card>
            <Card>
              <div className="p-4 sm:p-8">
                <h3 className="text-gray-500">{t("totalRevenue")}</h3>
                <p className="text-2xl sm:text-3xl font-bold">
                  {revenueData.reduce(
                      (acc, cur) => acc + Number(cur.amount) * Number(cur.buy_count), 0
                  ).toFixed(2)}元
                </p>
              </div>
            </Card>
            <div className="flex items-center justify-center p-4">
              <Button className="w-full sm:w-auto" color="secondary" variant="ghost" onClick={handleExport}>
                {t("export")}
              </Button>
            </div>
          </div>

          {/* Chart section */}
          <div className="grid grid-cols-1 md:grid-cols-3 sm:grid-cols-1 gap-6 mb-6">
            <Card>
              <div className="p-4">
                <SalesPieChart data={applicationData} title={t("application")} />
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <SalesPieChart data={userAgentData} title={t("userAgent")} />
              </div>
            </Card>
            <Card>
              <div className="p-4">
                <SalesPieChart data={planData} title={t("plan")} />
              </div>
            </Card>
          </div>

          {/* Data table section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Card className="lg:col-span-1">
              <div className="p-4">
                <h3 className="mb-4">{t("dailyRecord")}</h3>
                <div className="w-full h-64 bg-amber-400"></div>
              </div>
            </Card>
            <Card className="lg:col-span-2">
              <div className="p-4">
                <h3 className="mb-4">{t("totalAmountChart")}</h3>
                <div className="w-full h-64 bg-indigo-300"></div>
              </div>
            </Card>
          </div>
        </div>
      </div>
  );
}
