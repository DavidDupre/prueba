import { Response } from "./types";

export const handleDownloadFile = (response:Response, fileName: string) => {
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;

    const contentDisposition = response.headers['content-disposition']; 

    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename="(.+)"/); // Extrae el nombre del archivo
      if (fileNameMatch.length === 2)
        fileName = fileNameMatch[1];
    }

    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    link.remove();
}