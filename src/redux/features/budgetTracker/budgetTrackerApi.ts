import { RootApi } from "../../services/RootApi";

const budgetTrackerApi = RootApi.injectEndpoints({
  endpoints: (builder) => ({
    createBudget: builder.mutation({
      query: (data) => ({
        url: "/budget-tracker",
        method: "POST",
        data: data
      }),
      invalidatesTags: ["budgetTracker"],
    }),
    getAllbudget: builder.query({
      query: () => ({
        url: "/budget-tracker",
        method: "GET",
      }),
      providesTags: ["budgetTracker"],
    }),
    deleteBudget: builder.mutation({
      query: (id) => ({
        url: `/budget-tracker/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["budgetTracker"],
    }),
  }),
});

export const { useGetAllbudgetQuery, useCreateBudgetMutation, useDeleteBudgetMutation } = budgetTrackerApi;
