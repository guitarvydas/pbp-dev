function encodews (s) { return encodequotes (encodeURIComponent (s)); }

function encodequotes (s) { 
    let rs = s.replace (/"/g, '%22').replace (/'/g, '%27');
    return rs;
}

let linenumber = 0;
function getlineinc () {
    linenumber += 1;
    return `${linenumber}`;
}

function part (s, i) {
    let lis = s.split ("⫶");
    let len = lis.length - 1
    let r = []
    let ix = Number (i);
    for (; ix < len ; ix += 3) {
	r.push (`${lis [ix]}`);
    }
    return `${r.join ('')}`;
}

function enspace (arr) {
    // create space-separated args for exec
    return arr;
    //return arr.join (" ");
}

function pycommentify (s) {
    return s;
    //return s.replaceAll (/\n/g, "\n#").replaceAll ("%0A", "%0A#");
}
