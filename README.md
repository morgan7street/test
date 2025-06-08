# Nutrient Tracker

This is a simple web application to track daily nutrient intake. You can add food entries with calories, protein, carbohydrates and fat. A daily calorie limit can be configured from the settings page.

The project is ready for deployment on [Render](https://render.com/).

## Local development

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. Run the application:
   ```bash
   python app.py
   ```
   The app will be available at `http://localhost:5000`.

## Deployment on Render

Render will detect `render.yaml` and build the service automatically.

1. Create a new Web Service on Render from this repository.
2. Ensure the build and start commands are:
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn app:app`

Render will provide a public URL where the application can be accessed.
