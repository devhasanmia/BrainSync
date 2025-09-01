import { RootApi } from "../../services/RootApi";

export const studyPlannerApi = RootApi.injectEndpoints({
  endpoints: (builder) => ({
    // ---- Get all tasks ----
    getAllStudyPlanner: builder.query({
      query: () => ({
        url: "/study-planner",
        method: "GET",
      }),
      providesTags: ["studyPlanner"],
    }),

    // ---- Get single task ----
    getStudyTaskById: builder.query({
      query: (id) => ({
        url: `/study-planner/${id}`,
        method: "GET",
      }),
      providesTags: ["studyPlanner"],
    }),

    // ---- Create task ----
    createStudyTask: builder.mutation({
      query: (payload) => ({
        url: "/study-planner",
        method: "POST",
        data: payload,
      }),
      invalidatesTags: ["studyPlanner"],
    }),

    // ---- Update task ----
    updateStudyTask: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/study-planner/${id}`,
        method: "PATCH",
        data: payload,
      }),
      invalidatesTags: ["studyPlanner"],
    }),

    // ---- Delete task ----
    deleteStudyTask: builder.mutation({
      query: (id) => ({
        url: `/study-planner/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["studyPlanner"],
    }),
  }),
});

export const {
  useGetAllStudyPlannerQuery,
  useGetStudyTaskByIdQuery,
  useCreateStudyTaskMutation,
  useUpdateStudyTaskMutation,
  useDeleteStudyTaskMutation,
} = studyPlannerApi;
