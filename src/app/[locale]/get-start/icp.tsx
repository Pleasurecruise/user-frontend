"use client";

import { CLIENT_BACKEND } from "@/app/requests/misc";
import { useEffect, useState } from "react";

type ICP = {
  icp_beian: string;
  icp_url: string;
  icp_entity: string;
}

export default function IcpInfo() {
  const [icp, setIcp] = useState<ICP | null>(null);

  useEffect(() => {
    async function fetchIcpInfo() {
      try {
        const res = await fetch(`${CLIENT_BACKEND}/api/misc/icp?domain=${window.location.hostname}`);
        const data = await res.json();
        setIcp(data);
      } catch (error) {
        console.error("Failed to query ICP", error);
      }
    }

    fetchIcpInfo();
  }, []);

  return icp ? (
    <div>
      <a href={icp.icp_url} target="_blank" className="text-xs text-gray-500 dark:text-gray-400">
        {icp.icp_beian}
        <span aria-hidden="true">&nbsp;&nbsp;</span>
        {icp.icp_entity}
      </a>
    </div>
  ) : null;
}