import * as fs from 'fs';
let src = fs.readFileSync(0, 'utf-8');
var result = JSON.stringify (src)
console.log (result);
