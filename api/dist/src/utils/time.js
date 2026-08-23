export function combinarFechaHora(fechaISO, hora) {
    const [anio, mes, dia] = fechaISO.split("-").map(Number);
    const [horas, minutos] = hora.split(":").map(Number);
    return new Date(anio, mes - 1, dia, horas, minutos, 0);
}
export function soloFecha(fechaISO) {
    const [anio, mes, dia] = fechaISO.split("-").map(Number);
    return new Date(anio, mes - 1, dia, 0, 0, 0);
}
