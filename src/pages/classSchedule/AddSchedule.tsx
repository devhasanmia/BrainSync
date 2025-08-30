import { toast } from "sonner";
import { useCreateClassScheduleMutation } from "@/redux/features/classSchedule/classScheduleApi";
import ScheduleForm from "./ScheduleForm";
import { type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { classScheduleValidationSchema } from "./classScheduleValidation";
import { useNavigate } from "react-router";

type ScheduleFormInputs = z.infer<typeof classScheduleValidationSchema>;

const AddSchedule = () => {
  const [createSchedule] = useCreateClassScheduleMutation();
  const navigate = useNavigate();
  const handleAdd: SubmitHandler<ScheduleFormInputs> = async (data) => {
    try {
      const res = await createSchedule(data).unwrap();
      toast.success(res.data.message || "Schedule added successfully!");
      navigate("/dashboard/schedule-tracker")
    } catch {
      toast.error("Failed to add schedule.");
    }
  };

  return <ScheduleForm mode="add" onSubmit={handleAdd} />;
};

export default AddSchedule;
