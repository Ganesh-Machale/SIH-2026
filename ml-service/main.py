from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from model import PriceForecastModel, BuyerMatchModel, OpportunityRanker

app = FastAPI(
    title="KisanNiti AI ML Service",
    description="Time-series price forecasting, buyer matching, and opportunity scoring - SIH 2026",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

forecast_engine = PriceForecastModel()

class ForecastRequest(BaseModel):
    crop: str = "Onion"
    current_price: float = 4600.0
    arrivals_tonnes: Optional[float] = 1200.0

class BuyerMatchRequest(BaseModel):
    crop_grade_match: bool = True
    qty_ratio: float = 1.0
    distance_km: float = 85.0
    offered_price: float = 4700.0
    market_price: float = 4600.0

class OpportunityScoreRequest(BaseModel):
    net_realization: float
    gross_revenue: float
    distance_km: float
    demand_level: str = "HIGH"
    trend: str = "Moderately Increasing"

@app.get("/")
def health_check():
    return {
        "status": "ONLINE",
        "service": "KisanNiti AI Python ML Service",
        "sih_problem_id": "SIH26132"
    }

@app.post("/predict-price")
def predict_price(req: ForecastRequest):
    try:
        res = forecast_engine.predict(req.crop, req.current_price, req.arrivals_tonnes or 1200.0)
        return res
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/buyer-match")
def match_buyer(req: BuyerMatchRequest):
    score = BuyerMatchModel.match_buyer(
        req.crop_grade_match, req.qty_ratio, req.distance_km, req.offered_price, req.market_price
    )
    return {"match_score": score, "confidence_percent": 92}

@app.post("/opportunity-score")
def score_opportunity(req: OpportunityScoreRequest):
    score = OpportunityRanker.rank_opportunity(
        req.net_realization, req.gross_revenue, req.distance_km, req.demand_level, req.trend
    )
    return {"opportunity_score": score}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
