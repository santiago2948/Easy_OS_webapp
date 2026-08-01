export function findCountry(countries, countryId) {
  return countries?.find((country) => country.id === countryId) ?? null
}

export function findPort(countries, countryId, portId) {
  const country = findCountry(countries, countryId)
  return country?.ports?.find((port) => port.id === portId) ?? null
}
