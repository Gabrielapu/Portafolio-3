/**
 * Formatea un objeto de fecha con propiedades 'year' y 'month' en el formato "AAAA-MM".
 *
 * @param {Object} fechaObjeto - Un objeto con propiedades 'year' y 'month'.
 * @param {number} fechaObjeto.year - El año.
 * @param {number} fechaObjeto.month - El mes (índice comienza en 1).
 * @returns {string} La fecha formateada en el formato "YYYY-MM".
 */
const formatMonthYear = ({ year, month }) => {
  // Advertencia Asegurate que month sea en base a 1
  month = Math.max(1, Math.min(12, month));
  const formattedDate = `${year}-${String(month).padStart(2, "0")}`;
  return formattedDate;
};

export default formatMonthYear;
