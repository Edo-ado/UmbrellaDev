import {  Estado, MODALIDAD } from "../../generated/prisma/enums";
import { prisma } from "../config/prisma";
import { CreateServicioDto } from "../dtos/cita.dto";
import { UpdateServicioDto } from "../dtos/servicio.dto";
import { AppError } from "../utils/app-error";

export const ServicioServices = {
  async getAll() {
    return await prisma.servicio.findMany({
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async getById(id: number) {
    return await prisma.servicio.findUnique({
      where: { Id: id },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async getByProfesional(profesionalId: number) {
    return await prisma.servicio.findMany({
      where: { idprofesional: profesionalId },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async getByCategories(CategoriesID: number) {
    return await prisma.servicio.findMany({
      where: { idcategoria: CategoriesID },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async searchByName(Nombre: string) {
    return await prisma.servicio.findMany({
      where: { Nombre: { contains: Nombre } },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async getByModalidad(modalidad: MODALIDAD) {
    return await prisma.servicio.findMany({
      where: { Modalidad: modalidad },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async getByRangoPrecio(precioMin: number, precioMax: number) {
    return await prisma.servicio.findMany({
      where: {
        Precio: {
          gte: precioMin,
          lte: precioMax,
        },
      },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });
  },

  async toggleStatus(id: number) {


const servicio = await this.getById(id);

 let nuevoEstado: Estado;

  if (servicio?.Estado === "ACTIVO") {
    nuevoEstado = "INACTIVO";
  } else {
    nuevoEstado = "ACTIVO";
  }

return await prisma.servicio.update({
    where: { Id: id },
    data: {
      Estado: nuevoEstado
    }
  });


  }, 

  async create(data: CreateServicioDto) {
//futuras validaciones q ahi iremos agregando

 return await prisma.servicio.create({
      data: {
        Nombre: data.Nombre,
        Descripcion: data.Descripcion,
        Precio: data.Precio,
        Duracion: data.Duracion,
        Estado: data.Estado,
        Modalidad: data.Modalidad,
        profesional: {
          connect: { Id: data.idprofesional },
        },
        categoria: {
          connect: { Id: data.idcategoria },
        },
        servicioEspecialidades: data.especialidadIds?.length
          ? {
              connect: data.especialidadIds.map((id) => ({ Id: id })),
            }
          : undefined,
      },
      include: {
        profesional: true,
        categoria: true,
        servicioEspecialidades: true,
      },
    });





  }, 
  
  async update(id: number, data:  UpdateServicioDto) {
this.validateServicio(id);
    return await prisma.servicio.update({
    where: { Id: id },
    data: {
      Nombre: data.Nombre,
      Descripcion: data.Descripcion,
      Precio: data.Precio,
      Duracion: data.Duracion,
      Estado: data.Estado,
      Modalidad: data.Modalidad,
      profesional: {
        connect: { Id: data.idprofesional },
      },
      categoria: {
        connect: { Id: data.idcategoria },
      },
      servicioEspecialidades: {
        set: data.especialidadIds.map((id) => ({ Id: id })),
      },
    },
    include: {
      profesional: true,
      categoria: true,
      servicioEspecialidades: true,
    },
  });


  }, 


async validateServicio(Id: number) {
 const servicio = await this.getById(Id);
if (!servicio) {
throw AppError.badRequest("El servicio indicado no existe")
}

},







}
