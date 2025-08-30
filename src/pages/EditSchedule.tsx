import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MapPin, BookOpen, User, Clock } from "lucide-react";

import LabeledInput from "../components/ui/InputWithLabel";
import PrimaryButton from "../components/ui/PrimaryButton";
import { useCreateClassScheduleMutation } from "@/redux/features/classSchedule/classScheduleApi";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const colors = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
];

const classScheduleValidationSchema = z.object({
  subject: z
    .string({ error: "Subject is required" })
    .min(1, { error: "Subject is required" }),
  instructor: z
    .string({ error: "Instructor is required" })
    .min(1, { error: "Instructor is required" }),
  day: z.enum(days).optional(),
  startTime: z
    .string({ error: "Start time is required" })
    .min(1, { error: "Start time is required" }),
  endTime: z
    .string({ error: "End time is required" })
    .min(1, { error: "End time is required" }),
  location: z.string().optional(),
  color: z.enum(colors).optional(),
});

type ScheduleFormInputs = z.infer<typeof classScheduleValidationSchema>;

const EditSchedule = () => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScheduleFormInputs>({
    resolver: zodResolver(classScheduleValidationSchema),
    defaultValues: {
        instructor:"HASAn"
    }
  });

  const selectedColor = watch("color");

  const [createSchedule] = useCreateClassScheduleMutation()
  const onSubmit: SubmitHandler<ScheduleFormInputs> = async (data) => {
    try {
      const res = await createSchedule(data).unwrap()
      toast.success(res.data.message || "Schedule added successfully!");
    } catch (err) {
      toast.error("Failed to add schedule.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="w-full max-w-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
              Update Class Schedule
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Fill in the details to Update a class schedule
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Subject */}
            <LabeledInput
              label="Subject"
              name="subject"
              type="text"
              placeholder="Enter subject name"
              icon={<BookOpen />}
              register={register}
              error={errors.subject?.message}
            />

            {/* Instructor */}
            <LabeledInput
              label="Instructor"
              name="instructor"
              type="text"
              placeholder="Enter instructor name"
              icon={<User />}
              register={register}
              error={errors.instructor?.message}
            />

            {/* Day */}
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                Day
              </label>
              <select
                {...register("day")}
                className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="">Select day</option>
                {days.map((day) => (
                  <option key={day} value={day}>
                    {day}
                  </option>
                ))}
              </select>
              {errors.day?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.day.message}
                </p>
              )}
            </div>

            {/* Time */}
            <div className="grid grid-cols-2 gap-4">
              <LabeledInput
                label="Start Time"
                name="startTime"
                type="time"
                icon={<Clock />}
                register={register}
                error={errors.startTime?.message}
              />

              <LabeledInput
                label="End Time"
                name="endTime"
                type="time"
                icon={<Clock />}
                register={register}
                error={errors.endTime?.message}
              />
            </div>

            {/* Location */}
            <LabeledInput
              label="Location"
              name="location"
              type="text"
              placeholder="e.g. Room 202"
              icon={<MapPin />}
              register={register}
              error={errors.location?.message}
            />

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Choose Color
              </label>
              <div className="flex gap-2 flex-wrap">
                {colors.map((c) => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setValue("color", c)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      selectedColor === c
                        ? "ring-2 ring-offset-2 ring-blue-500"
                        : "border-gray-300 dark:border-gray-600"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              {errors.color?.message && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.color.message}
                </p>
              )}
            </div>

            {/* Submit */}
            <div className="flex justify-center pt-4">
              <PrimaryButton type="submit">Update Schedule</PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditSchedule;
