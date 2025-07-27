export interface Coordinate {
  latitude: number
  longitude: number
}

// Constantes com nomes descritivos
const DEGREE_TO_RADIAN = Math.PI / 180 // Converte graus para radianos
const RADIAN_TO_DEGREE = 180 / Math.PI // Converte radianos para graus
const NAUTICAL_MILES_PER_DEGREE = 60 // 1 grau = 60 milhas náuticas
const MILES_TO_KILOMETERS = 1.609344 // 1 milha = 1.609344 km
const NAUTICAL_TO_MILES = 1.1515 // 1 milha náutica = 1.1515 milhas terrestres

export function getDistanceBetweenCoordinates(
  from: Coordinate,
  to: Coordinate,
): number {
  // Se os pontos forem exatamente iguais, a distância é zero
  if (from.latitude === to.latitude && from.longitude === to.longitude) {
    return 0
  }

  // Converte latitudes para radianos
  const fromLatitudeInRadian = from.latitude * DEGREE_TO_RADIAN
  const toLatitudeInRadian = to.latitude * DEGREE_TO_RADIAN

  // Diferença de longitude em graus e depois convertida para radiano
  const deltaLongitude = from.longitude - to.longitude
  const deltaLongitudeInRadian = deltaLongitude * DEGREE_TO_RADIAN

  // Fórmula da Lei dos Cossenos Esférica (para calcular ângulo central entre os pontos)
  let angleCosine =
    Math.sin(fromLatitudeInRadian) * Math.sin(toLatitudeInRadian) +
    Math.cos(fromLatitudeInRadian) *
      Math.cos(toLatitudeInRadian) *
      Math.cos(deltaLongitudeInRadian)

  // Protege contra erros numéricos (evita valores maiores que 1)
  if (angleCosine > 1) {
    angleCosine = 1
  }

  // Converte cosseno do ângulo para o próprio ângulo (em radianos)
  const centralAngle = Math.acos(angleCosine)

  // Converte ângulo para graus
  const centralAngleInDegrees = centralAngle * RADIAN_TO_DEGREE

  // Converte graus em milhas náuticas, depois em milhas terrestres e depois em quilômetros
  const distanceInKilometers =
    centralAngleInDegrees *
    NAUTICAL_MILES_PER_DEGREE *
    NAUTICAL_TO_MILES *
    MILES_TO_KILOMETERS

  return distanceInKilometers
}
