# Luxury Her - Premium Wigs E-Commerce

A beautiful, feminine e-commerce website for luxury wigs with WhatsApp ordering integration and a comprehensive admin dashboard.

## Features

### Public-Facing Features
- 🎨 Elegant landing page with gold brand colors
- 📱 Fully responsive design
- 🏷️ Category-based wig filtering
- 🖼️ Multiple images per product
- 🎥 Video support for products (max 10MB)
- 💰 Discount pricing display
- 📊 Stock availability indicators
- 💬 WhatsApp order integration with pre-filled product details

### Admin Dashboard Features
- 🔐 Secure authentication (NextAuth.js)
- 📦 Complete wig inventory management
- 🗂️ Category management
- ☁️ Cloudinary integration for media uploads
- 📈 Dashboard with statistics
- ✏️ Create, read, update, and delete operations for wigs and categories

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Authentication:** NextAuth.js
- **Database:** MongoDB with Mongoose
- **Media Storage:** Cloudinary
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- MongoDB installed locally or MongoDB Atlas account
- Cloudinary account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd luxuryher
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:

Copy `.env.example` to `.env.local` and update with your credentials:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/luxuryher

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Admin Access

1. Navigate to `/admin/login`
2. Use the credentials you set in `.env.local`:
   - Username: as specified in `ADMIN_USERNAME`
   - Password: as specified in `ADMIN_PASSWORD`

## Project Structure

```
luxuryher/
├── app/
│   ├── api/               # API routes
│   │   ├── auth/         # NextAuth configuration
│   │   ├── categories/   # Category CRUD endpoints
│   │   ├── wigs/         # Wig CRUD endpoints
│   │   └── upload/       # Cloudinary upload endpoint
│   ├── admin/            # Admin dashboard
│   │   ├── login/        # Admin login page
│   │   └── dashboard/    # Protected admin pages
│   ├── wigs/             # Public wig detail pages
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles
├── components/           # Reusable components
├── lib/                  # Utility functions
│   ├── mongodb.ts       # Database connection
│   ├── cloudinary.ts    # Cloudinary utilities
│   └── auth.ts          # Auth helpers
├── models/              # Mongoose models
│   ├── Category.ts
│   └── Wig.ts
└── middleware.ts        # NextAuth middleware
```

## Usage

### Managing Categories

1. Go to Admin Dashboard → Categories
2. Click "Add Category" to create a new category
3. Edit or delete existing categories

### Managing Wigs

1. Go to Admin Dashboard → Wigs
2. Click "Add Wig" to create a new product
3. Fill in product details:
   - Name, description, category
   - Price, discount, stock quantity
   - Color
   - Upload multiple images
   - Upload optional video (max 10MB)
4. Save and publish

### Customer Orders via WhatsApp

When customers click "Order via WhatsApp" on a product page, a pre-filled WhatsApp message opens containing:
- Product name
- Color
- Price (with discount if applicable)
- Direct link to the product page

## Building for Production

```bash
npm run build
npm start
```

## Deployment

This project can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- Any Node.js hosting platform

### Environment Variables for Production

Make sure to set all environment variables in your hosting platform:
- `MONGODB_URI` - Your production MongoDB connection string
- `NEXTAUTH_SECRET` - A secure random string
- `NEXTAUTH_URL` - Your production URL
- `ADMIN_USERNAME` and `ADMIN_PASSWORD` - Admin credentials
- Cloudinary credentials

## Brand Colors

- **Gold:** `#D4AF37` (Primary brand color)
- **Gold Light:** `#F4E4C1`
- **Gold Dark:** `#B8941E`
- **Pink:** `#FFF0F5` (Background accent)
- **Rose:** `#FFE4E9` (Background accent)

## Security Notes

- Admin credentials are hardcoded in environment variables (suitable for single-user admin)
- NextAuth.js handles session management
- Protected routes use middleware for authentication
- All admin API routes verify authentication before processing

## Support

For issues or questions, please create an issue in the repository.

## License

All rights reserved © 2024 Luxury Her
