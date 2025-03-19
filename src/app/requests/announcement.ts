type Announcement = {
  ec: number
  msg: string
  data: {
    summary: string
    details: string
  }
}

export function getAnnouncement(lang: "zh" | "en"): Promise<Announcement> {
  // Use absolute URL with origin to work properly in server components
  const baseUrl = process.env.MIRRORC_BASE_URL || "";
  return fetch(`${baseUrl}/api/misc/anno?lang=${lang}`)
    .then((res) => res.json())
    .catch((error) => {
      console.error("Get Announcement error:", error);
      return {
        "ec": 400,
        "msg": "",
        "data": {
          "summary": "",
          "details": ""
        }
      };
    });
}
