/**
 * Municipality admin = role "municipality" (issue + recycling admin).
 */
export function isMunicipalityAdmin(user) {
  return Boolean(user && user.role === "municipality");
}
