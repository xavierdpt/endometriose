# Reference Finder Tool

A Node.js program to systematically add missing references to affirmations and counter-affirmations in JSON files.

## Usage

### Run the main program:
```bash
node reference-finder.js
```

### Check status (see what needs references):
```bash
node reference-finder.js --status
```

## How it works

1. **Scans** all JSON files in the current directory (files starting with "ch" and ending with ".json")
2. **Identifies** affirmations and counter-affirmations with empty references arrays
3. **Selects** the first statement needing references
4. **Asks** you to search the web for three supporting references
5. **Stops** and waits for you to manually add the references to the JSON file
6. **Run again** to get the next statement needing references

## Reference Format

References are added in this format:
```json
{
  "url": "https://example.com",
  "justification": ""
}
```

## Features

- ✅ Processes one statement at a time
- ✅ Shows which file and item needs references
- ✅ Requests web search for supporting references
- ✅ Status command to see what needs work
- ✅ Error handling for malformed JSON files
- ✅ Manual control over reference addition

## Example Session

```
🔍 Reference Finder - Scanning for missing references...

Found 12 statements needing references.

Next statement requiring references:

--------------------------------------------------------------------------------
STATEMENT NEEDING REFERENCES (affirmation):
Retrograde menstruation is the primary mechanism for ectopic endometrial tissue dissemination
--------------------------------------------------------------------------------

File: ch1-s1-pathophysiology.json
Item: 2
Type: affirmation

🔍 PLEASE SEARCH THE WEB FOR THREE SUPPORTING REFERENCES

Once you have found the references, add them to the JSON file in this format:
{
  "url": "https://example.com",
  "justification": ""
}

Add them to the "references" array for item 2 in ch1-s1-pathophysiology.json

--------------------------------------------------------------------------------

Run the program again after adding references to continue with the next statement.
```