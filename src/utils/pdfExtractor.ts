import * as pdfjs from 'pdfjs-dist';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';

export const extractTextFromPdf = async (data: ArrayBuffer): Promise<string> => {
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const text = content.items.map((item: any) => item.str).join(' ');
    pages.push(text);
  }

  return pages.join('\n');
};
