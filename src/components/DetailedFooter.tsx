'use client';

export default function DetailedFooter() {
  const preventDefault = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
  };

  return (
    <footer className="bg-white text-gray-800 border-t border-gray-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="pb-8 mb-8 border-b border-gray-200">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center text-sm text-yellow-800 mb-8">
            <p>
              <span className="font-bold">Note :</span> Les liens ci-dessous sont fictifs et non fonctionnels. Cette section est en cours de développement.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <div className="md:col-span-4">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">OptiLearn</h3>
              <p className="text-gray-600 text-sm">
                Révolutionnez votre façon d'apprendre avec notre plateforme d'IA intelligente. Créez des quiz personnalisés à partir de vos documents PDF.
              </p>
            </div>
            <div className="md:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Produit</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Fonctionnalités</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">API</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Intégrations</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Nouveautés</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Ressources</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Documentation</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Guides</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Blog</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Centre d'aide</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Communauté</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Entreprise</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">À propos</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Carrières</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Presse</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Partenaires</a></li>
                  <li><a href="#" onClick={preventDefault} className="text-gray-600 hover:text-primary-600">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} OptiLearn. Tous droits réservés.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" onClick={preventDefault} className="hover:text-primary-600">Politique de confidentialité</a>
            <a href="#" onClick={preventDefault} className="hover:text-primary-600">Conditions d'utilisation</a>
            <a href="#" onClick={preventDefault} className="hover:text-primary-600">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  );
} 