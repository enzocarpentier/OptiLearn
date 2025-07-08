#!/bin/bash

# Script de publication OptiLearn
echo "🚀 Préparation de OptiLearn pour la publication..."

# Vérification que nous sommes dans le bon dossier
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Ce script doit être exécuté dans le dossier racine du projet"
    exit 1
fi

# Test du build
echo "📦 Test du build de production..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build réussi !"
else
    echo "❌ Erreur lors du build. Veuillez corriger les erreurs avant de continuer."
    exit 1
fi

# Instructions pour GitHub
echo ""
echo "📋 PROCHAINES ÉTAPES:"
echo ""
echo "1. Créez un repository sur GitHub nommé 'optilearn'"
echo "2. Exécutez ces commandes :"
echo ""
echo "   git init"
echo "   git add ."
echo "   git commit -m 'Initial commit - OptiLearn ready for deployment'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/[VOTRE-USERNAME]/optilearn.git"
echo "   git push -u origin main"
echo ""
echo "3. Allez sur vercel.com et déployez votre projet"
echo "4. Ajoutez les variables d'environnement listées dans PUBLICATION.md"
echo ""
echo "🎉 Votre application sera alors accessible publiquement !"
echo ""
echo "📖 Consultez PUBLICATION.md pour les instructions détaillées"
