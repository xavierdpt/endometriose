const fs = require('fs');
const path = require('path');

// Global thesis paragraph
const GLOBAL_THESIS = `This research investigates the complex pathophysiological pathway linking endometriosis to chronic fatigue syndrome through a cascade of interconnected mechanisms. The central thesis proposes that endometriosis, characterized by ectopic endometrial tissue and chronic inflammatory processes, can disrupt gastrointestinal function and promote small intestinal bacterial overgrowth (SIBO). This potential SIBO-endometriosis combination can create a state of amplified systemic inflammation through bacterial endotoxin release and immune dysregulation, which may subsequently disrupt thyroidal and neuroendocrine function via suppression of the hypothalamic-pituitary-thyroid axis and impairment of peripheral thyroid hormone metabolism. The resulting metabolic suppression, neuroinflammation, and perpetuation of pathological inflammatory cycles can ultimately manifest as chronic fatigue syndrome, creating a self-reinforcing pathological state that requires integrated therapeutic approaches targeting multiple pathways simultaneously.`;

// Parse command line arguments
const args = process.argv.slice(2);
const overwriteAll = args.includes('--overwrite-all');
const overwriteIndex = args.indexOf('--overwrite');
const overwriteFiles = overwriteIndex !== -1 ? args.slice(overwriteIndex + 1) : [];

function loadJsonFiles() {
    const jsonFiles = fs.readdirSync('.')
        .filter(file => /^ch\d+-s\d+-.+\.json$/.test(file));
    
    const affirmations = [];
    
    for (const file of jsonFiles) {
        try {
            const data = JSON.parse(fs.readFileSync(file, 'utf8'));
            if (Array.isArray(data)) {
                affirmations.push(...data.filter(item => item.subtopic_file));
            }
        } catch (error) {
            console.error(`Error reading ${file}:`, error.message);
        }
    }
    
    return affirmations;
}

function generateMarkdownContent(affirmation) {
    let content = '';
    
    // Section a) Global thesis
    content += '# Global Research Context\n\n';
    content += GLOBAL_THESIS + '\n\n';
    
    // Section b) Specific affirmation
    content += '# Focus Statement\n\n';
    content += `**Affirmation under study:** ${affirmation.affirmation}\n\n`;
    
    // Section c) Analysis placeholder
    content += '# Pathophysiological Analysis\n\n';
    content += '*[This section should contain up to three paragraphs explaining how this affirmation supports the global thesis, including specific biochemical pathways and mechanisms involved.]*\n\n';
    
    // Section d) Reference analysis
    content += '# Literature Review\n\n';
    
    // Collect all references
    const allReferences = [];
    if (affirmation.references && affirmation.references.length > 0) {
        allReferences.push(...affirmation.references);
    }
    if (affirmation.counter_references && affirmation.counter_references.length > 0) {
        allReferences.push(...affirmation.counter_references);
    }
    
    if (allReferences.length > 0) {
        allReferences.forEach((ref, index) => {
            content += `## Reference ${index + 1}\n\n`;
            content += `**URL:** ${ref.url}\n\n`;
            content += '**Assessment:**\n\n';
            content += '*[Provide detailed assessment of how this reference relates to the pathophysiological analysis above. Discuss the specific evidence presented, its quality, methodology, and relevance to the biochemical pathways mentioned. Evaluate whether it supports, contradicts, or provides nuanced perspective on the affirmation.]*\n\n';
        });
    }
    
    // Section e) Conclusion
    content += '# Synthesis and Conclusions\n\n';
    content += '*[This section should contain up to two paragraphs synthesizing the evidence and evaluating how strongly this affirmation supports the global research thesis.]*\n\n';
    
    return content;
}

function shouldProcessFile(filename, isEmpty) {
    if (overwriteAll) return true;
    if (overwriteFiles.includes(filename)) return true;
    return isEmpty;
}

function main() {
    console.log('Content Initializer - Populating subtopic files');
    console.log('================================================\n');
    
    // Create subtopics directory if it doesn't exist
    if (!fs.existsSync('subtopics')) {
        fs.mkdirSync('subtopics');
        console.log('Created subtopics directory');
    }
    
    const affirmations = loadJsonFiles();
    console.log(`Found ${affirmations.length} affirmations with subtopic files\n`);
    
    let processedCount = 0;
    let skippedCount = 0;
    
    for (const affirmation of affirmations) {
        const filename = `${affirmation.subtopic_file}.md`;
        const filepath = path.join('subtopics', filename);
        
        let isEmpty = true;
        if (fs.existsSync(filepath)) {
            const currentContent = fs.readFileSync(filepath, 'utf8').trim();
            isEmpty = currentContent === '';
        }
        
        if (shouldProcessFile(filename, isEmpty)) {
            const content = generateMarkdownContent(affirmation);
            fs.writeFileSync(filepath, content, 'utf8');
            console.log(`✓ Processed: ${filename}`);
            processedCount++;
        } else {
            console.log(`- Skipped (not empty): ${filename}`);
            skippedCount++;
        }
    }
    
    console.log(`\nSummary:`);
    console.log(`- Processed: ${processedCount} files`);
    console.log(`- Skipped: ${skippedCount} files`);
    
    if (overwriteAll) {
        console.log('- Mode: Overwrite all files');
    } else if (overwriteFiles.length > 0) {
        console.log(`- Mode: Overwrite specific files (${overwriteFiles.join(', ')})`);
    } else {
        console.log('- Mode: Initialize empty files only');
    }
}

// Run the program
if (require.main === module) {
    main();
}