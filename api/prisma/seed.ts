import { prisma } from "../src/config/prisma";
import { Role, ESTADOCITA, Estado, MODALIDAD } from "../generated/prisma/client";
import bcrypt from "bcryptjs";

async function main() {
  console.log("Iniciando seed...");

  const passwordHash = await bcrypt.hash("1221", 10);

  //limmpieza
  const models = [
    prisma.imagenesServicio,
    prisma.imagenesUsuario,
    prisma.imagenes,
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

await prisma.$executeRaw`ALTER TABLE Cita AUTO_INCREMENT = 1`;
await prisma.$executeRaw`ALTER TABLE ImagenesServicio AUTO_INCREMENT = 1`;
await prisma.$executeRaw`ALTER TABLE ImagenesUsuario AUTO_INCREMENT = 1`;
await prisma.$executeRaw`ALTER TABLE Curriculum AUTO_INCREMENT = 1`;
await prisma.$executeRaw`ALTER TABLE Servicio AUTO_INCREMENT = 1`;
await prisma.$executeRaw`ALTER TABLE Usuario AUTO_INCREMENT = 1`;
await prisma.$executeRaw`ALTER TABLE Especialidad AUTO_INCREMENT = 1`;
await prisma.$executeRaw`ALTER TABLE Categoria AUTO_INCREMENT = 1`;
await prisma.$executeRaw`ALTER TABLE Imagenes AUTO_INCREMENT = 1`;

  //categorias
  await prisma.categoria.createMany({
    data: [
      { Nombre: "Desarrollo de software", Descripcion: "Servicios de desarrollo y programación de software." },
      { Nombre: "Mantenimientos de Computadoras", Descripcion: "Reparación y mantenimiento de equipos de cómputo." },
      { Nombre: "Mantenimiento de Consolas", Descripcion: "Reparación y mantenimiento de consolas de videojuegos." },
      { Nombre: "Hogar", Descripcion: "Servicios y productos para el hogar." },
      { Nombre: "Arreglo de Celulares", Descripcion: "Reparación de dispositivos móviles." },
      { Nombre: "Magia (Consolas)", Descripcion: "Modificaciones y desbloqueados especiales para consolas." },
      { Nombre: "Asesoramiento", Descripcion: "Consultoría y orientación técnica." },
      { Nombre: "Análisis de datos", Descripcion: "Procesamiento, análisis y visualización de datos." },
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

  //especialidades
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
      { Nombre: "Xcode", CategoriaId: catSoftware.Id },
      { Nombre: "Docker", CategoriaId: catSoftware.Id },
      { Nombre: "Kubernetes", CategoriaId: catSoftware.Id },
      { Nombre: "Linux", CategoriaId: catSoftware.Id },
      { Nombre: "iOS", CategoriaId: catSoftware.Id },
      { Nombre: "Windows", CategoriaId: catSoftware.Id },
      { Nombre: "Android", CategoriaId: catSoftware.Id },
      { Nombre: "Git", CategoriaId: catSoftware.Id },
      { Nombre: "Terraform", CategoriaId: catSoftware.Id },
      { Nombre: "Cisco", CategoriaId: catSoftware.Id },
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
      { Nombre: "Problemas de Software", CategoriaId: catAsesoramiento.Id },
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

//usuarios
    await prisma.usuario.create({
      data: {
        NombreCompleto: "Carlos Méndez",
        Email: "carlos@profesional.com",
        Contraseña: passwordHash,
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
          connect: [{ Id: espMap["NodeJS"] }, { Id: espMap["MySQL"] }],
        },
      },
    });

    await prisma.usuario.create({
      data: {
        NombreCompleto: "María Solano",
        Email: "maria@profesional.com",
        Contraseña: passwordHash,
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
          connect: [{ Id: espMap["Angular"] }, { Id: espMap["React"] }, { Id: espMap["Css"] }],
        },
      },
    });

    await prisma.usuario.create({
      data: {
        NombreCompleto: "Andrés Rojas",
        Email: "andres@profesional.com",
        Contraseña: passwordHash,
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
        Contraseña: passwordHash,
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
        NombreCompleto: "Daniela Castro",
        Email: "daniela@cliente.com",
        Contraseña: passwordHash,
        Pais: "Costa Rica",
        Telefono: "8888-2222",
        Role: Role.USUARIO,
        Estado: Estado.ACTIVO,
      },
    });

    await prisma.usuario.create({
      data: {
        NombreCompleto: "Eduardo Ulloa",
        Email: "eduardo@admin.com",
        Contraseña: passwordHash,
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
        Contraseña: passwordHash,
        Pais: "Costa Rica",
        Telefono: "8888-0002",
        Role: Role.ADMIN,
        Estado: Estado.ACTIVO,
      },
    });

  const usuarios = await prisma.usuario.findMany({ select: { Id: true, Email: true } });
  const userMap: Record<string, number> = Object.fromEntries( usuarios.map((u: { Id: number; Email: string }) => [u.Email, u.Id]));

  //servicios
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
      servicioEspecialidades: {
        connect: [{ Id: espMap["NodeJS"] }, { Id: espMap["MySQL"] }],
      },
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
      servicioEspecialidades: {
        connect: [{ Id: espMap["Angular"] }, { Id: espMap["Css"] }, { Id: espMap["Html"] }],
      },
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
      servicioEspecialidades: {
        connect: [{ Id: espMap["Laptops"] }, { Id: espMap["Computadoras"] }],
      },
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
      servicioEspecialidades: {
        connect: [{ Id: espMap["Power BI"] }, { Id: espMap["Excel"] }],
      },
    },
  });

  const servicios = await prisma.servicio.findMany({ select: { Id: true, Nombre: true } });
  const servicioMap: Record<string, number> = Object.fromEntries(servicios.map((s: { Id: number; Nombre: string }) => [s.Nombre, s.Id]) );

  //citas
<<<<<<< HEAD
  await prisma.cita.createMany({
    data: [
      {
        idcliente: userMap["daniela@cliente.com"],
        idprofesional: userMap["carlos@profesional.com"],
        idservicio: servicioMap["Desarrollo de API REST"],
        fechaHora: new Date("2026-06-15"),
        Modalidad: MODALIDAD.VIRTUAL,
        Descripcion: "Necesito una API REST para gestión de usuarios.",
        Estado: ESTADOCITA.PENDIENTE,
      },
      {
        idcliente: userMap["daniela@cliente.com"],
        idprofesional: userMap["sofia@profesional.com"],
        idservicio: servicioMap["Dashboard en Power BI"],
        fechaHora: new Date("2026-06-16"),
        Modalidad: MODALIDAD.VIRTUAL,
        Descripcion: "Ocupo un dashboard para ventas mensuales.",
        Estado: ESTADOCITA.PENDIENTE,
      },
      {
        idcliente: userMap["daniela@cliente.com"],
        idprofesional: userMap["andres@profesional.com"],
        idservicio: servicioMap["Mantenimiento preventivo de laptop"],
        fechaHora: new Date("2026-06-17"),
        Modalidad: MODALIDAD.PRESENCIAL,
        Descripcion: "Mi laptop se apaga sola.",
        Estado: ESTADOCITA.PENDIENTE,
      },
      {
        idcliente: userMap["daniela@cliente.com"],
        idprofesional: userMap["maria@profesional.com"],
        idservicio: servicioMap["Landing page en Angular"],
        fechaHora: new Date("2026-06-18"),
        Modalidad: MODALIDAD.VIRTUAL,
        Descripcion: "Quiero una landing moderna para mi negocio.",
        Estado: ESTADOCITA.PENDIENTE,
=======
// citas
await prisma.cita.createMany({
  data: [
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["carlos@profesional.com"],
      idservicio: servicioMap["Desarrollo de API REST"],
      Fecha: new Date("2026-06-15"),
      Hora: "09:00",
      Modalidad: MODALIDAD.VIRTUAL,
      Descripcion: "Necesito una API REST para gestión de usuarios.",
      Comentarios: "Requiero autenticación y CRUD base.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["sofia@profesional.com"],
      idservicio: servicioMap["Dashboard en Power BI"],
      Fecha: new Date("2026-06-16"),
      Hora: "10:30",
      Modalidad: MODALIDAD.VIRTUAL,
      Descripcion: "Ocupo un dashboard para ventas mensuales.",
      Comentarios: "Necesito gráficos por sucursal.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["andres@profesional.com"],
      idservicio: servicioMap["Mantenimiento preventivo de laptop"],
      Fecha: new Date("2026-06-17"),
      Hora: "08:00",
      Modalidad: MODALIDAD.PRESENCIAL,
      Descripcion: "Mi laptop se apaga sola.",
      Comentarios: "También suena mucho el ventilador.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["maria@profesional.com"],
      idservicio: servicioMap["Landing page en Angular"],
      Fecha: new Date("2026-06-18"),
      Hora: "02:00",
      Modalidad: MODALIDAD.VIRTUAL,
      Descripcion: "Quiero una landing moderna para mi negocio.",
      Comentarios: "Debe ser responsive.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["carlos@profesional.com"],
      idservicio: servicioMap["Desarrollo de API REST"],
      Fecha: new Date("2026-06-19"),
      Hora: "11:00",
      Modalidad: MODALIDAD.HIBRIDA,
      Descripcion: "Necesito exponer endpoints para un sistema web.",
      Comentarios: "Ojalá con Prisma y MySQL.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["maria@profesional.com"],
      idservicio: servicioMap["Landing page en Angular"],
      Fecha: new Date("2026-06-20"),
      Hora: "03:30",
      Modalidad: MODALIDAD.VIRTUAL,
      Descripcion: "Deseo una página promocional para mis servicios.",
      Comentarios: "Con formulario de contacto.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["andres@profesional.com"],
      idservicio: servicioMap["Mantenimiento preventivo de laptop"],
      Fecha: new Date("2026-06-21"),
      Hora: "09:45",
      Modalidad: MODALIDAD.PRESENCIAL,
      Descripcion: "La laptop está muy lenta.",
      Comentarios: "Necesito revisión general.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["sofia@profesional.com"],
      idservicio: servicioMap["Dashboard en Power BI"],
      Fecha: new Date("2026-06-22"),
      Hora: "01:15",
      Modalidad: MODALIDAD.VIRTUAL,
      Descripcion: "Necesito analizar inventario y ventas.",
      Comentarios: "Con filtros por fecha.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["carlos@profesional.com"],
      idservicio: servicioMap["Desarrollo de API REST"],
      Fecha: new Date("2026-06-23"),
      Hora: "04:00",
      Modalidad: MODALIDAD.VIRTUAL,
      Descripcion: "Busco apoyo para backend con Node.js.",
      Comentarios: "Debe incluir documentación en Postman.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["maria@profesional.com"],
      idservicio: servicioMap["Landing page en Angular"],
      Fecha: new Date("2026-06-24"),
      Hora: "10:00",
      Modalidad: MODALIDAD.HIBRIDA,
      Descripcion: "Quiero renovar la web de mi emprendimiento.",
      Comentarios: "Me interesa un diseño limpio.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["andres@profesional.com"],
      idservicio: servicioMap["Mantenimiento preventivo de laptop"],
      Fecha: new Date("2026-06-25"),
      Hora: "12:30",
      Modalidad: MODALIDAD.PRESENCIAL,
      Descripcion: "Necesito cambiar pasta térmica y limpieza interna.",
      Comentarios: "Equipo de uso diario.",
      Estado: ESTADOCITA.PENDIENTE,
    },
    {
      idcliente: userMap["daniela@cliente.com"],
      idprofesional: userMap["sofia@profesional.com"],
      idservicio: servicioMap["Dashboard en Power BI"],
      Fecha: new Date("2026-06-26"),
      Hora: "02:45",
      Modalidad: MODALIDAD.VIRTUAL,
      Descripcion: "Ocupo un tablero para seguimiento de KPIs.",
      Comentarios: "Con datos mensuales y trimestrales.",
      Estado: ESTADOCITA.PENDIENTE,
    },
  ],
});

  //imgs
  await prisma.imagenes.createMany({
    data: [
      { Url: "https://picsum.photos/seed/pro1/400/400" },
      { Url: "https://picsum.photos/seed/pro2/400/400" },
      { Url: "https://picsum.photos/seed/pro3/400/400" },
      { Url: "https://picsum.photos/seed/pro4/400/400" },
      { Url: "https://picsum.photos/seed/serv1/600/400" },
      { Url: "https://picsum.photos/seed/serv2/600/400" },
    ],
  });

  const imagenes = await prisma.imagenes.findMany({ select: { Id: true, Url: true } });
  const imagenMap: Record<string, number> = Object.fromEntries(
    imagenes.map((i: { Id: number; Url: string }) => [i.Url, i.Id])
  );

  //cvs
  await prisma.curriculum.createMany({
    data: [
      {
        Url: "https://example.com/cv-andres.pdf",
        UsuarioID: userMap["andres@profesional.com"],
>>>>>>> origin
      },
    ],
  });

<<<<<<< HEAD
  //imgs
  await prisma.imagenes.createMany({
    data: [
      { Url: "https://picsum.photos/seed/pro1/400/400" },
      { Url: "https://picsum.photos/seed/pro2/400/400" },
      { Url: "https://picsum.photos/seed/pro3/400/400" },
      { Url: "https://picsum.photos/seed/pro4/400/400" },
      { Url: "https://picsum.photos/seed/serv1/600/400" },
      { Url: "https://picsum.photos/seed/serv2/600/400" },
    ],
  });

  const imagenes = await prisma.imagenes.findMany({ select: { Id: true, Url: true } });
  const imagenMap: Record<string, number> = Object.fromEntries(
    imagenes.map((i: { Id: number; Url: string }) => [i.Url, i.Id])
  );

  //cvs
  await prisma.curriculum.createMany({
    data: [
      {
        Url: "https://example.com/cv-andres.pdf",
        UsuarioID: userMap["andres@profesional.com"],
      },
    ],
  });

  //imagenservicio
  await prisma.imagenesServicio.createMany({
    data: [
      {
        idServicio: servicioMap["Desarrollo de API REST"],
        idImagen: imagenMap["https://picsum.photos/seed/serv1/600/400"],
      },
      {
        idServicio: servicioMap["Landing page en Angular"],
        idImagen: imagenMap["https://picsum.photos/seed/serv2/600/400"],
      },
    ],
  });

  //img usuario
  await prisma.imagenesUsuario.createMany({
    data: [
      {
        idImagen: imagenMap["https://picsum.photos/seed/pro1/400/400"],
        idUsuario: userMap["carlos@profesional.com"],
      },
      {
        idImagen: imagenMap["https://picsum.photos/seed/pro2/400/400"],
        idUsuario: userMap["maria@profesional.com"],
      },
    ],
  });

=======
  //imagenservicio
  await prisma.imagenesServicio.createMany({
    data: [
      {
        idServicio: servicioMap["Desarrollo de API REST"],
        idImagen: imagenMap["https://picsum.photos/seed/serv1/600/400"],
      },
      {
        idServicio: servicioMap["Landing page en Angular"],
        idImagen: imagenMap["https://picsum.photos/seed/serv2/600/400"],
      },
    ],
  });

  //img usuario
  await prisma.imagenesUsuario.createMany({
    data: [
      {
        idImagen: imagenMap["https://picsum.photos/seed/pro1/400/400"],
        idUsuario: userMap["carlos@profesional.com"],
      },
      {
        idImagen: imagenMap["https://picsum.photos/seed/pro2/400/400"],
        idUsuario: userMap["maria@profesional.com"],
      },
    ],
  });

>>>>>>> origin
  console.log("Seed completado con éxito.");
}

main()
  .catch((e) => {
    console.error("Error en seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });