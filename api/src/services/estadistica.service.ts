// import { prisma } from "../config/prisma";

// export const EstadisticaService = {
//   // Trae todas las citas y las agrupa por estado
//   async getCitasPorEstado() {
//     const citas = await prisma.cita.findMany();

//     const conteo: Record<string, number> = {};
//     citas.forEach(c => {
//       conteo[c.Estado] = (conteo[c.Estado] || 0) + 1;
//     });

//     return Object.entries(conteo).map(([estado, total]) => ({ estado, total }));
//   },

//   // Trae todos los usuarios y los agrupa por rol
//   async getUsuariosPorRol() {
//     const usuarios = await prisma.usuario.findMany();

//     const conteo: Record<string, number> = {};
//     usuarios.forEach(u => {
//       conteo[u.Role] = (conteo[u.Role] || 0) + 1;
//     });

//     return Object.entries(conteo).map(([rol, total]) => ({ rol, total }));
//   },

  
// };