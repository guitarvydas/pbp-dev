#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Read from stdin
let inputData = '';

process.stdin.setEncoding('utf8');

process.stdin.on('readable', () => {
  let chunk;
  while (null !== (chunk = process.stdin.read())) {
    inputData += chunk;
  }
});

process.stdin.on('end', () => {
  try {
    // Parse the JSON input
    const jsonArray = JSON.parse(inputData);
    
    // Validate that input is an array
    if (!Array.isArray(jsonArray)) {
      console.error('Error: Input must be a JSON array');
      process.exit(1);
    }
    
    // Process each object in the array
    jsonArray.forEach((obj, index) => {
      // Check if object is valid
      if (typeof obj !== 'object' || obj === null) {
        console.error(`Warning: Item ${index} is not an object, skipping`);
        return;
      }
      
      // Process each key-value pair in the object
      Object.keys(obj).forEach(key => {
        const value = obj[key];
        
        // Only process string values
        if (typeof value === 'string') {
          const filename = `out.${key}`;
          
          try {
            // Write the string value to the file
            fs.writeFileSync(filename, value, 'utf8');
            console.log(`Created file: ${filename}`);
          } catch (error) {
            console.error(`Error writing file ${filename}: ${error.message}`);
          }
        } else {
          console.warn(`Warning: Value for key "${key}" is not a string, skipping`);
        }
      });
    });
    
  } catch (error) {
    console.error('Error parsing JSON:', error.message);
    process.exit(1);
  }
});

// Handle case where no input is provided
process.stdin.on('error', (error) => {
  console.error('Error reading from stdin:', error.message);
  process.exit(1);
});
