import { SERVER_BACKEND } from "@/app/requests/misc";

type Announcement = {
  ec: number
  msg: string
  data: {
    summary: string
    details: string
  }
}

export async function getAnnouncement(lang: "zh" | "en"): Promise<Announcement> {
  // Use absolute URL with origin to work properly in server components
  try {
    const res = await fetch(`${SERVER_BACKEND}/api/misc/anno?lang=${lang}`);
    return await res.json();
  } catch (error) {
    console.error("Get Announcement error:", error);
    return {
      "ec": 400,
      "msg": "",
      "data": {
        "summary": "",
        "details": ""
      }
    };
  }
}
