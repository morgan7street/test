# Suivi des nutriments

Cette application web permet de suivre la consommation quotidienne de nutriments. Vous pouvez enregistrer vos aliments avec les calories, protéines, glucides et lipides. Les totaux journaliers sont affichés sur la page d'accueil et vous pouvez définir une limite de calories dans la page des paramètres.

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
