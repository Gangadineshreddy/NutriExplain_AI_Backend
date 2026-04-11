import mysql.connector

def setup_database():
    try:
        # Connect to MySQL (without database initially)
        conn = mysql.connector.connect(
            host="localhost",
            user="root",
            password=""
        )
        cursor = conn.cursor()

        # Create Database
        cursor.execute("CREATE DATABASE IF NOT EXISTS nutritionai")
        cursor.execute("USE nutritionai")

        # Create Users Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                full_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        """)

        # Create Health Profiles Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS health_profiles (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                age INT,
                gender VARCHAR(20),
                height_cm DOUBLE,
                weight_kg DOUBLE,
                activity_level VARCHAR(50),
                sleep_hours DOUBLE,
                stress_level VARCHAR(50),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)

        # Create User Medical Conditions Table (Normalized)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_medical_conditions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                condition_id INT,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)

        # Create User Conditions Table (Raw text/stage - used by some routes)
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_conditions (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                disease_name VARCHAR(100),
                stage VARCHAR(50),
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)

        # Create Nutritional Limits Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_nutritional_limits (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                max_sugar DOUBLE,
                max_sodium DOUBLE,
                max_fat DOUBLE,
                max_carbs DOUBLE,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)

        # Create Scan History Table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS scan_history (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT,
                product_name VARCHAR(255),
                analysis_result VARCHAR(50),
                ai_prediction VARCHAR(50),
                scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        """)

        print("Database 'nutritionai' and tables created successfully!")

    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

if __name__ == "__main__":
    setup_database()
