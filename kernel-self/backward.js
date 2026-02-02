/**
 * Program to read kernel.drawio.json and replace ":DONE" with "'DONE" and ":$" with "$"
 * 
 * HOW TO USE:
 * 1. Save this script as "modify-drawio.js"
 * 2. Place your kernel.drawio.json file in the same directory
 * 3. Run with Node.js: node modify-drawio.js
 * 4. A new file "modified-kernel.drawio.json" will be created with the replacements
 */

const fs = require('fs');
const path = require('path');

// Function to modify the JSON file
function modifyJsonFile(inputFilePath, outputFilePath) {
  try {
    // Read the file content
    const fileContent = fs.readFileSync(inputFilePath, 'utf8');
    console.log(`File '${inputFilePath}' loaded successfully.`);
    
    // Count original occurrences
    const countDONE = (fileContent.match(/:DONE/g) || []).length;
    const countDollar = (fileContent.match(/:\$/g) || []).length;
    console.log(`Found ${countDONE} occurrences of ":DONE"`);
    console.log(`Found ${countDollar} occurrences of ":$"`);
    
    // Replace ":DONE" with "'DONE" and ":$" with "$"
    let modifiedContent = fileContent.replace(/:DONE/g, "'DONE");
    modifiedContent = modifiedContent.replace(/:\$/g, "$");
    
    // Count new occurrences to verify replacements
    const countDONEAfter = (modifiedContent.match(/:DONE/g) || []).length;
    const countDONENew = (modifiedContent.match(/'DONE/g) || []).length;
    const countDollarAfter = (modifiedContent.match(/:\$/g) || []).length;
    
    console.log(`After replacement: ${countDONEAfter} occurrences of ":DONE" (should be 0)`);
    console.log(`After replacement: ${countDONENew} occurrences of "'DONE"`);
    console.log(`After replacement: ${countDollarAfter} occurrences of ":$" (should be 0)`);
    
    // Write the modified content to the output file
    fs.writeFileSync(outputFilePath, modifiedContent);
    console.log(`Replacements completed. Modified file saved as '${outputFilePath}'`);
    
    return true;
  } catch (error) {
    console.error(`Error processing the file: ${error.message}`);
    return false;
  }
}

// Main execution
const inputFile = 'kernel.drawio.json';
const outputFile = 'modified-kernel.drawio.json';

console.log('Starting file modification process...');
const result = modifyJsonFile(inputFile, outputFile);

if (result) {
  console.log('File processing completed successfully!');
} else {
  console.log('Failed to process file. Please check the error message above.');
}
