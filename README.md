OpsMind AI – Intelligent Document Q&A System
OpsMind AI is a full-stack AI-powered application that allows users to upload company documents (PDFs) and ask questions based on them. It uses a Retrieval-Augmented Generation (RAG) pipeline to provide accurate, context-based answers along with source references.

📌 Features
👤 User Features
🔐 Authentication (Login / Signup using JWT)
📄 Upload PDF documents
💬 Ask questions based on uploaded documents
🧠 AI-generated answers using document context
📚 Chat history (view, reload, delete)
📎 Source references with page numbers

🛡️ Smart Guardrails
Prevents hallucination
If answer is not found in documents:
"I don't know based on available documents."

👨‍💼 Admin Dashboard
👥 View all users
💬 View all chats
📊 Knowledge Insights:
Top accessed documents
Frequently asked topics
📈 Visual analytics using charts

🧠 Tech Stack
Frontend
React.js
CSS
React Icons
Recharts (for analytics dashboard)

Backend
Node.js
Express.js
MongoDB Atlas
Mongoose

AI / ML
Embedding Model (for semantic search)
Local LLM (for answer generation)
Vector similarity search (RAG pipeline)

⚙️ Project Structure
opsmind-ai/
│
├── backend/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── services/
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── App.js
│   ├── Admin.js
│   └── components/
│
└── README.md

🔄 How It Works (RAG Pipeline)
User uploads PDF
Document is split into chunks
Embeddings are generated and stored
User asks a query
Query embedding is generated
Relevant chunks are retrieved
Context is passed to LLM
Answer is generated with references

🔐 Authentication Flow
JWT-based authentication
Role-based access:
user → normal access
admin → dashboard access

📊 Admin Insights
📄 Document usage tracking
🔍 Topic frequency analysis
📉 Data visualization using charts

🚀 Setup Instructions
1️⃣ Clone the repo


git clone https://github.com/Renugasri-1/opsmind-ai.git
cd opsmind-ai
2️⃣ Backend Setup
cd backend
npm install

Create .env file:
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_secret_key

Run Backend:
Node server.js

Frontend Setup
cd frontend
npm install
npm install recharts react-icons
npm start

🔑 Admin Access
After signup, update role manually in MongoDB:
Json
Copy code
{
  "role": "admin"
} 
