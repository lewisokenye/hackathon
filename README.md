🔹 Prompts for Backend Code Generation

Server + Express Setup

*“Generate a Node.js Express backend setup with routes for donations, marketplace, rewards, and payment integration. Use MySQL as the database. Include a db.js connection file, server.js entry point, and organize routes in a /routes folder. Add environment variable support with dotenv.”

Donations API

“Write an Express router file donations.js that lets users create a donation (food or money), fetch all donations, and link the donations to logged-in users. Store data in MySQL with fields: id, donor_id, type, description, amount, created_at.”

Marketplace API

“Create a marketplace.js router for listing available food items. Each item should have id, name, description, quantity, donor_id, status, and created_at. Include endpoints to add an item, list items, and update status (claimed/unclaimed). Use MySQL queries.”

**Gamification (Rewards API)

“Build a rewards.js router that tracks points for users. Each donation adds 10 points. Streaks (donating multiple days in a row) should add bonus points. Create endpoints to get user rewards and update them. Store in MySQL: user_id, points, streak, badges.”

Paystack Integration

“Generate a paystack.js Express router that integrates Paystack API. Include endpoints /pay (initialize transaction) and /callback (verify transaction). Use environment variables for PAYSTACK_SECRET_KEY and PAYSTACK_PUBLIC_KEY. Handle donation crediting after successful payment.”

OpenAI Food Safety Assistant API

“Write an Express route /api/ai/food-advice that accepts foodType in the request body and queries OpenAI GPT API. Prompt it to return JSON with safety_tips and recipe fields. Respond with parsed JSON. Use dotenv for the OpenAI API key.”

🔹 Prompts for Frontend Code Generation

React App Structure

“Generate a React app with pages: Dashboard, Donations, Marketplace, Rewards, MapView. Include components: DonationForm, PaymentButton, RewardsCard. Use React Router for navigation. Use TailwindCSS for styling.”

Donations Page & Form*

“Write a Donations.jsx page with a DonationForm.jsx component. The form should allow entering donation type (food or money), description, and amount. On submit, send data to backend /donations via Axios. Show confirmation after success.”

Marketplace Page

“Create a Marketplace.jsx page that fetches available food items from /marketplace API and displays them in a grid with name, description, quantity, and status. Add a button to claim an item, which updates the backend status.”

Rewards Page

“Generate a Rewards.jsx page that fetches a user’s rewards from /rewards. Display points, streaks, and badges using a RewardsCard.jsx component. Use Tailwind for styling.”

Payment Button Component

“Write a PaymentButton.jsx React component that integrates Paystack checkout. It should call the backend /paystack/pay endpoint to initialize a transaction, then redirect the user to Paystack checkout page. On success, notify backend /paystack/callback to update donation records.”

API Layer (Axios Helpers)

“Create an api/ folder with donations.js, marketplace.js, rewards.js, and paystack.js. Each file should export Axios functions to call the backend routes. Example: getDonations(), createDonation(), getRewards(), etc.”

🔹 Prompt for Gamification (Frontend & Backend Integration)

“Extend the HungerLink project with gamification. On every successful donation, update rewards points in MySQL via backend. The frontend should immediately reflect changes in the Rewards page (using live fetch or optimistic UI update). Add badges for milestones (e.g., 100 points = Bronze Donor, 500 points = Gold Donor). Display a streak counter for consecutive donations.”
