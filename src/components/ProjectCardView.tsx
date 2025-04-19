"use client";

import ProjectCard, { ProjectCardProps } from "@/components/ProjectCard";
import { useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { CLIENT_BACKEND } from "@/app/requests/misc";

export default function ProjectCardView({ projects }: { projects: Array<ProjectCardProps> }) {
  const searchParams = useSearchParams();
  const rid = searchParams.get("rid");
  const download = searchParams.get("download");
  const t = useTranslations("Download");

  useEffect(() => {
    if (download) {
      const url = `${CLIENT_BACKEND}/api/resources/download/${download}`;
      window.location.href = url;
      addToast({
        description: t("downloading"),
        color: "primary",
      });
      console.log(`downloading ${url}`);
    }
  }, [])

  return <>
    {projects.map((project) => (
      <ProjectCard
        key={project.resource}
        showModal={project.download && rid === project.resource}
        osParam={searchParams.get("os")}
        archParam={searchParams.get("arch")}
        channelParam={searchParams.get("channel")}
        {...project}
      />
    ))}
  </>;
}