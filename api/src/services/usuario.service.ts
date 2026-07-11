import {  MODALIDAD, Role, Estado } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { CreateUsuarioDto, UpdateUsuarioDto } from "../dtos/usuario.dto";
import { AppError } from "../utils/app-error";

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
    Foto: data.Foto ?? null,
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
      Foto: data.Foto,
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
}

}