import { Skeleton } from "@/components/ui/skeleton"

export default function AdminLoading() {
  return (
    <div className="min-h-screen p-8">
      <Skeleton className="h-10 w-72 mb-8" /> {/* Page Title */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Create/Edit Announcement Form Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 mb-4" /> {/* Card Title */}
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" /> {/* Title Input */}
            <Skeleton className="h-24 w-full" /> {/* Content Textarea */}
            <Skeleton className="h-10 w-full" /> {/* Media URL Input */}
            <Skeleton className="h-10 w-full" /> {/* Media Type Select */}
            <Skeleton className="h-10 w-full" /> {/* Submit Button */}
          </div>
        </div>

        {/* Recent Announcements List Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-64 mb-4" /> {/* Card Title */}
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-4 border rounded-md">
                <Skeleton className="w-[80px] h-[60px] rounded-md flex-shrink-0" /> {/* Media Thumbnail */}
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-3/4" /> {/* Announcement Title */}
                  <Skeleton className="h-4 w-full" /> {/* Content Line 1 */}
                  <Skeleton className="h-4 w-5/6" /> {/* Content Line 2 */}
                  <div className="flex justify-between items-center mt-2">
                    <Skeleton className="h-4 w-24" /> {/* Date */}
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-8 rounded-md" /> {/* Edit Button */}
                      <Skeleton className="h-8 w-8 rounded-md" /> {/* Delete Button */}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
