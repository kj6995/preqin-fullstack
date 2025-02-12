# Preqin Technical Interview

The aim is to fulfill the following user story:

```
As a user of the system
I want to see a list of all investors and their commitments
So that I can understand which investors have committed to which funds
```

Sample data is provided in `data.csv`. Assume a sole currency of GBP, and ignore any authentication needs.

How you visualise the data is up to you, if you need guidance there are some optional wireframes in the repo.

## Steps to Run this Solution

### Prerequisites
- Python 3.10
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Import the data from the csv file:
```bash
python import_data.py
```

5. Start the backend server:
```bash
uvicorn api:app --reload --port 8000
```

The backend will be running at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be running at http://localhost:3000

### Features
- View list of investors with pagination
- Click on an investor to see their commitments
- Filter commitments by asset class
- Navigate back to the main list
- Responsive design that works on both desktop and mobile

### API Endpoints
- GET `/api/investors` - List all investors with pagination
- GET `/api/investors/{id}/commitments` - Get investor details and commitments with filtering and pagination

### Tech Stack
- Backend:
  - FastAPI (Python)
  - SQLite Database
  - SQLAlchemy ORM
- Frontend:
  - Next.js 13+
  - TypeScript
  - Tailwind CSS
  - Shadcn UI Components
