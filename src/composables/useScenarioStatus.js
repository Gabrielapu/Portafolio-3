const scenarioStatus = {
  'Pendiente de ejecución': {
    text: 'Pendiente de ejecución',
    color: 'warning',
    icon: 'uil:exclamation-triangle',
  },
  Completado: {
    text: 'Completado',
    color: 'positive',
    icon: 'uil:check',
  },
  Ejecutando: {
    text: 'Ejecutando',
    color: 'positive',
    icon: 'ph:spinner-bold',
    classes: 'animate-spin',
  },
  'Sin solución': {
    text: 'Sin solución',
    color: 'warning',
    icon: 'raphael:exclamation',
  },
  Infactible: {
    text: 'Infactible',
    color: 'warning',
    icon: 'raphael:exclamation',
  },
  Error: {
    text: 'Error',
    color: 'danger',
    icon: 'uil:cancel',
  },
  'Input con Errores': {
    text: 'Input con Errores',
    color: 'danger',
    icon: 'uil:cancel',
  },
  'Input con Advertencias': {
    text: 'Input con Advertencias',
    color: 'processing',
    icon: 'zondicons:exclamation-outline',
  },
  Validando: {
    text: 'Validando',
    color: 'primary',
    icon: 'cil:clock',
  },
  Pendiente: {
    text: 'Pendiente',
    color: 'warning',
    icon: 'uil:exclamation-triangle',
  },
  Official: {
    text: 'Escenario oficial',
    color: 'success',
    icon: 'uil:check',
  },
};

export default function getScenarioStatus() {
  return scenarioStatus;
}
