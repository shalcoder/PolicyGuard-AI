# PolicyGuard AI

**PolicyGuard AI** is a pre-deployment policy governance control plane designed to ensure AI workflows comply with organizational policies before they go live. It serves as actionable middleware that intercepts, evaluates, and safeguards AI interactions.

## 🚀 Key Features

*   **Policy Analysis**: Upload and analyze policy documents to extract rule sets.
*   **Guardrail Timeline**: Visual timeline of policy checks and compliance verdicts.
*   **Compliance Reports**: Detailed reports on AI workflow adherence to specific policies.
*   **Settings Management**: Configure API keys and backend connections easily.

## 🛠 Tech Stack

### Frontend
*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **UI Components**: [Shadcn UI](https://ui.shadcn.com/) / [Radix UI](https://www.radix-ui.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)

### Backend
*   **Framework**: [FastAPI](https://fastapi.tiangolo.com/)
*   **AI Models**: Google Gemini Pro (via `google-generativeai`)
*   **Orchestration**: LangGraph
*   **Vector Database**: Weaviate
*   **Language**: Python 3.10+

## 🏁 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
*   Node.js 18+ and npm
*   Python 3.10+
*   Google Gemini API Key

### 1. clone the repository
```bash
git clone https://github.com/TharunvenkateshN/PolicyGuard-AI.git
cd PolicyGuard-AI
```

### 2. Backend Setup

Navigate to the backend directory:
```bash
cd backend
```

Create a virtual environment:
```bash
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Create a `.env` file in the `backend` directory:
```env
GOOGLE_API_KEY=your_gemini_api_key_here
```

Run the backend server:
```bash
uvicorn main:app --reload
```
The backend API will be available at `http://localhost:8000`.

### 3. Frontend Setup

Open a new terminal and navigate to the frontend directory:
```bash
cd ../frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env.local` file in the `frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

Run the development server:
```bash
npm run dev
```
The frontend application will be available at `http://localhost:3000`.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.