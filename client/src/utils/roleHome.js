/**
 * Default landing path after login/register by role.
 */
export function roleHome(role) {
  switch (role) {
    case "municipality":
      return "/dashboard";
    case "recycler":
      return "/recycler";
    default:
      return "/my-reports";
  }
}
