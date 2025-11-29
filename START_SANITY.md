# 🚀 Starting Sanity Studio

## Quick Start

### Option 1: Use the PowerShell Script (Easiest)
```powershell
.\start-sanity-studio.ps1
```

### Option 2: Manual Start
```powershell
cd sanity-studio
npm run dev
```

## ⚠️ Important: Update Your .env File First!

Before starting, make sure your `.env` file has your **actual** Sanity credentials (not placeholders):

```env
VITE_SANITY_PROJECT_ID=your-actual-project-id-here
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=your-actual-api-token-here
```

**Get your credentials from:** [https://www.sanity.io/manage](https://www.sanity.io/manage)

## What Happens When You Start

1. **Sanity Studio will start** on `http://localhost:3333`
2. **First time?** You'll be asked to login to Sanity
3. **Select your project** from the list
4. **Start creating content!**

## Accessing the Studio

Once started, open your browser to:
- **Local:** http://localhost:3333
- **Studio path:** http://localhost:3333/studio

## Creating Your First Content

1. Click **"Create new"** button
2. Choose a content type:
   - **Blog Post** - For blog articles
   - **Featured Car** - For showcasing cars
3. Fill in the fields
4. Click **"Publish"** to make it live

## Troubleshooting

### "Project ID not found"
- Check your `.env` file has the correct Project ID
- Make sure you restarted after updating `.env`

### "Login required"
- The CLI will open a browser for you to login
- Or run: `npx sanity login` manually

### "Project not found"
- Verify your Project ID is correct
- Make sure you have access to the project

## Next Steps

After starting the studio:
1. ✅ Login to Sanity (if prompted)
2. ✅ Create your first blog post
3. ✅ Create your first featured car
4. ✅ Check your website - content should appear!

---

**Need help?** Check `SANITY_SETUP.md` for detailed instructions.

