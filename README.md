# বাংলা ইবুক সেলিং ল্যান্ডিং পেজ

এই প্রজেক্টে দুইটি অংশ আছে:

- `Frontend`: React/Vite landing page + admin dashboard
- `Backend`: Node.js/Express API, ebook upload, order approval, secure download token

## চালানোর নিয়ম

Backend:

```bash
cd Backend
npm install
npm run dev
```

Frontend:

```bash
cd Frontend
npm install
npm run dev -- --port 5173
```

Frontend URL:

```text
http://localhost:5173
```

Backend API:

```text
http://localhost:5000
```

## Admin Login

```text
Email: admin@example.com
Password: admin123
```

Production/deployment-er age `Backend/.env.example` copy kore `.env` বানান এবং `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `CLIENT_URL` বদলে দিন।

## Payment Flow

1. Admin dashboard থেকে ebook file, cover image, price, bKash number, Nagad number সেট করুন।
2. Buyer landing page থেকে bKash/Nagad select করে Transaction ID submit করবে।
3. Admin order list থেকে transaction verify করে `Approve` করলে download link generate হবে।
4. Approved order-er download link 7 din valid থাকবে।

Real bKash/Nagad automated gateway লাগলে merchant API credentials দরকার হবে; এই MVP manual transaction verification flow দিয়ে বানানো।
