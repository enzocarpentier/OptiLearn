# OptiLearn

OptiLearn est une application web intelligente qui transforme vos documents PDF en quiz interactifs pour optimiser votre apprentissage.

## Fonctionnalités

- 📄 **Upload de PDF** : Téléchargez vos documents d'étude
- 🧠 **Quiz intelligents** : Génération automatique de questions à partir de vos PDFs
- 🔐 **Authentification sécurisée** : Connexion par email/mot de passe ou Google
- 📱 **Interface moderne** : Design responsive et intuitif
- 🌙 **Mode sombre** : Interface adaptable selon vos préférences

## Technologies utilisées

- **Frontend** : Next.js 15, React 18, TypeScript, Tailwind CSS
- **Backend** : Firebase Authentication, Firestore
- **Déploiement** : Vercel (recommandé)

## Installation et développement

1. Clonez le repository :
```bash
git clone [votre-repo]
cd optilearn
```

2. Installez les dépendances :
```bash
npm install
```

3. Configurez Firebase (voir `FIREBASE_SETUP.md`)

4. Créez un fichier `.env.local` avec vos clés Firebase

5. Lancez le serveur de développement :

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000).

## Structure du projet

```
src/
├── app/                    # Pages Next.js App Router
│   ├── dashboard/         # Tableau de bord utilisateur
│   ├── login/            # Page de connexion
│   ├── signup/           # Page d'inscription
│   ├── quiz/[id]/        # Page de quiz dynamique
│   └── upload/           # Page d'upload PDF
├── components/           # Composants réutilisables
├── contexts/            # Contextes React (Auth)
└── lib/                # Configuration Firebase
```

## Déploiement

Consultez le fichier `DEPLOYMENT.md` pour les instructions de déploiement sur Vercel.

## Configuration Firebase

Consultez le fichier `FIREBASE_SETUP.md` pour configurer votre projet Firebase.
