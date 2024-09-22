// src/utils/pdfUtils.js
import pdfjsLib from "pdfjs-dist";

export const extractTextFromPdf = async (file) => {
  const pdf = await pdfjsLib.getDocument(URL.createObjectURL(file)).promise;
  let extractedText = "";

  for (let i = 0; i < pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    textContent.items.forEach((item) => {
      extractedText += item.str + " ";
    });
  }
  return extractedText;
};
