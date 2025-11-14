import { TypeDocumentalObjectBase, TypeDocumentalObject } from './../crear/interfaces';
import { client } from "./apiHandler";
import { TableDataDocumentals, FilterBase, GeneralSelector } from "../interfaces";


export const getNumberTotalRegistersAndPages = async () => {

  const response = (await client.getWithParams(`/tipologiasdocumentales/listado`, {
    params:{
      page: 0,
      size: 10000,
    }
  }));
  if(response.status === 200){
    return { dataElements: response.data.totalElements, pages: response.data.totalPages };
  }
  else{
    return { dataElements: null, pages: null};
  }

}

export const getNumberTotalRegistersAndPagesFiltered = async (filterData : FilterBase) => {

  const indexes = Object.keys(filterData);

  const activeFilters = {};
  indexes.map((nameIndex)=>{
    if(nameIndex === 'estado'){
      if(filterData.estado.label !== ''){
        activeFilters[nameIndex] = filterData.estado.value;
      }
    }
    else if(nameIndex === 'codigoTipologiaDocumental'){
      if(filterData.codigoTipologiaDocumental.label !== ''){
        activeFilters[nameIndex] = filterData.codigoTipologiaDocumental.label;
      }
    }
    else if(filterData[nameIndex] !== ''){
      activeFilters[nameIndex] = filterData[nameIndex];
    }
  })

  const response = (await client.getWithParams(`/tipologiasdocumentales/buscar`, {
    params:{
      ...activeFilters,
      page: 0,
      size: 10000,
    }
  }));
  if(response.status === 200){
    return { dataElements: response.data.totalElements, pages: response.data.totalPages };
  }
  else{
    return { dataElements: null, pages: null};
  }

}

export const getDocumetalTypesList = async (numberElements: number) => {
  const response = (await client.getWithParams(`/tipologiasdocumentales/listado`, {
    params:{
      page: 0,
      size: 10000,
    }
  }));
  if(response.status === 200){

    const idsUnicos = new Set();
    const filteredData = response.data.content?.map((doc: any) => {
      return new GeneralSelector({
        label: doc.codigoTipologiaDocumental,
        value: doc.idTipologiaDocumental
      });
    }).filter((objeto) => {
      if (idsUnicos.has(objeto.label)) {
        return false;
      }
      idsUnicos.add(objeto.label);
      return true;
    });;
    return filteredData;
  }
  else{
    return [new GeneralSelector()];
  }
}

export const getAllDataDocumentaltypes = async (numberElements: number, numberPage: number) => {
  const response = (await client.getWithParams(`/tipologiasdocumentales/listado`, {
    params:{
      page: numberPage,
      size: 10000,
    }
  }));
  if(response.status === 200){
    return response.data.content?.map((doc: any) => {
      return  new TableDataDocumentals({
        id: doc.idTipologiaDocumental,
        codigoTipoDocumental: doc.codigoTipologiaDocumental,
        idTipoDocumental: doc.idTipologiaDocumental,
        nombre: doc.nombre,
        siglaIndice: doc.siglaIndice,
        estados: doc.estado
      })
    });
  }
  else{
    return [];
  }
}

export const getAllDataDocumentaltypesFiltered = async (numberElements: number, numberPage: number, filterData : FilterBase) => {

  const indexes = Object.keys(filterData);

  const activeFilters = {};
  indexes.map((nameIndex)=>{
    if(nameIndex === 'estado'){
      if(filterData.estado.label !== ''){
        activeFilters[nameIndex] = filterData.estado.value;
      }
    }
    else if(nameIndex === 'codigoTipologiaDocumental'){
      if(filterData.codigoTipologiaDocumental.label !== ''){
        activeFilters[nameIndex] = filterData.codigoTipologiaDocumental.label;
      }
    }
    else if(filterData[nameIndex] !== ''){
      activeFilters[nameIndex] = filterData[nameIndex];
    }
  })

  const response = (await client.getWithParams(`/tipologiasdocumentales/buscar`, {
    params:{
      ...activeFilters,
      page: numberPage,
      size: 10000,
    }
  }));
  if(response.status === 200){
    return response.data.content?.map((doc: any) => {
      return  new TableDataDocumentals({
        id: doc.idTipologiaDocumental,
        codigoTipoDocumental: doc.codigoTipologiaDocumental,
        idTipoDocumental: doc.idTipologiaDocumental,
        nombre: doc.nombre,
        siglaIndice: doc.siglaIndice,
        estados: doc.estado
      })
    });
  }
  else{
    return [];
  }
}

export const gettypeDocumentalById = async (id: number) => {
  const response = (await client.get(`tipologiasdocumentales/obtener/${id}`));

  if(response.status === 200 || response.status === 201 || response.status === 204){
    return new TypeDocumentalObject({
      ...response.data
    })
  }
  else{
    return new TypeDocumentalObject();
  }
}

export const createTypedocumental = async (dataForm: TypeDocumentalObjectBase) => {
  const response = (await client.post(`tipologiasdocumentales/crear`, dataForm));

  if(response.status === 200 || response.status === 201 || response.status === 204){
    return {status: true, msg: 'Tramite creado con exito'}
  }
  else{
    return {status: false, msg: 'Tramite con errores'}
  }
}

export const editTypedocumental = async (dataForm: TypeDocumentalObjectBase) => {
  const response = (await client.put(`tipologiasdocumentales/actualizar/${dataForm.idTipologiaDocumental}`, dataForm));

  if(response.status === 200 || response.status === 201 || response.status === 204){
    return {status: true, msg: 'Tramite actualizado con exito'}
  }
  else{
    return {status: false, msg: 'Tramite con errores'}
  }
}




