type Announcement = {
  content: {
    zh: string
    en: string
  }
  startTimestamp: number
  endTimestamp: number
}

export function getAnnouncement(): Promise<Announcement> {
  return fetch("/api/announcement")
    .then((res) => res.json())
    .catch(() => {
      return {
        content: {
          zh: "",
          en: "",
        },
        startTimestamp: 0,
        endTimestamp: 0,
      }
    });
}
