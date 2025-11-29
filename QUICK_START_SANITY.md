# Quick Start: Connect Sanity CMS

## 🚀 5-Minute Setup

### Step 1: Get Your Sanity Credentials (2 minutes)

1. **Sign up/Login**: Go to [https://www.sanity.io/](https://www.sanity.io/) and create an account
2. **Create Project**: Click "Create new project" → Name it "JDM Heaven" → Create
3. **Get Project ID**: 
   - In your project dashboard, copy the Project ID (shown at the top)
   - Example: `aoh6qdxm`
4. **Create API Token**:
   - Go to **Settings** → **API** → **Tokens**
   - Click **Add API token**
   - Name: "JDM Heaven Frontend"
   - Permission: **Editor** (or Viewer for read-only)
   - Click **Save** and **COPY THE TOKEN** (you won't see it again!)

### Step 2: Update .env File (1 minute)

Open your `.env` file and add:

```env
VITE_SANITY_PROJECT_ID=your-project-id-here
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=your-api-token-here
```

Replace:
- `your-project-id-here` with your actual Project ID
- `your-api-token-here` with your actual API token

### Step 3: Restart Dev Server (30 seconds)

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

### Step 4: Create Content in Sanity (2 minutes)

#### Option A: Use Sanity Studio (Visual Editor)

1. Install Sanity CLI:
   ```bash
   npm install -g @sanity/cli
   ```

2. Initialize Studio (optional):
   ```bash
   mkdir sanity-studio
   cd sanity-studio
   sanity init --template clean --project-id YOUR_PROJECT_ID --dataset production
   ```

3. Start Studio:
   ```bash
   cd sanity-studio
   sanity start
   ```

4. Open [http://localhost:3333](http://localhost:3333) and create content

#### Option B: Use Sanity Vision (Web Interface)

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Click on your project
3. Go to **API** → **Vision**
4. Use GROQ queries to create content (see examples below)

### Step 5: Test It Works (30 seconds)

1. Check browser console - should see "✅ Sanity connected" (or similar)
2. Visit your blog page - should load content from Sanity
3. Check Admin Dashboard - connection status should show

## 📝 Creating Your First Content

### Create a Blog Post

In Sanity Vision, run this mutation:

```groq
*[_type == "post"][0]
```

Or create via Studio:
1. Click "Create new" → "Blog Post"
2. Fill in:
   - Title: "Welcome to JDM Heaven"
   - Slug: (auto-generated from title)
   - Main Image: Upload an image
   - Body: Write your content
   - Published At: Set to now
3. Click "Publish"

### Create a Featured Car

In Sanity Studio:
1. Click "Create new" → "Featured Car"
2. Fill in:
   - Title: "1999 Nissan Skyline GT-R"
   - Make: "Nissan"
   - Model: "Skyline GT-R"
   - Year: 1999
   - Price: 85000
   - Image: Upload car image
   - Reference ID: Link to your Supabase car ID
3. Click "Publish"

## 🔍 Verify Connection

Check these files are using Sanity:
- `src/lib/cms.ts` - CMS API functions
- `src/components/cms/` - CMS components
- `src/pages/BlogPage.tsx` - Blog listing
- `src/pages/HomePage.tsx` - Homepage (uses FeaturedCarsFromCMS)

## 🎯 What You Can Manage in Sanity

✅ **Blog Posts** - Full blog content management
✅ **Featured Cars** - Showcase cars on homepage
✅ **JDM Legends** - Carousel content
✅ **Services** - Service listings
✅ **Hero Section** - Homepage hero
✅ **Testimonials** - Customer testimonials
✅ **Gallery** - Image gallery

## 🆘 Troubleshooting

**"Missing required Sanity configuration"**
- Check `.env` file has all 3 variables
- Restart dev server after adding variables

**"Unable to access content"**
- Check API token permissions
- Verify Project ID is correct

**"Content not found"**
- Create content in Sanity first
- Check content type names match (post, featuredCar, etc.)

## 📚 Next Steps

1. Read the full guide: `SANITY_SETUP.md`
2. Customize schemas in `sanity/schemas/`
3. Set up webhooks for real-time updates
4. Configure preview mode for drafts

## 💡 Pro Tips

- Use Sanity Studio for visual content editing
- Use GROQ queries for complex data fetching
- Set up image optimization in Sanity
- Use references to link related content
- Enable real-time collaboration features

