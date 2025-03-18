type Announcement = {
  ec: number
  msg: string
  data: {
    summary: string
    details: string
  }
}

export function getAnnouncement(lang: 'zh' | 'en'): Promise<Announcement> {
  return fetch(`/api/announcement?lang=${lang}`)
    .then((res) => res.json())
    .catch(() => {
      // return {
      //   "ec": 400,
      //   "msg": "No announcement",
      //   "data": {
      //     "summary": "",
      //     "details": ""
      //   }
      // }
      return {
        "ec": 0,
        "msg": "mollit consectetur",
        "data": {
          "summary": "est do qui incididunt",
          "details": "incididunt sunt nulla reprehenderit non"
        }
      }
    });
}
