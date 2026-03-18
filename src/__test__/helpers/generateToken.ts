import jwt from "jsonwebtoken";
import { env } from "../../schemas/envSchema";

export function generateTestToken(roles: string[] = ["Administrador"]) {
    return jwt.sign(
        { id: "1", roles },
        String(env.JWTSECRETKEY),
        { expiresIn: "1h", issuer: "biblioteca-api", audience: "biblioteca-frontend" }
    );
}