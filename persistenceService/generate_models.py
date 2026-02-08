import os
import subprocess
from dotenv import load_dotenv

load_dotenv()

db_url = os.getenv("DATABASE_URL")
if not db_url:
    raise ValueError("DATABASE_URL not found in .env")

output_file = "models.py"

# Run sqlacodegen and write output into models.py
result = subprocess.run(
    ["sqlacodegen", db_url],
    capture_output=True,
    text=True
)

if result.returncode != 0:
    print(result.stderr)
    raise SystemExit("sqlacodegen failed")

with open(output_file, "w", encoding="utf-8") as f:
    f.write(result.stdout)

print(f"✅ Generated {output_file} from database schema")
