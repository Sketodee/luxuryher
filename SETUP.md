# Quick Setup Guide for Luxury Her

## Step 1: Environment Setup

1. Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```

2. Update the following in `.env.local`:

### MongoDB Setup
**Option A: Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/luxuryher
```

**Option B: MongoDB Atlas (Cloud)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Update:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/luxuryher
```

### Cloudinary Setup
1. Go to [Cloudinary](https://cloudinary.com)
2. Sign up for a free account
3. From your dashboard, copy:
   - Cloud Name
   - API Key
   - API Secret
4. Update in `.env.local`:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Admin Credentials
Set your admin login credentials:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123
```

### NextAuth Secret
Generate a random secret key:
```bash
openssl rand -base64 32
```
Or use any random string generator, then update:
```env
NEXTAUTH_SECRET=your-generated-secret-here
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Start the Development Server

```bash
npm run dev
```

## Step 4: Access the Application

- **Homepage**: [http://localhost:3000](http://localhost:3000)
- **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Step 5: Initial Setup

1. Login to admin panel using your credentials from `.env.local`
2. Create some categories (e.g., "Lace Front", "Full Lace", "Synthetic")
3. Add your first wig with:
   - Name and description
   - Category
   - Price and optional discount
   - Color
   - Stock quantity
   - Multiple images
   - Optional video

## Troubleshooting

### MongoDB Connection Issues
- Make sure MongoDB is running locally: `mongod`
- Or check your MongoDB Atlas connection string

### Image Upload Issues
- Verify Cloudinary credentials are correct
- Check that images are less than 10MB (for videos)

### Authentication Issues
- Clear browser cookies
- Check that `NEXTAUTH_SECRET` is set
- Verify `NEXTAUTH_URL` matches your dev server URL

### Port Already in Use
If port 3000 is in use, you can specify a different port:
```bash
PORT=3001 npm run dev
```

## Production Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy!

### Other Platforms
1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Set all environment variables on your hosting platform

## Need Help?

Check the main [README.md](./README.md) for more detailed information.
