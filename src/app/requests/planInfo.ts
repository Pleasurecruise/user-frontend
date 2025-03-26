export type Discount = {
  beginAt: number // timestamp
  endAt: number   // timestamp
  discountPrice: number
}

export type Plan = {
  name: string
  price: number
  planId: string
  skuId: string
  mostPopular: boolean
  discount?: Discount
}

export type AfdianResponse = {
  ec: number
  data: {
    plan: {
      name: string
      plan_id: string
      price: string
      time_limit_price: {
        begin_time: number
        end_time: number
        price: string
      }
    },
    list: {
      sku_id: string
    }[]
  }
  msg: string
};

// 缓存的信息
const cachedPlanInfo: Record<string, Plan | undefined> = {};
// 缓存的更新时间
const lastFetchTime: Record<string, number> = {};
// 缓存的持续时间
const CACHE_DURATION = 10 * 60 * 1000; // 10分钟（毫秒）

export const getPlanInfo = async (planId: string, mostPopularId: string): Promise<Plan | null> => {
  const now = Date.now();
  if(lastFetchTime[planId] && now - lastFetchTime[planId] < CACHE_DURATION && cachedPlanInfo[planId]){
    return cachedPlanInfo[planId] || null;
  }

  try {
    const response = await fetch(`https://afdian.com/api/creator/get-plan-skus?plan_id=${planId}&is_ext=`);

    if (response.ok) {
      const data: AfdianResponse = await response.json();

      const { plan, list } = data.data;

      const responsePlan = {
        name: plan.name,
        price: parseFloat(plan.price),
        planId: plan.plan_id,
        skuId: list[0].sku_id,
        mostPopular: mostPopularId === plan.plan_id,
        discount: plan.time_limit_price && {
          beginAt: plan.time_limit_price.begin_time,
          endAt: plan.time_limit_price.end_time,
          discountPrice: parseFloat(plan.time_limit_price.price)
        }
      };

      cachedPlanInfo[planId] = responsePlan;
      lastFetchTime[planId] = now;

      return responsePlan;
    }
    else {
      console.error("Get Plan Info resp error:", response);
      return cachedPlanInfo[planId] || null;
    }
  } catch (error) {
    console.error("Get Plan Info error:", error);
    return cachedPlanInfo[planId] || null;
  }
};
