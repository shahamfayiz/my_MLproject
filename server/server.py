from fastapi import FastAPI,HTTPException
import json
import joblib
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def load_artifacts():

    model = joblib.load(r'C:\Users\shaham fayiz\OneDrive\Desktop\my_MLproject\server\artifactes\sports_car_prediction.pkl')
    columns = joblib.load(r'C:\Users\shaham fayiz\OneDrive\Desktop\my_MLproject\server\artifactes\columns.pkl')


    return model,columns

model,columns = load_artifacts()  

class CarRequest(BaseModel):
    make:str
    year:int
    engine_size:float
    hp:float
    torque:float
    time_0_60:float

@app.post('/predict')
async def predict_price(car:CarRequest):

    if car.hp <= 0:
        raise HTTPException(status_code=400, detail="Horsepower (hp) must be greater than 0.")
    
    if car.engine_size <= 0:
        raise HTTPException(status_code=400, detail="Engine size must be greater than 0.")

    mapping = {
        'Year': car.year,
        'Engine Size (L)': car.engine_size,
        'Horsepower': car.hp,
        'Torque (lb-ft)': car.torque,
        '0-60 MPH Time (seconds)': car.time_0_60
    }

   
    user_make = f"Car Make_{car.make.strip().lower()}"
    
    input_row = {}
    for col in columns:
        if col in mapping:
            input_row[col] = mapping[col]
        elif col == user_make:
            input_row[col] = 1
        else:
            input_row[col] = 0


    df_input = pd.DataFrame([input_row])[columns]

 
    prediction = model.predict(df_input)[0]
    prediction_val = float(prediction)

    return{
        'car name' : car.make,
        'Estimated_price' : round(prediction_val,0),
        'formatted_price' : f'${prediction_val:,.0f}'
    } 
import uvicorn

uvicorn.run(app,host='127.0.0.1',port=8001)
  
    


         
