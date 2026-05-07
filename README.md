This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Implemented Features

This project incorporates a robust set of backend features, focusing on security, data integrity, and best practices:

* **Role-Based Access Control (RBAC):** Restricts access to API routes and resources based on user roles, ensuring users can only perform actions they are authorized for.
* **Roles:** The system distinguishes between different user roles, such as `ADMIN`, `HOST`, and `GUEST`, each with specific permissions and capabilities within the platform.
* **Access Tokens:** Uses short-lived JWT access tokens for authenticating API requests securely and efficiently.
* **Refresh Tokens & Token Rotation:** Implements a secure authentication flow using HttpOnly refresh tokens stored in the database. Token rotation is used to issue a new refresh token with every access token refresh, mitigating the risk of compromised tokens.
* **Database Design:** A well-structured relational database schema designed to support complex relationships between users, listings, bookings, and reviews, ensuring data consistency and optimal querying.
* **Prisma Usage:** Utilizes Prisma ORM for type-safe database access, schema migrations, and intuitive data modeling.
* **Prisma `$transaction`:** Leverages Prisma `$transaction` to ensure ACID compliance during complex operations (e.g. creating a booking and verifying availability simultaneously). This guarantees that either all database operations succeed or none do, preventing partial or inconsistent data updates.
* **Middleware:** Employs Next.js middleware for edge-level request interception, handling tasks like token verification, route protection, and RBAC enforcement before requests reach the API handlers.

## Problems / Can Be Improved

* **Important Real-World Optimization:** Right now, multiple users can create infinite `PENDING` bookings. That can become a vector for abuse or spam (database bloat and coupon locking). Implementing a background cleanup job or limiting active pending bookings per user would resolve this.
* **Simplified Booking Workflow:** Currently, the system uses two separate APIs: one to create a `PENDING` booking entity when reserving, and another to initiate the payment. A more streamlined approach would be to bypass creating the initial database entity altogether and instead generate the booking record only when the user clicks the payment gateway button. This would consolidate the logic into a single API, reduce database writes, and eliminate the problem of abandoned `PENDING` bookings entirely.
