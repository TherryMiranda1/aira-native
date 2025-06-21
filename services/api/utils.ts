export async function getClerkSessionToken(template?: string) {
  if (typeof window !== "undefined" && window.Clerk) {
    const clerk = window.Clerk;

    if (clerk.session) {
      try {
        const token = await clerk.session.getToken({ template });
        return token;
      } catch (error) {
        console.error(
          "Error al obtener el token de la sesión de Clerk:",
          error
        );
        return null;
      }
    } else {
      console.warn(
        "No hay sesión activa de Clerk encontrada en window.Clerk.session."
      );
      return null;
    }
  } else {
    console.warn(
      "window.Clerk no está disponible. Asegúrate de que ClerkProvider está configurado y ClerkJS ha cargado."
    );
    return null;
  }
}
