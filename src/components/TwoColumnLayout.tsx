import React from 'react';

interface TwoColumnLayoutProps {
  mainContent: React.ReactNode;
  rightSidebar: React.ReactNode;
}

const TwoColumnLayout: React.FC<TwoColumnLayoutProps> = ({ mainContent, rightSidebar }) => {
  return (
    <div className="flex flex-1 w-full h-[calc(100vh-7rem)] p-6 gap-6 bg-white overflow-hidden">
      {/* Contenu principal à gauche - 70% de l'espace */}
      <div className="w-[70%] h-[calc(100vh-9rem)] overflow-hidden flex flex-col">
        {mainContent}
      </div>
      
      {/* Sidebar à droite - 30% de l'espace */}
      <div className="w-[30%] h-[calc(100vh-9rem)] overflow-hidden flex flex-col">
        {rightSidebar}
      </div>
    </div>
  );
};

export default TwoColumnLayout;