#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class NumberingTaskChecker {
    constructor() {
        this.bookDir = path.join(__dirname, '..', 'book');
        this.results = {
            totalFiles: 0,
            completedFiles: 0,
            issuesFound: [],
            fileDetails: []
        };
    }

    /**
     * Extract chapter and section numbers from filename
     * @param {string} filename - e.g., "section-1-2-inflammatory-cascade.md"
     * @returns {object} - {chapter: 1, section: 2}
     */
    parseFilename(filename) {
        const match = filename.match(/^section-(\d+)-(\d+)-.+\.md$/);
        if (!match) {
            return null;
        }
        return {
            chapter: parseInt(match[1], 10),
            section: parseInt(match[2], 10)
        };
    }

    /**
     * Check if a header has proper numbering
     * @param {string} headerLine - e.g., "## 1.2.3 Some Title"
     * @param {number} expectedChapter
     * @param {number} expectedSection  
     * @param {number} expectedSubsection
     * @returns {boolean}
     */
    isHeaderProperlyNumbered(headerLine, expectedChapter, expectedSection, expectedSubsection) {
        const trimmed = headerLine.trim();
        if (!trimmed.startsWith('## ')) {
            return false;
        }
        
        const expectedNumber = `${expectedChapter}.${expectedSection}.${expectedSubsection}`;
        const pattern = new RegExp(`^## ${expectedNumber.replace(/\./g, '\\.')} .+`);
        return pattern.test(trimmed);
    }

    /**
     * Process a single markdown file
     * @param {string} filename
     * @returns {object} - Analysis results for the file
     */
    processFile(filename) {
        const filePath = path.join(this.bookDir, filename);
        
        if (!fs.existsSync(filePath)) {
            return {
                filename,
                error: 'File not found',
                isComplete: false
            };
        }

        const parsedName = this.parseFilename(filename);
        if (!parsedName) {
            return {
                filename,
                error: 'Invalid filename format',
                isComplete: false
            };
        }

        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        
        const analysis = {
            filename,
            chapter: parsedName.chapter,
            section: parsedName.section,
            headers: [],
            issues: [],
            isComplete: true
        };

        let subsectionCounter = 1;
        let foundMainTitle = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            // Check for main title (should remain unchanged)
            if (line.startsWith('# ') && !foundMainTitle) {
                foundMainTitle = true;
                const expectedMainTitle = `# ${parsedName.chapter}.${parsedName.section}`;
                if (!line.startsWith(expectedMainTitle)) {
                    analysis.issues.push(`Line ${i + 1}: Main title should start with "${expectedMainTitle}"`);
                }
                continue;
            }

            // Check ## headers (subsections)
            if (line.startsWith('## ')) {
                const headerInfo = {
                    line: i + 1,
                    text: line,
                    expectedNumber: `${parsedName.chapter}.${parsedName.section}.${subsectionCounter}`,
                    isCorrect: false
                };

                if (this.isHeaderProperlyNumbered(line, parsedName.chapter, parsedName.section, subsectionCounter)) {
                    headerInfo.isCorrect = true;
                } else {
                    headerInfo.isCorrect = false;
                    analysis.issues.push(`Line ${i + 1}: Header should start with "## ${headerInfo.expectedNumber} " but found: "${line}"`);
                    analysis.isComplete = false;
                }

                analysis.headers.push(headerInfo);
                subsectionCounter++;
            }

            // Check that deeper headers (###, ####, etc.) are NOT numbered
            if (line.match(/^#{3,} \d+\.\d+\.\d+/)) {
                analysis.issues.push(`Line ${i + 1}: Deeper headers should NOT be numbered: "${line}"`);
                analysis.isComplete = false;
            }
        }

        if (analysis.headers.length === 0) {
            analysis.issues.push('No ## headers found in file');
            analysis.isComplete = false;
        }

        if (!foundMainTitle) {
            analysis.issues.push('No main title (# header) found in file');
            analysis.isComplete = false;
        }

        return analysis;
    }

    /**
     * Get all section files from the book directory
     * @returns {string[]} - Array of filenames
     */
    getSectionFiles() {
        if (!fs.existsSync(this.bookDir)) {
            throw new Error(`Book directory not found: ${this.bookDir}`);
        }

        const files = fs.readdirSync(this.bookDir);
        return files
            .filter(file => file.match(/^section-\d+-\d+-.+\.md$/))
            .sort();
    }

    /**
     * Run the complete analysis
     * @returns {object} - Complete analysis results
     */
    checkAllFiles() {
        console.log('🔍 Checking numbering task completion...\n');
        console.log(`📁 Book directory: ${this.bookDir}\n`);

        try {
            const sectionFiles = this.getSectionFiles();
            
            if (sectionFiles.length === 0) {
                console.log('❌ No section files found!');
                return { success: false, error: 'No section files found' };
            }

            console.log(`📚 Found ${sectionFiles.length} section files:\n`);

            this.results.totalFiles = sectionFiles.length;

            for (const filename of sectionFiles) {
                const fileAnalysis = this.processFile(filename);
                this.results.fileDetails.push(fileAnalysis);

                if (fileAnalysis.isComplete) {
                    this.results.completedFiles++;
                    console.log(`✅ ${filename}`);
                    console.log(`   Chapter ${fileAnalysis.chapter}, Section ${fileAnalysis.section}`);
                    console.log(`   ${fileAnalysis.headers.length} subsections properly numbered\n`);
                } else {
                    console.log(`❌ ${filename}`);
                    if (fileAnalysis.error) {
                        console.log(`   Error: ${fileAnalysis.error}\n`);
                    } else {
                        console.log(`   Chapter ${fileAnalysis.chapter}, Section ${fileAnalysis.section}`);
                        console.log(`   ${fileAnalysis.headers.length} subsections found`);
                        console.log(`   Issues:`);
                        fileAnalysis.issues.forEach(issue => console.log(`     - ${issue}`));
                        console.log('');
                    }
                }

                if (fileAnalysis.issues.length > 0) {
                    this.results.issuesFound.push(...fileAnalysis.issues.map(issue => 
                        `${filename}: ${issue}`
                    ));
                }
            }

            return this.generateSummary();

        } catch (error) {
            console.error('❌ Error during analysis:', error.message);
            return { success: false, error: error.message };
        }
    }

    /**
     * Generate final summary report
     * @returns {object}
     */
    generateSummary() {
        const isTaskComplete = this.results.completedFiles === this.results.totalFiles;
        
        console.log('📊 SUMMARY REPORT');
        console.log('================\n');
        
        console.log(`📁 Total files: ${this.results.totalFiles}`);
        console.log(`✅ Completed files: ${this.results.completedFiles}`);
        console.log(`❌ Files with issues: ${this.results.totalFiles - this.results.completedFiles}`);
        console.log(`🐛 Total issues found: ${this.results.issuesFound.length}\n`);

        if (isTaskComplete) {
            console.log('🎉 TASK COMPLETE! All files have proper subsection numbering.\n');
            console.log('✨ All ## headers are numbered in the format: {chapter}.{section}.{subsection}');
            console.log('✨ Main titles (# headers) are preserved');
            console.log('✨ Deeper headers (###, ####, etc.) are not numbered\n');
        } else {
            console.log('⚠️  TASK INCOMPLETE! Some files need attention.\n');
            
            if (this.results.issuesFound.length > 0) {
                console.log('🔧 Issues that need to be fixed:');
                this.results.issuesFound.forEach((issue, index) => {
                    console.log(`   ${index + 1}. ${issue}`);
                });
                console.log('');
            }
        }

        console.log('📋 Next steps:');
        if (isTaskComplete) {
            console.log('   - No further action needed!');
            console.log('   - All subsections are properly numbered');
        } else {
            console.log('   - Review files with issues listed above');
            console.log('   - Manually add numbering to ## headers in format: {chapter}.{section}.{subsection}');
            console.log('   - Run this script again to verify completion');
        }

        return {
            success: true,
            isTaskComplete,
            stats: {
                totalFiles: this.results.totalFiles,
                completedFiles: this.results.completedFiles,
                issuesCount: this.results.issuesFound.length
            },
            details: this.results.fileDetails,
            issues: this.results.issuesFound
        };
    }
}

// Main execution
if (require.main === module) {
    const checker = new NumberingTaskChecker();
    const results = checker.checkAllFiles();
    
    process.exit(results.success && results.isTaskComplete ? 0 : 1);
}

module.exports = NumberingTaskChecker;