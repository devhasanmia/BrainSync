import { RootApi } from "../../services/RootApi";

export const AuthApi = RootApi.injectEndpoints({
    endpoints: (builder) => ({
        register: builder.mutation({
            query: (data) => ({
                url: "/auth/register",
                method: "POST",
                data: data
            }),
            invalidatesTags: ["user"]
        }),
        login: builder.mutation({
            query: (data) => ({
                url: "/auth/login",
                method: "POST",
                data: data
            }),
            invalidatesTags: ["user"]
        }),
        logout: builder.mutation({
            query: () => ({
                url: "/auth/logout",
                method: "POST",
            }),
            invalidatesTags: ["user"]
        }),
        profile: builder.query({
            query: () => ({
                url: "/user/profile",
                method: "GET",
            }),
            providesTags: ["user"]
        })
    })
});

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } = AuthApi;