interface Parametros {
  nombre?: string;
  departamento?: string;
  municipio?: string;
}

export const getURLFilter=({ nombre, departamento, municipio }: Parametros)=>{

  let base_url = "/correspondencia/puntoRadicacion/filtrarPor?";

    let parametros = [];
    if (nombre) {
        parametros.push(`nombre=${nombre}`);
    }
    if (departamento) {
        parametros.push(`departamento=${departamento}`);
    }
    if (municipio) {
        parametros.push(`municipio=${municipio}`);
    }

    return base_url + parametros.join("&");
}

export const mapSucursales=(sucursales)=>{
  return sucursales.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((item) => {
    return ({
      label: item.nombre,
      value: item.id
    })
  });
}

export const mapDependencias=(sucursales)=>{
  return sucursales.sort((a, b) => a.nombre.localeCompare(b.nombre)).map((item) => {
    return ({
      label: item.nombre,
      value: item.idSeccionSubSeccion
    })
  });
}