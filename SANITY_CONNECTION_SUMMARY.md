# ✅ Sanity CMS Connection - Complete Setup

## What Has Been Set Up

### ✅ 1. Configuration Files
- **`.env` file** - Created with placeholder values for Sanity credentials
- **`SANITY_SETUP.md`** - Comprehensive setup guide
- **`QUICK_START_SANITY.md`** - 5-minute quick start guide
- **Schema files** - Created in `sanity/schemas/` directory

### ✅ 2. Code Integration
- **CMS Client** (`src/lib/sanity-client.ts`) - Already configured
- **CMS API** (`src/lib/cms.ts`) - Functions to fetch content
- **Components** - Ready to use Sanity content:
  - `FeaturedCarsFromCMS.tsx` - Displays cars from Sanity
  - `BlogPostList.tsx` - Lists blog posts
  - `JdmLegendsFromCMS.tsx` - JDM legends carousel
  - `ServicesFromCMS.tsx` - Services listing
  - `HeroFromCMS.tsx` - Hero section

### ✅ 3. Dependencies
- `groq` - Installed (GROQ query language for Sanity)
- `@sanity/client` - Already in dependencies
- `@sanity/image-url` - Already in dependencies

## What You Need to Do

### Step 1: Get Sanity Credentials (5 minutes)

1. **Sign up/Login** at [https://www.sanity.io/](https://www.sanity.io/)
2. **Create a project** named "JDM Heaven"
3. **Get your Project ID** from the project dashboard
4. **Create an API token**:
   - Settings → API → Tokens → Add API token
   - Name: "JDM Heaven Frontend"
   - Permission: Editor (or Viewer for read-only)
   - **Copy the token immediately!**

### Step 2: Update .env File

Open `.env` and replace these values:

```env
VITE_SANITY_PROJECT_ID=your-actual-project-id
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=your-actual-api-token
```

### Step 3: Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Step 4: Create Content in Sanity

You have two options:

#### Option A: Sanity Studio (Visual Editor - Recommended)

```bash
# Install Sanity CLI globally
npm install -g @sanity/cli

# Create and initialize studio
mkdir sanity-studio
cd sanity-studio
sanity init --template clean --project-id YOUR_PROJECT_ID --dataset production

# Start studio
sanity start
```

Then open [http://localhost:3333](http://localhost:3333) to manage content visually.

#### Option B: Sanity Vision (Web Interface)

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Click your project
3. Go to **API** → **Vision**
4. Use GROQ queries to create/manage content

## Content Types Available

Your app is ready to use these content types:

1. **`post`** - Blog posts
   - Title, slug, author, image, categories, body, published date
   
2. **`featuredCar`** - Featured cars for homepage
   - Make, model, year, price, image, specs, reference ID
   
3. **`jdmLegend`** - JDM legends for carousel
   - Name, description, image, year, specs
   
4. **`service`** - Services listing
   - Title, description, icon
   
5. **`hero`** - Hero section
   - Title, subtitle, background image, CTAs
   
6. **`testimonial`** - Customer testimonials
   - Name, role, quote, image
   
7. **`galleryImage`** - Gallery images
   - Title, description, image, category

## How to Use in Your Code

### Fetch Blog Posts

```typescript
import { cms } from './lib/cms';

// Get all blog posts
const { posts, total } = await cms.getBlogPosts(10, 0);

// Get single blog post
const post = await cms.getBlogPost('my-blog-slug');
```

### Fetch Featured Cars

```typescript
// Get featured cars
const cars = await cms.getFeaturedCars();
```

### Fetch JDM Legends

```typescript
// Get JDM legends
const legends = await cms.getJdmLegends();
```

## Testing the Connection

1. **Check browser console** - Should see connection status
2. **Visit blog page** - Should load content from Sanity
3. **Check Admin Dashboard** - Connection status indicator
4. **Create test content** - Add a blog post or featured car in Sanity

## Files Created/Modified

### New Files:
- `SANITY_SETUP.md` - Full setup guide
- `QUICK_START_SANITY.md` - Quick start guide
- `sanity/schemas/post.ts` - Blog post schema
- `sanity/schemas/featuredCar.ts` - Featured car schema
- `sanity/schemas/blockContent.ts` - Rich text schema
- `sanity/schemas/index.ts` - Schema exports

### Existing Files (Already Set Up):
- `src/lib/sanity-client.ts` - Sanity client configuration
- `src/lib/cms.ts` - CMS API functions
- `src/components/cms/` - CMS components
- `.env` - Environment variables (needs your credentials)

## Next Steps

1. ✅ Get Sanity credentials
2. ✅ Update `.env` file
3. ✅ Restart dev server
4. ✅ Create content in Sanity
5. ✅ Test content appears on your site

## Troubleshooting

**"Missing required Sanity configuration"**
- Check `.env` has all 3 Sanity variables
- Restart dev server after updating `.env`

**"Unable to access content"**
- Verify API token permissions
- Check Project ID is correct
- Ensure dataset name matches

**"Content not found"**
- Create content in Sanity first
- Check content type names match exactly
- Verify content is published (not drafts)

## Resources

- **Full Guide**: `SANITY_SETUP.md`
- **Quick Start**: `QUICK_START_SANITY.md`
- **Sanity Docs**: [https://www.sanity.io/docs](https://www.sanity.io/docs)
- **GROQ Query**: [https://www.sanity.io/docs/groq](https://www.sanity.io/docs/groq)

## Support

If you need help:
1. Check the browser console for errors
2. Verify `.env` credentials are correct
3. Test API token in Sanity Vision tool
4. Review `SANITY_SETUP.md` for detailed instructions

---

**You're all set!** Just add your Sanity credentials to `.env` and start creating content! 🚀

