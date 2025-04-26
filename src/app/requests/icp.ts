import { SERVER_BACKEND } from "@/app/requests/misc";

type ICP = {
  icp_beian: string;
  icp_url: string;
  icp_entity: string;
}

let icp: ICP;

export async function getICP(): Promise<ICP> {
  if (icp) {
    return icp;
  }

  try {
    const res = await fetch(`${SERVER_BACKEND}/api/misc/icp?lang=1`);
    icp = await res.json();

  } catch (error) {
    console.error("Failed to query ICP", error);
  }

  return icp;
}
