# PSL Project

This repository contains two main parts:

- `backend/` — FastAPI backend for translating text to Pakistani Sign Language (PSL) gloss tokens
- `frontend/` — Next.js frontend for displaying the translation and animation

## Run the backend (WSL)

Open a WSL terminal and run:

```bash
cd "/mnt/c/Nabeel/Semester_7/Final Year Project/psl/backend"
chmod +x run-backend.sh
./run-backend.sh
```

If the backend script fails because venv support is missing, run once in WSL:

```bash
sudo apt update
sudo apt install -y python3-pip python3-venv
```

Then rerun:

```bash
./run-backend.sh
```

The backend will start at:

```text
http://localhost:8000
```

Verify by opening:

```text
http://localhost:8000/health
```

## Run the frontend

Open a separate terminal (Windows or WSL) and run:

```bash
cd "/mnt/c/Nabeel/Semester_7/Final Year Project/psl/frontend"
npm install
npm run dev
```

The frontend will start at:

```text
http://localhost:3000
```

## Notes

- The frontend is already configured to call the backend at `http://localhost:8000`.
- Do not commit local environment files.
- `backend/.env` is ignored by `.gitignore`.
- The backend uses SQLite locally with `backend/dev.db`.

## Git

The repository ignores local environment files and hidden caches. To push safely, use:

```bash
git add .
git commit -m "Add README and ignore local runtime files"
git push
```
