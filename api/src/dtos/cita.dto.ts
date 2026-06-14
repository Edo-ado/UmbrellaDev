import { z } from "zod";
import { createServicioSchema } from "./servicio.dto";

const modalidadEnum = z.enum(["PRESENCIAL", "VIRTUAL", "HIBRIDA"], {
  error: "La modalidad es obligatoria",
});

export const createCitaSchema = z.object({
  idcliente: z.coerce
    .number({ error: "El cliente es obligatorio" })
    .int("El cliente debe ser válido")
    .positive("El cliente es obligatorio"),

  idprofesional: z.coerce
    .number({ error: "El profesional es obligatorio" })
    .int("El profesional debe ser válido")
    .positive("El profesional es obligatorio"),

  idservicio: z.coerce
    .number({ error: "El servicio es obligatorio" })
    .int("El servicio debe ser válido")
    .positive("El servicio es obligatorio"),

 Fecha: z
    .string()
    .trim()
    .min(1, "La fecha es obligatoria")
    .refine((value) => !Number.isNaN(Date.parse(value)), {message: "La fecha no tiene un formato válido",
    }),
 Hora: z
    .string()
    .trim()
    .min(1, "La hora es obligatoria")
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "La hora debe tener formato HH:mm"),


  Modalidad: modalidadEnum,

  Descripcion: z
    .string()
    .trim()
    .min(1, "La descripción es obligatoria")
    .max(500, "La descripción no puede superar 500 caracteres"),

  Comentarios: z
    .string()
    .trim()
    .max(500, "Los comentarios no pueden superar 500 caracteres")
    .optional(),
});
    
export type CreateServicioDto = z.infer<typeof createServicioSchema>;