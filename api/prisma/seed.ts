import { prisma } from "../src/config/prisma";
import { Role, ESTADOCITA, Estado, MODALIDAD } from "../generated/prisma/client";
import bcrypt from "bcryptjs";


function sumarMinutos(hora: string, minutos: number): string {
  const [h, m] = hora.split(":").map(Number);
  const totalMinutos = h * 60 + m + minutos;
  const horas = Math.floor(totalMinutos / 60) % 24;
  const mins = totalMinutos % 60;
  return `${String(horas).padStart(2, "0")}:${String(mins).padStart(2, "0")}`;
}


function sumarHoras(fecha: Date, horas: number): Date {
  return new Date(fecha.getTime() + horas * 60 * 60 * 1000);
}

function combinarFechaHora(fechaISO: string, hora: string): Date {
  const [h, m] = hora.split(":").map(Number);
  const fecha = new Date(`${fechaISO}T00:00:00`);
  fecha.setHours(h, m, 0, 0);
  return fecha;
}

async function main() {
  console.log("Iniciando seed...");

  const passwordHash = await bcrypt.hash("1221", 10);


  const models = [
    prisma.imagenesServicio,
    prisma.imagenesUsuario,
    prisma.imagenes,
    prisma.resena,
    prisma.historialEstadoCita,
    prisma.cita,
    prisma.servicio,
    prisma.curriculum,
    prisma.especialidad,
    prisma.categoria,
    prisma.usuario,
  ];
  for (const model of models) {
    await (model as any).deleteMany();
  }

  await prisma.$executeRaw`ALTER TABLE Resena AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE HistorialEstadoCita AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Cita AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE ImagenesServicio AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE ImagenesUsuario AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Curriculum AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Servicio AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Usuario AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Especialidad AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Categoria AUTO_INCREMENT = 1`;
  await prisma.$executeRaw`ALTER TABLE Imagenes AUTO_INCREMENT = 1`;

  
  await prisma.categoria.createMany({
    data: [
      { Nombre: "Desarrollo de software", Descripcion: "Servicios de desarrollo y programación de software.", Estado: Estado.ACTIVO },
      { Nombre: "Mantenimientos de Computadoras", Descripcion: "Reparación y mantenimiento de equipos de cómputo.", Estado: Estado.ACTIVO },
      { Nombre: "Mantenimiento de Consolas", Descripcion: "Reparación y mantenimiento de consolas de videojuegos.", Estado: Estado.ACTIVO },
      { Nombre: "Hogar", Descripcion: "Servicios y productos para el hogar.", Estado: Estado.ACTIVO },
      { Nombre: "Arreglo de Celulares", Descripcion: "Reparación de dispositivos móviles.", Estado: Estado.INACTIVO },
      { Nombre: "Magia (Consolas)", Descripcion: "Modificaciones y desbloqueados especiales para consolas.", Estado: Estado.INACTIVO },
      { Nombre: "Asesoramiento", Descripcion: "Consultoría y orientación técnica.", Estado: Estado.ACTIVO },
      { Nombre: "Análisis de datos", Descripcion: "Procesamiento, análisis y visualización de datos.", Estado: Estado.ACTIVO },
    ],
  });

  const [
    catSoftware, catComputadoras, catConsolas, catHogar,
    catCelulares, catMagia, catAsesoramiento, catAnalisisDatos,
  ] = await Promise.all([
    prisma.categoria.findFirst({ where: { Nombre: "Desarrollo de software" } }),
    prisma.categoria.findFirst({ where: { Nombre: "Mantenimientos de Computadoras" } }),
    prisma.categoria.findFirst({ where: { Nombre: "Mantenimiento de Consolas" } }),
    prisma.categoria.findFirst({ where: { Nombre: "Hogar" } }),
    prisma.categoria.findFirst({ where: { Nombre: "Arreglo de Celulares" } }),
    prisma.categoria.findFirst({ where: { Nombre: "Magia (Consolas)" } }),
    prisma.categoria.findFirst({ where: { Nombre: "Asesoramiento" } }),
    prisma.categoria.findFirst({ where: { Nombre: "Análisis de datos" } }),
  ]);

  if (!catSoftware || !catComputadoras || !catConsolas || !catHogar ||
      !catCelulares || !catMagia || !catAsesoramiento || !catAnalisisDatos) {
    throw new Error("Error: no se encontraron todas las categorías.");
  }

 
  await prisma.especialidad.createMany({
    data: [
      { Nombre: "Html", CategoriaId: catSoftware.Id },
      { Nombre: "Oracle", CategoriaId: catSoftware.Id },
      { Nombre: "Css", CategoriaId: catSoftware.Id },
      { Nombre: "Angular", CategoriaId: catSoftware.Id },
      { Nombre: "React", CategoriaId: catSoftware.Id },
      { Nombre: "NodeJS", CategoriaId: catSoftware.Id },
      { Nombre: "MySQL", CategoriaId: catSoftware.Id },
      { Nombre: "SQLServer", CategoriaId: catSoftware.Id },
      { Nombre: "MongoDB", CategoriaId: catSoftware.Id },
      { Nombre: "XAMP", CategoriaId: catSoftware.Id },
      { Nombre: "Postman", CategoriaId: catSoftware.Id },
      { Nombre: "API", CategoriaId: catSoftware.Id },
      { Nombre: "ApiRest", CategoriaId: catSoftware.Id },
      { Nombre: "Wordpress", CategoriaId: catSoftware.Id },
      { Nombre: "Shopify", CategoriaId: catSoftware.Id },
      { Nombre: "Microsoft Azure", CategoriaId: catSoftware.Id },
      { Nombre: "Android Studio", CategoriaId: catSoftware.Id },
      { Nombre: "Amazon Web Services", CategoriaId: catSoftware.Id },
      { Nombre: "Xcode", CategoriaId: catSoftware.Id, Estado: Estado.INACTIVO },
      { Nombre: "Docker", CategoriaId: catSoftware.Id, Estado: Estado.INACTIVO },
      { Nombre: "Kubernetes", CategoriaId: catSoftware.Id, Estado: Estado.INACTIVO },
      { Nombre: "Linux", CategoriaId: catSoftware.Id },
      { Nombre: "iOS", CategoriaId: catSoftware.Id },
      { Nombre: "Windows", CategoriaId: catSoftware.Id },
      { Nombre: "Android", CategoriaId: catSoftware.Id },
      { Nombre: "Git", CategoriaId: catSoftware.Id },
      { Nombre: "Terraform", CategoriaId: catSoftware.Id },
      { Nombre: "Cisco", CategoriaId: catSoftware.Id },
      { Nombre: "Problemas de Software", CategoriaId: catSoftware.Id },
      { Nombre: "Computadoras", CategoriaId: catComputadoras.Id },
      { Nombre: "Laptops", CategoriaId: catComputadoras.Id },
      { Nombre: "Monitores", CategoriaId: catComputadoras.Id },
      { Nombre: "UPS", CategoriaId: catComputadoras.Id },
      { Nombre: "Nvidia", CategoriaId: catComputadoras.Id },
      { Nombre: "AMD", CategoriaId: catComputadoras.Id },
      { Nombre: "Intel", CategoriaId: catComputadoras.Id },
      { Nombre: "Teclados", CategoriaId: catComputadoras.Id },
      { Nombre: "Mouse", CategoriaId: catComputadoras.Id },
      { Nombre: "Audífonos", CategoriaId: catComputadoras.Id },
      { Nombre: "Impresoras", CategoriaId: catComputadoras.Id },
      { Nombre: "Webcams", CategoriaId: catComputadoras.Id },
      { Nombre: "Parlantes", CategoriaId: catComputadoras.Id },
      { Nombre: "Micrófonos", CategoriaId: catComputadoras.Id },
      { Nombre: "Play Station 4", CategoriaId: catConsolas.Id },
      { Nombre: "Nintendo Switch", CategoriaId: catConsolas.Id },
      { Nombre: "Xbox One", CategoriaId: catConsolas.Id },
      { Nombre: "Iluminación", CategoriaId: catHogar.Id },
      { Nombre: "Electrodomésticos", CategoriaId: catHogar.Id },
      { Nombre: "iPhone", CategoriaId: catCelulares.Id },
      { Nombre: "Samsung", CategoriaId: catCelulares.Id },
      { Nombre: "Switch Arista", CategoriaId: catMagia.Id },
      { Nombre: "PS4 Jailbreak", CategoriaId: catMagia.Id },
      { Nombre: "Componentes", CategoriaId: catAsesoramiento.Id },
      { Nombre: "Machine learning", CategoriaId: catAnalisisDatos.Id },
      { Nombre: "Power BI", CategoriaId: catAnalisisDatos.Id },
      { Nombre: "Excel", CategoriaId: catAnalisisDatos.Id },
      { Nombre: "Python", CategoriaId: catAnalisisDatos.Id },
      { Nombre: "R", CategoriaId: catAnalisisDatos.Id },
      { Nombre: "Tableau", CategoriaId: catAnalisisDatos.Id },
    ],
  });

  const categorias = await prisma.categoria.findMany();
  const especialidades = await prisma.especialidad.findMany();
  const catMap = Object.fromEntries(categorias.map((c: { Id: number; Nombre: string }) => [c.Nombre, c.Id]));
  const espMap = Object.fromEntries(especialidades.map((e: { Id: number; Nombre: string }) => [e.Nombre, e.Id]));

  

  await prisma.usuario.create({
    data: {
      NombreCompleto: "Eduardo Ulloa",
      Email: "eduardo@admin.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-0001",
      Role: Role.ADMIN,
      Estado: Estado.ACTIVO,
    },
  });

  await prisma.usuario.create({
    data: {
      NombreCompleto: "Ashley Sibaja",
      Email: "ashley@admin.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-0002",
      Role: Role.ADMIN,
      Estado: Estado.ACTIVO,
    },
  });

  // --- Profesionales (5: 3 disponibles, 2 no disponibles; 4 activos, 1 inactivo) ---
  await prisma.usuario.create({
    data: {
      NombreCompleto: "Carlos Méndez",
      Email: "carlos@profesional.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-1111",
      Role: Role.DESARROLLADOR,
      Estado: Estado.ACTIVO,
      Modalidad: MODALIDAD.HIBRIDA,
      Descripcion: "Desarrollador backend especializado en APIs REST.",
      AnosExperiencia: 5,
      Ubicacion: "San José",
      TituloProfesional: "Ingeniero en Sistemas",
      TarifaBase: 18000,
      Disponibilidad: false,
      Universidad: "TEC",
      especialidades: {
        connect: [{ Id: espMap["NodeJS"] }, { Id: espMap["MySQL"] }, { Id: espMap["API"] }, { Id: espMap["Problemas de Software"] }],
      },
    },
  });

  await prisma.usuario.create({
    data: {
      NombreCompleto: "María Solano",
      Email: "maria@profesional.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-1112",
      Role: Role.DESARROLLADOR,
      Estado: Estado.ACTIVO,
      Modalidad: MODALIDAD.VIRTUAL,
      Descripcion: "Especialista en frontend con Angular y UX.",
      AnosExperiencia: 4,
      Ubicacion: "San José",
      TituloProfesional: "Ingeniera en Sistemas",
      TarifaBase: 16000,
      Disponibilidad: true,
      Universidad: "UCR",
      especialidades: {
        connect: [{ Id: espMap["Angular"] }, { Id: espMap["React"] }, { Id: espMap["Css"] }, { Id: espMap["Html"] }],
      },
    },
  });

  await prisma.usuario.create({
    data: {
      NombreCompleto: "Andrés Rojas",
      Email: "andres@profesional.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-1113",
      Role: Role.DESARROLLADOR,
      Estado: Estado.ACTIVO,
      Modalidad: MODALIDAD.PRESENCIAL,
      Descripcion: "Técnico en mantenimiento de equipos de cómputo.",
      AnosExperiencia: 6,
      Ubicacion: "Alajuela",
      TituloProfesional: "Ingeniero en Computación",
      TarifaBase: 20000,
      Disponibilidad: true,
      Universidad: "TEC",
      especialidades: {
        connect: [{ Id: espMap["Laptops"] }, { Id: espMap["Computadoras"] }],
      },
    },
  });

  await prisma.usuario.create({
    data: {
      NombreCompleto: "Sofía Vargas",
      Email: "sofia@profesional.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-1114",
      Role: Role.DESARROLLADOR,
      Estado: Estado.ACTIVO,
      Modalidad: MODALIDAD.VIRTUAL,
      Descripcion: "Analista de datos con experiencia en Power BI y Python.",
      AnosExperiencia: 3,
      Ubicacion: "Heredia",
      TituloProfesional: "Ingeniera en Estadística",
      TarifaBase: 15000,
      Disponibilidad: true,
      Universidad: "UNA",
      especialidades: {
        connect: [{ Id: espMap["Power BI"] }, { Id: espMap["Excel"] }, { Id: espMap["Python"] }],
      },
    },
  });

  await prisma.usuario.create({
    data: {
      NombreCompleto: "Luis Fernández",
      Email: "luis@profesional.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-1115",
      Role: Role.DESARROLLADOR,
      Estado: Estado.INACTIVO,
      Modalidad: MODALIDAD.PRESENCIAL,
      Descripcion: "Técnico en modificación y reparación de consolas de videojuegos.",
      AnosExperiencia: 7,
      Ubicacion: "Cartago",
      TituloProfesional: "Técnico en Electrónica",
      TarifaBase: 22000,
      Disponibilidad: false,
      Universidad: "INA",
      especialidades: {
        connect: [{ Id: espMap["Play Station 4"] }, { Id: espMap["Xbox One"] }],
      },
    },
  });

  // --- Clientes (5: activos, inactivo y baneado) ---
  await prisma.usuario.create({
    data: {
      NombreCompleto: "Daniela Castro",
      Email: "daniela@cliente.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-2222",
      Role: Role.USUARIO,
      Estado: Estado.ACTIVO,
    },
  });

  await prisma.usuario.create({
    data: {
      NombreCompleto: "José Araya",
      Email: "jose@cliente.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-2223",
      Role: Role.USUARIO,
      Estado: Estado.ACTIVO,
    },
  });

  await prisma.usuario.create({
    data: {
      NombreCompleto: "Fernanda Jiménez",
      Email: "fernanda@cliente.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-2224",
      Role: Role.USUARIO,
      Estado: Estado.ACTIVO,
    },
  });

  await prisma.usuario.create({
    data: {
      NombreCompleto: "Ricardo Mora",
      Email: "ricardo@cliente.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-2225",
      Role: Role.USUARIO,
      Estado: Estado.INACTIVO,
    },
  });

  await prisma.usuario.create({
    data: {
      NombreCompleto: "Valeria Chinchilla",
      Email: "valeria@cliente.com",
      Contrasena: passwordHash,
      Pais: "Costa Rica",
      Telefono: "8888-2226",
      Role: Role.USUARIO,
      Estado: Estado.BANEADO,
    },
  });

  const usuarios = await prisma.usuario.findMany({ select: { Id: true, Email: true } });
  const userMap: Record<string, number> = Object.fromEntries(usuarios.map((u: { Id: number; Email: string }) => [u.Email, u.Id]));

  // -------------------------------------------------------------------------
  // Servicios (8 -> mínimo pedido: 8, activos e inactivos, precios/duraciones/
  // categorías/modalidades distintas)
  // -------------------------------------------------------------------------
  await prisma.servicio.create({
    data: {
      Nombre: "Desarrollo de API REST",
      Descripcion: "API con Node.js, Prisma y MySQL.",
      Precio: 95000,
      Duracion: 480,
      Estado: Estado.ACTIVO,
      Modalidad: MODALIDAD.HIBRIDA,
      profesional: { connect: { Id: userMap["carlos@profesional.com"] } },
      categoria: { connect: { Id: catMap["Desarrollo de software"] } },
      servicioEspecialidades: { connect: [{ Id: espMap["NodeJS"] }, { Id: espMap["MySQL"] }] },
    },
  });

  await prisma.servicio.create({
    data: {
      Nombre: "Landing page en Angular",
      Descripcion: "Sitio responsivo con Angular y CSS moderno.",
      Precio: 70000,
      Duracion: 360,
      Estado: Estado.ACTIVO,
      Modalidad: MODALIDAD.VIRTUAL,
      profesional: { connect: { Id: userMap["maria@profesional.com"] } },
      categoria: { connect: { Id: catMap["Desarrollo de software"] } },
      servicioEspecialidades: { connect: [{ Id: espMap["Angular"] }, { Id: espMap["Css"] }, { Id: espMap["Html"] }] },
    },
  });

  await prisma.servicio.create({
    data: {
      Nombre: "Mantenimiento preventivo de laptop",
      Descripcion: "Limpieza interna, cambio de pasta térmica y revisión general.",
      Precio: 25000,
      Duracion: 120,
      Estado: Estado.ACTIVO,
      Modalidad: MODALIDAD.PRESENCIAL,
      profesional: { connect: { Id: userMap["andres@profesional.com"] } },
      categoria: { connect: { Id: catMap["Mantenimientos de Computadoras"] } },
      servicioEspecialidades: { connect: [{ Id: espMap["Laptops"] }, { Id: espMap["Computadoras"] }] },
    },
  });

  await prisma.servicio.create({
    data: {
      Nombre: "Dashboard en Power BI",
      Descripcion: "Construcción de tablero interactivo para análisis empresarial.",
      Precio: 85000,
      Duracion: 300,
      Estado: Estado.INACTIVO,
      Modalidad: MODALIDAD.VIRTUAL,
      profesional: { connect: { Id: userMap["sofia@profesional.com"] } },
      categoria: { connect: { Id: catMap["Análisis de datos"] } },
      servicioEspecialidades: { connect: [{ Id: espMap["Power BI"] }, { Id: espMap["Excel"] }] },
    },
  });

  await prisma.servicio.create({
    data: {
      Nombre: "Consultoría en arquitectura backend",
      Descripcion: "Revisión y recomendaciones sobre la arquitectura de tu sistema.",
      Precio: 45000,
      Duracion: 90,
      Estado: Estado.ACTIVO,
      Modalidad: MODALIDAD.VIRTUAL,
      profesional: { connect: { Id: userMap["carlos@profesional.com"] } },
      categoria: { connect: { Id: catMap["Asesoramiento"] } },
      servicioEspecialidades: { connect: [{ Id: espMap["API"] }, { Id: espMap["Problemas de Software"] }] },
    },
  });

  await prisma.servicio.create({
    data: {
      Nombre: "Optimización de rendimiento web",
      Descripcion: "Mejora de tiempos de carga y experiencia de usuario en sitios existentes.",
      Precio: 55000,
      Duracion: 180,
      Estado: Estado.ACTIVO,
      Modalidad: MODALIDAD.HIBRIDA,
      profesional: { connect: { Id: userMap["maria@profesional.com"] } },
      categoria: { connect: { Id: catMap["Desarrollo de software"] } },
      servicioEspecialidades: { connect: [{ Id: espMap["React"] }, { Id: espMap["Css"] }] },
    },
  });

  await prisma.servicio.create({
    data: {
      Nombre: "Reparación de fuente de poder",
      Descripcion: "Diagnóstico y cambio de fuente de poder en equipos de escritorio.",
      Precio: 18000,
      Duracion: 60,
      Estado: Estado.INACTIVO,
      Modalidad: MODALIDAD.PRESENCIAL,
      profesional: { connect: { Id: userMap["andres@profesional.com"] } },
      categoria: { connect: { Id: catMap["Mantenimientos de Computadoras"] } },
      servicioEspecialidades: { connect: [{ Id: espMap["Computadoras"] }] },
    },
  });

  await prisma.servicio.create({
    data: {
      Nombre: "Modificación de consola PS4",
      Descripcion: "Instalación de firmware personalizado y mantenimiento de PS4.",
      Precio: 30000,
      Duracion: 150,
      Estado: Estado.ACTIVO,
      Modalidad: MODALIDAD.PRESENCIAL,
      profesional: { connect: { Id: userMap["luis@profesional.com"] } },
      categoria: { connect: { Id: catMap["Mantenimiento de Consolas"] } },
      servicioEspecialidades: { connect: [{ Id: espMap["Play Station 4"] }] },
    },
  });

  const servicios = await prisma.servicio.findMany({ select: { Id: true, Nombre: true, Precio: true, Duracion: true } });
  const servicioMap: Record<string, { Id: number; Precio: number; Duracion: number }> = Object.fromEntries(
    servicios.map((s: { Id: number; Nombre: string; Precio: number; Duracion: number | null }) => [
      s.Nombre,
      { Id: s.Id, Precio: s.Precio, Duracion: s.Duracion ?? 60 },
    ])
  );

 
  type EstadoCitaKey = keyof typeof ESTADOCITA;

  interface CitaSeed {
    clienteEmail: string;
    profesionalEmail: string;
    servicioNombre: string;
    fecha: string; // yyyy-mm-dd
    hora: string;  // HH:mm
    modalidad: MODALIDAD;
    descripcion: string;
    comentarios?: string;
    estadoFinal: EstadoCitaKey;
    motivoRechazo?: string;
    motivoCancelacion?: string;
    transiciones: { de: EstadoCitaKey; a: EstadoCitaKey; motivo?: string }[];
    resena?: { puntuacion: number; comentario?: string };
  }

  const citasSeed: CitaSeed[] = [
    {
      
      clienteEmail: "daniela@cliente.com",
      profesionalEmail: "carlos@profesional.com",
      servicioNombre: "Desarrollo de API REST",
      fecha: "2026-08-25",
      hora: "09:00",
      modalidad: MODALIDAD.HIBRIDA,
      descripcion: "Necesito una API REST para gestión de usuarios.",
      estadoFinal: "PENDIENTE",
      transiciones: [],
    },
    {
      clienteEmail: "jose@cliente.com",
      profesionalEmail: "carlos@profesional.com",
      servicioNombre: "Consultoría en arquitectura backend",
      fecha: "2026-08-25",
      hora: "09:30",
      modalidad: MODALIDAD.VIRTUAL,
      descripcion: "Quiero asesoría rápida sobre mi arquitectura backend.",
      estadoFinal: "PENDIENTE",
      transiciones: [],
    },
    {
      // Futura, ACEPTADA (candidata a cancelar en la demo)
      clienteEmail: "fernanda@cliente.com",
      profesionalEmail: "maria@profesional.com",
      servicioNombre: "Landing page en Angular",
      fecha: "2026-08-28",
      hora: "08:00",
      modalidad: MODALIDAD.VIRTUAL,
      descripcion: "Quiero una landing moderna para mi negocio.",
      comentarios: "Perfecto, comenzamos según lo acordado.",
      estadoFinal: "ACEPTADA",
      transiciones: [{ de: "PENDIENTE", a: "ACEPTADA" }],
    },
    {
      clienteEmail: "daniela@cliente.com",
      profesionalEmail: "andres@profesional.com",
      servicioNombre: "Mantenimiento preventivo de laptop",
      fecha: "2026-08-26",
      hora: "10:00",
      modalidad: MODALIDAD.PRESENCIAL,
      descripcion: "Mi laptop se apaga sola y suena mucho el ventilador.",
      comentarios: "Confirmado, llevo mis herramientas.",
      estadoFinal: "ACEPTADA",
      transiciones: [{ de: "PENDIENTE", a: "ACEPTADA" }],
    },
    {
      // Futura, PENDIENTE (con profesional inactivo Luis, sirve para probar
      // reglas de "profesional no disponible")
      clienteEmail: "daniela@cliente.com",
      profesionalEmail: "luis@profesional.com",
      servicioNombre: "Modificación de consola PS4",
      fecha: "2026-09-02",
      hora: "13:00",
      modalidad: MODALIDAD.PRESENCIAL,
      descripcion: "Quiero instalar firmware personalizado en mi PS4.",
      estadoFinal: "PENDIENTE",
      transiciones: [],
    },
    {
      // Pasada, RECHAZADA
      clienteEmail: "daniela@cliente.com",
      profesionalEmail: "andres@profesional.com",
      servicioNombre: "Mantenimiento preventivo de laptop",
      fecha: "2026-07-20",
      hora: "08:00",
      modalidad: MODALIDAD.PRESENCIAL,
      descripcion: "Necesito revisión general de mi equipo.",
      estadoFinal: "RECHAZADA",
      motivoRechazo: "No hay disponibilidad de repuestos para esa fecha.",
      transiciones: [{ de: "PENDIENTE", a: "RECHAZADA", motivo: "No hay disponibilidad de repuestos para esa fecha." }],
    },
    {
      // Pasada, CANCELADA desde Pendiente (cliente)
      clienteEmail: "jose@cliente.com",
      profesionalEmail: "carlos@profesional.com",
      servicioNombre: "Consultoría en arquitectura backend",
      fecha: "2026-08-10",
      hora: "14:00",
      modalidad: MODALIDAD.VIRTUAL,
      descripcion: "Necesito revisar la arquitectura de mi backend.",
      estadoFinal: "CANCELADA",
      motivoCancelacion: "Se me presentó un imprevisto laboral.",
      transiciones: [{ de: "PENDIENTE", a: "CANCELADA", motivo: "Se me presentó un imprevisto laboral." }],
    },
    {
      // Pasada, CANCELADA desde Aceptada (profesional)
      clienteEmail: "fernanda@cliente.com",
      profesionalEmail: "maria@profesional.com",
      servicioNombre: "Landing page en Angular",
      fecha: "2026-08-12",
      hora: "08:00",
      modalidad: MODALIDAD.VIRTUAL,
      descripcion: "Deseo una página promocional para mis servicios.",
      estadoFinal: "CANCELADA",
      motivoCancelacion: "El profesional tuvo una emergencia médica.",
      transiciones: [
        { de: "PENDIENTE", a: "ACEPTADA" },
        { de: "ACEPTADA", a: "CANCELADA", motivo: "El profesional tuvo una emergencia médica." },
      ],
    },
    {
      // Pasada, COMPLETA, CON reseña (calificación alta)
      clienteEmail: "daniela@cliente.com",
      profesionalEmail: "sofia@profesional.com",
      servicioNombre: "Dashboard en Power BI",
      fecha: "2026-08-01",
      hora: "10:30",
      modalidad: MODALIDAD.VIRTUAL,
      descripcion: "Necesito analizar inventario y ventas.",
      estadoFinal: "COMPLETA",
      transiciones: [
        { de: "PENDIENTE", a: "ACEPTADA" },
        { de: "ACEPTADA", a: "COMPLETA" },
      ],
      resena: { puntuacion: 5, comentario: "Excelente trabajo, el tablero quedó justo como lo necesitaba." },
    },
    {
      // Pasada, COMPLETA, CON reseña
      clienteEmail: "jose@cliente.com",
      profesionalEmail: "carlos@profesional.com",
      servicioNombre: "Desarrollo de API REST",
      fecha: "2026-07-15",
      hora: "09:00",
      modalidad: MODALIDAD.HIBRIDA,
      descripcion: "Busco apoyo para backend con Node.js.",
      estadoFinal: "COMPLETA",
      transiciones: [
        { de: "PENDIENTE", a: "ACEPTADA" },
        { de: "ACEPTADA", a: "COMPLETA" },
      ],
      resena: { puntuacion: 4, comentario: "Buen trabajo, cumplió con lo acordado en el tiempo esperado." },
    },
    {
      // Pasada, COMPLETA, SIN reseña (para distinguir de las ya calificadas)
      clienteEmail: "fernanda@cliente.com",
      profesionalEmail: "maria@profesional.com",
      servicioNombre: "Optimización de rendimiento web",
      fecha: "2026-08-05",
      hora: "09:00",
      modalidad: MODALIDAD.HIBRIDA,
      descripcion: "Mi sitio carga muy lento y quiero mejorarlo.",
      estadoFinal: "COMPLETA",
      transiciones: [
        { de: "PENDIENTE", a: "ACEPTADA" },
        { de: "ACEPTADA", a: "COMPLETA" },
      ],
 
    },
    {
      // Pasada, COMPLETA, CON reseña baja (para el reporte de "baja calificación")
      clienteEmail: "jose@cliente.com",
      profesionalEmail: "andres@profesional.com",
      servicioNombre: "Reparación de fuente de poder",
      fecha: "2026-07-25",
      hora: "09:00",
      modalidad: MODALIDAD.PRESENCIAL,
      descripcion: "Mi computadora no enciende, sospecho de la fuente de poder.",
      estadoFinal: "COMPLETA",
      transiciones: [
        { de: "PENDIENTE", a: "ACEPTADA" },
        { de: "ACEPTADA", a: "COMPLETA" },
      ],
      resena: { puntuacion: 2, comentario: "El servicio fue aceptable pero tardó más de lo esperado." },
    },
  ];

  for (const c of citasSeed) {
    const servicio = servicioMap[c.servicioNombre];
    const fechaHoraInicio = combinarFechaHora(c.fecha, c.hora);
    const fechaHoraFin = sumarHoras(fechaHoraInicio, servicio.Duracion);
    
    const horaFin = sumarMinutos(c.hora, servicio.Duracion * 60);

    const citaCreada = await prisma.cita.create({
      data: {
        idcliente: userMap[c.clienteEmail],
        idprofesional: userMap[c.profesionalEmail],
        idservicio: servicio.Id,
        fechaHora: fechaHoraInicio,
        FechaHoraFin: fechaHoraFin,
        Fecha: new Date(`${c.fecha}T00:00:00`),
        Hora: c.hora,
        HoraFin: horaFin,
        TiempoTotal: servicio.Duracion,
        Monto: servicio.Precio,
        Modalidad: c.modalidad,
        Descripcion: c.descripcion,
        Comentarios: c.comentarios,
        Estado: ESTADOCITA[c.estadoFinal],
        MotivoRechazo: c.motivoRechazo,
        MotivoCancelacion: c.motivoCancelacion,
      },
    });

    if (c.transiciones.length > 0) {
      await prisma.historialEstadoCita.createMany({
        data: c.transiciones.map((t) => ({
          citaId: citaCreada.Id,
          EstadoAnterior: ESTADOCITA[t.de],
          EstadoNuevo: ESTADOCITA[t.a],
          Motivo: t.motivo,
        })),
      });
    }

    if (c.resena) {
      await prisma.resena.create({
        data: {
          citaId: citaCreada.Id,
          clienteId: userMap[c.clienteEmail],
          profesionalId: userMap[c.profesionalEmail],
          Puntuacion: c.resena.puntuacion,
          Comentario: c.resena.comentario,
        },
      });
    }
  }

  
  await prisma.imagenes.createMany({
    data: [{ Url: "api/assets/uploads/EjemploBorrar.png" }],
  });

  await prisma.curriculum.createMany({
    data: [
      { Url: "https://example.com/cv-andres.pdf", UsuarioID: userMap["andres@profesional.com"] },
      { Url: "https://example.com/cv-luis.pdf", UsuarioID: userMap["luis@profesional.com"] },
    ],
  });

  await prisma.imagenesServicio.createMany({ data: [] });
  await prisma.imagenesUsuario.createMany({ data: [] });

  console.log("Seed completado con éxito.");
  console.log(`Usuarios: ${usuarios.length} | Servicios: ${servicios.length} | Citas: ${citasSeed.length} | Reseñas: ${citasSeed.filter((c) => c.resena).length}`);
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });