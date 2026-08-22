import bcrypt from "bcryptjs";
import {  MODALIDAD, Role, Estado } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../dtos/usuario.dto";
import { AppError } from "../utils/app-error";
import jwt, {
    Secret,
    SignOptions
} from "jsonwebtoken"


export const UsuarioService = {
  async getAll() {
  return await prisma.usuario.findMany({
    include: { especialidades: true},
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

  async searchByNombre(Nombre :string){

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
      Estado: nuevoEstado
    }
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

async getAllDesarrolladoresActivos() {
  return await prisma.usuario.findMany({
    where: { Role: "DESARROLLADOR", Estado: "ACTIVO" }, 
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

   async actualizar(id: number, data: UpdateUsuarioDto) {

await this.validateUsuario(id)//reviso si exsite
await this.getById(id)

//futuras validaciones que iremos viendo

 return prisma.usuario.update({
    where: { Id: id },
    data: {
   NombreCompleto: data.NombreCompleto,
      Email: data.Email,
     
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
        ? {  set: data.especialidadIds.map((Id) => ({ Id })),
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

  async validateUsuario(Id: number) {
 const usuario = await this.getById(Id);
  if (!usuario) {
  throw AppError.badRequest("El usuario indicado no existe")
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
        where: { Email: data.email }
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
            where: { Email: data.email }
        });
        if (!usuario) {
            throw new Error("Correo o contraseña incorrectos");
        }
        const isPasswordValid = await bcrypt.compare(data.contrasena, usuario.Contrasena);
        if (!isPasswordValid) {
            throw new Error("Correo o contraseña incorrectos");
        }
const payload = {
    Id: usuario.Id,
    Email: usuario.Email,
    Role: usuario.Role,
}
        const secret: Secret = process.env.JWT_SECRET || "vj_utn_2026";
        const options: SignOptions = {
            expiresIn: "2h",
        };
        const token = jwt.sign(payload, secret, options);
        return {
            token
        };
    },
    async perfil(usuarioId: number) {
    const usuario = await prisma.usuario.findUnique({
        where: { Id: usuarioId },
    });
    if (!usuario) {
        throw new Error("El usuario no existe");
    }
    const { Contrasena, ...usuarioSinPassword } = usuario;

    return usuarioSinPassword;
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










}