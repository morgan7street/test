from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
from pathlib import Path
import os
import json
import requests
import re
from json import JSONDecodeError, JSONDecoder
from uuid import uuid4

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY", "dev-key")
DATABASE = Path('nutrients.db')

# unités acceptées
VALID_UNITS = {'g', 'mL', 'P'}
UNIT_TO_GRAMS = {
    'g': 1.0,
    'mL': 1.0,
    'P': 100.0,
}

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
                session_id TEXT NOT NULL,
                name TEXT NOT NULL,
                calories REAL NOT NULL,
                protein REAL NOT NULL,
                carbs REAL NOT NULL,
                fat REAL NOT NULL,
                fiber REAL NOT NULL,
                quantity REAL NOT NULL,
                unit TEXT NOT NULL DEFAULT 'g',
                nutriscore TEXT,
                created_at DATE DEFAULT (DATE('now'))
            );"""
    )
    if 'unit' not in cols:
        c.execute("ALTER TABLE food ADD COLUMN unit TEXT NOT NULL DEFAULT 'g'")
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

@app.before_request
def ensure_session():
    if 'session_id' not in session:
        session['session_id'] = uuid4().hex

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

def fetch_nutrition(name, quantity, unit):
    """Use OpenRouter to obtain nutrition facts and NutriScore for a given amount of food."""
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise RuntimeError("OPENROUTER_API_KEY not set")

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
        "HTTP-Referer": "https://example.com",
        "X-Title": "Nutrient Tracker",
    }
    if unit == 'P':
        qty_str = f"{quantity} piece"
    else:
        qty_str = f"{quantity} {unit}"
    prompt = (
        f"Donne la valeur nutritionnelle pour {qty_str} de {name} en calories, proteines, glucides, lipides et fibres ainsi que le Nutri-score (A-E)."
        " Reponds en JSON avec les cles calories, protein, carbs, fat, fiber et nutriscore."
    )
    # Construction de la charge utile pour OpenRouter
    # dictionnaire pour l'appel OpenRouter
    payload = {
        "model": "openai/gpt-3.5-turbo",
        "messages": [{"role": "user", "content": prompt}],
        "max_tokens": 200,
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=headers,
        data=json.dumps(payload),
        timeout=30,
    )
    response.raise_for_status()
    data = response.json()
    content = data["choices"][0]["message"]["content"]

    match = re.search(r"\{.*\}", content, re.DOTALL)
    if not match:
        raise ValueError("Réponse OpenRouter inattendue: " + content)

    decoder = JSONDecoder()
    try:
        obj = decoder.raw_decode(match.group(0))[0]
    except JSONDecodeError as exc:
        raise ValueError("Impossible de parser la réponse d'OpenRouter") from exc
    return obj

def add_food(session_id, name, calories, protein, carbs, fat, fiber, quantity, unit, nutriscore):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO food (session_id, name, calories, protein, carbs, fat, fiber, quantity, unit, nutriscore) VALUES (?,?,?,?,?,?,?,?,?,?)",
        (session_id, name, calories, protein, carbs, fat, fiber, quantity, unit, nutriscore),
    )
    conn.commit()
    conn.close()

def get_today_food(session_id):
    conn = get_db_connection()
    cur = conn.execute(
        "SELECT * FROM food WHERE session_id = ? AND created_at = DATE('now') ORDER BY id DESC",
        (session_id,)
    )
    rows = cur.fetchall()
    conn.close()
    return rows

def get_totals(rows):
    total_cals = sum(row['calories'] for row in rows)
    total_protein = sum(row['protein'] for row in rows)
    total_carbs = sum(row['carbs'] for row in rows)
    total_fat = sum(row['fat'] for row in rows)
    total_fiber = sum(row['fiber'] for row in rows)
    return total_cals, total_protein, total_carbs, total_fat, total_fiber

@app.route('/')
def index():
    foods = get_today_food(session['session_id'])
    totals = get_totals(foods)
    limit = get_calorie_limit()
    return render_template('index.html', foods=foods, totals=totals, limit=limit)

@app.route('/add', methods=['GET', 'POST'])
def add():
    error = None
    name = ""
    quantity = 100.0
    unit = 'g'
    if request.method == 'POST':
        name = request.form['name']
        quantity = float(request.form['quantity'])
        unit = request.form.get('unit', 'g')
        if unit not in VALID_UNITS:
            error = "Unité inconnue"
            return render_template('add.html', error=error, name=name, quantity=quantity, unit=unit)
        if unit != 'g':
            weight = UNIT_TO_GRAMS.get(unit, 1)
            quantity = quantity * weight
        try:
            info = fetch_nutrition(name, 100.0, 'g')
            factor = quantity / 100.0
            calories = float(info['calories']) * factor
            protein = float(info['protein']) * factor
            carbs = float(info['carbs']) * factor
            fat = float(info['fat']) * factor
            fiber = float(info.get('fiber', 0)) * factor
            nutriscore = info.get('nutriscore')
            add_food(session['session_id'], name, calories, protein, carbs, fat, fiber, quantity, unit, nutriscore)
            return redirect(url_for('index'))
        except Exception as exc:
            print(f"Erreur lors de l'ajout d'aliment: {exc}")
            error = "Impossible de récupérer les informations nutritionnelles."
    return render_template('add.html', error=error, name=name, quantity=quantity, unit=unit)

@app.route('/delete/<int:food_id>', methods=['POST'])
def delete(food_id):
    conn = get_db_connection()
    conn.execute(
        "DELETE FROM food WHERE id=? AND session_id=?",
        (food_id, session['session_id']),
    )
    conn.commit()
    conn.close()
    return redirect(url_for('index'))

@app.route('/settings', methods=['GET', 'POST'])
def settings():
    if request.method == 'POST':
        limit = float(request.form['limit'])
        set_calorie_limit(limit)
        return redirect(url_for('index'))
    current = get_calorie_limit()
    return render_template('settings.html', current=current)

# Initialise la base de données au démarrage de l'application
init_db()

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
