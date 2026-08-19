import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
export interface AuthTokenPayload extends JwtPayload {
    Id: number
    Email: string
    Role: string
}
export interface AuthRequest extends Request { user?: AuthTokenPayload }
export function authenticateToken(request: AuthRequest, response: Response, next: NextFunction) {
    const authorizationHeader = request.headers.authorization
    if (!authorizationHeader) {
        return response.status(StatusCodes.UNAUTHORIZED)
            .json({ success: false, message: "Token no proporcionado" })
    }
    const [scheme, token] = authorizationHeader.split(" ")
    if (scheme !== "Bearer" || !token) {
        return response
            .status(StatusCodes.UNAUTHORIZED)
            .json({ success: false, message: "Formato de token inválido" })
    }
    try {
        const secret: Secret = process.env.JWT_SECRET || "vj_utn_2026"
        const decodedToken = jwt.verify(token, secret)
      if (typeof decodedToken === "string" || !decodedToken.Id || !decodedToken.Email || !decodedToken.Role) {
            return response
                .status(StatusCodes.UNAUTHORIZED)
                .json({ success: false, message: "Token inválido" })
        }
        request.user = {
            Id: Number(decodedToken.Id),
            Email: String(decodedToken.Email),
            Role: String(decodedToken.Role)
        }
        next()
    } catch {
        return response
            .status(StatusCodes.UNAUTHORIZED)
            .json({ success: false, message: "Token inválido o expirado" })
    }
}