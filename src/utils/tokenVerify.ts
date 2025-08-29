import { jwtDecode } from "jwt-decode";

export type TUser = {
    _id: string;
    email: string;
    phone: string;
    role: "admin" | "user" | "agent";
    iat: number;
    exp: number;
};


export const tokenVerify = (token: string): TUser | null => {
    try {
        const decoded: TUser = jwtDecode(token);
        return decoded;
    } catch (error) {
        return null;
    }
};