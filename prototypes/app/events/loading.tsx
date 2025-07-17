import { Skeleton } from "@/components/ui/skeleton"

export default function EventsLoading() {
  return (
    <div className="min-h-screen p-8">
      <Skeleton className="h-10 w-72 mb-8" /> {/* Page Title */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <Skeleton className="h-10 w-full md:w-64" /> {/* Search Input */}
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          <Skeleton className="h-10 w-20" /> {/* Category Button */}
          <Skeleton className="h-10 w-24" /> {/* Category Button */}
          <Skeleton className="h-10 w-20" /> {/* Category Button */}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col border rounded-lg overflow-hidden">
            <Skeleton className="aspect-video w-full" /> {/* Event Image */}
            <div className="p-4 flex flex-col flex-grow">
              <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
              <Skeleton className="h-4 w-full mb-4" /> {/* Description line 1 */}
              <Skeleton className="h-4 w-5/6 mb-4" /> {/* Description line 2 */}
              <div className="space-y-3 mb-4">
                <Skeleton className="h-4 w-48" /> {/* Location */}
                <Skeleton className="h-4 w-40" /> {/* Date/Time */}
              </div>
              <div className="flex gap-2 mt-auto pt-4 border-t border-border">
                <Skeleton className="h-10 w-1/2" /> {/* Button 1 */}
                <Skeleton className="h-10 w-1/2" /> {/* Button 2 */}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
