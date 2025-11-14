import { sgdeaAxios } from "src/services";
import { toast } from "src/helpers/toast";
import { useAuthStore } from "src/stores/auth.store";
import { crearTrazabilidad } from "src/helpers/trazabilidad";

export interface IAsignarFacturaUsuario {
  type: string,
  id: number,
  short_type: string,
  usuarioAsignado: number,
  motivoAsignacion: string,
  oficinaAsignada: number
}

const authStore = useAuthStore();

export async function asignarUsuario(params: IAsignarFacturaUsuario, onSuccess?: () => void | Promise<void>){
  const {type, id, usuarioAsignado, short_type, motivoAsignacion, oficinaAsignada} = params;

  const body = {
    motivoAsignacion: motivoAsignacion,
    usuarioAsignado: usuarioAsignado,
    oficinaAsignada: oficinaAsignada
  }

  // if(!usuarioAsignado || !motivoAsignacion){
  //   toast.error('Debe seleccionar un usuario, y especificar el motivo de la asignacion');
  //   return;
  // }

    try {
      const response = await sgdeaAxios.post(`/facturacion/asignarUsuario?type=${type}&id=${id}`, body);
      toast.success('El radicado ha sido asignado con éxito');
      if (onSuccess) {
        onSuccess();
      }
      await crearTrazabilidad({
        proceso: short_type+id,
        secuencia: response.data?.facturaAdministrativaId?.sec ?? response.data?.cuentacobroId?.sec,
        estado: "Asignado",
        descripcion: "Se ha asignado al usuario " + usuarioAsignado,
        comentario: motivoAsignacion,
        nombre: (await authStore.getUserInfo()).name,
        tramite: response.data?.facturaAdministrativaId?.sec ?? response.data?.cuentacobroId?.sec,
        accion: "Asignar " + short_type
      })
      return response.data;

    } catch (error) {
      console.error(error);
      toast.error('No se pudo realizar la asignacion. Inténtelo de nuevo más tarde')
    }
}
