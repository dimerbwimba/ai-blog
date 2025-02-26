import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold mb-4">Category Not Found</h2>
      <p className="text-gray-600 mb-6 text-center">
        The category you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/getting-started">
          Browse All Categories
        </Link>
      </Button>
    </div>
  );
} 