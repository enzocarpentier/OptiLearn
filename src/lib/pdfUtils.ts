import * as pdfjsLib from 'pdfjs-dist';

// Configure le worker pour pdf.js
// Cette ligne est cruciale pour que la bibliothèque fonctionne dans un environnement web moderne.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

/**
 * Extrait le texte d'un fichier PDF à partir de son URL.
 * @param url L'URL publique du fichier PDF.
 * @returns Une promesse qui se résout avec le contenu textuel complet du PDF.
 */
export async function extractTextFromPdfUrl(url: string): Promise<string> {
  try {
    const loadingTask = pdfjsLib.getDocument(url);
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;
    let fullText = '';

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
      fullText += pageText + '\n\n'; // Ajoute un espace entre les pages
    }

    return fullText.trim();
  } catch (error) {
    console.error("Erreur lors de l'extraction du texte du PDF:", error);
    throw new Error("Impossible de lire le contenu du fichier PDF.");
  }
}
