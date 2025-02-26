import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
      <h2 className="text-2xl font-bold mb-4">Destination Not Found</h2>
      <p className="text-gray-600 mb-6 text-center">
        The destination you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Button asChild>
        <Link href="/destinations">
          Browse All Destinations
        </Link>
      </Button>
    </div>
  );
} 