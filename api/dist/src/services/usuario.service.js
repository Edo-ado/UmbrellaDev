
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { Role } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";

import { AppError } from "../utils/app-error";
export const UsuarioService = {
    async getAll() {
        return await prisma.usuario.findMany({ include: { especialidades: true } });
    },
    async getById(id) {
        return await prisma.usuario.findUnique({
            where: { Id: id },
            include: { especialidades: true },
        });
    },
    async getByRol(Role) {
        return await prisma.usuario.findMany({
            where: { Role: Role },
            include: { especialidades: true },
        });
    },
    async getByModalidad(modalidad) {
        return await prisma.usuario.findMany({
            where: { Modalidad: modalidad },
            include: { especialidades: true },
        });
    },
    async getByDisponibilidad(Disponibilidad) {
        return await prisma.usuario.findMany({
            where: { Disponibilidad: Disponibilidad },
            include: { especialidades: true },
        });
    },
    async searchByNombre(Nombre) {
        return await prisma.usuario.findMany({
            where: { NombreCompleto: { contains: Nombre } },
            include: { especialidades: true },
        });
    },
async toggleStatus(id) {
    const usuario = await this.getById(id)

    if (!usuario) {
        throw AppError.badRequest(
            "El usuario indicado no existe"
        )
    }

    const nuevoEstado =
        usuario.Estado === "ACTIVO"
            ? "INACTIVO"
            : "ACTIVO"

    return await prisma.usuario.update({
        where: { Id: id },
        data: {
            Estado: nuevoEstado
        }
    })
},
    async crear(data) {
        return prisma.usuario.create({
            data: {
                NombreCompleto: data.NombreCompleto,
                Email: data.Email,
                Contrasena: data.Contraseña,
                Pais: data.Pais,
                Edad: data.Edad,
                Telefono: data.Telefono ?? null,
                Role: data.Role ?? "USUARIO",
                Estado: data.Estado ?? "ACTIVO",
                Modalidad: data.Modalidad ?? "PRESENCIAL",
                Descripcion: data.Descripcion ?? null,
                AnosExperiencia: data.AnosExperiencia ?? null,
                Ubicacion: data.Ubicacion ?? null,
                TituloProfesional: data.TituloProfesional ?? null,
                TarifaBase: data.TarifaBase ?? null,
                Disponibilidad: data.Disponibilidad ?? true,
                Universidad: data.Universidad ?? null,
                especialidades: data.especialidadIds
                    ? {
                        connect: data.especialidadIds.map((Id) => ({ Id })),
                    }
                    : undefined,
            },
            include: {
                especialidades: true,
                servicios: true,
                curriculum: true,
                imagenesUsuario: {
                    include: {
                        imagen: true,
                    },
                },
            },
        });
    },
    async actualizar(id, data) {
        await this.validateUsuario(id); //reviso si exsite
        await this.getById(id);
        //futuras validaciones que iremos viendo
        return prisma.usuario.update({
            where: { Id: id },
            data: {
                NombreCompleto: data.NombreCompleto,
                Email: data.Email,
                Contrasena: data.Contraseña,
                Telefono: data.Telefono,
                Pais: data.Pais,
                Edad: data.Edad,
                Role: data.Role,
                Estado: data.Estado,
                Modalidad: data.Modalidad,
                TituloProfesional: data.TituloProfesional,
                Descripcion: data.Descripcion,
                AnosExperiencia: data.AnosExperiencia,
                Ubicacion: data.Ubicacion,
                TarifaBase: data.TarifaBase,
                Disponibilidad: data.Disponibilidad,
                Universidad: data.Universidad,
                especialidades: data.especialidadIds
                    ? { set: data.especialidadIds.map((Id) => ({ Id })),
                    }
                    : undefined,
            },
            include: {
                especialidades: true,
                servicios: true,
                curriculum: true,
                imagenesUsuario: {
                    include: {
                        imagen: true,
                    },
                },
            },
        });
    },
    async validateUsuario(Id) {
        const usuario = await this.getById(Id);
        if (!usuario) {
            throw AppError.badRequest("El usuario indicado no existe");
        }
    },
    async toggleDisponibilidadByProfesional(id) {
        const usuario = await this.getById(id);
        if (!usuario) {
            throw AppError.badRequest("El usuario indicado no existe");
        }
        if (usuario.Role !== Role.DESARROLLADOR) {
            throw AppError.badRequest("El usuario indicado no es un desarrollador");
        }
        return await prisma.usuario.update({
            where: { Id: id },
            data: {
                Disponibilidad: !usuario.Disponibilidad,
            },
            include: {
                especialidades: true,
                servicios: true,
                curriculum: true,
                imagenesUsuario: {
                    include: {
                        imagen: true,
                    },
                },
            },
        });
    },

async login(email, contrasena) {
    const usuario = await prisma.usuario.findUnique({
        where: {
            Email: email
        },
        include: {
            especialidades: true
        }
    })

    if (!usuario) {
        throw AppError.badRequest(
            "Correo o contraseña incorrectos"
        )
    }

    if (usuario.Estado !== "ACTIVO") {
        throw AppError.badRequest(
            "El usuario se encuentra inactivo"
        )
    }

    const contrasenaValida = await bcrypt.compare(
        contrasena,
        usuario.Contrasena
    )

    if (!contrasenaValida) {
        throw AppError.badRequest(
            "Correo o contraseña incorrectos"
        )
    }

    await prisma.usuario.update({
        where: {
            Id: usuario.Id
        },
        data: {
            LastLogin: new Date()
        }
    })

    const secret = process.env.JWT_SECRET || "vj_utn_2026"

    const token = jwt.sign(
        {
            Id: usuario.Id,
            Email: usuario.Email,
            Role: usuario.Role
        },
        secret,
        {
            expiresIn: "1d"
        }
    )

    return {
        token,
        usuario: {
            ...usuario,
            Contrasena: undefined
        }
    }
},
async register(data) {
    const usuarioExistente = await prisma.usuario.findUnique({
        where: {
            Email: data.Email
        }
    })

    if (usuarioExistente) {
        throw AppError.badRequest(
            "El correo ya está registrado"
        )
    }

    const contrasenaHasheada = await bcrypt.hash(
        data.Contrasena,
        10
    )

    const usuario = await prisma.usuario.create({
        data: {
            NombreCompleto: data.NombreCompleto,
            Email: data.Email,
            Contrasena: contrasenaHasheada,
            Pais: data.Pais,
            Edad: data.Edad ?? null,
            Telefono: data.Telefono ?? null,
            Role: data.Role ?? "USUARIO",
            Estado: "ACTIVO",
            Modalidad: data.Modalidad ?? "NOCAP"
        },
        include: {
            especialidades: true
        }
    })

    return {
        ...usuario,
        Contrasena: undefined
    }
},

async getPerfil(id) {
    const usuario = await prisma.usuario.findUnique({
        where: {
            Id: id
        },
        include: {
            especialidades: true,
            servicios: true,
            curriculum: true,
            imagenesUsuario: {
                include: {
                    imagen: true
                }
            }
        }
    })

    if (!usuario) {
        throw AppError.badRequest(
            "El usuario indicado no existe"
        )
    }

    return {
        ...usuario,
        Contrasena: undefined
    }
}


};
