#!/usr/bin/env node

/**
 * Data Ingestion Script for Stacking Analytics
 * 
 * This script helps ingest new stacking data and update the JSON files.
 * Run: node scripts/ingest-data.js [options]
 */

const fs = require('fs');
const path = require('path');

class DataIngestor {
  constructor() {
    this.dataDir = path.join(__dirname, '..', 'public', 'data');
  }

  async ingestCycleData(cycleNumber, data) {
    console.log(`Ingesting data for cycle ${cycleNumber}...`);
    
    const cyclesPath = path.join(this.dataDir, 'cycles.json');
    const cyclesData = JSON.parse(fs.readFileSync(cyclesPath, 'utf8'));
    
    // Add new cycle data
    const newCycle = {
      cycleNumber,
      startDate: data.startDate,
      endDate: data.endDate,
      totalStacked: data.totalStacked,
      totalRewards: data.totalRewards,
      activeStackers: data.activeStackers,
      btcReceived: data.btcReceived,
      yieldRate: data.yieldRate,
      status: data.status || 'completed',
      poolMembers: data.poolMembers,
      averageStackAmount: Math.round(data.totalStacked / data.activeStackers)
    };
    
    // Insert at the beginning (most recent first)
    cyclesData.cycles.unshift(newCycle);
    cyclesData.lastUpdated = new Date().toISOString();
    
    fs.writeFileSync(cyclesPath, JSON.stringify(cyclesData, null, 2));
    console.log(`✅ Cycle ${cycleNumber} data added to cycles.json`);
    
    // Update overview data
    await this.updateOverview();
    
    // Update rewards data if this cycle is completed
    if (data.status === 'completed' && data.btcReceived) {
      await this.ingestRewardData(cycleNumber, {
        distributionDate: data.endDate,
        btcReceived: data.btcReceived,
        stxDistributed: data.totalRewards,
        participants: data.activeStackers,
        yieldRate: data.yieldRate,
        transactionId: data.transactionId || '',
        status: 'completed'
      });
    }
  }

  async ingestRewardData(cycleNumber, data) {
    console.log(`Ingesting reward data for cycle ${cycleNumber}...`);
    
    const rewardsPath = path.join(this.dataDir, 'rewards.json');
    const rewardsData = JSON.parse(fs.readFileSync(rewardsPath, 'utf8'));
    
    const newDistribution = {
      cycleNumber,
      ...data
    };
    
    // Insert at the beginning (most recent first)
    rewardsData.recentDistributions.unshift(newDistribution);
    
    // Update summary
    rewardsData.summary.totalBtcReceived += data.btcReceived;
    rewardsData.summary.totalStxDistributed += data.stxDistributed;
    rewardsData.summary.distributionEvents += 1;
    rewardsData.summary.averageYield = this.calculateAverageYield(rewardsData.recentDistributions);
    
    rewardsData.lastUpdated = new Date().toISOString();
    
    fs.writeFileSync(rewardsPath, JSON.stringify(rewardsData, null, 2));
    console.log(`✅ Reward data for cycle ${cycleNumber} added to rewards.json`);
  }

  async updateOverview() {
    console.log('Updating overview data...');
    
    const overviewPath = path.join(this.dataDir, 'overview.json');
    const cyclesPath = path.join(this.dataDir, 'cycles.json');
    const rewardsPath = path.join(this.dataDir, 'rewards.json');
    
    const cyclesData = JSON.parse(fs.readFileSync(cyclesPath, 'utf8'));
    const rewardsData = JSON.parse(fs.readFileSync(rewardsPath, 'utf8'));
    const overviewData = JSON.parse(fs.readFileSync(overviewPath, 'utf8'));
    
    const currentCycle = cyclesData.cycles[0];
    const previousCycle = cyclesData.cycles[1];
    
    // Update summary with latest data
    overviewData.summary = {
      totalStacked: currentCycle.totalStacked,
      totalRewards: currentCycle.totalRewards,
      activeStackers: currentCycle.activeStackers,
      averageYield: currentCycle.yieldRate,
      totalDistributed: rewardsData.summary.totalStxDistributed
    };
    
    // Calculate trends
    if (previousCycle) {
      overviewData.trends = {
        stackedGrowth: ((currentCycle.totalStacked - previousCycle.totalStacked) / previousCycle.totalStacked * 100),
        stackersGrowth: ((currentCycle.activeStackers - previousCycle.activeStackers) / previousCycle.activeStackers * 100),
        rewardsGrowth: ((currentCycle.totalRewards - previousCycle.totalRewards) / previousCycle.totalRewards * 100)
      };
    }
    
    // Update recent cycles (take first 3)
    overviewData.recentCycles = cyclesData.cycles.slice(0, 3);
    overviewData.currentCycle = currentCycle.cycleNumber;
    overviewData.lastUpdated = new Date().toISOString();
    
    fs.writeFileSync(overviewPath, JSON.stringify(overviewData, null, 2));
    console.log('✅ Overview data updated');
  }

  calculateAverageYield(distributions) {
    if (distributions.length === 0) return 0;
    const sum = distributions.reduce((acc, dist) => acc + dist.yieldRate, 0);
    return Number((sum / distributions.length).toFixed(2));
  }

  async ingestFromCsv(csvFilePath) {
    console.log(`Ingesting data from CSV: ${csvFilePath}`);
    // CSV parsing logic would go here
    // This is a placeholder for more complex data ingestion
  }
}

// CLI interface
if (require.main === module) {
  const ingestor = new DataIngestor();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'cycle':
      const cycleNumber = parseInt(process.argv[3]);
      const cycleDataJson = process.argv[4];
      
      if (!cycleNumber || !cycleDataJson) {
        console.error('Usage: node ingest-data.js cycle <cycleNumber> <jsonData>');
        process.exit(1);
      }
      
      try {
        const cycleData = JSON.parse(cycleDataJson);
        ingestor.ingestCycleData(cycleNumber, cycleData);
      } catch (error) {
        console.error('Error parsing cycle data:', error);
        process.exit(1);
      }
      break;
      
    case 'update-overview':
      ingestor.updateOverview();
      break;
      
    default:
      console.log(`
Data Ingestion Script for Stacking Analytics

Usage:
  node scripts/ingest-data.js cycle <cycleNumber> '<jsonData>'
  node scripts/ingest-data.js update-overview

Examples:
  node scripts/ingest-data.js cycle 86 '{"startDate":"2024-07-16T00:00:00Z","endDate":"2024-07-30T00:00:00Z","totalStacked":126000000,"totalRewards":2550000,"activeStackers":1260,"btcReceived":43.2,"yieldRate":2.2,"status":"current","poolMembers":1260}'
  
  node scripts/ingest-data.js update-overview
      `);
  }
}

module.exports = DataIngestor;