import { BackgroundLines } from "@/components/BackgroundLines";
import ProjectCard, { ProjectCardProps } from "@/components/ProjectCard";
import ProjectIntegratedCard from "@/components/ProjectIntegratedCard";
import { getTranslations } from "next-intl/server";
import { SERVER_BACKEND } from "@/app/requests/misc";

export default async function ProjectsPage() {
  const t = await getTranslations("Projects");
  const resp = await fetch(`${SERVER_BACKEND}/api/misc/project`)
  const projects: Array<ProjectCardProps> = []
  try {
    const { ec, data } = await resp.json();
    if (ec === 200) {
      Array.prototype.push.apply(projects, data);
    }
  } catch (e) {
    console.log(e)
  }

  return (
    <BackgroundLines className="min-h-screen">
      <div className="container mx-auto px-3 py-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("title")}</h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-auto">
          {projects.map((project) => (
            <ProjectCard
              key={project.resource}
              {...project}
            />
          ))}
          <ProjectIntegratedCard />
        </div>
      </div>
    </BackgroundLines>
  );
}