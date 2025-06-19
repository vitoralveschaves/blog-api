import { Request } from "express";
import { User } from "../generated/prisma";

type UserWithoutPassword = Omit<User, "password" | "createdAt" | "updatedAt">

export type ExtendedRequest = Request & {
    user?: UserWithoutPassword;
}