import pymongo
from datetime import datetime

url = "mongodb://localhost:27017/ppl_production"

print("Connecting to DB...")
client = pymongo.MongoClient(url)
db = client["ppl_production"]

materias_col = db["materias"]

try:
  materias = materias_col.find()
  for materia in materias:
    print(materia)
except Exception as e:
  print(e)
finally:
  print("DONE")
