import { WorkerJwtPayload } from "../jwt/jwt";

// Fazendo o express reconhecer o .user no request que vem dos middlewares.
declare global {
    namespace Express {
        interface Request {
            user?: WorkerJwtPayload;
        }
    }
}