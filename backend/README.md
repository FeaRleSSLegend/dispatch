# Dispatch API

FastAPI service wrapping the ML incident pipeline and persisting to Supabase.

## Setup

```bash
cd backend
pip install -r requirements.txt
python -m spacy download en_core_web_sm
cp .env.example .env
# Edit .env with your Supabase URL + service_role key