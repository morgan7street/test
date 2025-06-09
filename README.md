# Suivi des nutriments

Cette application web permet de suivre la consommation quotidienne de nutriments. Vous pouvez ajouter un aliment en saisissant son nom, en envoyant une photo ou en scannant son code‑barres. Les valeurs nutritionnelles (calories, protéines, glucides, lipides et fibres) ainsi que le Nutri‑score sont récupérées automatiquement grâce aux services OpenRouter et OpenFoodFacts. Les données sont isolées par session et vous pouvez définir une limite de calories dans la page des paramètres. Une animation indique que la récupération est en cours. Les quantités peuvent être saisies en grammes (g), en millilitres (mL) ou en nombre de pièces (P).
Pour utiliser la reconnaissance via photo ou scanner un code-barres, votre navigateur doit autoriser l'accès à la caméra.

Le projet est prêt à être déployé sur [Render](https://render.com/).

## Développement local

1. Installez les dépendances :
   ```bash
   pip install -r requirements.txt
   ```
2. Lancez l'application :
   ```bash
   python app.py
   ```
   L'application sera disponible sur `http://localhost:5000`.

## Déploiement sur Render

Render détecte automatiquement `render.yaml` et construit le service.

1. Créez un nouveau service web sur Render à partir de ce dépôt.
2. Vérifiez les commandes :
   - Build : `pip install -r requirements.txt`
   - Start : `gunicorn app:app`

Render fournira ensuite une URL publique pour accéder à l'application.

## Variable d'environnement

L'application nécessite une clé API OpenRouter pour récupérer les informations nutritionnelles. Sur Render, ajoutez une variable `OPENROUTER_API_KEY` contenant votre clé.
