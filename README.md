# KisanNiti AI 🌾🤖
> **Where. When. To Whom. Sell Smarter.**
> **Smart India Hackathon 2026 | Problem Statement ID: SIH26132**  
> *Theme: Agriculture, FoodTech & Rural Development*

---

## 📌 Executive Summary

Traditional agri-market platforms display today's listed mandi prices, but leave small and marginal farmers to guess their **actual NET REALIZATION** after accounting for freight transportation, loading/unloading fees, mandi commission, storage charges, and spoilage losses.

**KisanNiti AI** goes beyond displaying market prices. It combines live mandi data, distance-based logistics calculation, Scikit-Learn time-series price forecasting, verified buyer requirements, and multi-factor opportunity scoring to answer three fundamental questions:

1. **WHERE** should I sell? *(Recommended Mandi based on Net Profit, not just listed price)*
2. **WHEN** should I sell? *(Optimal selling window: Sell Now vs Wait 3 Days vs Wait 7 Days)*
3. **TO WHOM** should I sell? *(AI-matched processor, retail, or wholesale buyers)*

---

## 🛠️ System Architecture

```
                               ┌────────────────────────────────┐
                               │  React Frontend (Vite/Tailwind)│
                               │  - Farmer / FPO / Buyer UI     │
                               │  - Net Realization Calc        │
                               │  - What-If Simulator & Maps    │
                               └───────────────┬────────────────┘
                                               │ REST API (JSON)
                               ┌───────────────▼────────────────┐
                               │   Express Backend (Node.js)    │
                               │   - Auth / JWT / User Roles    │
                               │   - Net Realization Engine     │
                               │   - Opportunity Ranking Logic  │
                               │   - SQLite / MySQL Adapter     │
                               └───────────────┬────────────────┘
                                               │ Internal API / Fallback
                               ┌───────────────▼────────────────┐
                               │   Python ML Service (FastAPI)  │
                               │   - Time-series Forecast       │
                               │   - Buyer Match (Scikit-Learn) │
                               │   - Weighted Opportunity Rank  │
                               └────────────────────────────────┘
```

---

## ✨ Key Features & PPT Requirements Implemented

1. **⭐ Best Selling Opportunity Spotlight Card**: Displays recommended mandi, Expected Net Realization (₹), net per kg (₹/kg), logistics breakdown, confidence rating, and bulleted explainable reasons.
2. **💰 Expected Net Realization Engine**:
   $$\text{Gross Revenue} = \text{Quantity} \times \text{Selling Price}$$
   $$\text{Total Costs} = \text{Transport} + \text{Loading} + \text{Commission} + \text{Storage} + \text{Spoilage}$$
   $$\text{Expected Net Realization} = \text{Gross Revenue} - \text{Total Costs}$$
3. **📊 AI Price Trend Forecasting**: Scikit-learn model predicting 3-day, 7-day, and 15-day price trajectories with confidence intervals and arrival volume pressure indicators.
4. **🧪 What-If Simulator**: CORE FEATURE allowing farmers to simulate:
   - *Scenario A*: Sell Now (Lasalgaon Mandi ₹4,600/q -> Net ₹2,10,700)
   - *Scenario B*: Wait 3 Days (Forecast ₹4,720/q -> Net ₹2,14,500, **+₹3,800 Gain**)
   - *Scenario C*: Wait 7 Days (Forecast ₹4,650/q -> Net ₹2,09,700, **-₹1,000 Loss**)
   - *Scenario D*: Alt Market Pune (Listed ₹4,750/q -> Net ₹2,11,800)
   - *Scenario E*: Direct Buyer ABC Agro (Offered ₹4,700/q -> Net ₹2,20,000, **Zero Mandi Commission**)
5. **🗺️ Interactive Market Map**: OpenStreetMap Leaflet visualization showing farmer origin, mandis, buyers, distance route lines, and net realization popups.
6. **🤝 AI Buyer Matching**: Feature-based buyer match scores (%) matching crop, quantity, grade, distance, and payment terms.
7. **🏢 FPO Collective Bargaining Dashboard**: Aggregates produce across member farmers (e.g., 420 Tonnes Onion) to negotiate bulk processor prices (+₹406/q higher net realization).
8. **👑 Judge Demo Header Bar**: Sticky top bar allowing 1-click persona switching (Farmer Ramesh Patil, FPO, Buyer, Admin) and instant preset scenario execution.

---

## 📂 Project Structure

```
/SIH 2026
├── /frontend               # React 18, Vite, Tailwind CSS, Recharts, Leaflet
│   ├── /src
│   │   ├── /components    # Navbar, Sidebar, DemoHeader
│   │   ├── /context       # AuthContext with demo role switcher
│   │   ├── /pages         # FarmerDashboard, MarketIntelligence, WhatIfSimulator, etc.
│   │   ├── App.jsx
│   │   └── main.jsx
├── /backend                # Node.js Express REST API
│   ├── /src
│   │   ├── /routes        # Auth, Produce, Markets, Recommendations, Buyers, Simulator, FPO
│   │   ├── db.js          # SQLite / MySQL unified adapter
│   │   └── index.js       # Master backend entry point (Port 5000)
├── /ml-service             # Python FastAPI ML Service (Port 8000)
│   ├── model.py           # Scikit-Learn price forecast & opportunity ranker
│   ├── main.py            # FastAPI endpoints (/predict-price, /buyer-match)
│   └── requirements.txt
├── /database
│   ├── schema.sql         # SQL Relational Schema
│   └── seed.sql           # Seed data (Maharashtra Agri Mandis & Buyers)
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Start Express Backend API (Port 5000)
```bash
cd backend
npm install
npm start
```
*(Backend automatically initializes the SQLite file database `kisan_niti.db` from `schema.sql` and `seed.sql` on first run)*

### 2. Start Python ML Service (Port 8000 - Optional)
```bash
cd ml-service
pip install -r requirements.txt
python main.py
```

### 3. Start React Frontend (Port 3000)
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🏆 Demo Credentials (Pre-configured)

| Role | Name | Email | Password |
|---|---|---|---|
| **Farmer** | Ramesh Patil | `ramesh@farmer.com` | `demo123` |
| **FPO** | Nashik Farmers Producer Org | `info@nashikfpo.org` | `demo123` |
| **Buyer** | ABC Agro Processing Pvt Ltd | `procurement@abcagro.com` | `demo123` |
| **Admin** | Agri Market Admin | `admin@kisanniti.gov.in` | `demo123` |

---

## 🔮 Future Scalability

- **Phase 1**: Maharashtra crops and key mandis (Lasalgaon, Pune, Nashik, Solapur, Nagpur).
- **Phase 2**: Integration with e-NAM and Agmarknet official government data APIs.
- **Phase 3**: Multilingual voice assistant (Marathi, Hindi, English).
- **Phase 4**: Pan-India Agri Market Intelligence Platform.
