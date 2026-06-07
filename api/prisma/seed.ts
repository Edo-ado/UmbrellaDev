import { Role } from "../generated/prisma/enums";
import { prisma } from "../src/config/prisma";
async function main() {
console.log("Iniciando seed...");



// 1. Limpieza de datos

    const models = [

        prisma.categoria,
        prisma.cita,
        prisma.curriculum,
        prisma.curriculumProfesional,
        prisma.especialidad,
        prisma.imagenes,
        prisma.imagenesProfesional,
        prisma.imagenesServicio,
        prisma.profesional,
        prisma.profesionalEspecialidad,
        prisma.servicio,
        prisma.servicioEspecialidad,
        prisma.usuario,

    ]
    for (const model of models) {
        await (model as any).deleteMany();
    }


// 2. Creación de datos maestros (Independientes)

  await prisma.categoria.createMany({
    data: [
      { Nombre: 'Desarrollo de software',        Descripcion: 'Servicios de desarrollo y programación de software.' },
      { Nombre: 'Mantenimientos de Computadoras', Descripcion: 'Reparación y mantenimiento de equipos de cómputo.' },
      { Nombre: 'Mantenimiento de Consolas',      Descripcion: 'Reparación y mantenimiento de consolas de videojuegos.' },
      { Nombre: 'Hogar',                          Descripcion: 'Servicios y productos para el hogar.' },
      { Nombre: 'Arreglo de Celulares',           Descripcion: 'Reparación de dispositivos móviles.' },
      { Nombre: 'Magia (Consolas)',               Descripcion: 'Modificaciones y desbloqueados especiales para consolas.' },
      { Nombre: 'Asesoramiento',                  Descripcion: 'Consultoría y orientación técnica.' },
      { Nombre: 'Análisis de datos',              Descripcion: 'Procesamiento, análisis y visualización de datos.' },
    ],
  });



const [

    catSoftware,
    catComputadoras,
    catConsolas,
    catHogar,
    catCelulares,
    catMagia,
    catAsesoramiento,
    catAnalisisDatos,


] = await Promise.all([

    prisma.categoria.findFirst({ where: { Nombre: 'Desarrollo de software' } }),
    prisma.categoria.findFirst({ where: { Nombre: 'Mantenimientos de Computadoras' } }),
    prisma.categoria.findFirst({ where: { Nombre: 'Mantenimiento de Consolas' } }),
    prisma.categoria.findFirst({ where: { Nombre: 'Hogar' } }),
    prisma.categoria.findFirst({ where: { Nombre: 'Arreglo de Celulares' } }),
    prisma.categoria.findFirst({ where: { Nombre: 'Magia (Consolas)' } }),
    prisma.categoria.findFirst({ where: { Nombre: 'Asesoramiento' } }),
    prisma.categoria.findFirst({ where: { Nombre: 'Análisis de datos' } }),

]);

  if (!catSoftware || !catComputadoras || !catConsolas || !catHogar ||
      !catCelulares || !catMagia || !catAsesoramiento || !catAnalisisDatos) {
    throw new Error('Error: no se encontraron todas las categorías. Verificá el paso anterior.');
  }



  await prisma.especialidad.createMany({
    data: [
      // ── Desarrollo de software ──────────────────────────────
      { Nombre: 'Html',                 CategoriaId: catSoftware.Id },
      { Nombre: 'Oracle',               CategoriaId: catSoftware.Id },
      { Nombre: 'Css',                  CategoriaId: catSoftware.Id },
      { Nombre: 'Angular',              CategoriaId: catSoftware.Id },
      { Nombre: 'React',                CategoriaId: catSoftware.Id },
      { Nombre: 'NodeJS',               CategoriaId: catSoftware.Id },
      { Nombre: 'MySQL',                CategoriaId: catSoftware.Id },
      { Nombre: 'SQLServer',            CategoriaId: catSoftware.Id },
      { Nombre: 'MongoDB',              CategoriaId: catSoftware.Id },
      { Nombre: 'XAMP',                 CategoriaId: catSoftware.Id },
      { Nombre: 'Postman',              CategoriaId: catSoftware.Id },
      { Nombre: 'API',                  CategoriaId: catSoftware.Id },
      { Nombre: 'ApiRest',              CategoriaId: catSoftware.Id },
      { Nombre: 'Wordpress',            CategoriaId: catSoftware.Id },
      { Nombre: 'Shopify',              CategoriaId: catSoftware.Id },
      { Nombre: 'Microsoft Azure',      CategoriaId: catSoftware.Id },
      { Nombre: 'Android Studio',       CategoriaId: catSoftware.Id },
      { Nombre: 'Amazon Web Services',  CategoriaId: catSoftware.Id },
      { Nombre: 'Xcode',                CategoriaId: catSoftware.Id },
      { Nombre: 'Docker',               CategoriaId: catSoftware.Id },
      { Nombre: 'Kubernetes',           CategoriaId: catSoftware.Id },
      { Nombre: 'Linux',                CategoriaId: catSoftware.Id },
      { Nombre: 'iOS',                  CategoriaId: catSoftware.Id },
      { Nombre: 'Windows',              CategoriaId: catSoftware.Id },
      { Nombre: 'Android',              CategoriaId: catSoftware.Id },
      { Nombre: 'Git',                  CategoriaId: catSoftware.Id },
      { Nombre: 'Terraform',            CategoriaId: catSoftware.Id },
      { Nombre: 'Cisco',                CategoriaId: catSoftware.Id },
 
      // ── Mantenimiento de Computadoras ───────────────────────
      { Nombre: 'Computadoras',         CategoriaId: catComputadoras.Id },
      { Nombre: 'Laptops',              CategoriaId: catComputadoras.Id },
      { Nombre: 'Monitores',            CategoriaId: catComputadoras.Id },
      { Nombre: 'UPS',                  CategoriaId: catComputadoras.Id },
      { Nombre: 'Nvidia',               CategoriaId: catComputadoras.Id },
      { Nombre: 'AMD',                  CategoriaId: catComputadoras.Id },
      { Nombre: 'Intel',                CategoriaId: catComputadoras.Id },
      { Nombre: 'Teclados',             CategoriaId: catComputadoras.Id },
      { Nombre: 'Mouse',                CategoriaId: catComputadoras.Id },
      { Nombre: 'Audífonos',            CategoriaId: catComputadoras.Id },
      { Nombre: 'Impresoras',           CategoriaId: catComputadoras.Id },
      { Nombre: 'Webcams',              CategoriaId: catComputadoras.Id },
      { Nombre: 'Parlantes',            CategoriaId: catComputadoras.Id },
      { Nombre: 'Micrófonos',           CategoriaId: catComputadoras.Id },
 
      // ── Mantenimiento de Consolas ───────────────────────────
      { Nombre: 'Play Station 1',       CategoriaId: catConsolas.Id },
      { Nombre: 'Play Station 2',       CategoriaId: catConsolas.Id },
      { Nombre: 'Play Station 3',       CategoriaId: catConsolas.Id },
      { Nombre: 'Play Station 4',       CategoriaId: catConsolas.Id },
      { Nombre: 'Play Station 4 Slim',  CategoriaId: catConsolas.Id },
      { Nombre: 'Play Station 4 Pro',   CategoriaId: catConsolas.Id },
      { Nombre: 'Play Station 5 Pro',   CategoriaId: catConsolas.Id },
      { Nombre: 'Play Station 5 Slim',  CategoriaId: catConsolas.Id },
      { Nombre: 'Play Station 5 Digital', CategoriaId: catConsolas.Id },
      { Nombre: 'Nintendo DS',          CategoriaId: catConsolas.Id },
      { Nombre: 'Nintendo 3DS',         CategoriaId: catConsolas.Id },
      { Nombre: 'Nintendo WII',         CategoriaId: catConsolas.Id },
      { Nombre: 'Nintendo WII U',       CategoriaId: catConsolas.Id },
      { Nombre: 'Nintendo Switch',      CategoriaId: catConsolas.Id },
      { Nombre: 'Nintendo Switch Oled', CategoriaId: catConsolas.Id },
      { Nombre: 'Nintendo Switch Lite', CategoriaId: catConsolas.Id },
      { Nombre: 'Nintendo Switch 2',    CategoriaId: catConsolas.Id },
      { Nombre: 'Nintendo 64',          CategoriaId: catConsolas.Id },
      { Nombre: 'Super Nintendo',       CategoriaId: catConsolas.Id },
      { Nombre: 'Nintendo Gamecube',    CategoriaId: catConsolas.Id },
      { Nombre: 'Gameboy Color',        CategoriaId: catConsolas.Id },
      { Nombre: 'GameBoy',              CategoriaId: catConsolas.Id },
      { Nombre: 'Xbox',                 CategoriaId: catConsolas.Id },
      { Nombre: 'Xbox 360',             CategoriaId: catConsolas.Id },
      { Nombre: 'Xbox 360 S',           CategoriaId: catConsolas.Id },
      { Nombre: 'Xbox 360 E',           CategoriaId: catConsolas.Id },
      { Nombre: 'Xbox One',             CategoriaId: catConsolas.Id },
      { Nombre: 'Xbox One S',           CategoriaId: catConsolas.Id },
      { Nombre: 'Xbox One X',           CategoriaId: catConsolas.Id },
      { Nombre: 'Xbox Series X|S',      CategoriaId: catConsolas.Id },
      { Nombre: 'SteamDeck',            CategoriaId: catConsolas.Id },
      { Nombre: 'SteamMachine',         CategoriaId: catConsolas.Id },
      { Nombre: 'Joy-Con',              CategoriaId: catConsolas.Id },
      { Nombre: 'Joy-Con 2',            CategoriaId: catConsolas.Id },
      { Nombre: 'DualSense',            CategoriaId: catConsolas.Id },
      { Nombre: 'Dualshock',            CategoriaId: catConsolas.Id },
      { Nombre: 'Dualshock 2',          CategoriaId: catConsolas.Id },
      { Nombre: 'Dualshock 3',          CategoriaId: catConsolas.Id },
      { Nombre: 'Dualshock 4',          CategoriaId: catConsolas.Id },
      { Nombre: 'Controles XBOX',       CategoriaId: catConsolas.Id },
 
      // ── Hogar ───────────────────────────────────────────────
      { Nombre: 'Iluminación',          CategoriaId: catHogar.Id },
      { Nombre: 'Sonido',               CategoriaId: catHogar.Id },
      { Nombre: 'Electrodomésticos',    CategoriaId: catHogar.Id },
      { Nombre: 'Refrigeradoras',       CategoriaId: catHogar.Id },
      { Nombre: 'Lavadoras',            CategoriaId: catHogar.Id },
      { Nombre: 'Secadoras',            CategoriaId: catHogar.Id },
      { Nombre: 'Cocina',               CategoriaId: catHogar.Id },
      { Nombre: 'Horno',                CategoriaId: catHogar.Id },
      { Nombre: 'Ventiladores',         CategoriaId: catHogar.Id },
      { Nombre: 'Aires Acondicionados', CategoriaId: catHogar.Id },
 
      // ── Arreglo de Celulares ────────────────────────────────
      { Nombre: 'iPhone',               CategoriaId: catCelulares.Id },
      { Nombre: 'Huawei',               CategoriaId: catCelulares.Id },
      { Nombre: 'Xiaomi',               CategoriaId: catCelulares.Id },
      { Nombre: 'Samsung',              CategoriaId: catCelulares.Id },
      { Nombre: 'Honor',                CategoriaId: catCelulares.Id },
      { Nombre: 'Nokia',                CategoriaId: catCelulares.Id },
      { Nombre: 'BlackBerry',           CategoriaId: catCelulares.Id },
      { Nombre: 'Motorola',             CategoriaId: catCelulares.Id },
 
      // ── Magia (Consolas) ────────────────────────────────────
      { Nombre: 'Switch Arista',        CategoriaId: catMagia.Id },
      { Nombre: 'Switch Mariko',        CategoriaId: catMagia.Id },
      { Nombre: 'Switch Oled',          CategoriaId: catMagia.Id },
      { Nombre: 'PS4 Jailbreak',        CategoriaId: catMagia.Id },
      { Nombre: 'PS3 Jailbreak',        CategoriaId: catMagia.Id },
      { Nombre: 'DS Flashcard',         CategoriaId: catMagia.Id },
      { Nombre: '3DS Custom Firmware',  CategoriaId: catMagia.Id },
 
      // ── Asesoramiento ───────────────────────────────────────
      { Nombre: 'Componentes',          CategoriaId: catAsesoramiento.Id },
      { Nombre: 'Cuidados de Equipos',  CategoriaId: catAsesoramiento.Id },
      { Nombre: 'Sistemas eléctricos',  CategoriaId: catAsesoramiento.Id },
      { Nombre: 'Problemas de Software', CategoriaId: catAsesoramiento.Id },
 
      // ── Análisis de datos ───────────────────────────────────
      { Nombre: 'Machine learning',           CategoriaId: catAnalisisDatos.Id },
      { Nombre: 'Optimización de procesos',   CategoriaId: catAnalisisDatos.Id },
      { Nombre: 'Power BI',                   CategoriaId: catAnalisisDatos.Id },
      { Nombre: 'Excel',                      CategoriaId: catAnalisisDatos.Id },
      { Nombre: 'Python',                     CategoriaId: catAnalisisDatos.Id },
      { Nombre: 'R',                          CategoriaId: catAnalisisDatos.Id },
      { Nombre: 'Tableau',                    CategoriaId: catAnalisisDatos.Id },
    ],
  });

  //Usuarios simples

    await prisma.usuario.createMany({
    data: [
      {
        NombreCompleto: 'Eduardo Ulloa Murillo',
        Gmail:          'edu18088@admin.com',
        Contraseña:     '1221',
        Pais:           'Costa Rica',
        Role:           Role.ADMIN,
      },
      {
        NombreCompleto: 'Ashley Sibaja Rojas',
        Gmail:          'Ashkithur@admin.com',
        Contraseña:     '1221',
        Pais:           'Costa Rica',
        Role:           Role.ADMIN,
      },
      {
        NombreCompleto: 'Eduardo Ulloa Murillo',
        Gmail:          'edu18088@usuario.com',
        Contraseña:     'hash_password',
        Pais:           'Costa Rica',
        Role:           Role.USUARIO,
      },
      {
        NombreCompleto: 'Ashley Sibaja Rojas',
        Gmail:          'Ashkithur@usuario.com',
        Contraseña:     'hash_password',
        Pais:           'Costa Rica',
        Role:           Role.USUARIO,
      },
    ],
  });































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