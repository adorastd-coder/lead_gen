require('dotenv').config();
const { getClient, getModel } = require('./openaiClient');
const { getBusinessInfoForPrompt, getProfile } = require('./businessProfile');

class MarketingAI {
    constructor() {
        this.openai = getClient();
        this.industryTemplates = this.loadIndustryTemplates();
        this.englishContext = this.loadEnglishContext();
        this.marketData = this.loadRealMarketData();
    }

    loadIndustryTemplates() {
        return {
            'dentist': {
                industry: 'dentist',
                painPoints: [
                    "73% of new patients search Google before booking — clinics without SEO lose them",
                    "Average dental practice spends $200-400/month on ads with no tracking",
                    "No-show rate averages 23% without automated appointment reminders",
                    "Practices without a modern website lose 67% of potential patients",
                    "Most clinics rely on word-of-mouth, limiting growth to 5-10% annually"
                ],
                solutions: [
                    "Google Ads campaigns targeting 'dentist near me' searches in your city",
                    "Local SEO to rank on Google Maps and page 1 for dental keywords",
                    "High-converting website designed specifically for dental patient booking",
                    "Meta Ads targeting local families and adults aged 25-55",
                    "Full digital marketing package starting at $400/month"
                ],
                benefits: [
                    "20-40 new patient inquiries per month from Google Ads",
                    "Page 1 Google Maps ranking within 90 days",
                    "Website conversion rate of 8-15% vs industry average 2-3%",
                    "Trackable ROI — know exactly which ads generate bookings",
                    "Reduced dependence on referrals for predictable growth"
                ],
                localContext: "Dental services market in USA/Canada/Australia/UK/UAE",
                urgency: "Dental clinics with digital marketing grow 3x faster than those relying on referrals alone",
                caseStudy: "Dental clinic in Houston: 34 new patients in first month with Google Ads + SEO"
            },
            'orthodontist': {
                industry: 'orthodontist',
                painPoints: [
                    "High-value Invisalign and braces patients research extensively online before choosing",
                    "Most orthodontists compete on price rather than value due to weak online presence",
                    "Consultation no-show rate 28% without proper follow-up systems",
                    "Instagram and before/after content underutilized despite high visual appeal",
                    "Competing with corporate dental chains that outspend on digital marketing"
                ],
                solutions: [
                    "Google Ads targeting high-intent searches like 'Invisalign near me'",
                    "Instagram and Meta Ads showcasing before/after transformations",
                    "Landing pages optimized for free consultation bookings",
                    "Local SEO to dominate orthodontist searches in your area",
                    "Retargeting campaigns to convert website visitors into consultations"
                ],
                benefits: [
                    "15-25 qualified consultation requests per month",
                    "Higher case acceptance rate with trust-building content",
                    "Reduced cost-per-lead vs traditional referral marketing",
                    "Dominant Google Maps presence in your city",
                    "Consistent patient pipeline without relying on GP referrals"
                ],
                localContext: "Orthodontic services in USA/Canada/Australia/UK/UAE",
                urgency: "Invisalign searches up 34% YoY — orthodontists not running ads are losing high-value cases",
                caseStudy: "Orthodontic practice in Toronto: 22 new Invisalign consultations in 6 weeks"
            },
            'cosmetic dentist': {
                industry: 'cosmetic dentist',
                painPoints: [
                    "High-value patients (veneers, whitening) research 5-7 websites before deciding",
                    "Generic dental websites don't communicate cosmetic expertise and premium quality",
                    "Social proof and before/after galleries underutilized in marketing",
                    "Competing with med spas and cosmetic surgeons for same high-income patients",
                    "Most cosmetic dentists have no system to follow up with consultation leads"
                ],
                solutions: [
                    "Premium website showcasing cosmetic portfolio and patient transformations",
                    "Google Ads targeting 'veneers', 'teeth whitening', 'smile makeover' searches",
                    "Instagram strategy leveraging before/after content for organic and paid reach",
                    "Meta Ads targeting high-income demographics in your city",
                    "Automated follow-up sequences for consultation inquiries"
                ],
                benefits: [
                    "Attract higher-value cases worth $3,000-$20,000+ per patient",
                    "Premium brand positioning that justifies higher fees",
                    "Consistent flow of cosmetic consultations from digital channels",
                    "Reduced dependence on general dentistry revenue",
                    "Measurable ROI from every marketing dollar spent"
                ],
                localContext: "Cosmetic dentistry market in USA/Canada/Australia/UK/UAE",
                urgency: "Cosmetic dental market growing 8% annually — early digital movers capture market share",
                caseStudy: "Cosmetic dentist in Sydney: 18 veneer consultations in first month of Meta Ads campaign"
            },
            'dental implants': {
                industry: 'dental implants',
                painPoints: [
                    "Implant patients ($3,000-$6,000 cases) research intensively — weak SEO loses them",
                    "Most implant leads come from referrals, limiting volume and predictability",
                    "High competition from corporate DSOs with large marketing budgets",
                    "Patients comparing multiple clinics on price without understanding value differences",
                    "No system to nurture leads who inquire but don't book immediately"
                ],
                solutions: [
                    "Google Ads targeting 'dental implants' and 'teeth replacement' with high intent",
                    "SEO strategy to rank for implant-related searches in your metro area",
                    "Landing pages with financing options and free consultation offers",
                    "Retargeting campaigns for website visitors who didn't convert",
                    "Patient testimonial and before/after content for trust building"
                ],
                benefits: [
                    "10-20 qualified implant inquiries per month from digital channels",
                    "Higher case value patients who understand and accept treatment cost",
                    "Reduced reliance on referral networks for growth",
                    "Competitive advantage over clinics without digital presence",
                    "Clear ROI tracking — every $1 spent tracked to patient revenue"
                ],
                localContext: "Dental implant market in USA/Canada/Australia/UK/UAE",
                urgency: "Dental implant searches grew 45% post-pandemic — high-value patients are actively searching",
                caseStudy: "Implant clinic in Dubai: 12 new implant cases in first 8 weeks with Google Ads"
            },
            'pediatric dentist': {
                industry: 'pediatric dentist',
                painPoints: [
                    "Parents search Google for 'kids dentist near me' — invisible clinics lose families",
                    "Family retention depends on trust; clinics without strong online reviews lose patients",
                    "Back-to-school and holiday seasons are high-opportunity periods often missed",
                    "Most pediatric practices have outdated websites that don't appeal to parents",
                    "No system to generate Google reviews which are critical for parent trust"
                ],
                solutions: [
                    "Local SEO targeting 'pediatric dentist near me' and 'kids dentist [city]'",
                    "Google Ads campaigns timed around back-to-school seasons",
                    "Website redesign focused on parent trust signals and easy booking",
                    "Google review generation system to build social proof",
                    "Facebook/Instagram Ads targeting parents with children in your area"
                ],
                benefits: [
                    "Consistent flow of new family patients from local search",
                    "Strong Google Maps presence with 4.8+ star rating",
                    "Higher patient lifetime value through family retention",
                    "Seasonal campaign spikes during back-to-school periods",
                    "Trusted brand in your local community"
                ],
                localContext: "Pediatric dental market in USA/Canada/Australia/UK/UAE",
                urgency: "78% of parents choose a dentist based on online reviews — without them you're invisible",
                caseStudy: "Pediatric practice in Melbourne: 45 new family registrations in 3 months"
            },
            'emergency dentist': {
                industry: 'emergency dentist',
                painPoints: [
                    "Emergency patients search and call within minutes — not ranking means losing them",
                    "Google Ads for emergency dental have immediate ROI but most clinics don't run them",
                    "After-hours and weekend availability is a massive differentiator not being marketed",
                    "High-urgency patients convert at 3x the rate of regular dental searches",
                    "No Google My Business optimization means missing 70% of emergency searches"
                ],
                solutions: [
                    "Google Ads with emergency keywords running 24/7 including weekends",
                    "Google My Business optimization for 'emergency dentist near me'",
                    "Call tracking to measure exactly how many patients call from ads",
                    "Landing page with immediate call-to-action and phone number prominent",
                    "Local SEO for emergency dental terms in your city"
                ],
                benefits: [
                    "Immediate new patient flow from day one of campaigns",
                    "High conversion rate — emergency patients book same day",
                    "Dominate Google Maps for emergency dental in your area",
                    "Track every call and booking to ad spend",
                    "Fill appointment gaps with high-urgency paying patients"
                ],
                localContext: "Emergency dental market in USA/Canada/Australia/UK/UAE",
                urgency: "Emergency dental searches spike on weekends — every missed call is a lost patient",
                caseStudy: "Emergency dental clinic in London: 60+ emergency calls per month from Google Ads"
            },
            'private school': {
                industry: 'private school',
                painPoints: [
                    "Enrollment decisions made months in advance — late digital outreach misses families",
                    "Parents research 4-6 schools before applying — weak online presence loses candidates",
                    "Most private schools rely on open days and word-of-mouth for enrollment",
                    "No digital strategy to reach families moving into the area",
                    "Competitor schools with better websites and ads attract families first"
                ],
                solutions: [
                    "Google Ads targeting 'private school near me' and 'best schools in [city]'",
                    "SEO strategy to rank for school-related searches in your area",
                    "Website redesign focused on enrollment conversion and school values",
                    "Facebook/Instagram Ads targeting families with school-age children",
                    "Remarketing campaigns to re-engage families who visited the website"
                ],
                benefits: [
                    "Consistent inquiry flow throughout enrollment season",
                    "Reach families new to the area before competitors do",
                    "Higher enrollment conversion from digital inquiry to application",
                    "Premium brand positioning to justify tuition fees",
                    "Measurable cost-per-enrollment from every campaign"
                ],
                localContext: "Private school market in USA/Canada/Australia/UK/UAE",
                urgency: "Enrollment windows are fixed — schools that don't market digitally fill fewer seats each year",
                caseStudy: "Private school in Abu Dhabi: 38 enrollment inquiries in one term from digital campaigns"
            }
        };
    }

    loadRealMarketData() {
        return {
            english: {
                digitalTransformation: "70% of SMBs accelerated digital investment post-2020",
                aiAdoption: "35% of businesses use AI for customer engagement",
                mobileCommerce: "54% of all searches happen on mobile devices",
                customerExpectations: "73% of patients research online before booking",
                marketTrends: {
                    'dentist': "$153B US dental market, 4.5% annual growth",
                    'orthodontist': "$4.2B orthodontics market, Invisalign searches up 34% YoY",
                    'cosmetic dentist': "$32B cosmetic dentistry market growing 8% annually",
                    'dental implants': "$5.5B implant market, 45% search growth post-pandemic",
                    'pediatric dentist': "$5.1B pediatric dental market, family retention key",
                    'emergency dentist': "Emergency dental searches spike 60% on weekends",
                    'private school': "$623B global private education market"
                }
            }
        };
    }

    loadEnglishContext() {
        return {
            businessCulture: {
                communication: "Results-oriented and direct communication preferred",
                decision: "Data-driven decision making",
                trust: "Trust built through proven ROI and case studies",
                social: "Reviews and testimonials highly influential"
            },
            marketTrends: {
                digital: "70% of SMBs accelerated digital investment post-2020",
                mobile: "54% of all searches happen on mobile devices",
                ai: "35% of businesses use AI for customer engagement"
            }
        };
    }

    async generateIndustrySpecificContent(lead, industry, yourService, campaignStyle = 'balanced', language = 'english') {
        if (!this.openai) {
            throw new Error('OpenAI not configured');
        }

        const template = this.industryTemplates[industry];
        if (!template) {
            throw new Error(`Industry template not found: ${industry}`);
        }

        const prompt = this.buildIndustryPrompt(lead, template, yourService, campaignStyle);

        try {
            const completion = await this.openai.chat.completions.create({
                model: getModel(),
                messages: [
                    {
                        role: "system",
                        content: this.getSystemPrompt(industry, campaignStyle)
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 3000,
                temperature: 0.4
            });

            return this.parseIndustryResponse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating industry-specific content:', error);
            return null;
        }
    }

    getSystemPrompt(industry, campaignStyle) {
        const marketData = this.marketData['english'];

        const styleInstructions = {
            conservative: "Respectful, professional, and build trust gradually. Focus on long-term relationship building.",
            balanced: "Standard business approach with balanced professionalism and approachability.",
            aggressive: "Direct, create urgency, and focus on immediate action. Emphasize competitive advantages."
        };

        return `You are an expert B2B outreach writer for Vrixo (vrixo.online), a digital marketing agency serving dental clinics and private schools in USA, Canada, Australia, UK, and UAE. You specialize in the ${industry} sector.

AGENCY: Vrixo | Website: vrixo.online | Packages from $400/month
SERVICES: Google Ads, Meta Ads, SEO, Social Media Marketing, Website Development

INDUSTRY EXPERTISE: Deep understanding of ${industry} business challenges and patient/client acquisition
MARKET INTELLIGENCE: Current trends, challenges, and growth opportunities in the ${industry} market

COMMUNICATION STYLE: ${styleInstructions[campaignStyle]}

REAL MARKET DATA:
- Digital Transformation: ${marketData.digitalTransformation}
- AI Adoption: ${marketData.aiAdoption}
- Mobile Commerce: ${marketData.mobileCommerce}
- Customer Expectations: ${marketData.customerExpectations}
- ${industry} Market Size: ${marketData.marketTrends[industry]}

REQUIREMENTS:
1. Write in professional English — direct and results-focused
2. Include specific industry pain points with supporting data
3. Reference market trends and statistics to build credibility
4. Create a compelling value proposition with measurable outcomes
5. Include social proof and case study references
6. Create urgency based on market data
7. Focus on ROI and trackable results
8. All outreach is on behalf of Vrixo — sign off accordingly

OUTPUT FORMAT:
Generate both EMAIL and WHATSAPP templates with:
- Compelling email subject line with a statistic
- Industry-specific pain points backed by data
- Tailored solutions with quantified benefits
- Clear and urgent call-to-action
- Professional, results-oriented tone
- Case study or social proof reference
- WHATSAPP must be under 130 words, conversational, end with one question or CTA only`;
    }

    buildIndustryPrompt(lead, template, yourService, campaignStyle) {
        const marketData = this.marketData['english'];
        const biz = getBusinessInfoForPrompt();

        const bizInfoSection = `YOUR BUSINESS INFO:
- Business Name: ${biz.name}
- Business Type: ${biz.type}
- Description: ${biz.description}
- Phone: ${biz.phone}
- Email: ${biz.email}
- Website: ${biz.website}
${biz.valuePropositions.length > 0 ? `- Value Propositions: ${biz.valuePropositions.join(', ')}` : ''}`;

        return `Create personalized marketing outreach for this ${template.localContext} business:

TARGET BUSINESS DETAILS:
- Name: ${lead.name}
- Address: ${lead.address}
- Phone: ${lead.phone}
- Rating: ${lead.rating || 'N/A'}
- Website: ${lead.website || 'NO WEBSITE — highest priority lead, emphasize this gap'}
- Digital Maturity: ${this.assessDigitalMaturity(lead)}
- Urgency Score: ${this.calculateUrgencyScore(lead)}/10
- Review Count: ${lead.reviewCount || 'unknown'}

SERVICE OFFERED: ${yourService || biz.description}

${bizInfoSection}

INDUSTRY CONTEXT:
Pain Points: ${template.painPoints.join(' | ')}
Solutions: ${template.solutions.join(' | ')}
Benefits: ${template.benefits.join(' | ')}
Market Context: ${template.localContext}
Market Urgency: ${template.urgency}
Case Study: ${template.caseStudy}

REAL MARKET DATA:
- Market Size: ${marketData.marketTrends[template.industry] || 'Growing market opportunity'}
- Digital Transformation: ${marketData.digitalTransformation}
- Customer Expectations: ${marketData.customerExpectations}

CAMPAIGN STYLE: ${campaignStyle}

IMPORTANT: If the lead has no website, emphasize this gap heavily as it is the single biggest opportunity.

Please generate:
1. EMAIL TEMPLATE with compelling subject line and statistics
2. WHATSAPP TEMPLATE for a short professional follow-up (max 150 words)

Personalize to their business name and location. Use statistics to add credibility. End with a clear call-to-action to book a free strategy call.`;
    }

    parseIndustryResponse(response) {
        const sections = response.split(/(?:EMAIL TEMPLATE|WHATSAPP TEMPLATE)/i);

        let emailContent = '';
        let whatsappContent = '';

        if (sections.length >= 2) {
            emailContent = sections[1]?.trim() || '';
            whatsappContent = sections[2]?.trim() || '';
        } else {
            const lines = response.split('\n');
            let currentSection = '';

            for (const line of lines) {
                if (line.toLowerCase().includes('email')) {
                    currentSection = 'email';
                    continue;
                } else if (line.toLowerCase().includes('whatsapp')) {
                    currentSection = 'whatsapp';
                    continue;
                }

                if (currentSection === 'email' && line.trim()) {
                    emailContent += line + '\n';
                } else if (currentSection === 'whatsapp' && line.trim()) {
                    whatsappContent += line + '\n';
                }
            }
        }

        return {
            email: this.cleanTemplate(emailContent),
            whatsapp: this.cleanTemplate(whatsappContent),
            industry: true,
            generated: new Date().toISOString()
        };
    }

    cleanTemplate(content) {
        return content
            .replace(/^[^\w\n]*/, '')
            .replace(/EMAIL TEMPLATE:?/gi, '')
            .replace(/WHATSAPP TEMPLATE:?/gi, '')
            .trim();
    }

    async generateMultiTouchSequence(lead, industry, yourService) {
        const sequences = {
            email1: await this.generateIndustrySpecificContent(lead, industry, yourService, 'conservative'),
            email2: await this.generateFollowUpContent(lead, industry, yourService, 'balanced'),
            email3: await this.generateClosingContent(lead, industry, yourService, 'aggressive'),
            whatsapp: await this.generateIndustrySpecificContent(lead, industry, yourService, 'balanced')
        };

        return sequences;
    }

    async generateFollowUpContent(lead, industry, yourService, style) {
        if (!this.openai) {
            throw new Error('OpenAI not configured');
        }

        const marketData = this.marketData['english'];

        const prompt = `Create a follow-up email for ${lead.name} (${lead.address}) in the ${industry} industry.
This is the SECOND touch point — they have not replied to the first email.
Open with a specific result from a similar ${industry} business, then connect it to their situation.
If they have no website (${!lead.website ? 'TRUE — emphasize heavily' : 'they have one'}), make that the hook.
Agency: Vrixo (vrixo.online)
Service: ${yourService}
Style: ${style}
Market data: ${marketData.marketTrends[industry]}
Keep it shorter than the first email. End with a soft CTA — ask one specific question, not a hard sell.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: getModel(),
                messages: [
                    {
                        role: "system",
                        content: this.getSystemPrompt(industry, style) +
                            "\n\nFOCUS: This is a FOLLOW-UP email. Lead with a case study or result. Include specific ROI examples. Keep it shorter than the first email."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 3000,
                temperature: 0.4
            });

            return this.parseIndustryResponse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating follow-up content:', error);
            return null;
        }
    }

    async generateClosingContent(lead, industry, yourService, style) {
        if (!this.openai) {
            throw new Error('OpenAI not configured');
        }

        const marketData = this.marketData['english'];

        const prompt = `Create a closing email for ${lead.name} in the ${industry} industry.
This is the FINAL touch point — create urgency and make the next step crystal clear.
Include a limited-time offer, risk reversal (no long-term contract, packages from $400/month), and a strong CTA to book a free 30-minute strategy call.
Agency: Vrixo (vrixo.online) | Website: vrixo.online
Service: ${yourService}
Style: ${style}
Statistics to use: ${marketData.marketTrends[industry]}
Emphasize cost of inaction — every month without ads is patients booking with their competitor.
Offer: free strategy call where Vrixo will show them exactly how many people searched for their service this month in their city.`;

        try {
            const completion = await this.openai.chat.completions.create({
                model: getModel(),
                messages: [
                    {
                        role: "system",
                        content: this.getSystemPrompt(industry, style) +
                            "\n\nFOCUS: This is a CLOSING email. Maximum urgency. Include a guarantee or risk reversal. Make the next step (book a free call) impossible to ignore."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
               max_tokens: 3000,
                temperature: 0.4
            });

            return this.parseIndustryResponse(completion.choices[0].message.content);
        } catch (error) {
            console.error('Error generating closing content:', error);
            return null;
        }
    }

    getIndustryInsights(industry) {
        const template = this.industryTemplates[industry];
        if (!template) return null;

        return {
            painPoints: template.painPoints,
            solutions: template.solutions,
            benefits: template.benefits,
            localContext: template.localContext,
            urgency: template.urgency,
            caseStudy: template.caseStudy,
            marketSize: this.getMarketSize(industry)
        };
    }

    getMarketSize(industry) {
        const sizes = {
            'dentist': "$153B US dental market, 4.5% annual growth",
            'orthodontist': "$4.2B orthodontics, Invisalign searches up 34% YoY",
            'cosmetic dentist': "$32B cosmetic dentistry, growing 8% annually",
            'dental implants': "$5.5B implant market, 45% search growth",
            'pediatric dentist': "$5.1B pediatric dental market",
            'emergency dentist': "Emergency dental searches spike 60% on weekends",
            'private school': "$623B global private education market"
        };
        return sizes[industry] || "Growing digital marketing opportunity";
    }

    getAvailableLanguages() {
        return [
            { code: 'english', name: 'English', flag: '🇺🇸' }
            // TODO: add Arabic templates for UAE market
        ];
    }

    getCampaignStyles() {
        return [
            {
                code: 'conservative',
                name: 'Conservative',
                description: 'Respectful, professional, gradual trust building'
            },
            {
                code: 'balanced',
                name: 'Balanced',
                description: 'Standard business approach with professional friendliness'
            },
            {
                code: 'aggressive',
                name: 'Aggressive',
                description: 'Direct, urgent, immediate action focused'
            }
        ];
    }

    getAvailableIndustries() {
        const descriptions = {
            'dentist': 'Dental Clinics',
            'orthodontist': 'Orthodontics',
            'cosmetic dentist': 'Cosmetic Dentistry',
            'dental implants': 'Dental Implants',
            'pediatric dentist': 'Pediatric Dentistry',
            'emergency dentist': 'Emergency Dental',
            'private school': 'Private Schools'
        };

        return Object.keys(this.industryTemplates).map(industry => ({
            code: industry,
            name: descriptions[industry] || industry,
            marketSize: this.getMarketSize(industry)
        }));
    }

    validateAndEnhanceLead(lead) {
        return {
            name: lead.name || 'Business Owner',
            address: lead.address || 'N/A',
            phone: lead.phone || 'N/A',
            rating: lead.rating || 'N/A',
            website: lead.website || null,
            businessSize: this.estimateBusinessSize(lead),
            digitalMaturity: this.assessDigitalMaturity(lead),
            urgencyScore: this.calculateUrgencyScore(lead)
        };
    }

    estimateBusinessSize(lead) {
        if (lead.website && lead.rating > 4.0) return 'medium-large';
        if (lead.website || lead.rating > 3.5) return 'small-medium';
        return 'small';
    }

    assessDigitalMaturity(lead) {
        let score = 0;
        if (lead.website) score += 3;
        if (lead.rating && lead.rating > 4.0) score += 2;
        if (lead.reviewCount && lead.reviewCount > 50) score += 1;

        if (score >= 4) return 'high';
        if (score >= 2) return 'medium';
        return 'low';
    }

    calculateUrgencyScore(lead) {
        let urgency = 5;
        if (!lead.website) urgency += 3;
        if (lead.rating && lead.rating < 3.5) urgency += 2;
        return Math.min(urgency, 10);
    }
}

module.exports = MarketingAI;
