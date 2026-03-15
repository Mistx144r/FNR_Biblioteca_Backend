import { JwtPayload } from "jsonwebtoken";

export type WorkerJwtPayload = JwtPayload & {
    id: number;
    name: string;
    roles: string[]
};