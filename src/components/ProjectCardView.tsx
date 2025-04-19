"use client";

import ProjectCard, { ProjectCardProps } from "@/components/ProjectCard";
import { useSearchParams } from "next/navigation";
import { addToast, ToastProps } from "@heroui/toast";
import { useTranslations } from "next-intl";

export default function ProjectCardView({ projects }: { projects: Array<ProjectCardProps> }) {
  const searchParams = useSearchParams();

  const download = searchParams.get("download");
  if (download) {
    window.location.href = download;
    const t = useTranslations("Download");
    addToast({
      description: t("downloading"),
      color: "primary",
    });
    console.log(`downloading ${download}`);
  }

  const rid = searchParams.get("rid");

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