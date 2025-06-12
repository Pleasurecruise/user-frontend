import { cn } from "@/lib/utils/css";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SERVER_BACKEND } from "@/app/requests/misc";
import { ProjectCardProps } from "@/components/ProjectCard";


export default async function ProjectBanner() {
  const t = await getTranslations("GetStart");
  const resp = await fetch(`${SERVER_BACKEND}/api/misc/project`);
  const projects: Array<ProjectCardProps> = [];
  try {
    const { ec, data } = await resp.json();
    if (ec === 200) {
      projects.push(...data);
    }
  } catch (e) {
    console.log(e);
  }

  const displayCount = 6
  const displayProjects = projects.slice(0, displayCount);
  const hasMore = projects.length > displayCount;

  const appCount = projects.length - (projects.length % 5);

  return (
    <div className="flex justify-center mt-5">
      <Link
        href={`/projects`}
        className={cn(
          "relative inline-flex items-center justify-center",
          "flex-col sm:flex-row",
          "gap-3 sm:gap-3",
          "px-5 py-4 sm:px-6 sm:py-4 rounded-2xl text-center text-lg sm:text-xl font-semibold",
          "bg-gray-100/50 dark:bg-gray-400/20",
          "backdrop-blur-lg backdrop-saturate-150",
          "text-gray-900 dark:text-white",
          "shadow-lg shadow-gray-400/30 dark:shadow-gray-900/40",
          "sm:hover:shadow-xl sm:hover:shadow-gray-500/40 dark:sm:hover:shadow-gray-900/60",
          "sm:hover:bg-gray-200/60 dark:sm:hover:bg-gray-400/25",
          "transition-all duration-500 ease-out",
          "overflow-hidden group",
          "sm:hover:px-5 sm:hover:py-4",
          "before:absolute before:inset-0 before:bg-gray-300/20 dark:before:bg-gray-600/10",
          "before:opacity-0 before:transition-opacity before:duration-500",
          "sm:hover:before:opacity-100",
          "w-auto max-w-[90vw]"
        )}
      >
        <div className="absolute -inset-x-4 -inset-y-4 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-400 dark:to-gray-600 opacity-0 blur-3xl sm:group-hover:opacity-20 dark:sm:group-hover:opacity-10 transition-opacity duration-1000" />

        <span className="relative z-10 flex items-center gap-2 transition-all duration-300">
          {t("viewProjects", { appCount })}
          <svg className="w-5 h-5 translate-x-1 sm:translate-x-0 sm:group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>

        {/* 图片容器 */}
        <div className="relative z-10 flex items-center justify-center sm:justify-end sm:ml-2 mr-0 sm:mr-1 transition-all duration-300 gap-1 sm:gap-0 sm:group-hover:gap-1">
          {displayProjects.map((project, index) => (
            project.image && (
              <div
                key={`${project.name}-${index}`}
                className={cn(
                  "relative h-9 w-9 sm:h-10 sm:w-10 rounded-full",
                  "shadow-md",
                  "-ml-1 first:ml-0",
                  "sm:-ml-3 sm:first:ml-0",
                  "transform transition-all duration-300",
                  "scale-105 sm:scale-100",
                  "sm:group-hover:scale-110",
                  "sm:group-hover:-ml-1 sm:group-hover:first:ml-0",
                  "p-[2px]",
                )}
                style={{
                  zIndex: displayProjects.length + 1 - index
                }}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-gray-200">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="rounded-full object-cover"
                  />
                </div>
              </div>
            )
          ))}

          {/* 省略图标 */}
          {hasMore && (
            <div
              className={cn(
                "relative h-9 w-9 sm:h-10 sm:w-10 rounded-full",
                "shadow-md",
                "-ml-1 sm:-ml-3",
                "transform transition-all duration-300",
                "scale-105 sm:scale-100",
                "sm:group-hover:scale-110",
                "sm:group-hover:-ml-1",
                "bg-gradient-to-r from-gray-500 to-gray-600",
                "p-[2px]",
                "flex items-center justify-center"
              )}
              style={{ zIndex: 0 }}
            >
              <div className="w-full h-full rounded-full bg-gray-600 dark:bg-gray-500 flex items-center justify-center">
                <span className="text-white text-xs font-semibold">
                  +{projects.length - displayCount}
                </span>
              </div>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
