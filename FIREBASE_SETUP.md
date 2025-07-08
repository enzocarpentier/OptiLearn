# Configuration Firebase pour OptiLearn

## 🔥 Étapes de configuration Firebase

### 1. Créer un projet Firebase

1. Allez sur [Firebase Console](https://console.firebase.google.com/)
2. Cliquez sur "Ajouter un projet"
3. Nommez votre projet (ex: "optiearn-app")
4. Suivez les étapes de configuration

### 2. Activer l'authentification

1. Dans votre projet Firebase, allez dans **Authentication**
2. Cliquez sur **Commencer**
3. Dans l'onglet **Sign-in method**, activez :
   - **Email/Password**
   - **Google** (recommandé)

### 3. Créer une application web

1. Dans **Paramètres du projet** (⚙️)
2. Cliquez sur **Ajouter une application** > **Web** (</>)
3. Nommez votre app (ex: "OptiLearn Web App")
4. Copiez la configuration qui s'affiche

### 4. Configuration locale

1. Créez un fichier `.env.local` à la racine du projet
2. Ajoutez vos clés Firebase :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=votre-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=votre-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=votre-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=votre-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=votre-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=votre-app-id
```

### 5. Tester l'authentification

1. Redémarrez le serveur : `npm run dev`
2. Allez sur `http://localhost:3000`
3. Testez l'inscription et la connexion

## 🚀 Fonctionnalités disponibles

- ✅ **Inscription par email/mot de passe**
- ✅ **Connexion par email/mot de passe**  
- ✅ **Connexion Google** (après configuration)
- ✅ **Gestion des erreurs** en français
- ✅ **Protection des routes** automatique
- ✅ **Déconnexion** sécurisée
- ✅ **Persistance de session**

## 🔧 Commandes utiles

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour production
npm run build
```

## 🐛 Dépannage

Si vous voyez des erreurs Firebase :
1. Vérifiez que toutes les variables d'environnement sont correctes
2. Assurez-vous que l'authentification est activée dans Firebase
3. Redémarrez le serveur après modification du .env.local

## 📧 Support

Si vous avez des questions, vérifiez :
1. La [documentation Firebase](https://firebase.google.com/docs)
2. Les logs de la console du navigateur
3. La console Firebase pour les erreurs 