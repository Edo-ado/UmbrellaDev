import { z } from "zod";

const estadoServicioEnum = z.enum(["ACTIVO", "INACTIVO"]);
const modalidadEnum = z.enum(["PRESENCIAL", "VIRTUAL", "HIBRIDA"]);

export const createServicioSchema = z.object({
  Nombre: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),

  Descripcion: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar 500 caracteres")
    .optional(),

  Precio: z.coerce
    .number({
      error: "El precio debe ser numérico",
    })
    .positive("El precio debe ser mayor que cero"),

  Duracion: z.coerce
    .number({
      error: "La duración debe ser numérica",
    })
    .int("La duración debe ser un número entero")
    .positive("La duración debe ser mayor que cero"),

  Estado: estadoServicioEnum.default("ACTIVO"),

  Modalidad: modalidadEnum.default("PRESENCIAL"),

  idprofesional: z.coerce
    .number({
      error: "El profesional es obligatorio",
    })
    .int("El profesional debe ser válido")
    .positive("El profesional es obligatorio"),

  idcategoria: z.coerce
    .number({
      error: "La categoría es obligatoria",
    })
    .int("La categoría debe ser válida")
    .positive("La categoría es obligatoria"),

    
especialidadIds: z.array(
  z.coerce
    .number({ error: "La especialidad debe ser válida" })
    .int("La especialidad debe ser válida")
    .positive("La especialidad debe ser válida")
).min(1, "Debe seleccionar al menos una especialidad"),
});


export const updateServicioSchema = createServicioSchema;

export type CreateServicioDto = z.infer<typeof createServicioSchema>;
export type UpdateServicioDto = z.infer<typeof updateServicioSchema>;