from flask import Flask, render_template, request, redirect, url_for
import sqlite3
from pathlib import Path

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
                created_at DATE DEFAULT (DATE('now'))
            );"""
    )
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

def add_food(name, calories, protein, carbs, fat):
    conn = get_db_connection()
    conn.execute(
        "INSERT INTO food (name, calories, protein, carbs, fat) VALUES (?,?,?,?,?)",
        (name, calories, protein, carbs, fat),
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
    if request.method == 'POST':
        name = request.form['name']
        calories = float(request.form['calories'])
        protein = float(request.form['protein'])
        carbs = float(request.form['carbs'])
        fat = float(request.form['fat'])
        add_food(name, calories, protein, carbs, fat)
        return redirect(url_for('index'))
    return render_template('add.html')

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
