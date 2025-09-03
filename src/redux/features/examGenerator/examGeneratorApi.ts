import { RootApi } from "../../services/RootApi";

export const examGeneratorApi = RootApi.injectEndpoints({
    endpoints: (builder) => ({
        addQuestion: builder.mutation({
            query: (data) => ({
                url: "/exam-generator",
                method: "POST",
                data
            }),
            invalidatesTags: ["exam"],
        }),
        generateExam: builder.mutation({
            query: (data) => ({
                url: "/exam-generator/generate",
                method: "POST",
                data
            }),
            invalidatesTags: ["exam"],
        })
    })
});

export const { useGenerateExamMutation, useAddQuestionMutation } = examGeneratorApi;
