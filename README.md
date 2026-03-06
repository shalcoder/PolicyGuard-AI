# PolicyGuard AI v2.0 🛡️

**The Autonomous Governance & Trust Layer for Enterprise Agentic Systems.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)](https://fastapi.tiangolo.com/)
[![Gemini 2.5](https://img.shields.io/badge/AI-Gemini%202.5%20Pro%2FFlash-4285F4)](https://ai.google.dev/)
[![LangGraph](https://img.shields.io/badge/Agentic-LangGraph-orange)](https://www.langchain.com/langgraph)
[![MITRE ATLAS](https://img.shields.io/badge/Security-MITRE%20ATLAS-red)](https://atlas.mitre.org/)

---

## 🚨 The Challenge: "Sovereignty in the Agentic Era"
As AI agents move from "generating text" to "executing actions," the risk of non-deterministic harm skyrockets. **PolicyGuard AI v2.0** provides a production-grade, AI-native control plane that enforces corporate sovereignty across your entire agent fleet. 

We bridge the gap between messy PDF policies and executable safety protocols using **Cognitive Governance**.

---

## 🚀 New in V2.0: The Sovereignty Update
PolicyGuard v2.0 introduces 6 major enterprise-grade innovations:

### 🕸️ 1. GraphRAG Policy Cognition
Traditional RAG misses "Longitudinal Harm" (conflicts buried across multiple documents). We use **NetworkX-powered Knowledge Graphs** to map cross-document dependencies, identifying where a rule in the *IT Handbook* might contradict a process in the *Financial Charter*.

### 🗺️ 2. MITRE ATLAS™ Threat Mapping
Adversarial findings are no longer just "errors." Every vulnerability detected by our Red Team is automatically mapped to the **MITRE ATLAS (Adversarial Threat Landscape for AI Systems)** framework, providing CISOs with industry-standard telemetry.

### 🔄 3. LangGraph Closed-Loop Evaluation
Our "Self-Healing" engine is now verified by a multi-agent loop:
1. **Red Team Agent**: Probes the patch with adversarial inputs.
2. **Remediation Agent**: Refines the guardrail based on failures.
3. **Eval Agent**: Scores the patch on safety vs. utility (Pass threshold: 7/10).

### 🔀 4. Autonomous GitHub PR Synthesis
Enterprise guardrails shouldn't be "black boxes." When a patch is generated, PolicyGuard auto-synthesizes a **GitHub Draft Pull Request**, allowing human admins to review, audit, and approve guardrail code before it ever touches production.

### 📄 5. Unstructured.io Intelligence
Policies aren't just text; they are tables, headers, and footnotes. We integrate **Unstructured.io** to extract high-fidelity document hierarchy, ensuring the AI understands the *structure* of your compliance.

### ⚙️ 6. CI/CD Policy Gate (GitHub Action)
Security starts in the IDE. Our custom **GitHub Action** audits PRDs (Product Requirement Docs) and Markdown policies on every commit, blocking merges that violate core safety protocols.

---

## ⚖️ Core Features

### ⚔️ Red Team Mode
Powered by **Gemini 2.5**, our system simulates sophisticated attacks including Mosaic Attacks (PII correlation), Indirect Injections, and Role-Play Bypasses to stress-test your agents before deployment.

### 🧠 Real-Time Governance Proxy
Acts as a Zero-Trust intermediary. Every token is inspected via **Deep Semantic Interception**. If an agent attempts to leak a secret key or violate an SLA, the proxy executes a millisecond-level freeze.

### ⚡ Smart API Resilience
Optimized for the Gemini Free Tier using a **Smart Cascade** architecture. The system intelligently switches between 5+ API keys and multiple models (Flash/Pro/Lite) to ensure 99.9% uptime without quota exhaustion.

---

## 🛠️ Technical Stack
- **Frontend**: Next.js 14, Tailwind CSS, Framer Motion (Premium Glassmorphic UI)
- **Backend**: FastAPI, LangGraph, NetworkX (Graph Analytics)
- **AI Engine**: Google Gemini 2.5 (Pro/Flash/Lite)
- **Security**: MITRE ATLAS Mapping, SHA-256 Integrity Checks
- **Persistence**: Firebase/Firestore, SQLite (Render-optimized)

---

## 🚀 Quick Start (Local)

### 🐳 Docker (Recommended)
```bash
git clone https://github.com/shalcoder/PolicyGuard-AI.git
cd PolicyGuard-AI
# Add your GOOGLE_API_KEYS to backend/.env
docker compose up --build
```

### 🛠️ Manual
1. **Backend**: `cd backend && pip install -r requirements.txt && uvicorn main:app --reload`
2. **Frontend**: `cd frontend && npm install && npm run dev`

---

## 📈 Enterprise Roadmap
- [x] Multi-Agent Closed Loop (LangGraph)
- [x] MITRE ATLAS Standardisation
- [x] GraphRAG Conflict Detection
- [ ] NIST AI RMF Audit Integration
- [ ] Hardware-based TEE (Trusted Execution Environment) Support

---

Built with ❤️ for **AI Safety & Enterprise Sovereignty**.
*Utilizing Gemini 2.5 Flash-Lite for high-efficiency governance.*
