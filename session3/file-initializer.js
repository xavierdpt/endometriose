const fs = require('fs');
const path = require('path');

// Configuration
const JSON_FILES_PATTERN = /^ch\d+-s\d+-.*\.json$/;
const SUBTOPICS_FOLDER = 'subtopics';
const MAX_FILENAME_LENGTH = 15;

class FileInitializer {
  constructor() {
    this.allAffirmations = [];
    this.jsonFiles = [];
  }

  // Get all JSON files matching the pattern
  getJsonFiles() {
    const files = fs.readdirSync('.').filter(file => 
      JSON_FILES_PATTERN.test(file) && fs.statSync(file).isFile()
    );
    console.log(`Found ${files.length} JSON files: ${files.join(', ')}`);
    return files;
  }

  // Load and parse all JSON files
  loadAffirmations() {
    this.jsonFiles = this.getJsonFiles();
    
    this.jsonFiles.forEach(filename => {
      try {
        const content = fs.readFileSync(filename, 'utf8');
        const affirmations = JSON.parse(content);
        
        affirmations.forEach((affirmation, index) => {
          this.allAffirmations.push({
            filename: filename,
            index: index,
            affirmation: affirmation.affirmation,
            subtopic_file: affirmation.subtopic_file || null,
            references: affirmation.references || [],
            counter_references: affirmation.counter_references || [],
            data: affirmation
          });
        });
        
        console.log(`Loaded ${affirmations.length} affirmations from ${filename}`);
      } catch (error) {
        console.error(`Error loading ${filename}:`, error.message);
      }
    });
    
    console.log(`Total affirmations loaded: ${this.allAffirmations.length}`);
  }

  // a) List affirmations that have no subtopic file name
  listMissingSubtopicFiles() {
    const missing = this.allAffirmations.filter(item => !item.subtopic_file);
    
    console.log('\n=== AFFIRMATIONS WITHOUT SUBTOPIC FILE NAME ===');
    if (missing.length === 0) {
      console.log('All affirmations have subtopic file names assigned.');
    } else {
      console.log(`Found ${missing.length} affirmations without subtopic file names:\n`);
      missing.forEach((item, index) => {
        console.log(`${index + 1}. File: ${item.filename} (index ${item.index})`);
        console.log(`   Affirmation: "${item.affirmation.substring(0, 80)}..."`);
        console.log('');
      });
    }
    
    return missing;
  }

  // b) Check filename uniqueness and length validation
  validateSubtopicFiles() {
    const withFiles = this.allAffirmations.filter(item => item.subtopic_file);
    const filenames = withFiles.map(item => item.subtopic_file);
    
    console.log('\n=== SUBTOPIC FILENAME VALIDATION ===');
    
    // Check for duplicates
    const duplicates = {};
    const seen = new Set();
    filenames.forEach(filename => {
      if (seen.has(filename)) {
        if (!duplicates[filename]) {
          duplicates[filename] = [];
        }
        duplicates[filename].push(...withFiles.filter(item => item.subtopic_file === filename));
      } else {
        seen.add(filename);
      }
    });

    if (Object.keys(duplicates).length > 0) {
      console.log('DUPLICATE FILENAMES FOUND:');
      Object.entries(duplicates).forEach(([filename, items]) => {
        console.log(`  "${filename}" is used by ${items.length} affirmations:`);
        items.forEach(item => {
          console.log(`    - ${item.filename} (index ${item.index})`);
        });
      });
    } else {
      console.log('✓ No duplicate filenames found.');
    }

    // Check filename length
    const tooLong = withFiles.filter(item => item.subtopic_file.length > MAX_FILENAME_LENGTH);
    if (tooLong.length > 0) {
      console.log('\nFILENAMES TOO LONG (>' + MAX_FILENAME_LENGTH + ' characters):');
      tooLong.forEach(item => {
        console.log(`  "${item.subtopic_file}" (${item.subtopic_file.length} chars) - ${item.filename} (index ${item.index})`);
      });
    } else {
      console.log('✓ All filenames are within length limit.');
    }

    return {
      duplicates: Object.keys(duplicates),
      tooLong: tooLong.map(item => item.subtopic_file),
      valid: withFiles.filter(item => 
        item.subtopic_file.length <= MAX_FILENAME_LENGTH && 
        !duplicates[item.subtopic_file]
      )
    };
  }

  // c) Create empty files for each valid filename in the subtopics folder
  createSubtopicFiles(validFiles) {
    console.log('\n=== CREATING SUBTOPIC FILES ===');
    
    // Create subtopics folder if it doesn't exist
    if (!fs.existsSync(SUBTOPICS_FOLDER)) {
      fs.mkdirSync(SUBTOPICS_FOLDER);
      console.log(`Created ${SUBTOPICS_FOLDER} folder.`);
    }

    const validFilenames = validFiles.map(item => item.subtopic_file);
    const uniqueFilenames = [...new Set(validFilenames)];

    if (uniqueFilenames.length === 0) {
      console.log('No valid filenames to create files for.');
      return;
    }

    console.log(`Creating ${uniqueFilenames.length} subtopic files:`);
    
    uniqueFilenames.forEach(filename => {
      const filePath = path.join(SUBTOPICS_FOLDER, filename.endsWith('.md') ? filename : `${filename}.md`);
      
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, '');
        console.log(`✓ Created: ${filePath}`);
      } else {
        console.log(`- Already exists: ${filePath}`);
      }
    });
  }

  // d) Delete files in subtopics folder that are not referenced in JSON files
  cleanupSubtopicFiles() {
    console.log('\n=== CLEANING UP UNREFERENCED FILES ===');
    
    if (!fs.existsSync(SUBTOPICS_FOLDER)) {
      console.log(`${SUBTOPICS_FOLDER} folder doesn't exist. Nothing to clean up.`);
      return;
    }

    const existingFiles = fs.readdirSync(SUBTOPICS_FOLDER).filter(file => 
      fs.statSync(path.join(SUBTOPICS_FOLDER, file)).isFile()
    );

    const referencedFiles = this.allAffirmations
      .filter(item => item.subtopic_file)
      .map(item => {
        const filename = item.subtopic_file;
        return filename.endsWith('.md') ? filename : `${filename}.md`;
      });

    const uniqueReferencedFiles = [...new Set(referencedFiles)];
    const unreferencedFiles = existingFiles.filter(file => !uniqueReferencedFiles.includes(file));

    if (unreferencedFiles.length === 0) {
      console.log('✓ No unreferenced files found.');
    } else {
      console.log(`Found ${unreferencedFiles.length} unreferenced files:`);
      unreferencedFiles.forEach(file => {
        const filePath = path.join(SUBTOPICS_FOLDER, file);
        try {
          fs.unlinkSync(filePath);
          console.log(`✓ Deleted: ${filePath}`);
        } catch (error) {
          console.error(`✗ Failed to delete ${filePath}:`, error.message);
        }
      });
    }
  }

  // Main execution method
  run() {
    console.log('='.repeat(60));
    console.log('SUBTOPIC FILES INITIALIZATION');
    console.log('='.repeat(60));

    try {
      // Load all affirmations
      this.loadAffirmations();

      // a) List missing subtopic file names
      const missingFiles = this.listMissingSubtopicFiles();

      // b) Validate existing subtopic file names
      const validation = this.validateSubtopicFiles();

      // c) Create files for valid filenames
      this.createSubtopicFiles(validation.valid);

      // d) Clean up unreferenced files
      this.cleanupSubtopicFiles();

      console.log('\n=== SUMMARY ===');
      console.log(`Total affirmations: ${this.allAffirmations.length}`);
      console.log(`Missing subtopic files: ${missingFiles.length}`);
      console.log(`Duplicate filenames: ${validation.duplicates.length}`);
      console.log(`Filenames too long: ${validation.tooLong.length}`);
      console.log(`Valid files processed: ${validation.valid.length}`);

    } catch (error) {
      console.error('Fatal error:', error.message);
      process.exit(1);
    }
  }
}

// Run the program if called directly
if (require.main === module) {
  const initializer = new FileInitializer();
  initializer.run();
}

module.exports = FileInitializer;