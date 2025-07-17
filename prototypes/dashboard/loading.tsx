import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Announcements & Events Skeletons */}
        <div className="lg:col-span-2 space-y-8">
          {/* Announcements Section Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-8 w-64 mb-6" /> {/* Section Title */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                <Skeleton className="w-full md:w-[200px] h-[120px] md:h-[150px] rounded-md" /> {/* Media */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" /> {/* Title */}
                  <Skeleton className="h-4 w-full" /> {/* Content line 1 */}
                  <Skeleton className="h-4 w-5/6" /> {/* Content line 2 */}
                  <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-4 w-24" /> {/* Read More link */}
                    <Skeleton className="h-6 w-20" /> {/* Date Badge */}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Events Section Skeleton */}
          <div className="space-y-8">
            <Skeleton className="h-8 w-64 mb-6" /> {/* Section Title */}
            {[1, 2].map((i) => (
              <div key={i} className="flex flex-col md:flex-row gap-4 p-4 border rounded-lg">
                <Skeleton className="w-full md:w-[200px] h-[120px] md:h-[150px] rounded-md" /> {/* Image */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" /> {/* Title */}
                  <Skeleton className="h-4 w-full" /> {/* Description line 1 */}
                  <Skeleton className="h-4 w-5/6" /> {/* Description line 2 */}
                  <div className="space-y-1 mt-2">
                    <Skeleton className="h-4 w-48" /> {/* Location */}
                    <Skeleton className="h-4 w-40" /> {/* Date/Time */}
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Skeleton className="h-10 w-32" /> {/* Button 1 */}
                    <Skeleton className="h-10 w-32" /> {/* Button 2 */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Directory Preview Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 mb-6" /> {/* Section Title */}
          <Skeleton className="h-10 w-full mb-6" /> {/* Search Input */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="h-16 w-16 rounded-full" /> {/* Avatar */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" /> {/* Name */}
                  <Skeleton className="h-4 w-1/2" /> {/* Title/Company */}
                  <Skeleton className="h-4 w-full" /> {/* Contact Info */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
