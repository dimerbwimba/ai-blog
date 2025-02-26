import { useMemo } from "react";
import { usePathname } from "next/navigation";

interface UseBreadcrumbsOptions {
  /**
   * Custom labels for specific paths
   * @example { "/dashboard": "Dashboard", "/dashboard/settings": "Settings" }
   */
  pathLabels?: Record<string, string>;
  /**
   * Paths to exclude from breadcrumbs
   * @example ["/auth", "/api"]
   */
  excludePaths?: string[];
  /**
   * Root path to start generating breadcrumbs from
   * @example "/dashboard"
   */
  rootPath?: string;
}

const defaultPathLabels: Record<string, string> = {
  dashboard: "Dashboard",
  settings: "Settings",
  posts: "Posts",
  create: "Create",
  edit: "Edit",
  profile: "Profile",
  categories: "Categories",
};

export function useBreadcrumbs(options: UseBreadcrumbsOptions = {}) {
  const pathname = usePathname();
  const {
    pathLabels = {},
    excludePaths = [],
    rootPath = "/dashboard",
  } = options;

  const breadcrumbs = useMemo(() => {
    // Return empty if current path is excluded
    if (excludePaths.some((path) => pathname.startsWith(path))) {
      return [];
    }

    // Remove the root path from pathname for processing
    const relativePath = pathname.replace(rootPath, "");

    // Split pathname into segments and filter out empty strings
    const segments = relativePath.split("/").filter(Boolean);

    if (!segments.length) return [];

    // Build breadcrumb items with accumulated paths
    return segments.map((segment, index) => {
      // Build the full path up to this segment
      const fullPath = `${rootPath}${segments
        .slice(0, index + 1)
        .map((s) => `/${s}`)
        .join("")}`;

      // Get custom label or format the segment
      const label =
        pathLabels[fullPath] ||
        pathLabels[segment] ||
        defaultPathLabels[segment] ||
        segment
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      return {
        label,
        href: fullPath,
      };
    });
  }, [pathname, pathLabels, excludePaths, rootPath]);

  return breadcrumbs;
}
