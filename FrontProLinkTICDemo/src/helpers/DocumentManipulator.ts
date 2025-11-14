import {cleanText, PDFDocument, PDFFont, rgb, StandardFonts} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import pdfjsLib from "boot/pdf";
import html2pdf from "html2pdf.js";
import { isNullOrUndefined } from "src/shared/utils/Input/validationInput";
export class PdfManipulate {
  headinPageFoot = 0;


  base64ToArrayBuffer(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }

  base64ToUint8Array(base64) {
    if (!base64) {
      return "";
    }
    const binaryString = window.atob(base64); // Decodifica el base64
    const len = binaryString.length;
    const bytes = new Uint8Array(len); // Crear un Uint8Array
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes; // Devuelve un Uint8Array
  }

  async extractTextPositions(
    base64Pdf: string
  ): Promise<
    Array<{ page: number; positions: Array<{ x: number; y: number }> }>
  > {
    const pdfBytes = this.base64ToUint8Array(base64Pdf);
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdfDocument = await loadingTask.promise.catch((err) => {
      console.error(err);
      throw err;
    });

    const textPositions: Array<{
      page: number;
      positions: Array<{ x: number; y: number }>;
    }> = [];

    // Iterar sobre cada página del PDF
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      // Array para almacenar las posiciones de la página actual
      const positions: Array<{ x: number; y: number }> = [];

      let lastY = null;
      let paragraphStart = null;

      // Iterar sobre cada elemento de texto de la página
      textContent.items.forEach((textItem) => {
        const currentX = textItem.transform[4]; // Coordenada X
        const currentY = textItem.transform[5]; // Coordenada Y

        // Agrupar texto basado en la distancia vertical (similar a la lógica de párrafos)
        if (lastY === null || Math.abs(lastY - currentY) > 14) {
          if (paragraphStart) {
            // Guardar la posición inicial del párrafo
            positions.push(paragraphStart);
          }
          // Actualizar el inicio del nuevo párrafo
          paragraphStart = { x: currentX, y: currentY };
        }
        lastY = currentY;
      });

      // Asegurarse de añadir el último párrafo de la página
      if (paragraphStart) {
        positions.push(paragraphStart);
      }

      // Agregar las posiciones de la página actual al array de posiciones global
      textPositions.push({ page: pageNum, positions });
    }

    return textPositions; // Retorna las posiciones de texto en todas las páginas
  }
/*
  corregirEspaciosAcentos(cadena: string): string {
    // Expresión regular que busca un espacio antes o después de un acento
    const regex = /\s*([áéíóúÁÉÍÓÚñÑüÜ])\s*/g;

    // Reemplaza espacios a izquierda o derecha del acento por solo el acento
  /*  return cadena.replace(regex, "$1");
  } */

  async extractTextWithPositions(base64Pdf) {
    //const pdfBytes = this.base64ToArrayBuffer(base64Pdf);
    const pdfBytes = this.base64ToUint8Array(base64Pdf);
    // Cargar el PDF usando pdfjs-dist
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdfDocument = await loadingTask.promise.catch((err) => {
      console.error(err);
      throw err;
    });
    let paragraphs = [];
    const textItems = [];

    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();

      let currentParagraph = "";
      let lastY = null;

      textContent.items.forEach((textItem) => {
        let currentText = textItem.str; //.replace(/\s+/g, "");
        // currentText = currentText.normalize("NFD");
        const currentY = textItem.transform[5];

        const maabs = Math.abs(lastY - currentY);
        if (lastY !== null && maabs > 14) {
          /*  let cleanText = this.corregirParrafoDinamico(currentParagraph.trim());
          cleanText = this.corregirEspaciosAcentos(cleanText); */
          const cleanText = currentParagraph;
          paragraphs.push(cleanText); // Añade el párrafo actual
          currentParagraph = ""; // Inicia un nuevo párrafo
        }

        currentParagraph += currentText + " ";
        lastY = currentY; // Actualiza la posición Y anterior
      });

      if (currentParagraph.trim()) {
        let cleanText = currentParagraph; //this.corregirParrafoDinamico(currentParagraph.trim());
        paragraphs.push(cleanText);
      }
    }
    return paragraphs || []; // Retorna el texto y las posiciones
  }

  async extractTextFromPDFBase64(base64Text) {
    try {
      let fullTexts = [];
      let paragraphs = [];
      let textLine = '';
      // Decodificar el Base64 a un ArrayBuffer
      const byteCharacters = atob(base64Text);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const arrayBuffer = byteArray.buffer;
      // Cargar el PDF usando PDF.js
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      // Extraer texto de cada página
      for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const textContent = await page.getTextContent();
        fullTexts = [...fullTexts, ...textContent.items.map(item => item.str)];
      }
      // Asignar cada texto a renglones en un array
      for (let i = 0; i <= fullTexts.length; i++) {
        const currentText = fullTexts[i];
        if (currentText === '' || i === fullTexts.length) {
          paragraphs.push(textLine);
          textLine = '';
        } else {
          textLine += currentText;
        }
      }

      return paragraphs;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  cleanTextForEncoding(text: string): string {
    return text.normalize("NFKD").replace(/[^\x00-\xFF]/g, "");
  }

  splitTextIntoLines(
    text: string,
    font: PDFFont,
    fontSize: number,
    maxWidth: number
  ): string[] {
    const cleanedText = text;// this.cleanTextForEncoding(text); // Limpiar el texto
    const words = cleanedText.split(" "); // Dividir el texto por espacios
    let lines: string[] = [];
    let currentLine = "";

    words.forEach((word) => {
      const testLine = currentLine + (currentLine ? " " : "") + word;
      const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);

      if (testLineWidth <= maxWidth) {
        currentLine = testLine; // Cabe en la línea actual
      } else {
        if (currentLine) {
          lines.push(currentLine); // Añadir la línea actual
        }
        currentLine = word; // Iniciar una nueva línea con la palabra actual
      }
    });

    if (currentLine) {
      lines.push(currentLine); // Añadir la última línea
    }

    return lines;
  }

  async replaceTextInPdf(
    base64Pdf: string,
    modifiedParagraphs: string[],
    base64img: any
  ) {
    const pdfBytes = this.base64ToUint8Array(base64Pdf);

    const pdfDoc = await PDFDocument.load(pdfBytes);

    const pages = pdfDoc.getPages();
    // Cargar la fuente Arial
    const arialFontBytes = await fetch("/fonts/arial.ttf").then((res) =>
      res.arrayBuffer()
    );

    pdfDoc.registerFontkit(fontkit);

    const font = await pdfDoc.embedFont(arialFontBytes);
    const fontSize = 11;

    const extractedText = await this.extractTextPositions(base64Pdf);

    let paragraphIndex = 0; // Para rastrear qué párrafo estamos reemplazando

    // Iterar sobre cada página del PDF
    pages.forEach((page, pageIndex) => {
      const { width, height } = page.getSize();
      const marginX = 40; // Margen izquierdo
      const marginRight = 40; // Margen derecho
      const maxWidth = width - marginX - marginRight;
      // Obtener las posiciones del texto original para la página actual
      const textPositions = extractedText.find((f) => f.page === pageIndex + 1);

      if (!textPositions || !textPositions.positions.length) {
        console.error(
          `No se encontraron posiciones de texto para la página ${pageIndex + 1
          }`
        );
        return;
      }


      let incrementLinePosition = 0;
      // Reemplazar el texto en las posiciones originales
      textPositions.positions.forEach((pos) => {

        page.drawRectangle({
          x: pos.x > marginX ? pos.x : marginX,
          y: pos.y - fontSize, // Ajustar la altura para cubrir el texto
          width: width + 10, // Ajusta según el tamaño del texto original
          height: fontSize + 12, // Ajusta según el tamaño de la fuente
          color: rgb(1, 1, 1), // Blanco
        });
        if (paragraphIndex >= modifiedParagraphs.length) return; // Si no quedan más párrafos, salir

        const modifiedText = modifiedParagraphs[paragraphIndex]; // Obtener el párrafo correspondiente
        paragraphIndex++;

        const lines = this.splitTextIntoLines(
          modifiedText,
          font,
          fontSize,
          maxWidth
        );

        const justifiedLines = this.justifyText(lines, maxWidth, font, fontSize);
        let currentY = pos.y; // Mantener la posición Y original
        if (incrementLinePosition > 0) {
          const diff = currentY - incrementLinePosition;
          currentY = currentY - diff;
        }

        lines.forEach(async (line) => {

          if (currentY < fontSize) {
            currentY = height - fontSize; // Nueva línea en la parte superior de la siguiente página
          }

          page.drawRectangle({
            x: pos.x > marginX ? pos.x : marginX,
            y: currentY - 30, // Position below the text
            width: 150,
            height: fontSize + 30,
            color: rgb(1, 1, 1), // White background to clear existing content
          });
          // Dibujar el texto en la posición actual
          if (!line.includes("_firmaUsuario_")) {
            page.drawText(line.trim(), {
              x: pos.x > marginX ? pos.x : marginX, // Asegurarse de no ir más allá del margen izquierdo
              y: currentY + (fontSize + 10), // Posición Y para la línea actual
              size: fontSize, // Usa el tamaño de fuente original
              font,
              color: rgb(0, 0, 0), // Negro
            });
          }

          if (
            line.includes("_firmaUsuario_") &&
            !isNullOrUndefined<string>(base64img)
          ) {
            currentY = currentY - 8;
            if (base64img?.fileType === "text/plain") {
              page.drawRectangle({
                x: pos.x > marginX ? pos.x : marginX,
                y: currentY -50,
                width: 150,
                height: fontSize + 30,
                color: rgb(1, 1, 1),
              });

              page.drawText(base64img?.fileName, {
                x: pos.x,
                y: currentY - 4,
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
              });
              currentY -= fontSize + 14;

            } else {
              const imageBytes = this.base64ToUint8Array(base64img.fileData);
              const image = await pdfDoc.embedJpg(imageBytes);

              const jpgDims = image.scale(0.5);
              const height = jpgDims.width > 100 ? 100 : jpgDims.width;
              page.drawImage(image, {
                x: pos.x,
                y: currentY - 70,
                width: jpgDims.height > 130 ? 130 : jpgDims.height,
                height: height,
              });

              currentY -= height + 4;

            }
          }
          currentY -= fontSize + 4;

          //incrementLinePosition = currentY;

        });
      });
    });

    // Guardar el PDF modificado como bytes
    const modifiedPdfBytes = await pdfDoc.save();

    // Convertir de nuevo a base64 si es necesario
    return this.uint8ArrayToBase64(modifiedPdfBytes);
  }

  // Función que aplica la justificación completa al texto
  justifyText(lines, maxWidth, font, fontSize) {
    return lines.map(line => {
      const words = line.split(" ");
      if (words.length < 2) {
        return line; // No es posible justificar si hay solo una palabra
      }

      let totalWordWidth = 0;
      let wordWidths = [];

      // Calcular el ancho total de las palabras
      words.forEach(word => {
        const wordWidth = font.widthOfTextAtSize(word, fontSize);
        wordWidths.push(wordWidth);
        totalWordWidth += wordWidth;
      });

      // Calcular el espacio extra que debe distribuirse entre las palabras
      const spaceAvailable = maxWidth - totalWordWidth;
      const spaceBetweenWords = spaceAvailable / (words.length - 1); // Espacio entre palabras

      let currentX = 0;
      let justifiedLine = '';

      // Colocar las palabras con el espacio adicional entre ellas
      words.forEach((word, index) => {
        justifiedLine += word;
        if (index < words.length - 1) {
          // Añadir el espacio entre palabras
          const space = spaceBetweenWords;
          currentX += wordWidths[index] + space;
        } else {
          // Añadir la última palabra sin espacio extra
          currentX += wordWidths[index];
        }
      });

      return justifiedLine;
    });
  }


  async insertAndJustifyText(
    base64Pdf: string,
    text: string,
    pageIndex: number
  ) {
    const pdfBytes = this.base64ToUint8Array(base64Pdf);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    // Verificar que la página existe
    if (pageIndex < 0 || pageIndex >= pages.length) {
      throw new Error("El índice de página está fuera de rango.");
    }

    const page = pages[pageIndex];
    const { width, height } = page.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 11;

    const marginX = 40; // Margen izquierdo
    const marginRight = 40; // Margen derecho
    const maxWidth = width - marginX - marginRight;

    const lines = this.splitTextIntoLines(text, font, fontSize, maxWidth);

    let currentY = height - 150;
    lines.forEach((line) => {
      const lineWidth = font.widthOfTextAtSize(line, fontSize);
      const spaceToAdd = maxWidth - lineWidth;
      const spaceCount = line.split(" ").length - 1;

      // if (spaceCount > 0) {
      const spaceWidth = spaceToAdd / spaceCount;
      const words = line.split(" ");
      const lineSpacing = 4;

      let currentX = marginX;

      words.forEach((word, index) => {
        page.drawText(word, {
          x: currentX,
          y: currentY,
          size: fontSize,
          font,
          color: rgb(0, 0, 0), // Color negro
        });
        currentX += font.widthOfTextAtSize(word, fontSize) + spaceWidth;
        currentY -= fontSize + lineSpacing;
      });
      currentY -= fontSize + 4; // Mover hacia abajo para la próxima línea
    });
    const modifiedPdfBytes = await pdfDoc.save();
    return this.uint8ArrayToBase64(modifiedPdfBytes);
  }

  async addFooterBeforeLastContent(
    base64Pdf,
    footerText,
    afterFirma,
    content,
    isActive,
    header?,
    asunto?
  ) {
    const pdfm = new PdfManipulate();
    const pdfBytes = pdfm.base64ToUint8Array(base64Pdf);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();

    const firstPage = pages[0];
    let lastPage = pages[pages.length - 1];
    const { height } = lastPage.getSize();
    const { height: heightFirst, width } = firstPage.getSize();

    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontSize = 8;

    const marginXFirst = 10;
    const marginX = 38;

    let headerY = heightFirst - 190;
    let footerY = 230;
    const lineSpacing = 4;

    const lines = footerText.split("\n");
    const linesFirma = afterFirma.split("\n");
    const linesHeader = header ? header.split("\n") : [];

    // Calculate the required space for the footer
    const footerHeight = (lines.length + linesFirma.length) * (fontSize + lineSpacing);

    // If the footer height exceeds the space available, add a new page
    if (footerHeight > 200) {
      const newPage = pdfDoc.addPage([width, height]);
      lastPage = newPage;
      footerY = height - 50; // Reset Y position on the new page
      headerY = height - 190; // Header position on the new page
    }

    if (isActive) {
      for (const line of linesHeader) {
        lastPage.drawText(line, {
          x: marginXFirst,
          y: headerY,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        headerY -= fontSize + lineSpacing;
      }

      for (const line of linesFirma) {
        lastPage.drawText(line, {
          x: marginX,
          y: footerY,
          size: fontSize,
          font: fontBold,
          color: rgb(0, 0, 0),
        });
        footerY -= fontSize + lineSpacing;
      }
    }

    // Function to split lines based on width
    const splitTextIntoLines = (text, maxWidth) => {
      const words = text.split(" ");
      let lines = [];
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const lineWidth = font.widthOfTextAtSize(testLine, fontSize);

        if (lineWidth > maxWidth) {
          lines.push(currentLine);
          currentLine = word; // Start a new line with the current word
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine) {
        lines.push(currentLine); // Push the last line
      }

      return lines;
    };

    // Split and draw each line of the footer text, keeping alignment
    for (const line of lines) {
      const splitLines = splitTextIntoLines(line, width - marginX * 2);

      for (const splitLine of splitLines) {
        lastPage.drawText(splitLine, {
          x: marginX,
          y: footerY,
          size: fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        footerY -= fontSize + lineSpacing;
      }
    }

    // Save the modified PDF and return the base64 string
    const modifiedPdfBytes = await pdfDoc.save();
    return pdfm.uint8ArrayToBase64(modifiedPdfBytes);
  }



  uint8ArrayToBase64(uint8Array) {
    let binary = "";
    const len = uint8Array.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(uint8Array[i]);
    }
    return window.btoa(binary);
  }
  generatePdfhtml(element: string) {
    const opt = {
      margin: 1,
      filename: "documento.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "letter", orientation: "portrait" },
    };

    // Generar PDF a partir del contenido HTML
    html2pdf().from(element).set(opt).save();
  }

  async blobToBase64(blob: Blob): Promise<string> {
    const reader = new FileReader();

    return new Promise<string>((resolve, reject) => {
      reader.onloadend = () => {
        if (reader.result) {
          const base64data = reader.result as string;

          const base64 = base64data.split(",")[1];
          resolve(base64);
        } else {
          reject(new Error("Error al leer el Blob como Base64"));
        }
      };

      reader.onerror = (error) => {
        reject(new Error(`Error al convertir Blob a Base64: ${error}`));
      };

      reader.readAsDataURL(blob);
    });
  }

  async generatePdf(htmlContent: string, base64: string, margin) {
    try {
      if (!base64) {
        return "";
      }
      // this.generatePdfhtml(htmlContent);
      // Cargar la plantilla PDF desde base64
      const pdfDoc = await PDFDocument.load(this.base64ToUint8Array(base64));
      const pdfDocNew = await PDFDocument.create();

      const page = pdfDoc.getPage(0);
      const { width, height } = page.getSize();

      // Crear un contenedor temporal para el contenido HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv); // Agregar al DOM para que html2pdf lo encuentre

      // Crear un canvas para renderizar el contenido HTML
      const opt = {
        margin: 2.5,
        filename: "documento.pdf",
        image: { type: "png", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "pt", orientation: "portrait", format: "letter" },
      };

      // Renderizar el contenido HTML en el canvas
      const canvas = await html2pdf().from(tempDiv).set(opt).outputPdf("blob");

      // Convertir el Blob a Base64

      const b64 = await this.blobToBase64(canvas);
      const byte = this.base64ToUint8Array(b64);
      const generatedPdfDoc = await PDFDocument.load(
        byte
      );

      const pages = generatedPdfDoc.getPageCount() - 1;
      for (let index = 0; index <= pages; index++) {
        const [existPage] = await pdfDocNew.copyPages(pdfDoc, [0]);
        const pagenew = pdfDocNew.addPage(existPage);

        const [generatedPage] = await pdfDocNew.embedPdf(generatedPdfDoc, [
          index,
        ]);


        this.headinPageFoot = generatedPage.height;

        // Dibujar el contenido de la página generada en la página de la plantilla base
        pagenew.drawPage(generatedPage, {
          xScale: 0.5,
          x: 40, // Ajusta la posición X en la página base según sea necesario
          y: 91, // Ajusta la posición Y en la página base según sea necesario
          width: width - 80, // Ajusta el ancho según sea necesario
          height: height - 210,
        }); // Es

      }

      // añadir aca line.includes("_firmaUsuario_") && esta linea de codigo

      /*  if ( !isNullOrUndefined<object>(base64img)) {
         const lastPageNumber = pdfDocNew.getPageCount() - 1;
         const lastPage = pdfDocNew.getPage(lastPageNumber)
         const {height} = lastPage.getSize();

         const position = 300;

         if (base64img.fileType.includes("text")) {
           lastPage.drawText(base64img.fileData, {
             x: 50,
             y: position,
             size: 11,
             color: rgb(0, 0, 0),
           });
         } else {

           const imageBytes = this.base64ToUint8Array(base64img.fileData);
           const image = await pdfDoc.embedPng(imageBytes);
           const jpgDims = image.scale(0.5)

           lastPage.drawImage(image, {
             x: 50,
             y: height-200,
             width: jpgDims.width,
             height: jpgDims.height,
           });
         }

       } */

      // Guardar el PDF resultante

      const pdfBytes = await pdfDocNew.save();

      // Limpiar el contenedor temporal
      document.body.removeChild(tempDiv);

      return this.uint8ArrayToBase64(pdfBytes);
    } catch (error) {
      alert("Ocurrió un error al generar el PDF. Por favor, intenta de nuevo.");
    }
  }
}
