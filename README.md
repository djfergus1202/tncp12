# 🚀 BioMed Research Suite - Render Deployment

## Quick Deploy to Render

### Prerequisites
- GitHub account
- Render account (sign up at https://render.com)

### Deployment Steps

#### Option 1: Deploy from GitHub (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit for Render deployment"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/biomed-research-suite.git
   git push -u origin main
   ```

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: biomed-research-suite
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free (or your choice)
   - Click "Create Web Service"

3. **Access Your App**
   - Your app will be available at: `https://biomed-research-suite.onrender.com`
   - Wait 2-3 minutes for initial deployment

#### Option 2: Deploy with Render CLI

```bash
# Install Render CLI
npm install -g render-cli

# Login to Render
render login

# Deploy
render deploy
```

## Project Structure

```
biomed-research-suite/
├── server.js           # Main Express server
├── package.json        # Dependencies and scripts
├── public/
│   └── index.html      # Frontend interface
├── .gitignore          # Git ignore file
└── README.md           # This file
```

## API Endpoints

Once deployed, your API will be available at:

- `GET /api/health` - Health check
- `GET /api/docking/proteins` - Get available proteins
- `GET /api/docking/ligands` - Get available ligands
- `POST /api/docking/run` - Run molecular docking simulation
- `GET /api/cells/cell-lines` - Get available cell lines
- `POST /api/cells/simulate` - Run cell growth simulation
- `POST /api/predict/drug-efficacy` - Predict drug efficacy

## Example API Usage

### Health Check
```bash
curl https://your-app.onrender.com/api/health
```

### Get Proteins
```bash
curl https://your-app.onrender.com/api/docking/proteins
```

### Run Docking Simulation
```bash
curl -X POST https://your-app.onrender.com/api/docking/run \
  -H "Content-Type: application/json" \
  -d '{
    "proteinId": "6LU7",
    "ligandId": "remdesivir",
    "numModes": 3
  }'
```

### Run Cell Simulation
```bash
curl -X POST https://your-app.onrender.com/api/cells/simulate \
  -H "Content-Type: application/json" \
  -d '{
    "cellLineName": "HeLa",
    "experimentParams": {
      "initialCells": 50,
      "duration": 24,
      "timeInterval": 1
    }
  }'
```

## Local Development

```bash
# Install dependencies
npm install

# Start server
npm start

# Server runs on http://localhost:10000
```

## Environment Variables

No environment variables required for basic deployment. The app uses:
- `PORT` - Automatically provided by Render (default: 10000)

## Testing Your Deployment

1. Visit your deployed URL (e.g., https://your-app.onrender.com)
2. You'll see the BioMed Research Suite interface
3. Click the test buttons to verify all endpoints work

## Troubleshooting

### Service Won't Start
- Check Render logs in the dashboard
- Verify `package.json` has correct start script
- Ensure Node version is 18.x

### CORS Issues
- CORS is enabled for all origins by default
- Check the `cors()` middleware in `server.js`

### API Returns 404
- Verify routes in `server.js`
- Check that server is listening on `0.0.0.0`
- Ensure PORT environment variable is used

### Free Tier Limitations
- Render free tier services spin down after 15 minutes of inactivity
- First request after spin-down takes 30-60 seconds
- Upgrade to paid plan for always-on service

## Monitoring

View logs in real-time:
1. Go to Render Dashboard
2. Select your service
3. Click "Logs" tab

## Upgrading

To upgrade from free tier:
1. Go to your service settings
2. Click "Plan"
3. Select a paid plan (Starter $7/month recommended)

## Features

✅ Molecular docking simulation  
✅ Cell growth modeling  
✅ Drug efficacy prediction  
✅ RESTful API endpoints  
✅ Interactive web interface  
✅ CORS enabled  
✅ Production-ready  

## Support

For issues with:
- **Render deployment**: Check [Render Docs](https://render.com/docs)
- **API functionality**: Review server.js endpoints
- **Frontend issues**: Check public/index.html

## License

MIT License - Feel free to use for research and educational purposes.

---

**Note**: This is a simplified research suite for educational purposes. For production use with real molecular docking, integrate actual computational chemistry tools like AutoDock Vina or RDKit.
