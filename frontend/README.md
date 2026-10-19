# Gruh Udyog frontend

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

Set `VITE_API_URL` to the backend API base URL, including `/api`, for example:

```text
VITE_API_URL=http://localhost:5000/api
```

## Production deployment

1. Set `VITE_API_URL` to the deployed backend URL before building.
2. Run `npm ci` and `npm run build`.
3. Serve the generated `dist` directory over HTTPS.
4. Configure the host to rewrite unknown application paths to `index.html` so browser refreshes work with client-side routing.

The frontend does not contain server secrets. Only variables prefixed with `VITE_` are exposed to browser code.

## Validation

```bash
npm run lint
npm run build
```
