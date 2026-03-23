import { createInterface } from 'readline';

// Create interface for reading from stdin
const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
});

// Store input lines
const allLines = [];
const errorLines = [];

// Error pattern regex
const errorPattern = />>>.*<<</;

// Process input lines
rl.on('line', line => {
    if (errorPattern.test(line)) {
        errorLines.push(line);
    }
    allLines.push(line);
});

// Handle end of input
rl.on('close', () => {
    if (errorLines.length) {
        errorLines.forEach(line => console.error(line));
    } else {
        allLines.forEach(line => console.log(line));
    }
    process.exit(errorLines.length ? 1 : 0);
});

// Handle errors
rl.on('error', err => {
    console.error('Error reading input:', err);
    process.exit(1);
});
