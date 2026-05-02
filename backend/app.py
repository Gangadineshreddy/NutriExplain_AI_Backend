import os
import requests
from flask import Flask, request, jsonify
import mysql.connector
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import smtplib
import random
from email.mime.text import MIMEText
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# -------------------------
# DATABASE CONNECTION
# -------------------------
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="",
        database="nutritionai"
    )


# -------------------------
# HOME ROUTE
# -------------------------
@app.route("/")
def home():
    return "NutriAI Backend Running!"


# -------------------------
# REGISTER USER
# -------------------------
@app.route("/register", methods=["POST"])
def register_user():
    data = request.json

    name = data["name"]
    email = data["email"]
    password = data["password"]

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO users (full_name, email, password_hash)
    VALUES (%s,%s,%s)
    """
    try:
        cursor.execute(query, (name, email, password))
        conn.commit()
        user_id = cursor.lastrowid
        return jsonify({
            "message": "User registered successfully",
            "user_id": user_id
        })
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        conn.close()


# -------------------------
# OTP & RESET PASSWORD
# -------------------------
@app.route("/send-otp", methods=["POST"])
def send_otp():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Check if user exists
        cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
        if not cursor.fetchone():
            return jsonify({"error": "No account found with this email"}), 404

        # Generate OTP
        otp = str(random.randint(100000, 999999))
        expires_at = datetime.now() + timedelta(minutes=10)

        # Store OTP
        cursor.execute("DELETE FROM password_resets WHERE email=%s", (email,))
        cursor.execute("INSERT INTO password_resets (email, otp, expires_at) VALUES (%s, %s, %s)", (email, otp, expires_at))
        conn.commit()

        # Send email
        SENDER_EMAIL = "mandlidinesh1432@gmail.com"
        SENDER_PASSWORD = "jilucoczqehkqzcm"
        
        print(f"\n======================================")
        print(f"MOCK EMAIL TO: {email}")
        print(f"OTP CODE: {otp}")
        print(f"======================================\n")

        if SENDER_EMAIL and SENDER_PASSWORD:
            msg = MIMEText(f"Your password reset code is: {otp}\nIt expires in 10 minutes.")
            msg['Subject'] = 'NutriExplain Password Reset'
            msg['From'] = SENDER_EMAIL
            msg['To'] = email

            with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:
                server.login(SENDER_EMAIL, SENDER_PASSWORD)
                server.send_message(msg)

        return jsonify({"message": "OTP sent successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/verify-otp", methods=["POST"])
def verify_otp():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM password_resets WHERE email=%s AND otp=%s", (email, otp))
        record = cursor.fetchone()

        if not record:
            return jsonify({"error": "Invalid OTP"}), 400
        
        if datetime.now() > record["expires_at"]:
            return jsonify({"error": "OTP has expired"}), 400

        return jsonify({"message": "OTP verified successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

@app.route("/reset-password", methods=["POST"])
def reset_password():
    data = request.json
    email = data.get("email")
    otp = data.get("otp")
    new_password = data.get("new_password")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        # Double check OTP just in case
        cursor.execute("SELECT * FROM password_resets WHERE email=%s AND otp=%s", (email, otp))
        record = cursor.fetchone()

        if not record or datetime.now() > record["expires_at"]:
            return jsonify({"error": "Invalid or expired OTP"}), 400
            
        # Update password
        cursor.execute("UPDATE users SET password_hash=%s WHERE email=%s", (new_password, email))
        # Clear the OTP
        cursor.execute("DELETE FROM password_resets WHERE email=%s", (email,))
        conn.commit()
        
        return jsonify({"message": "Password reset successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# -------------------------
# LOGIN USER
# -------------------------
@app.route("/login", methods=["POST"])
def login_user():
    data = request.json
    email = data["email"]
    password = data["password"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT id, full_name FROM users WHERE email=%s AND password_hash=%s"
    
    try:
        cursor.execute(query, (email, password))
        user = cursor.fetchone()
        
        if user:
            return jsonify({
                "message": "Login successful",
                "user_id": user["id"],
                "full_name": user["full_name"]
            })
        else:
            return jsonify({"error": "Invalid email or password"}), 401
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# -------------------------
# ADD HEALTH PROFILE
# -------------------------
@app.route("/add-health-profile", methods=["POST"])
def add_health_profile():

    data = request.json
    user_id = data["user_id"]
    age = data["age"]
    gender = data["gender"]
    height_cm = data["height_cm"]
    weight_kg = data["weight_kg"]
    activity_level = data["activity_level"]
    sleep_hours = data.get("sleep_hours", 7.5)
    stress_level = data.get("stress_level", "Medium")

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO health_profiles (user_id, age, gender, height_cm, weight_kg, activity_level, sleep_hours, stress_level)
    VALUES (%s,%s,%s,%s,%s,%s,%s,%s)
    """
    try:
        cursor.execute(query, (user_id, age, gender, height_cm, weight_kg, activity_level, sleep_hours, stress_level))
        conn.commit()
        return jsonify({"message": "Health profile added"})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        conn.close()


# -------------------------
# ENSURE DB SCHEMA (Utility)
# -------------------------
def ensure_schema():
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # Add profile_image_url to users table if not exists
        cursor.execute("SHOW COLUMNS FROM users LIKE 'profile_image_url'")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE users ADD COLUMN profile_image_url VARCHAR(255) DEFAULT NULL")
            conn.commit()
        
        # Ensure scan_history has image_url
        cursor.execute("SHOW COLUMNS FROM scan_history LIKE 'image_url'")
        if not cursor.fetchone():
            cursor.execute("ALTER TABLE scan_history ADD COLUMN image_url VARCHAR(255) DEFAULT NULL")
            conn.commit()
            
        # Add password_resets table
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY,
            email VARCHAR(255) NOT NULL,
            otp VARCHAR(6) NOT NULL,
            expires_at DATETIME NOT NULL
        )
        """)
        conn.commit()
    except:
        pass
    finally:
        cursor.close()
        conn.close()

ensure_schema()


# -------------------------
# UPDATE PROFILE
# -------------------------
@app.route("/update-profile", methods=["POST"])
def update_profile():
    data = request.json
    user_id = data["user_id"]
    age = data.get("age")
    gender = data.get("gender")
    height = data.get("height_cm")
    weight = data.get("weight_kg")
    activity = data.get("activity_level")
    sleep = data.get("sleep_hours")
    stress = data.get("stress_level")
    full_name = data.get("full_name")
    profile_image_url = data.get("profile_image_url")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Update user name and image if provided
        if full_name:
            cursor.execute("UPDATE users SET full_name=%s WHERE id=%s", (full_name, user_id))
        if profile_image_url:
            cursor.execute("UPDATE users SET profile_image_url=%s WHERE id=%s", (profile_image_url, user_id))
        
        # Update health profile
        cursor.execute("""
            UPDATE health_profiles 
            SET age=%s, gender=%s, height_cm=%s, weight_kg=%s, activity_level=%s, sleep_hours=%s, stress_level=%s
            WHERE user_id=%s
        """, (age, gender, height, weight, activity, sleep, stress, user_id))
        
        conn.commit()
        return jsonify({"message": "Profile updated successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()

# -------------------------
# UPLOAD PROFILE IMAGE
# -------------------------
@app.route("/upload-profile-image", methods=["POST"])
def upload_profile_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400
    
    file = request.files['image']
    user_id = request.form.get('user_id')
    
    if file.filename == '' or not user_id:
        return jsonify({"error": "No selected file or user ID"}), 400

    filename = f"profile_{user_id}.jpg"
    upload_folder = "uploads/profiles"
    if not os.path.exists(upload_folder):
        os.makedirs(upload_folder)
        
    filepath = os.path.join(upload_folder, filename)
    file.save(filepath)
    
    # Generate a local URL (or relative path)
    image_url = f"http://{request.host}/{filepath}"
    
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE users SET profile_image_url=%s WHERE id=%s", (image_url, user_id))
        conn.commit()
        return jsonify({"message": "Image uploaded successfully", "image_url": image_url})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()



# -------------------------
# ADD USER MEDICAL CONDITION
# -------------------------
@app.route("/add-condition", methods=["POST"])
def add_condition():

    data = request.json
    user_id = data["user_id"]
    condition_id = data["condition_id"]

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO user_medical_conditions (user_id, condition_id)
    VALUES (%s,%s)
    """
    try:
        cursor.execute(query, (user_id, condition_id))
        conn.commit()
        return jsonify({"message": "Condition added"})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        conn.close()


# -------------------------
# SAVE HEALTH CONDITION
# -------------------------
@app.route("/save-health-condition", methods=["POST"])
def save_health_condition():
    data = request.json
    user_id = data["user_id"]
    disease = data["disease"]
    stage = data["stage"]

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO user_conditions (user_id, disease_name, stage)
    VALUES (%s,%s,%s)
    """
    try:
        cursor.execute(query, (user_id, disease, stage))
        conn.commit()
        return jsonify({"message": "Condition saved successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        conn.close()


# -------------------------
# REMOVE HEALTH CONDITION
# -------------------------
@app.route("/remove-condition", methods=["POST"])
def remove_condition():
    data = request.json
    user_id = data["user_id"]
    disease = data["disease"]
    stage = data["stage"]

    conn = get_db_connection()
    cursor = conn.cursor()

    query = "DELETE FROM user_conditions WHERE user_id=%s AND disease_name=%s AND stage=%s"
    try:
        cursor.execute(query, (user_id, disease, stage))
        conn.commit()
        return jsonify({"message": "Condition removed successfully"})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        conn.close()


# -------------------------
# GENERATE NUTRITION LIMIT
# -------------------------
@app.route("/set-nutrition-limit", methods=["POST"])
def set_limits():

    data = request.json

    user_id = data["user_id"]
    sugar = data["max_sugar"]
    sodium = data["max_sodium"]
    fat = data["max_fat"]
    carbs = data["max_carbs"]

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO user_nutritional_limits
    (user_id, max_sugar, max_sodium, max_fat, max_carbs)
    VALUES (%s,%s,%s,%s,%s)
    """
    try:
        cursor.execute(query, (user_id, sugar, sodium, fat, carbs))
        conn.commit()
        return jsonify({"message": "Nutrition limits saved"})
    except Exception as e:
        return jsonify({"error": str(e)})
    finally:
        cursor.close()
        conn.close()


# -------------------------
# ANALYZE FOOD PRODUCT
# -------------------------
@app.route("/analyze-food", methods=["POST"])
def analyze_food():

    data = request.json

    user_id = data["user_id"]
    sugar = data["sugar"]
    sodium = data["sodium"]
    fat = data["fat"]
    carbs = data["carbs"]

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
        SELECT * FROM user_nutritional_limits
        WHERE user_id=%s
        """, (user_id,))

        limits = cursor.fetchone()

        result = "SAFE"

        if not limits:
             return jsonify({"error": "User nutritional limits not found"}), 404

        if sugar > limits["max_sugar"]:
            result = "HIGH SUGAR"

        if sodium > limits["max_sodium"]:
            result = "HIGH SODIUM"

        if fat > limits["max_fat"]:
            result = "HIGH FAT"

        return jsonify({
            "analysis": result
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# -------------------------
# AI PREDICTION
# -------------------------
model = joblib.load("nutrition_ai_model.pkl")

@app.route("/ai-predict", methods=["POST"])
def ai_predict():
    data = request.json
    sugar = data["sugar"]
    sodium = data["sodium"]
    fat = data["fat"]
    carbs = data["carbs"]
    calories = data["calories"]
    protein = data["protein"]
    fiber = data["fiber"]

    features = [[sugar, sodium, fat, carbs, calories, protein, fiber]]
    prediction = model.predict(features)

    return jsonify({
        "prediction": str(prediction[0])
    })


# -------------------------
# GET USER PROFILE
# -------------------------
@app.route("/get-profile", methods=["GET"])
def get_profile():
    user_id = request.args.get("user_id")
    
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    
    try:
        # Get basic health profile
        cursor.execute("SELECT * FROM health_profiles WHERE user_id=%s", (user_id,))
        profile = cursor.fetchone()
        
        # Get user basic info (name, email, image)
        cursor.execute("SELECT full_name, email, profile_image_url FROM users WHERE id=%s", (user_id,))
        user_info = cursor.fetchone()
        
        # Get conditions
        cursor.execute("SELECT disease_name, stage FROM user_conditions WHERE user_id=%s", (user_id,))
        conditions = cursor.fetchall()
        
        if profile and user_info:
            profile.update(user_info) # Merge user info into profile
            profile["conditions"] = conditions
            return jsonify(profile)
        elif user_info:
            # If health profile missing (e.g. just registered), return basic user info
            user_info["conditions"] = conditions
            # Add defaults for missing profile fields if needed
            user_info["age"] = 0
            user_info["gender"] = "Unknown"
            user_info["height_cm"] = 0.0
            user_info["weight_kg"] = 0.0
            user_info["activity_level"] = "Sedentary"
            user_info["sleep_hours"] = 7.5
            user_info["stress_level"] = "Low"
            return jsonify(user_info)
        else:
            return jsonify({"error": "Profile not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# -------------------------
# SAVE SCAN RESULT
# -------------------------
@app.route("/save-scan", methods=["POST"])
def save_scan():
    data = request.json
    user_id = data["user_id"]
    barcode = data.get("barcode", "")
    product_name = data["product_name"]
    analysis = data["analysis"]
    prediction = data["prediction"]

    conn = get_db_connection()
    cursor = conn.cursor()

    query = """
    INSERT INTO scan_history (user_id, barcode, product_name, analysis_result, ai_prediction, image_url)
    VALUES (%s,%s,%s,%s,%s,%s)
    """
    try:
        cursor.execute(query, (user_id, barcode, product_name, analysis, prediction, data.get("image_url", "")))
        conn.commit()
        return jsonify({"message": "Scan saved successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# -------------------------
# GET SCAN HISTORY
# -------------------------
@app.route("/get-history", methods=["GET"])
def get_history():
    user_id = request.args.get("user_id")

    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)

    try:
        cursor.execute("""
            SELECT product_name, barcode, analysis_result, ai_prediction, scanned_at, image_url 
            FROM scan_history 
            WHERE user_id=%s 
            ORDER BY scanned_at DESC
        """, (user_id,))
        history = cursor.fetchall()
        return jsonify({"history": history})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# -------------------------
# GET PRODUCT DATA BY BARCODE
# -------------------------
# -------------------------
# OPENFOODFACTS API FALLBACK
# -------------------------
def get_from_openfoodfacts_api(barcode):
    try:
        url = f"https://world.openfoodfacts.org/api/v0/product/{barcode}.json"
        headers = {"User-Agent": "NutriAI-App/1.0"}
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == 1:
                p = data.get("product", {})
                n = p.get("nutriments", {})
                
                def gv(key, variants=None, default=0.0):
                    val = n.get(key)
                    if val is None and variants:
                        for v in variants:
                            val = n.get(v)
                            if val is not None: break
                    if val is None: return default
                    try: return float(val)
                    except: return default

                sugar_val = gv("sugars_100g", ["sugar_100g", "sugars"])
                fat_val = gv("fat_100g", ["fat"])
                carbs_val = gv("carbohydrates_100g", ["carbs_100g", "carbs"])
                protein_val = gv("proteins_100g", ["protein_100g", "proteins"])
                fiber_val = gv("fiber_100g", ["fiber"])
                
                cal_val = gv("energy-kcal_100g", ["energy_kcal_100g", "energy-kcal", "energy_kcal"])
                if not cal_val:
                    kj_val = gv("energy_100g", ["energy"])
                    cal_val = kj_val / 4.184
                
                if cal_val == 0.0:
                    cal_val = (carbs_val * 4) + (protein_val * 4) + (fat_val * 9)

                # Smart Estimation based on Name if still 0
                prod_name = p.get("product_name", "").lower()
                if cal_val == 0.0 and prod_name:
                    # Common Indian/General products fallback
                    if "creatine" in prod_name:
                        cal_val, protein_val = 0.0, 0.0
                    elif "whey" in prod_name or "protein powder" in prod_name:
                        cal_val, protein_val, carbs_val, fat_val = 380.0, 75.0, 10.0, 5.0
                    elif "milk" in prod_name:
                        cal_val, protein_val, carbs_val, fat_val = 42.0, 3.4, 4.8, 1.0
                    elif "yogurt" in prod_name or "curd" in prod_name:
                        cal_val, protein_val, carbs_val, fat_val = 60.0, 3.5, 4.7, 3.3
                    elif "peanut butter" in prod_name:
                        cal_val, protein_val, carbs_val, fat_val = 588.0, 25.0, 20.0, 50.0
                    elif "egg" in prod_name:
                        cal_val, protein_val, carbs_val, fat_val = 143.0, 13.0, 1.1, 10.0
                    elif "oats" in prod_name:
                        cal_val, protein_val, carbs_val, fat_val = 389.0, 16.9, 66.3, 6.9
                    elif "horlicks" in prod_name:
                        cal_val, protein_val, carbs_val, fat_val = 370.0, 11.0, 75.0, 2.0
                    elif "kissan" in prod_name or "ketchup" in prod_name:
                        cal_val, carbs_val, sugar_val = 120.0, 28.0, 25.0

                return {
                    "product_name": p.get("product_name", "Unknown Product"),
                    "brand": p.get("brands", ""),
                    "quantity": p.get("quantity", ""),
                    "image_url": p.get("image_url", ""),
                    "sugar": sugar_val,
                    "sodium": gv("sodium_100g", ["sodium"]) * 1000,
                    "fat": fat_val,
                    "carbs": carbs_val,
                    "calories": cal_val,
                    "protein": protein_val,
                    "fiber": fiber_val
                }
    except Exception as e:
        print(f"API Fallback Error: {e}")
    return None


@app.route("/get-product-data", methods=["POST"])
def get_product_data():
    data = request.json
    barcode = str(data.get("barcode", "")).strip()
    
    if not barcode:
        return jsonify({"error": "No barcode provided"}), 400

    try:
        norm_barcode = barcode.lstrip("0") if barcode.isdigit() else barcode
        import os
        
        if os.path.exists("en.openfoodfacts.org.products.tsv"):
            with open("en.openfoodfacts.org.products.tsv", "rb") as f:
                header_line = f.readline().decode('utf-8', errors='replace').strip()
                header = header_line.split("\t")
                if "code" in header:
                    code_idx = header.index("code")
                    file_size = os.path.getsize("en.openfoodfacts.org.products.tsv")
                    low = 0
                    high = file_size
                    found_parts = None
                    
                    while low < high:
                        mid = (low + high) // 2
                        f.seek(mid)
                        f.readline() # Skip to start of next line
                        
                        line_bin = f.readline()
                        if not line_bin:
                            high = mid
                            continue
                            
                        line = line_bin.decode('utf-8', errors='replace')
                        parts = line.split("\t")
                        if len(parts) > code_idx:
                            current_code = parts[code_idx].strip()
                            current_norm = current_code.lstrip("0") if current_code.isdigit() else current_code
                            
                            if current_norm == norm_barcode:
                                found_parts = parts
                                break
                            elif current_norm < norm_barcode:
                                low = f.tell()
                            else:
                                high = mid
                    
                    if found_parts:
                        def gv(idx, default=0.0):
                            if idx < len(found_parts):
                                try:
                                    v = found_parts[idx].strip()
                                    return float(v) if v else default
                                except:
                                    return default
                            return default

                        # Map indices
                        try:
                            sugar_idx = header.index("sugars_100g")
                            sodium_idx = header.index("sodium_100g")
                            fat_idx = header.index("fat_100g")
                            carbs_idx = header.index("carbohydrates_100g")
                            protein_idx = header.index("proteins_100g")
                            fiber_idx = header.index("fiber_100g")
                            
                            kcal_idx = header.index("energy-kcal_100g") if "energy-kcal_100g" in header else -1
                            kj_idx = header.index("energy-kj_100g") if "energy-kj_100g" in header else -1
                            name_idx = header.index("product_name") if "product_name" in header else -1
                            img_idx = header.index("image_url") if "image_url" in header else -1
                            
                            # Calorie logic with macro fallback
                            sugar_val = gv(sugar_idx)
                            fat_val = gv(fat_idx)
                            carbs_val = gv(carbs_idx)
                            protein_val = gv(protein_idx)
                            fiber_val = gv(fiber_idx)
                            
                            cal_val = 0.0
                            if kcal_idx != -1:
                                cal_val = gv(kcal_idx)
                            if cal_val == 0.0 and kj_idx != -1:
                                cal_val = gv(kj_idx) / 4.184
                            
                            # Fallback to macro-based calculation if still 0
                            if cal_val == 0.0:
                                cal_val = (carbs_val * 4) + (protein_val * 4) + (fat_val * 9)
                            
                            # Smart Estimation based on Name if still 0
                            prod_name = found_parts[name_idx].strip() if name_idx < len(found_parts) else "Unknown"
                            if cal_val == 0.0 and prod_name:
                                prod_name_lower = prod_name.lower()
                                if "creatine" in prod_name_lower:
                                    cal_val, protein_val = 0.0, 0.0
                                elif "whey" in prod_name_lower or "protein powder" in prod_name_lower:
                                    cal_val, protein_val, carbs_val, fat_val = 380.0, 75.0, 10.0, 5.0
                                elif "milk" in prod_name_lower:
                                    cal_val, protein_val, carbs_val, fat_val = 42.0, 3.4, 4.8, 1.0
                                elif "yogurt" in prod_name_lower or "curd" in prod_name_lower:
                                    cal_val, protein_val, carbs_val, fat_val = 60.0, 3.5, 4.7, 3.3
                                elif "peanut butter" in prod_name_lower:
                                    cal_val, protein_val, carbs_val, fat_val = 588.0, 25.0, 20.0, 50.0
                                elif "egg" in prod_name_lower:
                                    cal_val, protein_val, carbs_val, fat_val = 143.0, 13.0, 1.1, 10.0
                                elif "oats" in prod_name_lower:
                                    cal_val, protein_val, carbs_val, fat_val = 389.0, 16.9, 66.3, 6.9
                                elif "horlicks" in prod_name_lower:
                                    cal_val, protein_val, carbs_val, fat_val = 370.0, 11.0, 75.0, 2.0
                                elif "kissan" in prod_name_lower or "ketchup" in prod_name_lower:
                                    cal_val, carbs_val, sugar_val = 120.0, 28.0, 25.0

                            p_info = {
                                "product_name": found_parts[name_idx].strip() if name_idx < len(found_parts) else "Unknown",
                                "brand": found_parts[header.index("brands")].strip() if "brands" in header else "",
                                "quantity": found_parts[header.index("quantity")].strip() if "quantity" in header else "",
                                "image_url": found_parts[img_idx].strip() if img_idx != -1 and img_idx < len(found_parts) else None,
                                "calories": cal_val,
                                "sugar": sugar_val,
                                "sodium": gv(sodium_idx) * 1000,
                                "fat": fat_val,
                                "carbs": carbs_val,
                                "protein": protein_val,
                                "fiber": fiber_val
                            }
                            return jsonify(p_info)
                        except ValueError:
                            pass # Fallback to API if columns missing
        
        # Fallback to API
        api_info = get_from_openfoodfacts_api(barcode)
        if api_info:
            return jsonify(api_info)
        return jsonify({"error": "Product not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------
# RUN SERVER
# -------------------------
if __name__ == "__main__":
    print(app.url_map)
    app.run(host="0.0.0.0", port=5000, debug=True)