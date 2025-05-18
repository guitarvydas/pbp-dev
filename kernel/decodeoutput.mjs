#!/usr/bin/env node

import fs from 'fs';

// Initialize empty files
fs.writeFileSync('out.lisp', '\n');
fs.writeFileSync('out.py', '\n');
fs.writeFileSync('out.js', '\n');
fs.writeFileSync('out.wasm', '\n');
fs.writeFileSync('out.md', '\n');

// Buffer to store stdin data
let inputData = '';

// Read from stdin
process.stdin.on('data', (chunk) => {
  inputData += chunk.toString();
});

// Process the data when stdin ends
process.stdin.on('end', () => {
  try {
    // Parse the JSON input
    const jsonArray = JSON.parse(inputData);
    
    // Validate that the input is an array
    if (!Array.isArray(jsonArray)) {
      console.error('Error: Input is not a JSON array');
      process.exit(1);
    }
    
    // Process each object in the array
    jsonArray.forEach((obj) => {
      // Process each key/value pair
      for (const [key, value] of Object.entries(obj)) {
        // Ensure both key and value are strings
        if (typeof key !== 'string' || typeof value !== 'string') {
          console.error('Error: Keys and values must be strings');
          continue;
        }
        
        // Determine which file to write to based on the key
        let outputFile;
        let outputContent = value;
        
        switch (key) {
          case 'CommonLisp':
            outputFile = 'out.lisp';
            break;
          case 'Python':
            outputFile = 'out.py';
            break;
          case 'Javascript':
            outputFile = 'out.js';
            break;
          case 'WASM':
            outputFile = 'out.wasm';
            break;
          default:
            // For any other key, write to out.md with a header
            outputFile = 'out.md';
            outputContent = `# ${key}\n\n${value}\n\n`;
            break;
        }
        
        // Append the content to the appropriate file
        fs.appendFileSync(outputFile, outputContent);
      }
    });
    
      fs.appendFileSync('out.lisp', '\n');
      fs.appendFileSync('out.py', '\n');
      fs.appendFileSync('out.js', '\n');
      fs.appendFileSync('out.wasm', '\n');
      fs.appendFileSync('out.md', '\n');

  } catch (error) {
    console.error('Error processing input:', error.message);
    process.exit(1);
  }
});
