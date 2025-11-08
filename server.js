// server.js - Main server for BioMed Research Suite on Render
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Enable CORS for all origins
app.use(cors());
app.use(express.json());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// ============================================================================
// DATA MODELS
// ============================================================================

const PROTEIN_DATABASE = {
  '1HVH': {
    pdb_id: '1HVH',
    name: 'HIV-1 Protease',
    organism: 'HIV-1',
    resolution: 1.8,
    binding_site_volume: 450,
    flexibility_score: 0.6,
    druggability: 0.85
  },
  '2OXY': {
    pdb_id: '2OXY',
    name: 'Cyclooxygenase-2',
    organism: 'Human',
    resolution: 2.1,
    binding_site_volume: 520,
    flexibility_score: 0.4,
    druggability: 0.92
  },
  '6LU7': {
    pdb_id: '6LU7',
    name: 'SARS-CoV-2 Main Protease',
    organism: 'SARS-CoV-2',
    resolution: 2.16,
    binding_site_volume: 480,
    flexibility_score: 0.5,
    druggability: 0.88
  },
  '5R81': {
    pdb_id: '5R81',
    name: 'EGFR Kinase',
    organism: 'Human',
    resolution: 1.9,
    binding_site_volume: 510,
    flexibility_score: 0.7,
    druggability: 0.90
  }
};

const LIGAND_DATABASE = {
  'aspirin': {
    name: 'Aspirin',
    smiles: 'CC(=O)OC1=CC=CC=C1C(=O)O',
    molecular_weight: 180.16,
    logP: 1.2,
    hbd: 1,
    hba: 4,
    rotatable_bonds: 3
  },
  'ibuprofen': {
    name: 'Ibuprofen',
    smiles: 'CC(C)CC1=CC=C(C=C1)C(C)C(=O)O',
    molecular_weight: 206.28,
    logP: 3.5,
    hbd: 1,
    hba: 2,
    rotatable_bonds: 4
  },
  'remdesivir': {
    name: 'Remdesivir',
    smiles: 'CCC(CC)COC(=O)C(C)NP(=O)(OCC1C(C(C(O1)C#N)O)O)OC',
    molecular_weight: 602.6,
    logP: 1.9,
    hbd: 4,
    hba: 13,
    rotatable_bonds: 14
  }
};

const CELL_LINE_DATABASE = {
  'HeLa': {
    name: 'HeLa',
    type: 'Cancer',
    origin: 'Cervical cancer',
    doubling_time: 24,
    drug_sensitivity: { 'taxol': 8.5, 'cisplatin': 12.3 }
  },
  'MCF-7': {
    name: 'MCF-7',
    type: 'Cancer',
    origin: 'Breast adenocarcinoma',
    doubling_time: 29,
    drug_sensitivity: { 'taxol': 5.2, 'tamoxifen': 6.8 }
  },
  'A549': {
    name: 'A549',
    type: 'Cancer',
    origin: 'Lung carcinoma',
    doubling_time: 22,
    drug_sensitivity: { 'cisplatin': 10.5, 'paclitaxel': 7.8 }
  },
  'HEK293': {
    name: 'HEK293',
    type: 'Normal',
    origin: 'Embryonic kidney',
    doubling_time: 20,
    drug_sensitivity: { 'cisplatin': 25.0, 'taxol': 20.0 }
  }
};

// ============================================================================
// API ROUTES
// ============================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '3.0',
    platform: 'Node.js',
    deployment: 'Render',
    timestamp: new Date().toISOString()
  });
});

// Get proteins
app.get('/api/docking/proteins', (req, res) => {
  res.json(PROTEIN_DATABASE);
});

// Get ligands
app.get('/api/docking/ligands', (req, res) => {
  res.json(LIGAND_DATABASE);
});

// Run docking simulation
app.post('/api/docking/run', (req, res) => {
  const { proteinId, ligandId, numModes = 9 } = req.body;
  
  const protein = PROTEIN_DATABASE[proteinId];
  const ligand = LIGAND_DATABASE[ligandId];
  
  if (!protein || !ligand) {
    return res.status(400).json({
      success: false,
      error: 'Invalid protein or ligand ID'
    });
  }
  
  // Simulate docking results
  const modes = [];
  for (let i = 0; i < numModes; i++) {
    modes.push({
      mode: i + 1,
      affinity: -5 - Math.random() * 10,
      rmsd_lb: Math.random() * 2,
      rmsd_ub: Math.random() * 3 + 2
    });
  }
  
  modes.sort((a, b) => a.affinity - b.affinity);
  
  res.json({
    success: true,
    data: {
      protein,
      ligand,
      modes,
      best_affinity: modes[0].affinity
    }
  });
});

// Get cell lines
app.get('/api/cells/cell-lines', (req, res) => {
  res.json(CELL_LINE_DATABASE);
});

// Run cell simulation
app.post('/api/cells/simulate', (req, res) => {
  const { cellLineName, experimentParams } = req.body;
  
  const cellLine = CELL_LINE_DATABASE[cellLineName];
  
  if (!cellLine) {
    return res.status(400).json({
      success: false,
      error: 'Invalid cell line'
    });
  }
  
  const { initialCells = 50, duration = 72, timeInterval = 0.5 } = experimentParams || {};
  const results = [];
  
  let currentCells = initialCells;
  const growthRate = Math.log(2) / cellLine.doubling_time;
  
  for (let time = 0; time <= duration; time += timeInterval) {
    currentCells *= (1 + growthRate * timeInterval);
    results.push({
      time,
      total: Math.round(currentCells),
      viable: Math.round(currentCells * 0.95),
      viability: 95
    });
  }
  
  res.json({
    success: true,
    data: results
  });
});

// Predict drug efficacy
app.post('/api/predict/drug-efficacy', (req, res) => {
  const { cellLineName, drugClass, concentration } = req.body;
  
  const cellLine = CELL_LINE_DATABASE[cellLineName];
  
  if (!cellLine) {
    return res.status(400).json({
      success: false,
      error: 'Invalid cell line'
    });
  }
  
  const ic50 = cellLine.drug_sensitivity[drugClass] || 10;
  const efficacy = 100 * Math.pow(concentration, 1.5) /
                    (Math.pow(ic50, 1.5) + Math.pow(concentration, 1.5));
  
  res.json({
    ic50,
    predicted_efficacy: efficacy,
    predicted_viability: 100 - efficacy
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: 'Please check the API documentation',
    available_endpoints: ['/api/health', '/api/docking/proteins', '/api/docking/ligands']
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 BioMed Research Suite running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api/health`);
});
