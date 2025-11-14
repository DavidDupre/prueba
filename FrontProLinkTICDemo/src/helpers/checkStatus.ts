export const checkStatus = (status: string) => {
  if (status === 'Rechazado'){
    return 'Aprobación rechazada'
  } else {
    return status
  }
}
