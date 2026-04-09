const { MASCOT_TYPES } = require('./mascotTypes');

function randomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateColor(zone) {
    const r = randomInRange(zone.rMin, zone.rMax);
    const d = randomInRange(zone.dMin, zone.dMax);
    return `R${r} D${d}`;
}

function generateOutlineColor(zone) {
    const rMin = Math.min(zone.rMax + 1, 12);
    const rMax = Math.min(zone.rMax + 3, 12);
    const r = randomInRange(rMin, rMax);
    const d = randomInRange(zone.dMin, zone.dMax);
    return `R${r} D${d}`;
}

function generatePalette(type) {
    const typeData = MASCOT_TYPES[type];
    const zone = typeData.colorZone;
    return {
        hair: {
            main: generateColor(zone),
            sub: generateColor(zone),
            outline: generateOutlineColor(zone),
        },
        eyes: {
            main: generateColor(zone),
            sub: generateColor(zone),
            outline: generateOutlineColor(zone),
        },
        outfit: {
            top: generateColor(zone),
            bottom: generateColor(zone),
            outline: generateOutlineColor(zone),
        },
        accessory: generateColor(zone),
        paletteName: typeData.palettes[Math.floor(Math.random() * typeData.palettes.length)],
    };
}

module.exports = { generatePalette };
