# Vercel vs Render: Key Changes Made

## Architecture Changes

### Vercel (Original)
```
api/
  └── index.js           # Serverless function
public/
  └── index.html         # Static files
vercel.json              # Vercel config
```

### Render (Updated)
```
server.js                # Traditional Express server
public/
  └── index.html         # Static files served by Express
render.yaml              # Render config
package.json             # Updated scripts
```

## Code Changes

### 1. Server Structure

**Vercel (Serverless)**
```javascript
// api/index.js
module.exports = app;  // Export for serverless
```

**Render (Traditional)**
```javascript
// server.js
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. Static File Serving

**Vercel**
- Automatically serves files from `public/`
- Configured in `vercel.json` routes

**Render**
```javascript
// Added in server.js
app.use(express.static(path.join(__dirname, 'public')));
```

### 3. Port Configuration

**Vercel**
- Automatic port assignment
- No explicit port needed

**Render**
```javascript
const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0');
```

### 4. Package.json Scripts

**Vercel**
```json
{
  "scripts": {
    "dev": "vercel dev",
    "deploy": "vercel --prod"
  }
}
```

**Render**
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  }
}
```

## Configuration Files

### vercel.json → render.yaml

**Vercel**
```json
{
  "version": 2,
  "builds": [
    { "src": "api/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/api/index.js" }
  ]
}
```

**Render**
```yaml
services:
  - type: web
    name: biomed-research-suite
    env: node
    buildCommand: npm install
    startCommand: npm start
    healthCheckPath: /api/health
```

## Deployment Process

### Vercel
1. `npm install -g vercel`
2. `vercel` or connect GitHub
3. Automatic deployment

### Render
1. Push to GitHub
2. Connect repo in Render dashboard
3. Auto-deploy from GitHub

## Performance Considerations

### Cold Starts

**Vercel**
- Serverless functions have cold starts
- Typically 100-500ms

**Render (Free Tier)**
- Service sleeps after 15 min inactivity
- Wake time: 30-60 seconds
- Upgrade to paid tier eliminates this

### Scaling

**Vercel**
- Automatic scaling
- Per-request billing

**Render**
- Manual scaling (upgrade plan)
- Fixed monthly cost

## Cost Comparison

### Free Tier

**Vercel**
- ✅ Generous bandwidth
- ✅ No sleep time
- ✅ Automatic HTTPS

**Render**
- ✅ 750 hours/month
- ⚠️ Sleeps after 15 min
- ✅ Automatic HTTPS

### Paid Tier

**Vercel Pro**
- $20/month per user
- Unlimited bandwidth

**Render Starter**
- $7/month per service
- Always-on
- Great for single apps

## When to Use Each

### Use Vercel When:
- Building JAMstack apps
- Need edge functions
- Want automatic scaling
- Have multiple small projects

### Use Render When:
- Need traditional server
- Want predictable pricing
- Building full-stack apps
- Need background workers
- Want database integration

## Migration Summary

The BioMed Research Suite has been successfully converted from:
- ✅ Serverless (Vercel) → Traditional Server (Render)
- ✅ All API endpoints preserved
- ✅ Frontend interface unchanged
- ✅ Same functionality
- ✅ Ready for deployment

No changes needed to your API calls or frontend code!
