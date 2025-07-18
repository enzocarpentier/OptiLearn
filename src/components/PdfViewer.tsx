'use client';

interface PdfViewerProps {
  fileUrl: string;
}

const PdfViewer = ({ fileUrl }: PdfViewerProps) => {
  if (!fileUrl) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-900">
        <p className="text-slate-500 dark:text-slate-400">Aucun PDF sélectionné</p>
      </div>
    );
  }

  // Ajoute le paramètre de zoom à l'URL pour un affichage à 95%
  const urlWithZoom = `${fileUrl}#zoom=95`;

  return (
    <div className="w-full h-full bg-slate-200 dark:bg-slate-900">
      <object
        data={urlWithZoom}
        type="application/pdf"
        className="w-full h-full"
        aria-label="PDF Viewer"
      >
        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-300 dark:bg-slate-800">
          <p className="text-slate-700 dark:text-slate-200 mb-4">Votre navigateur ne prend pas en charge l'affichage des PDF intégrés.</p>
          <a 
            href={urlWithZoom} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Télécharger ou voir le PDF
          </a>
        </div>
      </object>
    </div>
  );
};

export default PdfViewer;
