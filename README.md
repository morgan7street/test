# Suivi des nutriments


Cette application web permet de suivre la consommation quotidienne de nutriments. Vous indiquez le nom et la quantité d'un aliment et l'application récupère automatiquement ses valeurs nutritionnelles (calories, protéines, glucides, lipides et fibres) ainsi que son Nutri-score grâce au service OpenRouter. Les données sont isolées par session pour garantir la confidentialité et vous pouvez définir une limite de calories dans la page des paramètres. Une animation de chargement apparaît pendant la récupération des données pour indiquer que l'enregistrement est en cours. Chaque ligne peut être supprimée et les quantités peuvent être saisies en grammes ou en unités courantes (banane, œuf, etc.). Les valeurs affichées sont arrondies à deux décimales pour plus de lisibilité.

Le projet est prêt à être déployé sur [Render](https://render.com/).

## Développement local

1. Installez les dépendances&nbsp;:
   ```bash
   pip install -r requirements.txt
   ```
2. Lancez l'application&nbsp;:
   ```bash
   python app.py
   ```
   L'application sera disponible sur `http://localhost:5000`.

## Déploiement sur Render

Render détecte automatiquement `render.yaml` et construit le service.

1. Créez un nouveau service web sur Render à partir de ce dépôt.
2. Vérifiez les commandes&nbsp;:
   - Build&nbsp;: `pip install -r requirements.txt`
   - Start&nbsp;: `gunicorn app:app`

Render fournira ensuite une URL publique pour accéder à l'application.

## Variable d'environnement

L'application nécessite une clé API OpenRouter pour récupérer les informations
nutritionnelles. Sur Render, ajoutez une variable `OPENROUTER_API_KEY` contenant
votre clé.
