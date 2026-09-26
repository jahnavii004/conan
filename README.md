# 🔗 Conan — AI-Powered Contract Obligation Intelligence

<div align="center">

![Conan Banner](https://img.shields.io/badge/Contract-Intelligence-blue?style=for-the-badge&logo=script&logoColor=white)
![Status](https://img.shields.io/badge/Status-Hackathon%202026-green?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

**Transform complex contracts into actionable obligation graphs, dependency maps, and risk intelligence.**

[🚀 Live Demo](#-live-demo) • [📖 Documentation](#-documentation) • [🏗️ Architecture](#-architecture) • [⚡ Quick Start](#-quick-start)

</div>

---

## 🎯 The Problem

Contracts are complex. Obligations are scattered across clauses, conditions, dates, and interdependencies. Teams struggle to maintain an actionable view of:

- ❌ What must happen
- ❌ When it must happen  
- ❌ Who is responsible
- ❌ What depends on what
- ❌ What the consequences are if something is missed

**Result:** Missed deadlines, compliance failures, and financial penalties.

---

## 💡 The Solution

Conan converts contractual complexity into **traceable, actionable intelligence**.

```
PDF Contract
    ↓
Document Understanding
    ↓
Clause Detection
    ↓
Obligation Extraction
    ↓
Dependency Graph
    ↓
Risk Analysis
    ↓
Action Timeline
    ↓
Human Review ← (You stay in control)
```

Instead of:

```
"The contract contains payment, renewal, and compliance provisions."
```

Conan produces:

```
CONTRACT HEALTH
├── 12 Obligations Detected
│   ├── 7 Active
│   ├── 3 Upcoming
│   ├── 1 High Risk
│   └── 1 Missing Information
├── Next Critical Action: Submit compliance certificate
├── Due: 15 October
├── Risk: HIGH
└── Reason:
    • Deadline detected from Clause 8.2
    • Required document not marked complete
    • Submission depends on prior approval
```

---

## 🌟 Key Features

### Core Features ✅

| Feature | Description |
|---------|------------|
| **📄 Multi-Format Upload** | PDF, DOCX (MVP: PDF) with page-level tracking |
| **🔍 Clause Classification** | Automatic categorization (Payment, Renewal, Compliance, Penalty, etc.) |
| **📋 Obligation Extraction** | Actor, action, deadline, amount, penalties, dependencies |
| **⏰ Temporal Intelligence** | Convert "30 days before expiry" → actual dates |
| **🕸️ Obligation Graph** | Visual dependency map with React Flow |
| **⚠️ Risk Scoring** | Deadline proximity + penalty severity + dependency status |
| **📊 Dashboard** | Overview, obligations, timeline, risk center |
| **🔗 Source Traceability** | Click any extracted item → PDF page + exact clause |

### Innovation Differentiators 🚀

| Differentiator | Impact |
|---------------|--------|
| **Obligation Graph + Risk Propagation** | "Delay in approval may affect 3 downstream obligations" |
| **Contract Contradiction Detection** | Flag temporal/logical inconsistencies for human review |
| **Explainable Risk** | "HIGH RISK because: deadline approaching + approval pending + penalty attached" |
| **Human-in-the-Loop Verification** | Users confirm/edit AI extractions before finalizing |
| **Contract Change Intelligence** | Compare versions → show material changes (stretch) |

### Stretch Features 🎁

- 📅 Contract obligation calendar with export (ICS/CSV)
- 🔄 Version comparison with semantic diff
- 📊 Multi-contract dashboard
- 📧 Email reminders for upcoming obligations
- 🔐 Risk propagation visualization

---

## 🏗️ Architecture

### System Flow

```
                         USER
                          │
                          ↓
                 ┌─────────────────┐
                 │   React UI      │
                 │ • Dashboard     │
                 │ • Timeline      │
                 │ • Obligation    │
                 │   Graph         │
                 └────────┬────────┘
                          │
                          ↓
                 ┌─────────────────┐
                 │ Node / Express  │
                 │ API Gateway     │
                 │ • JWT Auth      │
                 │ • Multer Upload │
                 └────────┬────────┘
                          │
              ┌───────────┴────────────┐
              ↓                        ↓
       ┌──────────────┐         ┌──────────────┐
       │ Python       │         │ PostgreSQL/  │
       │ FastAPI      │         │ MongoDB      │
       │ • PDF parse  │         │              │
       │ • NLP/LLM    │         │ • Contracts  │
       │ • Temporal   │         │ • Clauses    │
       │ • Risk calc  │         │ • Obligations│
       └──────┬───────┘         │ • Users      │
              │                 └──────────────┘
      ┌───────┼────────┐
      ↓       ↓        ↓
   Gemini  spaCy   Temporal
    API   Embeddings Engine
      │       │        │
      └───────┼────────┘
              ↓
       Obligation Graph
              │
              ↓
          Risk Engine
              │
              ↓
      Contract Intelligence
```

### ML/NLP Components

| Task | Approach |
|------|----------|
| PDF Extraction | Deterministic (PyMuPDF) |
| Clause Segmentation | NLP + Rules |
| Clause Classification | LLM (Gemini) + Embeddings |
| Entity Extraction | LLM + spaCy |
| Date Extraction | NLP + Temporal Rules |
| Obligation Extraction | LLM (structured output) |
| Semantic Similarity | Sentence Transformers |
| Risk Scoring | ML + Weighted Rules |
| Dependency Detection | LLM + Graph Logic |
| Explanation Generation | LLM + Source Evidence |

---

## 🛠️ Tech Stack

### Frontend
```
React 18
├── Vite (build)
├── Tailwind CSS (styling)
├── React Flow (obligation graph)
├── Recharts (timeline visualization)
├── React Router (navigation)
└── Axios (HTTP client)
```

### Backend
```
Node.js + Express.js
├── JWT (authentication)
├── Multer (file uploads)
├── Cors (cross-origin)
└── Mongoose/Prisma (ORM)
```

### AI/NLP Service
```
Python + FastAPI
├── PyMuPDF (PDF parsing)
├── spaCy (NLP)
├── Sentence Transformers (embeddings)
├── Scikit-learn (risk scoring)
├── Temporal reasoning (dateutil, dateparser)
└── Gemini API (LLM extraction)
```

### Database
```
PostgreSQL (Recommended)
or MongoDB (Semi-structured contracts)
├── Cloud: Neon / Supabase (free tier)
└── Collections: Users, Contracts, Clauses, Obligations, Dependencies
```

### Deployment
```
Frontend: Vercel
Backend: Render / Railway
AI Service: Render / Modal
Database: Neon / Supabase
```

---

## ⚡ Quick Start

### Prerequisites

- Node.js 16+
- Python 3.9+
- PostgreSQL 13+ (or MongoDB)
- Git

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-team/conan.git
cd conan
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Server runs on `http://localhost:5173`

### 3️⃣ Backend Setup

```bash
cd backend
npm install

# Create .env
cp .env.example .env

# Add your values:
# DATABASE_URL=postgresql://...
# GEMINI_API_KEY=your-key
# JWT_SECRET=your-secret

npm run dev
```

Server runs on `http://localhost:5000`

### 4️⃣ AI Service Setup

```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create .env
cp .env.example .env
# Add GEMINI_API_KEY=your-key

python -m uvicorn main:app --reload
```

Service runs on `http://localhost:8000`

### 5️⃣ Database Setup

```bash
# If using PostgreSQL
createdb conan_dev
psql conan_dev < schema.sql

# If using MongoDB
# Update MONGODB_URI in backend .env
```

### 6️⃣ Test Upload

1. Navigate to `http://localhost:5173`
2. Click **"Upload Contract"**
3. Drag & drop `sample-contract.pdf`
4. Click **"Analyze"**
5. View dashboard, timeline, and obligation graph

---

## 📚 Project Structure

```
conan/
├── frontend/                   # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/        # Dashboard, Graph, Timeline
│   │   ├── pages/             # Upload, Overview, Detail
│   │   ├── hooks/             # useContract, useObligation
│   │   ├── utils/             # API client, formatters
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                    # Node + Express + Mongoose
│   ├── routes/                # /upload, /contracts, /obligations
│   ├── controllers/           # Business logic
│   ├── models/                # User, Contract, Clause, Obligation
│   ├── middleware/            # Auth, errorHandler
│   ├── config/                # Database, Gemini
│   ├── .env.example
│   └── server.js
│
├── ai-service/                # Python + FastAPI
│   ├── main.py               # FastAPI app
│   ├── services/
│   │   ├── pdf_parser.py     # Extract text from PDF
│   │   ├── clause_classifier.py
│   │   ├── obligation_extractor.py
│   │   ├── temporal_engine.py
│   │   └── risk_engine.py
│   ├── models/               # Pydantic schemas
│   ├── utils/
│   ├── requirements.txt
│   └── .env.example
│
├── database/                  # Schema and migrations
│   ├── schema.sql
│   └── migrations/
│
├── docs/                      # Documentation
│   ├── API.md
│   ├── ARCHITECTURE.md
│   └── DEPLOYMENT.md
│
└── README.md                  # This file
```

---

## 🚀 Live Demo

**[Deployed Instance](https://conan-demo.vercel.app)** (Coming Soon)

**Demo Video:** [YouTube](https://youtube.com) (Coming Soon)

**Sample Contract:** [Download](./sample-contract.pdf)

### Demo Flow

1. **Upload** → `Vendor_Service_Agreement.pdf`
2. **Analysis** → 18 clauses, 11 obligations, 4 deadlines, 2 penalties
3. **Dashboard** → Risk overview (2 Critical, 3 High, 4 Medium, 2 Low)
4. **Click Obligation** → "Submit compliance certificate"
5. **View Details** → Deadline, responsible party, penalty, dependencies
6. **Click "Why?"** → Explainable risk factors
7. **View Graph** → Obligation dependency map
8. **Click Source** → PDF opens at exact page + clause

---

## 📊 Database Schema

### Key Collections/Tables

```javascript
// User
{
  _id, email, name, subscription, createdAt
}

// Contract
{
  _id, userId, name, parties, startDate, endDate, 
  status, riskScore, obligationCount, createdAt
}

// Clause
{
  _id, contractId, section, text, type, page, 
  confidence, confidence, extractedAt
}

// Obligation
{
  _id, contractId, actor, action, object, amount, deadline,
  deadlineType, condition, penalty, clauseId, page, status,
  riskScore, confidence, dependencies: [{ from, to, relationship }]
}

// Dependency
{
  from: obligationId, to: obligationId, relationship
}
```

---

## 🤖 Gemini API Integration

### Two-Pass Processing (Recommended)

**Pass 1: Clause Extraction**
```python
# Prompt: "Extract all contractual clauses. Return JSON."
# Output: [{ section, text, type, page }]
```

**Pass 2: Obligation Extraction**
```python
# Prompt: "For each clause, extract obligations."
# Output: [{ actor, action, deadline, penalty, ... }]
```

### Risk Calculation

```python
Risk = w₁D + w₂P + w₃C + w₄S + w₅U

where:
D = deadline urgency (0–1)
P = penalty severity (0–1)
C = dependency completion (0–1)
S = obligation status (0–1)
U = uncertainty (0–1)

Output: 0.00–0.30 (Low), 0.30–0.60 (Medium), 0.60–0.80 (High), 0.80–1.00 (Critical)
```

---

## 🔐 Security & Privacy

- ✅ JWT authentication for all API endpoints
- ✅ File uploads validated (size, type, virus scan)
- ✅ Database encryption at rest
- ✅ HTTPS/TLS for all traffic
- ✅ No contract text stored in logs
- ✅ GDPR compliance ready

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [API.md](./docs/API.md) | REST API endpoints + examples |
| [ARCHITECTURE.md](./docs/ARCHITECTURE.md) | System design deep-dive |
| [DEPLOYMENT.md](./docs/DEPLOYMENT.md) | Production deployment guide |
| [FEATURES.md](./docs/FEATURES.md) | Feature roadmap + prioritization |

---

## 🧪 Testing

```bash
# Frontend tests
cd frontend
npm run test

# Backend tests
cd backend
npm run test

# AI Service tests
cd ai-service
pytest
```

---

## 📦 MVP Checklist

- [x] PDF upload + text extraction
- [x] Clause classification
- [x] Obligation extraction (actor, action, deadline, penalty)
- [x] Parties extraction
- [x] Date extraction + temporal reasoning
- [x] Obligation dashboard
- [x] Risk score calculation
- [x] Obligation graph (React Flow)
- [x] Source traceability (page + clause links)
- [x] Human verification workflow

---

## 🚀 Roadmap

### Phase 1: MVP (Hackathon)
- PDF parsing + clause extraction
- Obligation graph + risk engine
- Dashboard + timeline
- Source-linked evidence

### Phase 2: Differentiation
- ✅ Contract contradiction detection
- ✅ Explainable risk ("Why?" button)
- ✅ Risk propagation (dependency chains)
- ✅ Multi-contract overview

### Phase 3: Stretch Features
- 📅 Calendar export (ICS/CSV)
- 🔄 Contract version comparison
- 📧 Email reminders
- 🔐 Obligation status tracking
- 📊 Team collaboration

### Phase 4: Enterprise
- SSO / SAML integration
- Audit logs
- Bulk contract ingestion
- API for legal systems
- Obligation automation

---

## 👥 Team

| Role | Responsibility |
|------|----------------|
| **Backend + AI** | PDF parsing, LLM integration, risk engine, temporal logic |
| **Frontend + Graph** | React dashboard, React Flow obligation graph, timeline UI |

**Time Allocation:** 24-hour hackathon split
- Hours 0–2: Setup + architecture
- Hours 2–5: PDF pipeline
- Hours 5–8: LLM extraction
- Hours 8–11: Obligation database
- Hours 11–14: Obligation graph
- Hours 14–17: Risk engine
- Hours 17–19: Dashboard UI
- Hours 19–21: Contradiction detection + "Why?" feature
- Hours 21–23: Testing + demo contract
- Hours 23–24: Presentation + video

---

## 📄 License

MIT License — see [LICENSE](./LICENSE) file

---

## 🙏 Contributing

This is a hackathon project. For future enhancements:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 💬 Support

- 📧 Email: [your-email@example.com]
- 💻 GitHub Issues: [Report bugs here](https://github.com/your-team/conan/issues)
- 📚 Documentation: [Full docs](https://github.com/your-team/conan/wiki)

---

## 🎓 Inspirations & References

- **Problem:** Contract obligation complexity & missed deadlines
- **Solution Approach:** Graph-based obligation mapping + explainable risk
- **Innovation:** Dependency propagation + contradiction detection + human verification
- **Stack:** Modern AI/ML + proven web technologies

---

<div align="center">

### Built with ❤️ for the Hackathon

**From Clauses to Consequences** 🔗

[⬆ Back to top](#-conan--ai-powered-contract-obligation-intelligence)

</div>
