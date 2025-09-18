# Task

In the book folder, we want to number all sub subsections like this:

{chapter number}.{section number}.{subsection number}

# Implementation plan

## Current Structure Analysis

The book folder contains sections already numbered at the main level:
- `section-1-1-pathophysiology.md` → Chapter 1, Section 1
- `section-1-2-inflammatory-cascade.md` → Chapter 1, Section 2  
- `section-1-3-anatomical-impact.md` → Chapter 1, Section 3
- `section-2-1-gi-dysfunction.md` → Chapter 2, Section 1
- And so on...

Each file contains:
1. A main title (e.g., `# 1.1 Pathophysiology of Endometriosis`)
2. Multiple subsections with `##` headers (e.g., `## Definition and Fundamental Characteristics`)

## Goal

Transform subsection headers from:
```
## Definition and Fundamental Characteristics
```

To:
```
## 1.1.1 Definition and Fundamental Characteristics
```

## Implementation Steps

### 1. Extract Chapter and Section Numbers
- Parse filename pattern `section-{chapter}-{section}-{name}.md`
- Extract chapter and section numbers from each filename

### 2. Process Each File
For each section file:
1. Read the file content
2. Find all `##` headers (subsections)
3. Add sequential numbering: `{chapter}.{section}.{subsection_index}`
4. Write the updated content back

### 3. Numbering Logic
- Subsection counter starts at 1 for each file
- Increment for each `##` header encountered
- Format: `{chapter}.{section}.{subsection}`

### 4. Example Transformation

**File: `section-1-1-pathophysiology.md`**

Before:
```
# 1.1 Pathophysiology of Endometriosis

## Definition and Fundamental Characteristics
## Mechanisms of Implantation
## Invasion and Tissue Penetration
```

After:
```
# 1.1 Pathophysiology of Endometriosis

## 1.1.1 Definition and Fundamental Characteristics
## 1.1.2 Mechanisms of Implantation
## 1.1.3 Invasion and Tissue Penetration
```

### 5. Technical Implementation

**Manual File Editing Approach:**

These changes must be applied by manually modifying each file. For each `section-*.md` file in the book folder:

**Process:**
1. Open the file in your text editor
2. Identify the chapter and section numbers from the filename:
   - `section-1-1-pathophysiology.md` → Chapter 1, Section 1
   - `section-2-3-gut-barrier-dysfunction.md` → Chapter 2, Section 3
3. Locate all `##` headers (subsections) in the file
4. Manually add numbering in sequence:
   - First `##` header → `## {chapter}.{section}.1`
   - Second `##` header → `## {chapter}.{section}.2`
   - Third `##` header → `## {chapter}.{section}.3`
   - And so on...
5. Save the file

**Manual Editing Guidelines:**
- Only modify `##` headers, leave `#` (main title) and `###`+ (deeper headers) unchanged
- Start subsection numbering at 1 for each file
- Increment sequentially for each `##` header within the same file
- Preserve original text after the header number
- Maintain consistent spacing: `## {number} {original text}`

**Quality Checks for Each File:**
- Verify filename pattern matches expected format
- Confirm main title (`#`) remains unchanged
- Ensure only `##` headers are modified, not `###` or deeper levels
- Double-check sequential numbering within each file

### 6. Validation Steps

After implementation:
1. Verify all files have been processed
2. Check that main titles (`#`) remain unchanged
3. Confirm subsection numbering is sequential within each file
4. Ensure deeper headers (`###`, `####`) are unmodified
5. Validate chapter.section numbers match filename

### 7. Automated Task Completion Checker

**A Node.js program has been created to automatically check if this task is complete:**

**Location:** `session3/tools/check-numbering-task.js`

**Usage:**
```bash
node session3/tools/check-numbering-task.js
```

**Features:**
- ✅ **Complete Analysis**: Scans all section files in the book folder
- ✅ **Detailed Reporting**: Shows exactly which files are complete and which need work
- ✅ **Line-by-Line Issues**: Identifies specific headers that need numbering with exact line numbers
- ✅ **Progress Tracking**: Shows completion percentage (completed files / total files)
- ✅ **Validation Rules**: Ensures only `##` headers are numbered, main titles (`#`) are preserved
- ✅ **Exit Codes**: Returns 0 when complete, 1 when issues remain (suitable for automation)

**What the Checker Validates:**
1. All `##` headers have proper `{chapter}.{section}.{subsection}` numbering
2. Main titles (`#`) remain unchanged 
3. Deeper headers (`###`, `####`, etc.) are NOT numbered
4. Sequential numbering within each file starts at 1
5. Chapter/section numbers match the filename pattern

**Example Output:**
```
✅ section-1-1-pathophysiology.md
   Chapter 1, Section 1
   5 subsections properly numbered

❌ section-2-1-gi-dysfunction.md
   Chapter 2, Section 1
   10 subsections found
   Issues:
     - Line 51: Header should start with "## 2.1.5 " but found: "## Nitric Oxide Synthase..."
```

**Workflow:**
1. Make manual edits to files with issues
2. Run the checker to see progress
3. Repeat until all files pass validation
4. Final run should show "🎉 TASK COMPLETE!"
