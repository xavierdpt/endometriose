const fs = require('fs');
const path = require('path');

function findStatementsNeedingReferences() {
    const currentDir = __dirname;
    const files = fs.readdirSync(currentDir).filter(file => 
        file.endsWith('.json') && file.startsWith('ch')
    );

    const needingReferences = [];

    for (const file of files) {
        const filePath = path.join(currentDir, file);
        try {
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            content.forEach((item, index) => {
                // Check affirmations
                if (item.references && item.references.length === 0) {
                    needingReferences.push({
                        file: file,
                        index: index,
                        type: 'affirmation',
                        statement: item.affirmation,
                        targetArray: 'references'
                    });
                }

                // Check counter_affirmations
                if (item.counter_references && item.counter_references.length === 0) {
                    needingReferences.push({
                        file: file,
                        index: index,
                        type: 'counter_affirmation',
                        statement: item.counter_affirmation,
                        targetArray: 'counter_references'
                    });
                }
            });
        } catch (error) {
            console.error(`Error reading ${file}:`, error.message);
        }
    }

    return needingReferences;
}

function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--status') || args.includes('-s')) {
        showStatus();
        return;
    }

    const needingReferences = findStatementsNeedingReferences();
    
    if (needingReferences.length === 0) {
        console.log('All affirmations and counter-affirmations have references!');
        return;
    }

    const selected = needingReferences[0];

    const outputText = `Reference Finder - Scanning for missing references...

Found ${needingReferences.length} statements needing references.
--------------------------------------------------------------------------------
Statement: "${selected.statement}"
--------------------------------------------------------------------------------
File: ${selected.file}
Type: ${selected.type}

🔍 ACTION REQUIRED: PERFORM WEB SEARCH
Please search the web for THREE SUPPORTING REFERENCES for this statement.

Search Query Suggestion: "${selected.statement} scientific research evidence"

After finding the references through web search, add them to the JSON file in this format:
{
  "url": "https://example.com",
  "justification": "Brief explanation of how this reference supports the statement"
}

Add them to the "${selected.targetArray}" array for item ${selected.index} in ${selected.file}

Run the program again after adding references to continue with the next statement.`;

    // Try console output first (use --file flag to force file output)
    if (args.includes('--file') || args.includes('-f')) {
        const outputFile = path.join(__dirname, 'reference-output.txt');
        fs.writeFileSync(outputFile, outputText, 'utf8');
        console.log(`Output written to: ${outputFile}`);
        console.log(`Please check ${outputFile} for the reference request.`);
    } else {
        // Attempt console output - if scrambled in PowerShell, use --file flag
        console.log(outputText);
        console.log('');
        console.log('Note: If output appears scrambled in PowerShell, run with --file flag');
    }
}

function showStatus() {
    console.log('Current Status Report');
    console.log('');
    
    const needingReferences = findStatementsNeedingReferences();
    
    if (needingReferences.length === 0) {
        console.log('All statements have references!');
        return;
    }

    console.log(`Statements still needing references: ${needingReferences.length}`);
    console.log('');
    
    const byFile = {};
    needingReferences.forEach(item => {
        if (!byFile[item.file]) byFile[item.file] = [];
        byFile[item.file].push(item);
    });

    Object.keys(byFile).forEach(file => {
        console.log(`${file}: ${byFile[file].length} statements`);
    });
}

if (require.main === module) {
    main();
}