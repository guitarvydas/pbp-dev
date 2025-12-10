import * as fs from 'fs';
let src = fs.readFileSync(0, 'utf-8')
    .replace ('%22', '"')
    .replace ('%27', ";")
    .replace ('%E2%80%9C', '"')
;
fs.writeFileSync("/tmp/src", src);
var result = decodeURIComponent (src)
console.log (result);
