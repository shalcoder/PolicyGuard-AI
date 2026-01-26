# PolicyGuard AI 🛡️

**The Trust Layer for the Agentic Era.**

![Next.js](https://img.shields.io/badge/Next.js-14-black) ![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688) ![Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Pro-4285F4) ![Docker](https://img.shields.io/badge/Docker-Ready-2496ED)

---

## 🚨 The Problem: "The Governance Gap"
In the **Action Era**, AI agents aren't just chatting—they are executing transactions, accessing PII, and making terminal decisions. Existing governance is either too slow (manual legal review) or too basic (keyword matching).

**PolicyGuard AI** is a real-time **Governance Control Plane** that validates agent intent, architecture, and behavior against complex corporate policies *before* and *during* deployment.

---

## ✨ "Wow" Features

### 1. 🌐 3D System Topology
Visualize your AI infrastructure like never before. An interactive 3D graph maps your agent's connections, policy "envelopes," and detected vulnerability nodes in real-time.
*   **Why it's cool**: Instantly spot "Compliance Hotspots" where data flows bypass secondary guardrails.

### 2. 🛡️ Fiduciary Shield (Advanced Reasoning)
Powered by **Gemini 1.5 Pro**, this engine performs high-context policy reasoning on "grey area" scenarios where simple rules fail.
*   **Why it's cool**: It doesn't just say "Block"; it explains the logic, cites the specific policy clause, and suggests a compliant alternative.

### 3. 📉 SLA Guard (Risk Forecasting)
Predictive monitoring that forecasts the probability of SLA breaches (latency/uptime) based on current agent complexity and token loads.
*   **Why it's cool**: "Latency IS a compliance issue." We score compliance not just on safety, but on system reliability.

### 4. 🕵️ Continuous Audit Stream
A live, high-fidelity feed of every action taken by your agents, audited in real-time. Block malicious intents before they reach your database.

---

## 🧪 Edge-Case Samples (Try These!)
We've curated three high-quality samples in the `samples/` folder to demonstrate the system's depth:
1.  **`edge_case_1_mosaic_effect`**: Detecting PII leakage through "Mosaic Attacks" (combining non-PII data to identify an individual).
2.  **`edge_case_2_data_sovereignty`**: Validating cross-border data transfer policies for GDPR compliance.
3.  **`edge_case_3_immutable_ledger`**: Auditing financial transaction agents for immutable logging requirements.

---

## 🚀 Quick Start (Local Setup)

### Option A: Docker (Recommended 🐳)
The easiest way to get started. Optimized for stability and low RAM usage.

```bash
# 1. Clone & Enter
git clone https://github.com/TharunvenkateshN/PolicyGuard-AI.git
cd PolicyGuard-AI

# 2. Add your API Key
# Edit backend/.env and add: GOOGLE_API_KEY=your_key_here

# 3. Launch
docker compose up --build
```
*   **Frontend**: [http://localhost:3000](http://localhost:3000)
*   **Backend API**: [http://localhost:8000](http://localhost:8000)

### Option B: Manual Setup (For Contributors 🛠️)

**Backend (FastAPI)**
```bash
cd backend
python -m venv venv
# Windows: .\venv\Scripts\activate | Unix: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend (Next.js)**
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

---

## 🛠 Tech Stack
*   **AI Core**: Google Gemini 1.5 Pro & Flash (Multimodal Reasoning)
*   **Frontend**: Next.js 14, Tailwind CSS, Shadcn UI, Framer Motion, Three.js (for 3D graphs)
*   **Backend**: FastAPI (Python 3.11), Pydantic, Uvicorn
*   **Persistence**: Firebase Firestore (Policy & Audit logs)
*   **Infrastructure**: Docker Compose (Optimized RAM configuration)

---

## 🤝 Contributing & Forking
1.  **Fork** the repository.
2.  **Create a branch**: `git checkout -b feature/cool-new-feature`.
3.  **Commit changes**: Follow the convention `feat: add something` or `fix: fix something`.
4.  **Push and Open a PR**. 

*We welcome contributions to the 3D visualization engine and new high-context policy samples!*

---

Built with ❤️ by **Tharun Venkatesh** for the **Google Gemini Hackathon**.