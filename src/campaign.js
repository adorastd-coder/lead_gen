const readline = require('readline');
const fs = require('fs');
const BusinessScraper = require('./scraper');
const MarketingAutomation = require('./marketing');
const MarketingAI = require('./marketingAI');
const LeadIntelligence = require('./leadIntelligence');
const FileUtils = require('./fileUtils');
const { getProfile, isConfigured } = require('./businessProfile');

class CampaignBuilder {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.campaign = {};
        this.userPrefs = this.loadUserPreferences();
        this.profile = getProfile();
    }

    loadUserPreferences() {
        try {
            if (fs.existsSync('user-preferences.json')) {
                return JSON.parse(fs.readFileSync('user-preferences.json', 'utf8'));
            }
        } catch (error) {
            console.log('⚠️  Could not load user preferences. Run: npm run setup first.');
        }
        return null;
    }

    async start() {
        console.log('🎯 Campaign Builder - Let\'s Create Your Lead Generation Campaign!\n');
        
        if (!this.userPrefs) {
            console.log('❌ Setup required. Please run: npm run setup');
            this.rl.close();
            return;
        }

        await this.selectCampaignType();
        await this.configureTarget();
        await this.configureCampaignDetails();
        await this.selectContentStrategy();
        await this.reviewCampaign();
        await this.executeCampaign();
        
        this.rl.close();
    }

    async selectCampaignType() {
        console.log('📋 Step 1: Campaign Type');
        console.log('─'.repeat(50));
        console.log('What type of campaign do you want to create?');
       console.log('1. 🎯 Lead Generation (find new prospects)');
console.log('2. 🔍 Market Research (analyze competitors)');
console.log('3. 📊 Competitor Analysis (study market)');
console.log('4. 🔄 Follow-up Campaign (existing leads)');
        
        const choice = await this.question('\nSelect campaign type (1-4): ');
        
        const types = {
            '1': 'lead_generation',
            '2': 'market_research',
            '3': 'competitor_analysis',
            '4': 'followup'
        };
        
        this.campaign.type = types[choice] || 'lead_generation';
        console.log(`✅ Campaign type: ${this.campaign.type.replace('_', ' ')}\n`);
    }

    async configureTarget() {
        console.log('🎯 Step 2: Target Configuration');
        console.log('─'.repeat(50));
        
        // Use industry from setup or ask
        if (this.userPrefs.industry && this.userPrefs.industry !== 'custom') {
            this.campaign.industry = this.userPrefs.industry;
            console.log(`🏢 Using your configured industry: ${this.campaign.industry}`);
        } else {
            console.log('Select target industry:');
            console.log('1. 🦷 Dentist / General Dental');
console.log('2. 😁 Orthodontist');
console.log('3. ✨ Cosmetic Dentist');
console.log('4. 🦷 Dental Implant Clinic');
console.log('5. 👶 Pediatric Dentist');
console.log('6. 🚨 Emergency Dentist');
console.log('7. 🎓 Private School / Education');
            
            const choice = await this.question('\nSelect industry (1-7): ');
            const industries = {
                '1': 'dentist', '2': 'orthodontist', '3': 'cosmetic dentist',
                    '4': 'dental implants', '5': 'pediatric dentist',
                        '6': 'emergency dentist', '7': 'private school'
            };
            this.campaign.industry = industries[choice] || 'professional';
        }

        // Location targeting
        const defaultLoc = this.profile.preferences.defaultLocation || 'New York, USA';
        this.campaign.location = await this.question(`🗺️  Target location (e.g., ${defaultLoc}): `) || defaultLoc;
        
        // Search query
        const defaultQueries = {
            'dentist': `dentist near ${this.campaign.location}`,
    'orthodontist': `orthodontist near ${this.campaign.location}`,
    'cosmetic dentist': `cosmetic dentist near ${this.campaign.location}`,
    'dental implants': `dental implants clinic near ${this.campaign.location}`,
    'pediatric dentist': `pediatric dentist near ${this.campaign.location}`,
    'emergency dentist': `emergency dentist near ${this.campaign.location}`,
    'private school': `private school near ${this.campaign.location}`
        };
        
        const defaultQuery = defaultQueries[this.campaign.industry];
        this.campaign.searchQuery = await this.question(`🔍 Search query [${defaultQuery}]: `) || defaultQuery;
        
        // Number of leads
        const maxLeads = await this.question('📊 Number of leads to generate [20]: ') || '20';
        this.campaign.maxResults = parseInt(maxLeads) || 20;
        
        console.log('\n✅ Target configuration complete!\n');
    }

    async configureCampaignDetails() {
        console.log('⚙️  Step 3: Campaign Details');
        console.log('─'.repeat(50));
        
        this.campaign.name = await this.question('📝 Campaign name: ') || 
            `${this.campaign.industry}_${this.campaign.location}_${new Date().toISOString().split('T')[0]}`;
        
        console.log('\nWhat\'s your main goal for this campaign?');
        console.log('1. 💰 Generate new sales leads');
        console.log('2. 🤝 Build business partnerships');
        console.log('3. 📈 Market expansion');
        console.log('4. 🔄 Customer re-engagement');
        
        const goalChoice = await this.question('\nSelect goal (1-4): ');
        const goals = {
            '1': 'sales_leads',
            '2': 'partnerships', 
            '3': 'market_expansion',
            '4': 'reengagement'
        };
        this.campaign.goal = goals[goalChoice] || 'sales_leads';
        
        console.log(`✅ Campaign goal: ${this.campaign.goal.replace('_', ' ')}\n`);
    }

    async selectContentStrategy() {
        console.log('✍️  Step 4: Content Strategy');
        console.log('─'.repeat(50));
        
        const defaultService = this.profile.business.description || '';
        this.campaign.yourService = await this.question(`💼 Describe your service/product briefly${defaultService ? ` [${defaultService.substring(0, 60)}...]` : ''}: `) || defaultService;
        
        console.log('\nContent approach:');
        console.log('1. 🤝 Conservative (respectful, slow build)');
        console.log('2. ⚖️  Balanced (standard business approach)');
        console.log('3. 🚀 Aggressive (direct, urgent)');
        
        const styleChoice = await this.question('\nSelect approach (1-3): ');
        const styles = {
            '1': 'conservative',
            '2': 'balanced',
            '3': 'aggressive'
        };
        this.campaign.contentStyle = styles[styleChoice] || this.userPrefs.campaignStyle || 'balanced';
        
        console.log('\nTemplate types to generate:');
        console.log('1. 📧 Email only');
        console.log('2. 📱 WhatsApp only');
        console.log('3. 📧📱 Both email and WhatsApp');
        
        const templateChoice = await this.question('\nSelect templates (1-3): ');
        const templates = {
            '1': ['email'],
            '2': ['whatsapp'],
            '3': ['email', 'whatsapp']
        };
        this.campaign.templateTypes = templates[templateChoice] || ['email', 'whatsapp'];
        
        console.log('\n✅ Content strategy configured!\n');
    }

    async reviewCampaign() {
        console.log('👀 Step 5: Campaign Review');
        console.log('─'.repeat(50));
        console.log('Campaign Summary:');
        console.log(`📝 Name: ${this.campaign.name}`);
        console.log(`🎯 Type: ${this.campaign.type.replace('_', ' ')}`);
        console.log(`🏢 Industry: ${this.campaign.industry}`);
        console.log(`🗺️  Location: ${this.campaign.location}`);
        console.log(`🔍 Query: "${this.campaign.searchQuery}"`);
        console.log(`📊 Leads: ${this.campaign.maxResults}`);
        console.log(`💼 Service: ${this.campaign.yourService}`);
        console.log(`🎨 Style: ${this.campaign.contentStyle}`);
        console.log(`📋 Templates: ${this.campaign.templateTypes.join(', ')}`);
        
        const proceed = await this.question('\n🚀 Start campaign? (y/n): ');
        
        if (proceed.toLowerCase() !== 'y' && proceed.toLowerCase() !== 'yes') {
            console.log('❌ Campaign cancelled.');
            return false;
        }
        
        return true;
    }

    async executeCampaign() {
        console.log('\n🚀 Executing Enhanced Campaign...');
        console.log('═'.repeat(60));
        
        const scraper = new BusinessScraper();
        const marketing = new MarketingAutomation();
        const marketingAI = new MarketingAI();
        const intelligence = new LeadIntelligence();
        
        try {
            // Phase 1: Lead Discovery
            console.log('\n📊 Phase 1: Lead Discovery');
            console.log('─'.repeat(40));
            
            const rawLeads = await this.executeWithProgress(
                () => scraper.scrapeGoogleMaps(this.campaign.searchQuery, this.campaign.maxResults),
                'Discovering leads',
                this.campaign.maxResults
            );
            
            if (!rawLeads || rawLeads.length === 0) {
                console.log('❌ No leads found. Try adjusting your search query.');
                return;
            }
            
            console.log(`✅ Found ${rawLeads.length} raw leads!`);
            
            // Phase 2: Lead Intelligence & Scoring
            console.log('\n� Phase 2: Lead Intelligence Analysis');
            console.log('─'.repeat(40));
            
            const scoredLeads = await this.executeWithProgress(
                () => intelligence.scoreLeads(rawLeads, this.campaign.industry),
                'Analyzing lead quality',
                rawLeads.length
            );
            
            // Filter high-quality leads for personalized content
            const highQualityLeads = intelligence.filterLeadsByScore(scoredLeads, 65);
            const priorityLeads = intelligence.getLeadsByPriority(scoredLeads, 'HIGH');
            
            console.log(`✅ Analyzed ${scoredLeads.length} leads`);
            console.log(`🎯 ${highQualityLeads.length} high-quality prospects identified`);
            console.log(`⭐ ${priorityLeads.length} priority leads for immediate action`);
            
            // Phase 3: Enhanced AI Content Generation
            console.log('\n🤖 Phase 3: Enhanced AI Content Generation');
            console.log('─'.repeat(40));
            
            const contentResults = await this.executeWithProgress(
                () => this.generateEnhancedContent(marketingAI, scoredLeads),
                'Generating industry-specific content',
                scoredLeads.length
            );
            
            // Phase 4: Export Enhanced Results
            console.log('\n💾 Phase 4: Saving Enhanced Results');
            console.log('─'.repeat(40));
            
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const outputDir = `output/campaign_${this.campaign.name}_${timestamp}`;
            
            if (!fs.existsSync('output')) {
                fs.mkdirSync('output');
            }
            if (!fs.existsSync(outputDir)) {
                fs.mkdirSync(outputDir, { recursive: true });
            }
            
            // Save leads with intelligence data
            await FileUtils.saveLeads(scoredLeads, `${outputDir}/leads_with_intelligence.csv`);
            await FileUtils.saveLeads(scoredLeads, `${outputDir}/leads_with_intelligence.json`);
            
            // Save high-priority leads separately
            await FileUtils.saveLeads(priorityLeads, `${outputDir}/priority_leads.csv`);
            
            // Save enhanced marketing content
            await this.saveEnhancedContent(contentResults, outputDir);
            
            // Save intelligence report
            intelligence.exportIntelligenceReport(scoredLeads, `${outputDir}/intelligence_report`);
            
            // Save comprehensive campaign info
            const campaignInfo = {
                ...this.campaign,
                executedAt: new Date().toISOString(),
                results: {
                    totalLeads: scoredLeads.length,
                    highQualityLeads: highQualityLeads.length,
                    priorityLeads: priorityLeads.length,
                    averageScore: Math.round(scoredLeads.reduce((sum, lead) => sum + lead.intelligence.score, 0) / scoredLeads.length),
                    contentGenerated: contentResults.generated,
                    enhancedAI: true
                },
                outputPath: outputDir
            };
            fs.writeFileSync(`${outputDir}/campaign_info.json`, JSON.stringify(campaignInfo, null, 2));
            
            // Show success summary
            this.showCampaignSuccess(campaignInfo, outputDir);
            
        } catch (error) {
            console.error('\n❌ Campaign failed:', error.message);
            console.error(error.stack);
        } finally {
            await scraper.close();
        }
    }
    
    async generateEnhancedContent(marketingAI, scoredLeads) {
        const highPriorityLeads = scoredLeads.filter(lead => lead.intelligence.priority === 'HIGH');
        const mediumPriorityLeads = scoredLeads.filter(lead => lead.intelligence.priority === 'MEDIUM');
        
        let generated = 0;
        const results = {
            highPriority: [],
            medium: [],
            generated: 0
        };
        
        // Generate premium content for high-priority leads
        for (const lead of highPriorityLeads) {
            try {
                const content = await marketingAI.generateIndustrySpecificContent(
                    lead, 
                    this.campaign.industry, 
                    this.campaign.yourService,
                    'balanced'
                );
                
                if (content) {
                    results.highPriority.push({
                        lead: lead,
                        content: content
                    });
                    generated++;
                }
            } catch (error) {
                console.log(`⚠️ Failed to generate content for ${lead.name}: ${error.message}`);
            }
        }
        
        // Generate standard content for medium-priority leads
for (const lead of mediumPriorityLeads.slice(0, 20)) { // Groq is free-tier friendly
    try {
                const content = await marketingAI.generateIndustrySpecificContent(
                    lead, 
                    this.campaign.industry, 
                    this.campaign.yourService,
                    this.campaign.contentStyle
                );
                
                if (content) {
                    results.medium.push({
                        lead: lead,
                        content: content
                    });
                    generated++;
                }
            } catch (error) {
                console.log(`⚠️ Failed to generate content for ${lead.name}: ${error.message}`);
            }
        }
        
        results.generated = generated;
        return results;
    }
    
    async saveEnhancedContent(contentResults, outputDir) {
        // Save high-priority personalized content
        if (contentResults.highPriority.length > 0) {
            let emailContent = '# HIGH PRIORITY LEADS - PERSONALIZED EMAIL TEMPLATES\n\n';
            let whatsappContent = '# HIGH PRIORITY LEADS - PERSONALIZED WHATSAPP TEMPLATES\n\n';
            
            contentResults.highPriority.forEach((item, index) => {
                emailContent += `## ${index + 1}. ${item.lead.name}\n`;
                emailContent += `Score: ${item.lead.intelligence.score} | Category: ${item.lead.intelligence.category}\n`;
                emailContent += `Phone: ${item.lead.phone}\n`;
                emailContent += `Address: ${item.lead.address}\n\n`;
                emailContent += item.content.email + '\n\n';
                emailContent += '─'.repeat(80) + '\n\n';
                
                whatsappContent += `## ${index + 1}. ${item.lead.name}\n`;
                whatsappContent += `Score: ${item.lead.intelligence.score} | Phone: ${item.lead.phone}\n\n`;
                whatsappContent += item.content.whatsapp + '\n\n';
                whatsappContent += '─'.repeat(80) + '\n\n';
            });
            
            fs.writeFileSync(`${outputDir}/priority_email_templates.txt`, emailContent);
            fs.writeFileSync(`${outputDir}/priority_whatsapp_templates.txt`, whatsappContent);
        }
        
        // Save medium-priority content
        if (contentResults.medium.length > 0) {
            let emailContent = '# MEDIUM PRIORITY LEADS - PERSONALIZED EMAIL TEMPLATES\n\n';
            let whatsappContent = '# MEDIUM PRIORITY LEADS - PERSONALIZED WHATSAPP TEMPLATES\n\n';
            
            contentResults.medium.forEach((item, index) => {
                emailContent += `## ${index + 1}. ${item.lead.name}\n`;
                emailContent += `Score: ${item.lead.intelligence.score} | Phone: ${item.lead.phone}\n\n`;
                emailContent += item.content.email + '\n\n';
                emailContent += '─'.repeat(80) + '\n\n';
                
                whatsappContent += `## ${index + 1}. ${item.lead.name}\n`;
                whatsappContent += `Score: ${item.lead.intelligence.score} | Phone: ${item.lead.phone}\n\n`;
                whatsappContent += item.content.whatsapp + '\n\n';
                whatsappContent += '─'.repeat(80) + '\n\n';
            });
            
            fs.writeFileSync(`${outputDir}/medium_email_templates.txt`, emailContent);
            fs.writeFileSync(`${outputDir}/medium_whatsapp_templates.txt`, whatsappContent);
        }
    }
    
    showCampaignSuccess(campaignInfo, outputDir) {
        console.log('\n🎉 Enhanced Campaign Complete!');
        console.log('═'.repeat(60));
        console.log(`📊 Total Leads: ${campaignInfo.results.totalLeads}`);
        console.log(`⭐ Priority Leads: ${campaignInfo.results.priorityLeads}`);
        console.log(`🎯 High Quality: ${campaignInfo.results.highQualityLeads}`);
        console.log(`📈 Average Score: ${campaignInfo.results.averageScore}/100`);
        console.log(`🤖 AI Content Generated: ${campaignInfo.results.contentGenerated} personalized templates`);
        console.log(`\n📁 Results Location: ${outputDir}`);
        console.log('\n📄 Generated Files:');
        console.log('├── leads_with_intelligence.csv (all leads with scores)');
        console.log('├── priority_leads.csv (high-priority prospects)');
        console.log('├── priority_email_templates.txt (personalized emails)');
        console.log('├── priority_whatsapp_templates.txt (personalized WhatsApp)');
        console.log('├── intelligence_report.json (detailed analysis)');
        console.log('└── campaign_info.json (campaign summary)');
        
        console.log('\n💡 Next Steps:');
        console.log('1. 🎯 Start with priority leads for immediate outreach');
        console.log('2. 📧 Use personalized templates for better response rates');
        console.log('3. 📊 Track results and optimize based on intelligence data');
        console.log('4. 🔄 Run follow-up campaigns for medium-priority leads\n');
    }

    async executeWithProgress(taskFunction, taskName, totalItems) {
        let progress = 0;
        const progressInterval = setInterval(() => {
            if (progress < 90) {
                progress += Math.random() * 20;
                this.showProgress(taskName, Math.min(progress, 90));
            }
        }, 1000);

        try {
            const result = await taskFunction();
            clearInterval(progressInterval);
            this.showProgress(taskName, 100);
            console.log(''); // New line
            return result;
        } catch (error) {
            clearInterval(progressInterval);
            console.log(''); // New line
            throw error;
        }
    }

    getIndustrySpecificCTA() {
    const ctas = {
        'dentist': "Get more patient bookings with Google Ads and local SEO built for dental clinics",
        'orthodontist': "Fill your consultation calendar with targeted Meta Ads for orthodontic practices",
        'cosmetic dentist': "Attract high-value cosmetic patients with a premium website and Google Ads",
        'dental implants': "Generate qualified implant leads with paid ads starting at $400/month",
        'pediatric dentist': "Reach local parents actively searching for pediatric dental care",
        'emergency dentist': "Dominate emergency dental searches with Google Ads and local SEO",
        'private school': "Increase enrollment inquiries with targeted digital marketing for schools"
    };

   return ctas[this.campaign.industry] || "Grow your business with integrated digital solutions";
}

    showProgress(task, percentage) {
        const width = 30;
        const filled = Math.round(width * percentage / 100);
        const empty = width - filled;
        const bar = '█'.repeat(filled) + '░'.repeat(empty);
        
        process.stdout.write(`\r${task}: ${bar} ${Math.round(percentage)}%`);
    }

    question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve);
        });
    }
}

// Export for use in package.json scripts
if (require.main === module) {
    const builder = new CampaignBuilder();
    builder.start().catch(console.error);
}

module.exports = CampaignBuilder;
