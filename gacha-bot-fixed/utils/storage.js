const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '..', 'data', 'mascots.json');

function ensureDataDir() {
    const dir = path.dirname(DATA_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));
}

function load() {
    ensureDataDir();
    try { return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8')); }
    catch { return {}; }
}

function save(data) {
    ensureDataDir();
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

function getKey(userId, guildId) { return `${userId}_${guildId}`; }

function generateId() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function migrateIfNeeded(raw) {
    if (!raw) return { activeMascotId: null, mascots: {} };
    if (raw.mascots !== undefined) return raw;
    const id = generateId();
    return { activeMascotId: id, mascots: { [id]: { ...raw, id } } };
}

function getUserData(userId, guildId) {
    const data = load();
    return migrateIfNeeded(data[getKey(userId, guildId)]);
}

function setUserData(userId, guildId, userData) {
    const data = load();
    data[getKey(userId, guildId)] = userData;
    save(data);
}

function getActiveMascot(userId, guildId) {
    const ud = getUserData(userId, guildId);
    if (!ud.activeMascotId || !ud.mascots[ud.activeMascotId]) return null;
    return ud.mascots[ud.activeMascotId];
}

function getMascot(userId, guildId) {
    return getActiveMascot(userId, guildId);
}

function setMascot(userId, guildId, mascot) {
    if (!mascot) return;
    const ud = getUserData(userId, guildId);
    if (ud.activeMascotId && ud.mascots[ud.activeMascotId]) {
        ud.mascots[ud.activeMascotId] = { ...mascot, id: ud.activeMascotId };
        setUserData(userId, guildId, ud);
    }
}

function addMascot(userId, guildId, mascot) {
    const id = generateId();
    const ud = getUserData(userId, guildId);
    mascot.id = id;
    ud.mascots[id] = mascot;
    if (!ud.activeMascotId || !ud.mascots[ud.activeMascotId]) {
        ud.activeMascotId = id;
    }
    setUserData(userId, guildId, ud);
    return id;
}

function getMascotById(userId, guildId, id) {
    const ud = getUserData(userId, guildId);
    return ud.mascots[id] || null;
}

function getAllMascots(userId, guildId) {
    const ud = getUserData(userId, guildId);
    return { mascots: Object.values(ud.mascots), activeMascotId: ud.activeMascotId };
}

function setActiveMascot(userId, guildId, id) {
    const ud = getUserData(userId, guildId);
    if (!ud.mascots[id]) return false;
    ud.activeMascotId = id;
    setUserData(userId, guildId, ud);
    return true;
}

function deleteMascotById(userId, guildId, id) {
    const ud = getUserData(userId, guildId);
    if (!ud.mascots[id]) return null;
    const deleted = { ...ud.mascots[id] };
    delete ud.mascots[id];
    let newActive = null;
    if (ud.activeMascotId === id) {
        const remaining = Object.keys(ud.mascots);
        if (remaining.length > 0) {
            ud.activeMascotId = remaining[0];
            newActive = ud.mascots[remaining[0]];
        } else {
            ud.activeMascotId = null;
        }
    }
    setUserData(userId, guildId, ud);
    return { deleted, newActive };
}

function updateMascot(userId, guildId, id, mascot) {
    const ud = getUserData(userId, guildId);
    if (!ud.mascots[id]) return false;
    ud.mascots[id] = { ...mascot, id };
    setUserData(userId, guildId, ud);
    return true;
}

function getActiveMascotId(userId, guildId) {
    return getUserData(userId, guildId).activeMascotId;
}

module.exports = {
    getMascot, setMascot, getActiveMascot, addMascot,
    getMascotById, getAllMascots, setActiveMascot,
    deleteMascotById, updateMascot, getActiveMascotId,
};
