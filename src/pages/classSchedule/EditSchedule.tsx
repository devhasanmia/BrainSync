import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import {
  useGetSingleScheduleQuery,
  useUpdateClassScheduleMutation,
} from "@/redux/features/classSchedule/classScheduleApi";
import ScheduleForm from "./ScheduleForm";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { classScheduleValidationSchema } from "./classScheduleValidation";
import { useMemo } from "react";
import Loading from "@/components/ui/Loading";

type ScheduleFormInputs = z.infer<typeof classScheduleValidationSchema>;

const EditSchedule = () => {
  const { id } = useParams<{ id: string }>();
  const { data: schedule, isLoading } = useGetSingleScheduleQuery(id);
  const [updateSchedule] = useUpdateClassScheduleMutation();

  const defaultValues = useMemo(
    () => ({
      subject: schedule?.data?.subject || "",
      instructor: schedule?.data?.instructor || "",
      day: schedule?.data?.day || "",
      startTime: schedule?.data?.startTime || "",
      endTime: schedule?.data?.endTime || "",
      location: schedule?.data?.location || "",
      color: schedule?.data?.color || "",
    }),
    [schedule]
  );
  const navigate = useNavigate()

  const handleEdit: SubmitHandler<ScheduleFormInputs> = async (data) => {
    try {
      const res = await updateSchedule({ id, payload: data }).unwrap();
      toast.success(res?.data?.message || "Schedule updated successfully!");
      navigate("/dashboard/schedule-tracker")
    } catch {
      toast.error("Failed to update schedule.");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return <ScheduleForm mode="edit" defaultValues={defaultValues} onSubmit={handleEdit} />;
};

export default EditSchedule;
