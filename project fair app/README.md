# ProjectExpert

A Flask-based engineering marketplace and project board for connecting project owners with specialist engineers.

## Run locally

```bash
python -m venv .venv
. .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python server.py
```

Then open http://localhost:8000

## Host on a platform

This project is ready for deployment with Gunicorn using the included Procfile:

```bash
gunicorn server:app
```

Set the environment variables from `.env.example` in your host.

## Deploy the backend on Render

1. Push this repo to GitHub.
2. In Render, create a new Web Service and connect the repository.
3. Use the default Python environment and set the build/start commands to:
   - Build: `pip install -r requirements.txt`
   - Start: `gunicorn backend.server:app`
4. Add your MySQL environment variables in Render if you want database-backed login and engineer storage.

## Deploy the frontend on Netlify

1. In Netlify, deploy the repository's `frontend/` folder as a static site.
2. Open the deployed site and edit the API base in `frontend/config.js`:
   - Replace the empty value with your Render backend URL, for example:
     `https://projectexpert.onrender.com`
3. Save and redeploy the site.

## Notes

- The frontend uses the configured `API_BASE_URL` for requests when it is hosted separately from the backend.
- If MySQL is unavailable, the app falls back to demo data so the site still loads.
- Database-backed features are still available when a MySQL server is configured.
