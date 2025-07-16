'use client';

import React, { useMemo } from 'react';

interface CustomPDFViewerProps {
  pdfUrl: string;
  fileName?: string;
}

const CustomPDFViewer: React.FC<CustomPDFViewerProps> = ({ pdfUrl, fileName }) => {
  // Ajouter le paramètre de zoom à l'URL du PDF
  const pdfUrlWithZoom = useMemo(() => {
    // Vérifier si l'URL contient déjà un paramètre
    const hasParams = pdfUrl.includes('?');
    // Ajouter le paramètre de zoom (95%)
    const zoomParam = `#zoom=95`;
    return `${pdfUrl}${zoomParam}`;
  }, [pdfUrl]);

  return (
    <div className="w-full h-full overflow-hidden rounded-xl shadow-sm border border-gray-200/80 bg-white">
      {/* Affichage du PDF via iframe avec zoom par défaut */}
      <iframe
        src={pdfUrlWithZoom}
        className="w-full h-full border-none"
        title={fileName || "Document PDF"}
        loading="lazy"
      />
    </div>
  );
};

export default CustomPDFViewer;