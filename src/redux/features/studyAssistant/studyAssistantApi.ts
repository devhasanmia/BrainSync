import { RootApi } from "../../services/RootApi";

const studyAssistantApi = RootApi.injectEndpoints({
  endpoints: (builder) => ({
    createStudySession: builder.mutation({
      query: (data) => ({
        url: "/study-session",
        method: "POST",
        data: data
      }),
      invalidatesTags: ["studyAssistant"],
    }),
    getStudySession: builder.query({
      query: () => ({
        url: "/study-session",
        method: "GET",
      }),
      providesTags: ["studyAssistant"],
    }),
    deleteClassSchedule: builder.mutation({
      query: (id ) => ({
        url: `/class-schedule/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["schedule"],
    }),
  }),
});

export const { useCreateStudySessionMutation, useGetStudySessionQuery} = studyAssistantApi;
