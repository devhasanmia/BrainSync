import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import {
    useGetStudyTaskByIdQuery,
    useUpdateStudyTaskMutation,
} from "@/redux/features/studyPlanner/studyPlannerApi";
import StudyTaskForm from "./StudyTaskForm";
import { type SubmitHandler } from "react-hook-form";
import { useMemo } from "react";
import Loading from "@/components/ui/Loading";
import type { StudyTaskFormInputs } from "./StudyTaskForm";

const EditStudyTask = () => {
    const { id } = useParams<{ id: string }>();
    const { data: task, isLoading } = useGetStudyTaskByIdQuery(id);
    const [updateTask] = useUpdateStudyTaskMutation();
    const navigate = useNavigate();

    // Prepare default values for the form
    const defaultValues = useMemo(
        () => ({
            title: task?.data?.title || "",
            subject: task?.data?.subject || "",
            description: task?.data?.description || "",
            priority: task?.data?.priority || "low",
            deadline: task?.data?.deadline
                ? new Date(task.data.deadline).toISOString().split("T")[0]
                : "",
            estimatedHours: task?.data?.estimatedHours?.toString() || "",
            completed: task?.data?.completed || false,
        }),
        [task]
    );

    const handleEdit: SubmitHandler<StudyTaskFormInputs> = async (data) => {
        try {
            const res = await updateTask({ id, payload: data }).unwrap();
            toast.success(res?.data?.message || "Task updated successfully!");
            navigate("/dashboard/study-planner");
        } catch {
            toast.error("Failed to update task.");
        }
    };

    if (isLoading) return <Loading />;

    return <StudyTaskForm mode="edit" defaultValues={defaultValues} onSubmit={handleEdit} />;
};

export default EditStudyTask;
