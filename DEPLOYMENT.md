# Optima - Guide de Déploiement

## 🚀 Déploiement sur Vercel

### Prérequis
- Un compte GitHub avec le code pushé dans un repository
- Un compte Vercel (gratuit)
- Votre projet Firebase configuré

### Étapes de déploiement

1. **Préparer votre repository GitHub**
   ```bash
   git add .
   git commit -m "Prêt pour déploiement"
   git push origin main
   ```

2. **Déployer sur Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec votre compte GitHub
   - Cliquez sur "New Project"
   - Sélectionnez votre repository `optima`
   - Vercel détectera automatiquement que c'est un projet Next.js

3. **Configurer les variables d'environnement**
   Dans les paramètres du projet Vercel, ajoutez ces variables :
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

4. **Configurer Firebase pour la production**
   - Dans la console Firebase, allez dans "Authentication" > "Settings" > "Authorized domains"
   - Ajoutez votre domaine Vercel (ex: `your-app.vercel.app`)

5. **Déployer**
   - Cliquez sur "Deploy"
   - Votre site sera disponible en quelques minutes !

### Configuration Firebase Production

N'oubliez pas d'ajouter votre domaine Vercel dans Firebase :
1. Console Firebase > Authentication > Settings > Authorized domains
2. Ajoutez : `your-project-name.vercel.app`

### URLs importantes après déploiement
- Site principal : `https://your-project-name.vercel.app`
- Dashboard : `https://your-project-name.vercel.app/dashboard`
- Login : `https://your-project-name.vercel.app/login`

## 🔧 Build locale (test)
```bash
npm run build
npm start
```

## 📱 Fonctionnalités
- ✅ Authentification Firebase (Email/Google)
- ✅ Pages protégées
- ✅ Interface responsive
- ✅ Validation robuste des mots de passe
- ✅ Design moderne et accessible
