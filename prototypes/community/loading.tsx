import { Skeleton } from "@/components/ui/skeleton"

export default function CommunityLoading() {
  return (
    <div className="min-h-screen p-8">
      <Skeleton className="h-10 w-72 mb-8" /> {/* Page Title */}
      <Skeleton className="h-10 w-full max-w-md mb-8" /> {/* Search Input */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col items-center p-6 border rounded-lg">
            <Skeleton className="h-24 w-24 rounded-full mb-4" /> {/* Avatar */}
            <Skeleton className="h-6 w-3/4 mb-2" /> {/* Name */}
            <Skeleton className="h-4 w-1/2 mb-3" /> {/* Title/Company */}
            <div className="space-y-2 w-full">
              <Skeleton className="h-4 w-full" /> {/* Email */}
              <Skeleton className="h-4 w-full" /> {/* Phone */}
            </div>
            <div className="mt-4 pt-4 border-t border-border w-full">
              <Skeleton className="h-4 w-24 mb-2" /> {/* Interests label */}
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-14 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
