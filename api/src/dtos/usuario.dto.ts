import { z } from "zod";

const modalidadEnum = z.enum(["PRESENCIAL", "VIRTUAL", "HIBRIDA"]);
const roleEnum = z.enum(["ADMIN", "USUARIO", "DESARROLLADOR"]);
const estadoEnum = z.enum(["ACTIVO", "INACTIVO", "BANEADO"]);

export const createUsuarioSchema = z.object({
  NombreCompleto: z
    .string()
    .trim()
    .min(1, "El nombre es obligatorio")
    .max(150, "El nombre no puede superar 150 caracteres"),

  Email: z
    .string()
    .trim()
    .email("El correo no es válido")
    .max(150, "El correo no puede superar 150 caracteres"),

  Contraseña: z
    .string()
    .trim()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(150, "La contraseña no puede superar 150 caracteres"),

  Telefono: z
    .string()
    .trim()
    .min(8, "El teléfono debe tener al menos 8 caracteres")
    .max(20, "El teléfono no puede superar 20 caracteres")
    .optional(),

  Pais: z
    .string()
    .trim()
    .min(1, "El país es obligatorio")
    .max(100, "El país no puede superar 100 caracteres"),

  Role: roleEnum.default("DESARROLLADOR"),
  Estado: estadoEnum.default("ACTIVO"),

  Modalidad: modalidadEnum,

  TituloProfesional: z
    .string()
    .trim()
    .min(1, "El título es obligatorio")
    .max(150, "El título no puede superar 150 caracteres"),

  Descripcion: z
    .string()
    .trim()
    .max(500, "La descripción no puede superar 500 caracteres")
    .optional(),

  AnosExperiencia: z
    .number({
   error: "La experiencia debe ser numérica",
    })
    .int("La experiencia debe ser un número entero")
    .min(0, "La experiencia no puede ser negativa"),

Edad: z.coerce
  .number({
    error: "La edad debe ser numérica",
  })
  .int("La edad debe ser un número entero")
  .min(0, "La edad no puede ser negativa")
  .optional(),



  Ubicacion: z
    .string()
    .trim()
    .max(150, "La ubicación no puede superar 150 caracteres")
    .optional(),
  TarifaBase: z
    .number({
    error: "La tarifa debe ser numérica",
    })
    .positive("La tarifa debe ser mayor que cero"),
  Disponibilidad: z.boolean().optional(),

 
  Universidad: z
    .string()
    .trim()
    .max(150, "La universidad no puede superar 150 caracteres")
    .optional(),

  Foto: z
    .string()
    .trim()
    .max(255, "El nombre de archivo de la foto no puede superar 255 caracteres")
    .optional(),

  especialidadIds: z
    .array(z.number().int().positive("Especialidad inválida"))
    .optional(),
});

export const updateUsuarioSchema = createUsuarioSchema.partial();

export type CreateUsuarioDto = z.infer<typeof createUsuarioSchema>;
export type UpdateUsuarioDto = z.infer<typeof updateUsuarioSchema>;