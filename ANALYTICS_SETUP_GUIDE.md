# 📊 Analytics Setup Guide - JDM HEAVEN

## Google Analytics 4 Configuration

### **Step 1: Create GA4 Property**

1. Go to [Google Analytics](https://analytics.google.com)
2. Click "Admin" (gear icon)
3. In "Property" column, click "Create Property"
4. Enter property name: "JDM Heaven"
5. Select timezone and currency (EUR)
6. Click "Create"
7. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

---

### **Step 2: Configure Environment Variables**

#### **Local Development (.env file)**
```bash
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

#### **Vercel Production**
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add new variable:
   - **Name**: `VITE_GA_MEASUREMENT_ID`
   - **Value**: `G-XXXXXXXXXX` (your GA4 Measurement ID)
   - **Environment**: Production, Preview, Development
3. Click "Save"
4. Redeploy your site

---

### **Step 3: Verify Setup**

1. **Deploy to Production**
   - Push changes to GitHub
   - Wait for Vercel deployment

2. **Test Analytics**
   - Visit your production site
   - Navigate to different pages
   - Perform actions (view car, add to wishlist, etc.)

3. **Check GA4 Real-Time Reports**
   - Go to GA4 Dashboard
   - Navigate to "Reports" → "Realtime"
   - You should see:
     - Active users
     - Page views
     - Events

---

## 📈 Key Events Being Tracked

### **Car/Inventory Events**
- `car_view` - When user views a car detail page
- `car_inquiry` - When user submits inquiry
- `car_wishlist_add` / `car_wishlist_remove` - Wishlist actions
- `car_compare_add` / `car_compare_remove` - Comparison actions
- `car_share` - When user shares a car

### **Filter Events**
- `filter_use` - When filter is applied
- `filter_reset` - When filters are cleared
- `filter_save` - When filter preset is saved

### **Search Events**
- `search_query` - When user searches
- `search_suggestion_click` - When suggestion is clicked

### **Calculator Events**
- `import_calculator` - Import cost calculated
- `shipping_calculator` - Shipping cost calculated
- `financing_calculator` - Financing calculated

### **User Journey Events**
- `sign_up` - New user registration
- `sign_in` - User login
- `custom_request` - Custom car request
- `quote_request` - Quote request

### **Conversion Events**
- `conversion` - Key conversion actions (inquiry, quote, purchase)

### **Engagement Events**
- `time_on_page` - Time spent on page (30+ seconds)
- `scroll_depth` - Scroll depth (75%+)

### **Error Events**
- `error` - Error occurrences

---

## 🎯 Setting Up Conversion Goals

### **In GA4 Dashboard**

1. **Go to Admin** → **Events**
2. **Mark as Conversion**:
   - `car_inquiry`
   - `quote_request`
   - `custom_request`
   - `sign_up`

3. **Create Custom Conversions**:
   - Go to Admin → Conversions
   - Click "New conversion event"
   - Add events above

---

## 📊 Custom Dashboards

### **Create "JDM Heaven Dashboard"**

1. Go to **Explore** → **Blank**
2. Add Dimensions:
   - Page title
   - Event name
   - User type
   - Device category

3. Add Metrics:
   - Event count
   - Users
   - Conversions
   - Average session duration

4. Add Filters:
   - Event name contains "car_"
   - Page path contains "/inventory"

5. Save as "JDM Heaven - Car Engagement"

---

## 🔍 Key Reports to Monitor

### **1. User Engagement**
- Pages per session
- Average session duration
- Bounce rate
- Return visitor rate

### **2. Car Inventory Performance**
- Car detail page views
- Most viewed cars
- Filter usage
- Search queries

### **3. Conversion Funnel**
1. Page view (inventory)
2. Car view (detail page)
3. Inquiry/Quote request
4. Sign up (if not logged in)

### **4. User Behavior**
- Time on inventory page
- Scroll depth
- Filter combinations used
- Most popular search terms

---

## 🚨 Alerts Setup

### **Create Custom Alerts**

1. Go to **Admin** → **Custom Alerts**
2. Create alerts for:
   - **High Bounce Rate**: > 70%
   - **Low Conversion Rate**: < 2%
   - **Error Spike**: > 10 errors/hour
   - **Traffic Drop**: > 50% decrease

---

## 📱 Mobile vs Desktop Tracking

Analytics automatically tracks:
- Device category
- Operating system
- Browser
- Screen resolution

**Monitor**:
- Mobile vs desktop conversion rates
- Mobile engagement metrics
- Device-specific issues

---

## 🔐 Privacy & Compliance

### **GDPR Compliance**
- Analytics respects "Do Not Track" header
- No personal data is tracked
- IP anonymization enabled (default in GA4)

### **Cookie Consent** (Future)
Consider adding cookie consent banner for EU users:
- Only load GA4 after consent
- Allow users to opt-out

---

## ✅ Verification Checklist

- [ ] GA4 property created
- [ ] Measurement ID obtained
- [ ] Environment variable set in Vercel
- [ ] Site deployed
- [ ] Real-time reports showing data
- [ ] Events firing correctly
- [ ] Conversion goals configured
- [ ] Custom dashboard created
- [ ] Alerts set up

---

## 🐛 Troubleshooting

### **Issue: No data in GA4**
**Solutions**:
1. Check Measurement ID is correct
2. Verify environment variable is set
3. Check browser console for errors
4. Ensure site is deployed (not just local)
5. Wait 24-48 hours for data to appear (Real-time shows immediately)

### **Issue: Events not tracking**
**Solutions**:
1. Check browser console for errors
2. Verify `analytics.initialize()` is called
3. Check event names match GA4 requirements
4. Use GA4 DebugView to see events in real-time

### **Issue: Page views not tracking**
**Solutions**:
1. Verify `usePageTracking` hook is used in RootLayout
2. Check React Router is working
3. Verify GA4 script is loading

---

## 📚 Resources

- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Event Reference](https://developers.google.com/analytics/devguides/collection/ga4/events)
- [GA4 DebugView](https://support.google.com/analytics/answer/7201382)

---

**Status**: Ready for setup  
**Next**: Add Measurement ID to environment variables and deploy

