#!/usr/bin/env node

/**
 * Translate drawio IDs to short IDs in diagram cells
 * @param {Array} data - Array containing diagrams and map object
 * @returns {Array} - Transformed data with translated IDs
 */
function translateIds(data) {
    // Get the map directly - no loop needed with object structure!
    const map = data.find(item => item.map).map;
    
    // Transform each item
    return data.map(item => {
        if (item.type !== "diagram") return item;
        
        return {
            ...item,
            cells: item.cells.map(cell => ({
                ...cell,
                parent: map[cell.parent] || cell.parent,
                source: map[cell.source] || cell.source,
                target: map[cell.target] || cell.target
            }))
        };
    });
}

/**
 * Forward lookup: Get short ID from drawio ID
 * @param {string} drawioId - The drawio ID to look up
 * @param {Object} map - The map object {drawio_id: short_id}
 * @returns {string|undefined} - The short ID, or undefined if not found
 */
function getShortId(drawioId, map) {
    return map[drawioId];
}

/**
 * Reverse lookup: Get drawio ID from short ID (linear search)
 * @param {string} shortId - The short ID to look up
 * @param {Object} map - The map object {drawio_id: short_id}
 * @returns {string|undefined} - The drawio ID, or undefined if not found
 */
function getDrawioId(shortId, map) {
    return Object.keys(map).find(key => map[key] === shortId);
}

// Main execution - read from stdin, write to stdout
if (require.main === module) {
    let inputData = '';
    
    process.stdin.setEncoding('utf8');
    
    process.stdin.on('data', chunk => {
        inputData += chunk;
    });
    
    process.stdin.on('end', () => {
        try {
            const data = JSON.parse(inputData);
            const result = translateIds(data);
            process.stdout.write(JSON.stringify(result, null, 2));
            process.stdout.write('\n');
        } catch (err) {
            console.error('Error:', err.message);
            process.exit(1);
        }
    });
}

module.exports = { translateIds, getShortId, getDrawioId };
