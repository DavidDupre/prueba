import Api from './Api';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import XLSX from 'xlsx/dist/xlsx.full.min.js';
import { saveAs } from 'file-saver';

// import { saveAs } from 'file-saver';
export default {

  async Download(Formato: String, exportData: any): Promise<void> {
    switch (Formato.toLowerCase()) {
      case 'xml':
        this.ExportXml(exportData);
        break;
      case 'pdf':
        this.ExportPdf(exportData);
        break;
      case 'csv':
        this.ExportCsv(exportData);
        break;
      case 'excel':
        this.ExportExcel(exportData);
        break;
    }
  },

  async ExportXml(exportData: any): Promise<void> {
    try {

      const xmlString = atob(exportData.archivo);
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "text/xml");
      const serializer = new XMLSerializer();
      const xmlContent = serializer.serializeToString(xmlDoc);
      const link = document.createElement("a");
      const blob = new Blob([xmlContent], { type: "text/xml" });
      const url = URL.createObjectURL(blob);
      link.href = url;
      link.download = exportData.nombre;
      link.click();
      URL.revokeObjectURL(url);

    } catch (error: any) {
      console.error("Error", error.message());
    }
  },

  async ExportPdf(exportData: any): Promise<void> {
    try {
      const base64Data = exportData.archivo;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const fileBlob = new Blob([byteArray], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(fileBlob);

      const htlmAnchor = document.createElement("a");
      htlmAnchor.href = fileURL;
      htlmAnchor.download = exportData.nombre;
      document.body.appendChild(htlmAnchor);
      htlmAnchor.click();
      document.body.removeChild(htlmAnchor);
    } catch (error: any) {
      console.error("Error", error.message());
    }
  },

  async ExportCsv(exportData: any): Promise<void> {
    try {
      const base64Data = exportData.archivo;
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const fileBlob = new Blob([byteArray], { type: "text/csv" });
      const fileURL = URL.createObjectURL(fileBlob);

      const htlmAnchor = document.createElement("a");
      htlmAnchor.href = fileURL;
      htlmAnchor.download = exportData.nombre;
      document.body.appendChild(htlmAnchor);
      htlmAnchor.click();
      document.body.removeChild(htlmAnchor);
    } catch (error: any) {
      console.error("Error", error.message());
    }
  },

  async ExportExcel(exportData: any): Promise<void> {
    try {

      const byteCharacters = atob(exportData.archivo);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      const workbook = XLSX.read(byteArray, { type: 'array' });

      const workbookBlob = new Blob([byteArray],
        { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(workbookBlob, exportData.nombre);


    } catch (error: any) {
      console.error("Error", error.message());
    }
  },

  // async ExportExcel(exportData: any): Promise<void> {
  //   try {

  //     const blob = new Blob([exportData.data], {
  //       type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  //     });

  //     // Guardar el archivo
  //     saveAs(blob, "TRD.xlsx");
  //   } catch (error: any) {
  //     console.error("Error", error);
  //   }
  // },
};


