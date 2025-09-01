import { toast } from "sonner";
import { useCreateStudyTaskMutation } from "@/redux/features/studyPlanner/studyPlannerApi";
import { type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router";
import StudyTaskForm from "./StudyTaskForm";
import type { StudyTaskFormInputs } from "./StudyTaskForm";

const AddStudyTask = () => {
  const [createTask] = useCreateStudyTaskMutation();
  const navigate = useNavigate();

  const handleAdd: SubmitHandler<StudyTaskFormInputs> = async (data) => {
    try {
      const res = await createTask(data).unwrap();
      toast.success(res.data.message || "Task added successfully!");
      navigate("/dashboard/study-planner"); // তোমার স্টাডি প্ল্যানার পেজ লিঙ্ক
    } catch {
      toast.error("Failed to add task.");
    }
  };

  return <StudyTaskForm mode="add" onSubmit={handleAdd} />;
};

export default AddStudyTask;
