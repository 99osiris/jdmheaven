# Sanity CMS Setup Guide for JDM Heaven

This guide will walk you through setting up Sanity CMS as a headless CMS for your car imports and blog content.

## Step 1: Create a Sanity Account and Project

1. **Sign up for Sanity**
   - Go to [https://www.sanity.io/](https://www.sanity.io/)
   - Click "Get started" and create a free account
   - The free tier includes:
     - Unlimited API requests
     - 3 users
     - 10GB asset storage
     - Real-time collaboration

2. **Create a New Project**
   - After logging in, click "Create new project"
   - Name it "JDM Heaven" (or your preferred name)
   - Choose a dataset name (usually "production")
   - Click "Create project"

## Step 2: Install Sanity CLI

Open your terminal and install the Sanity CLI globally:

```bash
npm install -g @sanity/cli
```

Or if you prefer using npx (no global installation):

```bash
npx @sanity/cli --version
```

## Step 3: Initialize Sanity Studio (Optional - for Content Management UI)

If you want a visual content management interface, you can set up Sanity Studio:

```bash
# In your project root directory
mkdir sanity-studio
cd sanity-studio
sanity init --template clean --project-id YOUR_PROJECT_ID --dataset production
```

**Note:** You can skip this step if you only want to use Sanity as a headless CMS via API.

## Step 4: Get Your Sanity Credentials

1. **Get Project ID**
   - Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
   - Click on your project
   - Your Project ID is displayed at the top (e.g., `aoh6qdxm`)
   - Copy this ID

2. **Create an API Token**
   - In your project dashboard, go to **Settings** → **API** → **Tokens**
   - Click **Add API token**
   - Name it "JDM Heaven Frontend" (or similar)
   - Choose **Editor** permissions (or **Viewer** for read-only)
   - Click **Save**
   - **Copy the token immediately** (you won't be able to see it again!)

3. **Get Dataset Name**
   - Usually "production" or "development"
   - You can see it in your project settings

## Step 5: Update Your .env File

Add your Sanity credentials to your `.env` file:

```env
VITE_SANITY_PROJECT_ID=your-project-id-here
VITE_SANITY_DATASET=production
VITE_SANITY_TOKEN=your-api-token-here
```

**Important:** 
- Replace `your-project-id-here` with your actual Project ID
- Replace `your-api-token-here` with your actual API token
- Keep the dataset as "production" unless you're using a different one

## Step 6: Set Up Content Types in Sanity

Your project already has schema definitions in `sanity.config.js`. You need to create these content types in your Sanity project.

### Option A: Using Sanity Studio (Recommended)

If you set up Sanity Studio, you can use the schema from `sanity.config.js`:

1. Copy the schema definitions from `sanity.config.js`
2. Create schema files in your `sanity-studio/schemas/` directory
3. Import them in your `sanity.config.js` in the studio

### Option B: Using Sanity Management API

You can create content types programmatically or manually through the Sanity Studio web interface.

## Step 7: Content Types You'll Need

Based on your project, you need these content types:

### 1. **Blog Posts** (`post`)
- Title
- Slug
- Author (reference)
- Main Image
- Categories (references)
- Published Date
- Excerpt
- Body (rich text)

### 2. **Featured Cars** (`featuredCar`)
- Title
- Make
- Model
- Year
- Price
- Image
- Description
- Specifications (array)
- Reference ID (links to Supabase car)
- Order (for sorting)

### 3. **JDM Legends** (`jdmLegend`)
- Name
- Description
- Image
- Year
- Specifications (array)
- Order

### 4. **Services** (`service`)
- Title
- Description
- Icon
- Order

### 5. **Hero Section** (`hero`)
- Title
- Subtitle
- Background Image
- CTA Buttons

### 6. **Testimonials** (`testimonial`)
- Name
- Role
- Quote
- Image
- Order

### 7. **Gallery Images** (`galleryImage`)
- Title
- Description
- Image
- Category
- Order

## Step 8: Create Your First Content

### Using Sanity Studio (if installed):

1. Start the studio:
   ```bash
   cd sanity-studio
   sanity start
   ```

2. Open [http://localhost:3333](http://localhost:3333) in your browser
3. Create your first blog post or featured car

### Using Sanity Management API:

You can create content programmatically using the Sanity client in your code.

## Step 9: Test the Connection

1. **Restart your development server** after adding the `.env` variables:
   ```bash
   npm run dev
   ```

2. **Check the browser console** for any Sanity connection errors

3. **Visit your blog page** to see if content loads from Sanity

4. **Check the Admin Dashboard** - you should see connection status

## Step 10: Using Sanity Content in Your App

Your app already has components set up to use Sanity:

- **Blog Posts**: `src/components/cms/BlogPostList.tsx`
- **Featured Cars**: `src/components/cms/FeaturedCarsFromCMS.tsx`
- **JDM Legends**: `src/components/cms/JdmLegendsFromCMS.tsx`
- **Services**: `src/components/cms/ServicesFromCMS.tsx`
- **Hero**: `src/components/cms/HeroFromCMS.tsx`

The CMS API is available in `src/lib/cms.ts`:

```typescript
import { cms } from './lib/cms';

// Get blog posts
const { posts, total } = await cms.getBlogPosts(10, 0);

// Get featured cars
const cars = await cms.getFeaturedCars();

// Get single blog post
const post = await cms.getBlogPost('my-blog-slug');
```

## Troubleshooting

### "Missing required Sanity configuration"
- Check that all three environment variables are set in `.env`
- Make sure you restarted the dev server after adding them
- Verify the variable names start with `VITE_`

### "Unable to access content"
- Check your API token permissions
- Verify your Project ID is correct
- Make sure your dataset name matches

### "Content not found"
- Create some content in Sanity Studio first
- Check that content types match the schema (e.g., `post`, `featuredCar`)
- Verify content is published (not drafts)

### Images not loading
- Make sure images are uploaded to Sanity (not external URLs)
- Check that the image URL builder is working
- Verify image asset references in your queries

## Next Steps

1. **Create content** in Sanity Studio or via API
2. **Customize schemas** to match your exact needs
3. **Set up webhooks** for real-time updates (optional)
4. **Configure CORS** if needed for production
5. **Set up preview mode** for draft content (optional)

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity Client Documentation](https://www.sanity.io/docs/js-client)
- [Sanity Image URLs](https://www.sanity.io/docs/image-urls)

## Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your `.env` file has correct credentials
3. Test your API token in Sanity's Vision tool
4. Check Sanity's status page: [status.sanity.io](https://status.sanity.io)

