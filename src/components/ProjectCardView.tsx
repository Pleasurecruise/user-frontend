"use client";

import ProjectCard, { ProjectCardProps } from "@/components/ProjectCard";
import { useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function ProjectCardView({ projects }: { projects: Array<ProjectCardProps> }) {
  const searchParams = useSearchParams();
  const rid = searchParams.get("rid");
  const download = searchParams.get("download");
  const t = useTranslations("Download");

  useEffect(() => {
    if (download) {
      window.location.href = download;      
      addToast({
        description: t("downloading"),
        color: "primary",
      });
      console.log(`downloading ${download}`);
    }
  }, [download, rid, t])

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