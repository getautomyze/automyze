const fs = require('fs');
const path = require('path');

// 1. Update whatsapp-ai-agent-india.html
let waPath = path.join(__dirname, 'whatsapp-ai-agent-india.html');
if (fs.existsSync(waPath)) {
    let content = fs.readFileSync(waPath, 'utf8');
    
    // Meta updates
    content = content.replace(/<title>.*?<\/title>/, '<title>WhatsApp AI Agent for Small Business India | Automyze</title>');
    content = content.replace(/<meta name="description".*?\/>/, '<meta name="description" content="Build a custom WhatsApp AI agent for your Indian business. Automate customer support, lead qualification, and bookings 24/7 on India\'s most popular messaging app."/>');
    content = content.replace(/<meta name="keywords".*?\/>/, '<meta name="keywords" content="WhatsApp AI agent for small business India, WhatsApp automation India, AI chatbot India, customer support AI"/>');
    
    // H1 and Headers
    content = content.replace(/<h1.*?>.*?<\/h1>/s, '<h1 class="text-5xl md:text-7xl font-heading mb-6 tracking-tight">WhatsApp AI Agent for Small Business India</h1>');
    content = content.replace(/<p class="text-luxury-black\/60 text-xl max-w-2xl".*?>.*?<\/p>/s, '<p class="text-luxury-black/60 text-xl max-w-2xl">Deploy an intelligent WhatsApp AI agent to handle queries, qualify leads, and book meetings instantly. Cost-effective AI automation tailored for the Indian market.</p>');
    
    fs.writeFileSync(waPath, content, 'utf8');
    console.log("Updated whatsapp-ai-agent-india.html");
}

// 2. Update workflow-automation-mumbai.html
let wfPath = path.join(__dirname, 'workflow-automation-mumbai.html');
if (fs.existsSync(wfPath)) {
    let content = fs.readFileSync(wfPath, 'utf8');
    
    // Meta updates
    content = content.replace(/<title>.*?<\/title>/, '<title>Workflow Automation Agency Mumbai | Automyze AI Consulting</title>');
    content = content.replace(/<meta name="description".*?\/>/, '<meta name="description" content="Automyze is a premium workflow automation agency in Mumbai. We build cost-effective AI process automation solutions for Indian enterprises."/>');
    content = content.replace(/<meta name="keywords".*?\/>/, '<meta name="keywords" content="Workflow automation agency Mumbai, AI process automation for Indian enterprises, cost-effective AI automation agency India, RPA Mumbai"/>');
    
    // H1 and Headers
    content = content.replace(/<h1.*?>.*?<\/h1>/s, '<h1 class="text-5xl md:text-7xl font-heading mb-6 tracking-tight">Workflow Automation Agency Mumbai</h1>');
    content = content.replace(/<p class="text-luxury-black\/60 text-xl max-w-2xl".*?>.*?<\/p>/s, '<p class="text-luxury-black/60 text-xl max-w-2xl">Your local partner in AI process automation. We engineer intelligent systems that eliminate manual friction for Indian enterprises, allowing you to scale without adding headcount.</p>');
    
    fs.writeFileSync(wfPath, content, 'utf8');
    console.log("Updated workflow-automation-mumbai.html");
}
