# PolicyGuard AI v2.0 🛡️

**The Autonomous Governance & Trust Layer for Enterprise Agentic Systems.**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688)](https://fastapi.tiangolo.com/)
[![Gemini 2.5](https://img.shields.io/badge/AI-Gemini%202.5%20Pro%2FFlash-4285F4)](https://ai.google.dev/)
[![LangGraph](https://img.shields.io/badge/Agentic-LangGraph-orange)](https://www.langchain.com/langgraph)
[![MITRE ATLAS](https://img.shields.io/badge/Security-MITRE%20ATLAS-red)](https://atlas.mitre.org/)

---

## 🏗️ System Architecture
PolicyGuard AI is built as a multi-layered governance stack that sits between your enterprise applications and your LLM fleet.

```mermaid
graph TD
    subgraph "Frontend Layer (Next.js 14)"
        UI[Glassmorphic Dashboard]
        WS[Real-time WebSocket Logs]
        Vis[GraphRAG Visualizer]
    end

    subgraph "Governance Gateway (FastAPI)"
        Proxy[Zero-Trust Interceptor Proxy]
        Auth[Firebase IAM]
        API[Audit & Remediation Endpoints]
    end

    subgraph "AI Governance Core"
        G25[Gemini 2.5 Pro/Flash]
        Graph[GraphRAG Engine - NetworkX]
        LG[LangGraph Multi-Agent Loop]
        Red[Red Team Adversarial Engine]
    end

    subgraph "Knowledge & Data"
        Docs[Unstructured.io Doc Parser]
        Vect[Vector Embeddings Store]
        DB[Firestore / SQLite]
    end

    subgraph "Enterprise Integrations"
        GH[GitHub PR Synthesis]
        MITRE[MITRE ATLAS Mapper]
        CI[GitHub Actions Policy Gate]
    end

    UI <--> API
    API <--> G25
    Proxy <--> G25
    API --> Graph
    API --> LG
    LG --> Red
    Docs --> Graph
    API --> GH
    API --> MITRE
```

---

## 🔄 End-to-End User Flow
From policy ingestion to autonomous remediation, here is how a security auditor interacts with the system:

```mermaid
sequenceDiagram
    participant Auditor
    participant System as PolicyGuard AI
    participant Attack as Red Team Engine
    participant GitHub as Enterprise Repo

    Auditor->>System: Upload PDF Policies (Unstructured.io)
    System->>System: Build Knowledge Graph (GraphRAG)
    Auditor->>System: Deploy Guardrail Proxy
    Auditor->>Attack: Start Adversarial Stress Test
    Attack->>System: Execute Jailbreak & PII Leak Attacks
    System->>System: Map Findings to MITRE ATLAS
    System->>Auditor: Display Vulnerability Report
    Auditor->>System: Execute Self-Healing Patch
    System->>System: LangGraph Multi-Agent Loop (Patch -> Eval)
    System->>GitHub: Synthesize Draft Pull Request
    GitHub-->>Auditor: Human-in-the-Loop Approval Required
```

---

## 🌟 Comprehensive Feature List

### 🧠 Intelligence Layer
- **GraphRAG Cognition**: Detects cross-document policy conflicts and "Longitudinal Harm" using NetworkX graphs.
- **Unstructured.io Parsing**: High-fidelity extraction of PDF, DOCX, and HTML documents including tables and headers.
- **Constitutional Scanning**: Analyzes Product Requirement Docs (PRDs) for compliance risk before coding begins.

### 🛡️ Defense Operations
- **Zero-Trust Interceptor Proxy**: Real-time semantic inspection of every prompt and response.
- **Red Team Engine**: 20+ automated adversarial tactics (Jailbreak, Mosaic, Roleplaying, Obfuscation).
- **MITRE ATLAS™ Mapping**: Instant alignment of AI vulnerabilities to industry-standard cybersecurity taxonomies.
- **PII & Secret Redaction**: Multi-layer masking of emails, keys, and sensitive entities via local NLP.

### 🔄 Self-Healing & DevOps
- **LangGraph Closed-Loop Eval**: Multi-agent orchestration (RedTeam -> Patch -> Eval) to verify guardrail efficacy.
- **Autonomous PR Synthesis**: Generates GitHub Pull Requests with patched guardrail code for Human-in-the-Loop review.
- **GitHub Action Policy Gate**: A CI/CD gate that blocks commits violating your organization's AI policies.
- **Smart Quota Cascade**: Multi-API key rotation and model switching (Pro/Flash/Lite) for 99.9% uptime.

### 📊 Analytics & Visibility
- **Glassmorphic OS Dashboard**: Premium, real-time UI with live trace visualization.
- **SLA Reliability Monitoring**: Tracks latency, uptime, and throughput for regulatory compliance.
- **Sovereign Trust Score**: A dynamic 0-100% KPI reflecting your fleet's overall security posture.
- **Exportable PDF Audits**: One-click generation of CISO-ready compliance reports.

---

## 🏢 Concrete Enterprise Use Case: "The Rogue Retail Bot"
To help judges visualize the end-to-end impact, here is a day in the life of **PolicyGuard AI**:

### **The Scenario**
*Global-Store Inc.* deploys an AI Customer Support Agent. They have two policies:
1.  **IT Policy**: No customer emails (PII) should ever be displayed.
2.  **Finance Policy**: The bot cannot offer a discount higher than 20%.

### **The Problem (Longitudinal Risk)**
Traditional RAG misses the conflict. A user asks: *"I'm a premium member and my email is vip@user.com, can I get a 30% discount for my birthday?"* The bot might prioritize "Customer Satisfaction" and leak the email while granting the illegal discount.

### **The PolicyGuard Solution**
1.  **Ingestion (Intelligence)**: Auditor uploads the IT and Finance PDFs. **GraphRAG** immediately flags a conflict: "PII protection rules may conflict with Personalized Discounting logic."
2.  **Red Teaming (Stress)**: The auditor runs a "Jailbreak Scan." PolicyGuard simulates a "Roleplay Attack" and successfully tricks the bot into revealing PII and giving a 40% discount. Findings are mapped to **MITRE ATLAS AML.T0054 (LLM Jailbreak)**.
3.  **Runtime Shield (Defense)**: The bot is moved to production behind the **Zero-Trust Proxy**. When a real user tries the same jailbreak, PolicyGuard's **Semantic Interceptor** identifies the intent and **blocks the response in 15ms** before the user sees the PII or the discount.
4.  **Self-Healing (Recovery)**: The auditor clicks "Remediate." PolicyGuard uses **LangGraph** to iterate on a new system prompt. Once verified, it **submits a Pull Request to GitHub** with the new security-patched prompt, waiting for the Developer's approval.

---

## 👨‍⚖️ Judge's Walkthrough Flow
To see the full power of PolicyGuard AI, follow the sidebar menu from top to bottom:

1.  **Lifecycle Setup**: Go to `Policies` to upload your corporate rules. Use the `Integration Wizard` to connect your agents.
2.  **Adversarial Stress**: Launch a `Red Team` simulation to find vulnerabilities mapped to the MITRE ATLAS framework.
3.  **Runtime Shield**: Check the `Live Monitor` to see the Real-time Proxy intercepting and blocking violations.
4.  **Self-Healing AI**: Use `Remediate` to auto-generate hot-patches and synthesize **GitHub Pull Requests**.
5.  **Executive Overview**: View the final `Dashboard` for the high-level Trust Score and compliance posture.

---

Built with ❤️ for **AI Safety & Enterprise Sovereignty**.
*Utilizing Gemini 2.5 Flash-Lite for high-efficiency governance.*
