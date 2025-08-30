import { RootApi } from "../../services/RootApi";

const classScheduleApi = RootApi.injectEndpoints({
  endpoints: (builder) => ({
    createClassSchedule: builder.mutation({
      query: (data) => ({
        url: "/class-schedule",
        method: "POST",
        data: data 
      }),
      invalidatesTags: ["schedule"],
    }),
    getAllSchedule: builder.query({
      query: () => ({
        url: "/class-schedule",
        method: "GET",
      }),
      providesTags: ["schedule"],
    }),
      updateClassSchedule: builder.mutation({
      query: ({id, payload}) => ({
        url: `/class-schedule/${id}`,
        method: "PATCH",
        data: payload 
      }),
      invalidatesTags: ["schedule"],
    }),
  }),
});

export const { useGetAllScheduleQuery, useCreateClassScheduleMutation } = classScheduleApi;
