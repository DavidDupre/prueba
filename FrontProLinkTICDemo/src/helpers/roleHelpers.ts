import { SelectInput } from "src/interfaces";

export const roleDescription = (role: SelectInput & { name: string }) => {
  let oficina = " Asignado a ";
  if (role.label.includes("Sin")) {
    oficina += " la dependencia " + role.label.split("Dependencia ")[1];
  } else {
    if (role.label.includes("RAD")) {
      oficina +=
        "l punto de radicación '" +
        role.label.split("RAD ")[1].split(")")[0] +
        "'";
    } else {
      oficina += "la oficina " + role.label.split("Oficina ")[1];
    }
  }

  const name = role.name.split(" ")[0].toLowerCase();

  switch (name) {
    case "defensor del consumidor":
      return "Defensor de afectados." + oficina;
    case "administrador master":
      return (
        "Tiene acceso a todas las funcionalidades de un flujo del sistema, además de poder gestionar usuarios y roles." +
        oficina
      );
    case "asignador responsable":
      return (
        "Tiene acceso a las bandejas de entrada de cada flujo y puede asignar tareas a los gestionadores." +
        oficina
      );
    case "radicador - web":
      return (
        "Puede radicar documentos en el sistema a cualquier dependencia y oficina." +
        oficina
      );
    default:
      // return (
      //   "Lo único que se sabe, es que está" +
      //   oficina.toLowerCase() +
      //   ", pero su rol es desconocido, agregar este rol a src/helpers/roleDescription.ts"
      // );
  }
};

export const roleIcon = (role: string) => {
  switch (role) {
    case "defensor":
      return "group";
    case "Administrador Master":
      return "user-tie";
    case "Asignador Responsable":
      return "user";
    case "Gestionador":
      return "gear";
    case "Revisor":
      return "user-pen";
    case "Radicador - Ventanilla":
      return "envelope-open-text";
    case "Aprobador":
      return "check-to-slot";
    case "Radicador - Mail":
      return "envelope-open";
    case "Gestionador Escalador":
      return "users-gear";
    case "Defensor del Consumidor":
      return "user-shield";
    case "Radicador - Contact Center":
      return "headset";
    case "Administrador de Trámite":
      return "id-card-clip";
    case "Asignador Líder":
      return "id-badge";
    case "Seguimiento Envío":
      return "paper-plane"
    default:
      return "account_question";
  }
};
