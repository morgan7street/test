from flask import Flask, render_template, request, redirect, url_for
import sqlite3
from pathlib import Path
import os
import json
import requests
import re
from json import JSONDecodeError, JSONDecoder

app = Flask(__name__)
DATABASE = Path('nutrients.db')

# Database helpers

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute(
        """CREATE TABLE IF NOT EXISTS food (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                calories REAL NOT NULL,
                protein REAL NOT NULL,
                carbs REAL NOT NULL,
                fat REAL NOT NULL,
                nutriscore TEXT,
                created_at DATE DEFAULT (DATE('now'))
            );"""
    )
    c.execute("PRAGMA table_info(food)")
    cols = [r[1] for r in c.fetchall()]
    if 'nutriscore' not in cols:
        c.execute("ALTER TABLE food ADD COLUMN nutriscore TEXT")
    c.execute(
        """CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY CHECK (id = 1),
                calorie_limit REAL
            );"""
    )
    # Ensure a single row exists
    c.execute("INSERT OR IGNORE INTO settings (id, calorie_limit) VALUES (1, 2000)")
    conn.commit()
    conn.close()


# Helper functions

def get_calorie_limit():
    conn = get_db_connection()
    cur = conn.execute("SELECT calorie_limit FROM settings WHERE id=1")
    row = cur.fetchone()
    conn.close()
    return row[0] if row else 2000

def set_calorie_limit(value):
    conn = get_db_connection()
    conn.execute("UPDATE settings SET calorie_limit=? WHERE id=1", (value,))
    conn.commit()
    conn.close()

def fetch_nutrition(name):
    """Use OpenRouter to obtain nutrition facts and NutriScore for a food."""
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY not set")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://example.com",
        "X-Title": "Nutrient Tracker",
    }
    prompt = (
        "Donne la valeur nutritionnelle pour 100g de "
        f"{name} en calories, proteines, glucides et lipides et le Nutri-score (A-E)."
        " Reponds en JSON avec les cles calories, protein, carbs, fat et nutriscore."
    )
    data = {
        "model": "microsoft/phi-4-reasoning:free",
        "messages": [{"role": "user", "content": prompt}],
    }

    try:
        resp = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=data,
            timeout=15,
        )
        resp.raise_for_status()
        text = resp.json()["choices"][0]["message"]["content"]
    except Exception as exc:  # network or API error
        raise RuntimeError("Erreur lors de la requête OpenRouter") from exc

    # parfois la réponse contient du texte en plus autour de l'objet JSON.
    match = re.search(r"{.*}", text, re.S)
    if not match:
        raise ValueError("Réponse inattendue d'OpenRouter")
    decoder = JSONDecoder()
    try:
        obj, _ = decoder.raw_decode(match.group(0))
    except JSONDecodeError as exc:
        raise ValueError("Impossible de parser la réponse d'OpenRouter") from exc
    return obj

def add_food(name, calories, protein, carbs, fat, nutriscore):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO food (name, calories, protein, carbs, fat, nutriscore) VALUES (?,?,?,?,?,?)",
        (name, calories, protein, carbs, fat, nutriscore),
    )
    conn.commit()
    conn.close()

def get_today_food():
    conn = get_db_connection()
    cur = conn.execute(
        "SELECT * FROM food WHERE created_at = DATE('now') ORDER BY id DESC"
    )
    rows = cur.fetchall()
    conn.close()
    return rows

def get_totals(rows):
    total_cals = sum(row['calories'] for row in rows)
    total_protein = sum(row['protein'] for row in rows)
    total_carbs = sum(row['carbs'] for row in rows)
    total_fat = sum(row['fat'] for row in rows)
    return total_cals, total_protein, total_carbs, total_fat

@app.route('/')
def index():
    foods = get_today_food()
    totals = get_totals(foods)
    limit = get_calorie_limit()
    return render_template('index.html', foods=foods, totals=totals, limit=limit)

@app.route('/add', methods=['GET', 'POST'])
def add():
    error = None
    name = ""
    if request.method == 'POST':
        name = request.form['name']
        try:
            info = fetch_nutrition(name)
            calories = float(info['calories'])
            protein = float(info['protein'])
            carbs = float(info['carbs'])
            fat = float(info['fat'])
            nutriscore = info.get('nutriscore')
            add_food(name, calories, protein, carbs, fat, nutriscore)
            return redirect(url_for('index'))
        except Exception as exc:
            # Log the error on the server and display a message to the user
            print(f"Erreur lors de l'ajout d'aliment: {exc}")
            error = "Impossible de récupérer les informations nutritionnelles."
    return render_template('add.html', error=error, name=name)

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    if request.method == 'POST':
        limit = float(request.form['limit'])
        set_calorie_limit(limit)
        return redirect(url_for('index'))
    current = get_calorie_limit()
    return render_template('settings.html', current=current)

# Initialize the database when the application starts
init_db()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
