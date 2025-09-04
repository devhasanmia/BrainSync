import { Plus, Edit2, Trash2, Clock, MapPin, User } from "lucide-react";
import { Link } from "react-router";
import { toast } from "sonner";
import PageHeader from "@/components/ui/PageHeader";
import { useDeleteClassScheduleMutation, useGetAllScheduleQuery } from "@/redux/features/classSchedule/classScheduleApi";
import type { Class } from "@/types";
import Loading from "@/components/ui/Loading";
import { days } from "./classSchedule.constent";

export function ScheduleTracker() {
  const { data: schedules, isLoading } = useGetAllScheduleQuery("");
  const [deleteClassSchedule] = useDeleteClassScheduleMutation();
  const deleteSchedule = async (id: string) => {
    try {
      const res = await deleteClassSchedule(id).unwrap();
      toast.success(res.data.message || "Schedule Deleted successfully!");
    } catch {
      toast.error("Failed to add schedule.");
    }
  }
  const classes: Class[] =
    schedules?.data?.map((item: any) => ({
      id: item._id,
      subject: item.subject,
      instructor: item.instructor,
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
      location: item.location,
      color: item.color || "",
    })) || [];

  const getClassesForDay = (day: string) => {
    return classes
      .filter((c) => c.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Class Schedule"
        subtitle="Manage your weekly class schedule"
        buttonText="Add Class"
        buttonLink="/dashboard/add-schedule"
        icon={Plus}
      />

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {days.map((day) => (
          <div
            key={day}
            className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-200 dark:border-gray-700"
          >
            <h3 className="text-center font-semibold text-gray-800 dark:text-gray-200 mb-4">
              {day}
            </h3>
            <div className="space-y-2">
              {getClassesForDay(day).map((classItem) => (
                <div
                  key={classItem.id}
                  className="p-3 rounded-xl text-white shadow-sm transition-colors hover:brightness-105"
                  style={{ backgroundColor: classItem.color }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{classItem.subject}</h4>
                    <div className="flex items-center gap-1">
                      <Link
                        to={`/dashboard/edit-schedule/${classItem.id}`}
                        className="p-1 text-white/80 hover:text-white transition-colors"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Link>
                      <button onClick={() => deleteSchedule(classItem.id)} className="p-1 text-white/80 hover:text-white transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-white/90 space-y-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {classItem.startTime} -{" "}
                      {classItem.endTime}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" /> {classItem.instructor}
                    </div>
                    {classItem.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {classItem.location}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
