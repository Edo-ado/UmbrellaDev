import { NextFunction, Request, Response } from "express"
import { StatusCodes } from "http-status-codes"
import jwt, { JwtPayload, Secret } from "jsonwebtoken"
import { Role } from "../../../generated/prisma/enums"

export interface AuthTokenPayload extends JwtPayload {
    Id: number
    Email: string
    Role: Role
}

export interface AuthRequest extends Request {
    user?: AuthTokenPayload
}

function isAuthTokenPayload(
    payload: string | JwtPayload
): payload is AuthTokenPayload {
    return (
        typeof payload !== "string" &&
        payload.Id !== undefined &&
        payload.Email !== undefined &&
        payload.Role !== undefined
    )
}

export function authenticateToken(
    request: AuthRequest,
    response: Response,
    next: NextFunction
) {
    const authorizationHeader = request.headers.authorization

    if (!authorizationHeader) {
        return response
            .status(StatusCodes.UNAUTHORIZED)
            .json({
                success: false,
                message: "Token no proporcionado"
            })
    }

    const [scheme, token] = authorizationHeader.split(" ")

    if (scheme !== "Bearer" || !token) {
        return response
            .status(StatusCodes.UNAUTHORIZED)
            .json({
                success: false,
                message: "Formato de token inválido"
            })
    }

    try {
        const secret: Secret = process.env.JWT_SECRET || "vj_utn_2026"

        const decodedToken = jwt.verify(token, secret)

        if (!isAuthTokenPayload(decodedToken)) {
            return response
                .status(StatusCodes.UNAUTHORIZED)
                .json({
                    success: false,
                    message: "Token inválido"
                })
        }

        request.user = {
            Id: Number(decodedToken.Id),
            Email: String(decodedToken.Email),
            Role: decodedToken.Role
        }

        next()
    } catch {
        return response
            .status(StatusCodes.UNAUTHORIZED)
            .json({
                success: false,
                message: "Token inválido o expirado"
            })
    }
}