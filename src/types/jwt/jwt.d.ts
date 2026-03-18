import { JwtPayload } from "jsonwebtoken";

export type WorkerJwtPayload = JwtPayload & {
    id: number;
    roles: string[]
};