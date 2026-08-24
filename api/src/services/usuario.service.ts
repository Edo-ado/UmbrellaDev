import bcrypt from "bcryptjs";
import { MODALIDAD, Role, Estado } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../dtos/usuario.dto";
import { AppError } from "../utils/app-error";
import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { CitaServices } from "../services/cita.service";

import { ImageService } from "../services/image.service";

import { ResenaService } from "../services/resena.service";

const imageService = new ImageService();

const resenaService = ResenaService;

export const UsuarioService = {
  async getAll() {
    return await prisma.usuario.findMany({
      include: { especialidades: true },
    });
  },

  async getById(id: number) {
    return await prisma.usuario.findUnique({
      where: { Id: id },
      include: { especialidades: true },
    });
  },

  async getByRol(Role: Role) {
    return await prisma.usuario.findMany({
      where: { Role: Role },
      include: { especialidades: true },
    });
  },

  async getByModalidad(modalidad: MODALIDAD) {
    return await prisma.usuario.findMany({
      where: { Modalidad: modalidad },
      include: { especialidades: true },
    });
  },

  async getByDisponibilidad(Disponibilidad: boolean) {
    return await prisma.usuario.findMany({
      where: { Disponibilidad: Disponibilidad },
      include: { especialidades: true },
    });
  },

  async searchByNombre(Nombre: string) {
    return await prisma.usuario.findMany({
      where: { NombreCompleto: { contains: Nombre } },
      include: { especialidades: true },
    });
  },

  async toggleStatus(id: number) {
    const usuario = await this.getById(id);

    let nuevoEstado: Estado;

    if (usuario?.Estado === "ACTIVO") {
      nuevoEstado = "INACTIVO";
    } else {
      nuevoEstado = "ACTIVO";
    }

    return await prisma.usuario.update({
      where: { Id: id },
      data: {
        Estado: nuevoEstado,
      },
    });
  },

  async getAllDesarrolladores() {
    return await prisma.usuario.findMany({
      where: { Role: "DESARROLLADOR" },
      include: {
        especialidades: true,
      },
    });
  },
  async crear(data: CreateUsuarioDto) {
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

  identificarTipoUsuario(
    role: Role,
  ): "ADMINISTRADOR" | "DESARROLLADOR" | "CLIENTE" {
    switch (role) {
      case Role.ADMIN:
        return "ADMINISTRADOR";
      case Role.DESARROLLADOR:
        return "DESARROLLADOR";
      case Role.USUARIO:
        return "CLIENTE";
      default:
        throw new Error("Rol de usuario no reconocido");
    }
  },

  async validarEmailDisponible(email: string, idUsuarioActual: number) {
    const existente = await prisma.usuario.findUnique({
      where: { Email: email },
    });

    if (existente && existente.Id !== idUsuarioActual) {
      throw new Error("El correo ya está en uso por otro usuario");
    }
  },

  async actualizar(
    id: number,
    data: UpdateUsuarioDto,
    file?: Express.Multer.File,
  ) {
    const usuario = await this.getById(id);

    if (!usuario) {
      throw AppError.badRequest("El usuario indicado no existe");
    }

    const tipoUsuario = this.identificarTipoUsuario(usuario.Role);
    if (tipoUsuario === "ADMINISTRADOR") {
      throw new Error("Los administradores no pueden editar su perfil");
    }

    if (data.Email && data.Email !== usuario.Email) {
      await this.validarEmailDisponible(data.Email, id);
    }

    const contrasenaActualizada = data.Contraseña
      ? await bcrypt.hash(data.Contraseña, 10)
      : usuario.Contrasena;

    const fotoActualizada = file
      ? await imageService.uploadImage(file, usuario.Foto ?? undefined)
      : usuario.Foto;

    const camposBase = {
      NombreCompleto: data.NombreCompleto ?? usuario.NombreCompleto,
      Email: data.Email ?? usuario.Email,
      Contrasena: contrasenaActualizada,
      Pais: data.Pais ?? usuario.Pais,
      Telefono: data.Telefono ?? usuario.Telefono,
      Foto: fotoActualizada,
    };

    const camposProfesional =
  tipoUsuario === "DESARROLLADOR"
    ? {
        Descripcion: data.Descripcion ?? usuario.Descripcion,
        Ubicacion: data.Ubicacion ?? usuario.Ubicacion,
        TarifaBase:
          data.TarifaBase !== undefined && data.TarifaBase !== null
            ? Number(data.TarifaBase)
            : usuario.TarifaBase,
        especialidades: data.especialidadIds
          ? { set: data.especialidadIds.map((Id) => ({ Id })) }
          : undefined,
      }
    : {};

    return prisma.usuario.update({
      where: { Id: id },
      data: {
        ...camposBase,
        ...camposProfesional,
      },
      include: {
        especialidades: true,
        servicios: true,
        curriculum: true,
        imagenesUsuario: {
          include: { imagen: true },
        },
      },
    });
  },

  async validateUsuario(Id: number) {
    const usuario = await this.getById(Id);
    if (!usuario) {
      throw AppError.badRequest("El usuario indicado no existe");
    }
  },

  async toggleDisponibilidadByProfesional(id: number) {
    const usuario = await this.getById(id);

    if (!usuario) {
      throw AppError.badRequest("El usuario indicado no existe");
    }

    if (usuario.Role !== Role.DESARROLLADOR) {
      throw AppError.badRequest("El usuario indicado no es un desarrollador");
    }

    const tieneActiva = await CitaServices.tieneCitaActiva(id);
    if (tieneActiva) {
      throw AppError.badRequest(
        "No puedes cambiar tu disponibilidad mientras tengas una cita activa",
      );
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

  async registrar(data: {
    email: string;
    Contrasena: string;
    nombre: string;
    role?: Role;
    pais: string;
    telefono?: string;
    edad?: number;
  }) {
    const usuarioExists = await prisma.usuario.findUnique({
      where: { Email: data.email },
    });
    if (usuarioExists) {
      throw new Error("El correo ya está registrado");
    }
    const hashedPassword = await bcrypt.hash(data.Contrasena, 10);
    const usuario = await prisma.usuario.create({
      data: {
        Email: data.email,
        Contrasena: hashedPassword,
        NombreCompleto: data.nombre,
        Pais: data.pais,
        Edad: data.edad ?? null,
        Telefono: data.telefono ?? null,
        Role: data.role ?? Role.USUARIO,
        Estado: Estado.ACTIVO,
        Modalidad: MODALIDAD.PRESENCIAL,
        Disponibilidad: true,
      },
    });
    const { Contrasena, ...usuarioWithoutPassword } = usuario;
    return usuarioWithoutPassword;
  },

  async login(data: { email: string; contrasena: string }) {
    const usuario = await prisma.usuario.findUnique({
      where: { Email: data.email },
    });
    if (!usuario) {
      throw new Error("Correo o contraseña incorrectos");
    }
    const isPasswordValid = await bcrypt.compare(
      data.contrasena,
      usuario.Contrasena,
    );
    if (!isPasswordValid) {
      throw new Error("Correo o contraseña incorrectos");
    }
    const payload = {
      Id: usuario.Id,
      Email: usuario.Email,
      Role: usuario.Role,
    };
    const secret: Secret = process.env.JWT_SECRET || "vj_utn_2026";
    const options: SignOptions = {
      expiresIn: "2h",
    };
    const token = jwt.sign(payload, secret, options);
    return {
      token,
       Id: usuario.Id,
      Email: usuario.Email,
      Role: usuario.Role,
    };
  },
  async perfil(usuarioId: number) {
    const usuario = await prisma.usuario.findUnique({
      where: { Id: usuarioId },
      include: {
        especialidades: true,
        servicios: true,
        curriculum: true,
        imagenesUsuario: {
          include: { imagen: true },
        },
      },
    });

    if (!usuario) {
      throw new Error("El usuario no existe");
    }

    const tipoUsuario = this.identificarTipoUsuario(usuario.Role);
    const { Contrasena, ...usuarioSinPassword } = usuario;

   
    if (tipoUsuario !== "DESARROLLADOR") {
      const {
        especialidades,
        servicios,
        curriculum,
        imagenesUsuario,
        Descripcion,
        AnosExperiencia,
        Ubicacion,
        TituloProfesional,
        TarifaBase,
        Disponibilidad,
        Universidad,
        ...usuarioBase
      } = usuarioSinPassword;

      return usuarioBase;
    }


    

   
    const { promedio, totalResenas } =
      await ResenaService.promedioCalificacionPorProfesional(usuarioId);

    return {
      ...usuarioSinPassword,
      calificacion: {
        promedio,
        totalResenas,
      },

      async getByFechas(DiaInicial: Date, DiaFinal: Date) {
        return await prisma.usuario.findMany({
          where: {
            CreatedAt: {
              gte: DiaInicial,
              lte: DiaFinal,
            },
          },
          include: { especialidades: true },
        });
      },
    };
  },


async getByFechas(DiaInicial: Date, DiaFinal: Date) {
    return await prisma.usuario.findMany({
      where: {
        CreatedAt: {
          gte: DiaInicial,
          lte: DiaFinal,
        },
      },
      include: { especialidades: true },
    });
  },

};
