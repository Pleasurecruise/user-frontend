import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Brush, TooltipProps
} from "recharts";
import { format, parseISO, startOfMinute, startOfHour, startOfDay } from "date-fns";
import { RevenueType } from "@/app/[locale]/dashboard/page";
import { Radio, RadioGroup, cn, Tooltip as Tippy, Switch } from "@heroui/react";
import { useTranslations } from "next-intl";

type PropsType = {
  revenueData: RevenueType[];
}

export default function SalesLineChart({ revenueData }: PropsType) {
  const t = useTranslations("Dashboard");
  // 状态管理
  const [showSales, setShowSales] = useState(true);
  const [timeRange, setTimeRange] = useState<string>("day");
  // 新增缩放状态
  const [brushRange, setBrushRange] = useState({ start: 0, end: 0.5 });
  const brushRef = useRef<HTMLDivElement>(null);

  // 处理原始数据
  const processedData = useMemo(() => {
    const groupedData: Record<string, { sumAmount: number; sumCount: number; time: Date }> = {};

    revenueData.forEach(item => {
      const date = parseISO(String(item.activated_at));
      let key: Date;

      switch (timeRange) {
        case "minute":
          key = startOfMinute(date);
          break;
        case "hour":
          key = startOfHour(date);
          break;
        case "day":
          key = startOfDay(date);
          break;
        default:
          key = startOfHour(date);
      }

      const isoKey = key.toISOString();

      if (!groupedData[isoKey]) {
        groupedData[isoKey] = {
          sumAmount: 0,
          sumCount: 0,
          time: key
        };
      }

      groupedData[isoKey].sumAmount += parseFloat(item.amount) * Number(item.buy_count);
      groupedData[isoKey].sumCount += item.buy_count;
    });

    return Object.values(groupedData)
      .sort((a, b) => a.time.getTime() - b.time.getTime())
      .map(item => ({
        time: item.time,
        amount: item.sumAmount,
        count: item.sumCount
      }));
  }, [revenueData, timeRange]);

  // 时间格式化
  const timeFormatter = (date: Date) => {
    switch (timeRange) {
      case "minute":
        return format(date, "MM-dd HH:mm");
      case "hour":
        return format(date, "MM-dd HH:00");
      case "day":
        return format(date, "yyyy-MM-dd");
      default:
        return format(date, "MM-dd HH:mm");
    }
  };

  // 自定义 Tooltip
  const CustomTooltip = (
    { active, payload }: TooltipProps<number, string> & {
      payload?: {
        payload: {
          time: Date;
          amount: number;
          count: number
        }
      }[]
    }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 p-3 shadow-lg rounded dark:border-gray-700">
          <p className="font-medium dark:border-gray-70">
            {timeRange === "day"
              ? format(data.time, "yyyy-MM-dd")
              : format(data.time, "yyyy-MM-dd HH:mm")}
          </p>
          <p className="text-blue-600 dark:text-blue-400">
            {showSales ?
              `${t("dailyRecord.amount")}: ${data.amount.toFixed(2)}元` :
              `${t("dailyRecord.revenue")}: ${data.count}件`}
          </p>
        </div>
      );
    }
    return null;
  };

  const handleWheel = useCallback((e: React.WheelEvent<HTMLDivElement>) => {
    const delta = e.deltaY * 0.0005;
    const newRange = Math.min(Math.max(timeRange === "day" ? 0.5 : 0.1, brushRange.end - brushRange.start + delta), 1);

    const center = (brushRange.start + brushRange.end) / 2;
    const newStart = Math.max(0, center - newRange / 2);
    const newEnd = Math.min(0.99, center + newRange / 2);

    setBrushRange({
      start: Number(newStart.toFixed(2)),
      end: Number(newEnd.toFixed(2))
    });
  }, [timeRange, brushRange]);

  useEffect(() => {
    const container = brushRef.current;
    if (container) {
      const nativeHandleWheel = (e: WheelEvent) => {
        handleWheel(e as unknown as React.WheelEvent<HTMLDivElement>);
      };
      container.addEventListener("wheel", nativeHandleWheel, { passive: false });
      return () => container.removeEventListener("wheel", nativeHandleWheel);
    }
  }, [brushRange, handleWheel]);

  const transform = 15 * (2 - brushRange.end + brushRange.start);

  return (
    <div className="relative h-full">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-2">
        <h3 className="w-full sm:flex-1 text-base sm:text-lg text-center">
          {t("totalAmountChart")}
        </h3>

        <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <RadioGroup
            orientation="horizontal"
            value={timeRange}
            size="sm"
            onValueChange={(value: string) => {
              setTimeRange(value);
              if (value === "day") {
                setBrushRange({ start: 0, end: 0.99 });
              }
            }}
            className="flex-1 sm:flex-none"
          >
            {[
              { label: t("dailyRecord.minute"), value: "minute" },
              { label: t("dailyRecord.hour"), value: "hour" },
              { label: t("dailyRecord.day"), value: "day" },
            ].map(({ label, value }) => (
              <Radio
                key={value}
                value={value}
                classNames={{
                  base: cn(
                    "inline-flex m-0 bg-content1 hover:bg-content2",
                    "items-center justify-between flex-row-reverse",
                    "max-w-[100px] sm:max-w-[300px] cursor-pointer",
                    "rounded-lg gap-1 sm:gap-2 border-2 border-transparent",
                    "data-[selected=true]:border-primary p-1"
                  ),
                }}
              >
                {label}
              </Radio>
            ))}
          </RadioGroup>
          <Tippy
            content={showSales ? t("dailyRecord.toggleAmount") : t("dailyRecord.toggleRevenue")}
            showArrow className="text-gray-500 dark:text-gray-200 "
          >
            <Switch
              isSelected={showSales}
              size="sm"
              onValueChange={(value) => setShowSales(value)}
            />
          </Tippy>
        </div>
      </div>

      <div
        className="mt-4 overflow-x-auto"
        onWheel={handleWheel}
        style={{
          cursor: "grab",
          scrollbarWidth: "thin",
          scrollbarColor: "#888 transparent"
        }}
        ref={brushRef}
      >
        <ResponsiveContainer
          width={"100%"}
          height={220}
          debounce={200}
        >
          <LineChart
            data={processedData}
            margin={{
              left: 0,
              right: 24,
              top: 12,
              bottom: 8
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            {/* X轴添加缩放控制 */}
            <XAxis
              dataKey="time"
              tickFormatter={timeFormatter}
              minTickGap={20}
              scale="time"
              domain={["auto", "auto"]}
              tick={{ fill: "#666", fontSize: 12 }}
              tickLine={{ stroke: "#ccc" }}
              allowDataOverflow
            />

            <YAxis
              label={{
                value: showSales ? t("dailyRecord.labelAmount") : t("dailyRecord.labelRevenue"),
                angle: -90,
                position: "insideLeft",
                fontSize: 14,
                offset: 10
              }}
              tick={{ fill: "#666", fontSize: 12 }}
              tickLine={{ stroke: "#ccc" }}
              domain={[0, (dataMax: number) => (dataMax * 1.1).toFixed(2)]}
            />

            <Brush
              dataKey="time"
              height={30}
              stroke="#8884d8"
              travellerWidth={10}
              startIndex={Math.floor(processedData.length * brushRange.start)}
              endIndex={Math.floor(processedData.length * brushRange.end)}
              tickFormatter={timeFormatter}
              gap={5}
              className="dark:[&_rect:first-child]:fill-gray-800"
              onChange={({ startIndex, endIndex }) => {
                const newStart = Number(startIndex) / processedData.length;
                const newEnd = Number(endIndex) / processedData.length;
                setBrushRange({ start: newStart, end: newEnd });
              }}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ strokeWidth: 0 }}
            />

            <Line
              type="monotone"
              dataKey={showSales ? "amount" : "count"}
              stroke="#8884d8"
              strokeWidth={2}
              style={timeRange === "day" ? { transform: `translateX(-${transform}px)` } : {}}
              dot={{
                fill: "#8884d8",
                strokeWidth: 2,
                r: 3,
                stroke: "#fff",
                style: timeRange === "day" ? { transform: `translateX(-${transform}px)` } : {}
              }}
              activeDot={{
                r: 6,
                fill: "#fff",
                stroke: "#8884d8",
                strokeWidth: 2,
                style: timeRange === "day" ? { transform: `translateX(-${transform}px)` } : {}
              }}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="sm:hidden text-sm text-gray-500 mt-2 px-2">
        ← 左右滑动查看完整图表 →
      </div>
    </div>
  );
};
