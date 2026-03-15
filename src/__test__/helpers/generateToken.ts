import jwt from "jsonwebtoken";

export function generateTestToken(roles: string[] = ["Administrador"]) {
    return jwt.sign(
        { id: "1", name: "Teste", roles },
        String(process.env.JWTSECRETKEY),
        { expiresIn: "1h" }
    );
}