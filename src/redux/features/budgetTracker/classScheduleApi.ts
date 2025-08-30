import { RootApi } from "../../services/RootApi";

const budgetTrackerApi = RootApi.injectEndpoints({
  endpoints: (builder) => ({
    createClassSchedule: builder.mutation({
      query: (data) => ({
        url: "/class-schedule",
        method: "POST",
        data: data
      }),
      invalidatesTags: ["schedule"],
    }),
    getAllbudget: builder.query({
      query: () => ({
        url: "/budget-tracker",
        method: "GET",
      }),
      providesTags: ["budgetTracker"],
    }),
    getSingleSchedule: builder.query({
      query: (id) => ({
        url: `/class-schedule/${id}`,
        method: "GET",
      }),
      providesTags: ["schedule"],
    }),
    updateClassSchedule: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/class-schedule/${id}`,
        method: "PATCH",
        data: payload
      }),
      invalidatesTags: ["schedule"],
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

export const { useGetAllbudgetQuery, useDeleteClassScheduleMutation, useUpdateClassScheduleMutation, useCreateClassScheduleMutation, useGetSingleScheduleQuery } = budgetTrackerApi;
