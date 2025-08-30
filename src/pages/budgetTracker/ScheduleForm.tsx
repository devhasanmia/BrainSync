import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MapPin, BookOpen, User, Clock } from "lucide-react";
import { classScheduleValidationSchema } from "./classScheduleValidation";
import { colors, days } from "./classSchedule.constent";
import LabeledInput from "@/components/ui/InputWithLabel";
import PrimaryButton from "@/components/ui/PrimaryButton";

type ScheduleFormInputs = z.infer<typeof classScheduleValidationSchema>;

interface ScheduleFormProps {
  mode: "add" | "edit";
  defaultValues?: Partial<ScheduleFormInputs>;
  onSubmit: SubmitHandler<ScheduleFormInputs>;
}

const ScheduleForm = ({ mode, defaultValues, onSubmit }: ScheduleFormProps) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ScheduleFormInputs>({
    resolver: zodResolver(classScheduleValidationSchema),
    defaultValues,
  });

  const selectedColor = watch("color");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center from-blue-50 via-indigo-100 to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
        <div className="w-full max-w-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {mode === "add" ? "Add New Class Schedule" : "Update Class Schedule"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {mode === "add"
                ? "Fill in the details to create a class schedule"
                : "Fill in the details to update the class schedule"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <LabeledInput
              label="Subject"
              name="subject"
              type="text"
              placeholder="Enter subject name"
              icon={<BookOpen />}
              register={register}
              error={errors.subject?.message}
            />

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
                <p className="text-sm text-red-500 mt-1">{errors.day.message}</p>
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
                <p className="text-sm text-red-500 mt-1">{errors.color.message}</p>
              )}
            </div>

            <div className="flex justify-center pt-4">
              <PrimaryButton type="submit">
                {mode === "add" ? "Save Schedule" : "Update Schedule"}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ScheduleForm;
