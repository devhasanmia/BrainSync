import { RootApi } from "../../services/RootApi";

const classScheduleApi = RootApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSchedule: builder.query({
      query: () => ({
        url: "/class-schedule",
        method: "GET",
      }),
      providesTags: ["schedule"],
    }),
  }),
});

export const { useGetAllScheduleQuery } = classScheduleApi;
