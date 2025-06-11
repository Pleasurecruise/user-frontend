import { cn } from "@/lib/utils/css";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SERVER_BACKEND } from "@/app/requests/misc";
import { ProjectCardProps } from "@/components/ProjectCard";
import Image from "next/image";


export default async function ProjectButton() {
  const t = await getTranslations("GetStart");
  const resp = await fetch(`${SERVER_BACKEND}/api/misc/project`);
  const projects: Array<ProjectCardProps> = [];
  try {
    const { ec, data } = await resp.json();
    if (ec === 200) {
      Array.prototype.push.apply(projects, data);
    }
  } catch (e) {
    console.log(e);
  }

  const defaultProjects = projects.slice(0, 6);
  const hoverProjects = projects;

  return (
    <div className="flex justify-center mt-5">
      <Link
        href={`/projects`}
        className={cn(
          "text-indigo-600 ring-1 ring-inset ring-indigo-200 hover:ring-indigo-300 dark:text-white",
          "block rounded-md px-4 py-3 text-center text-xl font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600",
          "relative inline-flex items-center justify-center gap-2 overflow-hidden min-h-[44px]",
          "transition-all duration-300 group w-auto",
        )}
      >
        {/* 文字部分 */}
        {t("viewProjects")}

        {/* 图片容器 */}
        <div className="flex items-center justify-end pr-2 opacity-80 hover:opacity-100 transition-opacity">
          {defaultProjects.map((project, index) => (
            project.image && (
              <div
                key={`${project.name}-${index}`}
                className="relative mx-[-2px] h-12 w-12 rounded-full bg-gray-200"
              >
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )
          ))}
        </div>

        ......

      </Link>
    </div>
  );
}