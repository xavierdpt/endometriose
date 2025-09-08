#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Prettifies all JSON files in the current directory
 */
function prettifyJsonFiles() {
    const currentDir = __dirname;
    console.log(`Processing JSON files in: ${currentDir}`);
    
    try {
        // Read all files in the current directory
        const files = fs.readdirSync(currentDir);
        
        // Filter for JSON files
        const jsonFiles = files.filter(file => path.extname(file).toLowerCase() === '.json');
        
        if (jsonFiles.length === 0) {
            console.log('No JSON files found in the current directory.');
            return;
        }
        
        console.log(`Found ${jsonFiles.length} JSON file(s):`);
        jsonFiles.forEach(file => console.log(`  - ${file}`));
        console.log();
        
        let successCount = 0;
        let errorCount = 0;
        
        // Process each JSON file
        jsonFiles.forEach(filename => {
            const filePath = path.join(currentDir, filename);
            
            try {
                // Read the file
                const content = fs.readFileSync(filePath, 'utf8');
                
                // Parse JSON to validate it
                const jsonData = JSON.parse(content);
                
                // Prettify with 2-space indentation
                const prettifiedContent = JSON.stringify(jsonData, null, 2);
                
                // Write back to file
                fs.writeFileSync(filePath, prettifiedContent + '\n', 'utf8');
                
                console.log(`✅ Successfully prettified: ${filename}`);
                successCount++;
                
            } catch (error) {
                console.error(`❌ Error processing ${filename}:`, error.message);
                errorCount++;
            }
        });
        
        console.log();
        console.log(`Summary:`);
        console.log(`  ✅ Successfully processed: ${successCount} files`);
        if (errorCount > 0) {
            console.log(`  ❌ Failed to process: ${errorCount} files`);
        }
        console.log('Done!');
        
    } catch (error) {
        console.error('Error reading directory:', error.message);
        process.exit(1);
    }
}

// Run the function
if (require.main === module) {
    prettifyJsonFiles();
}

module.exports = { prettifyJsonFiles };