// utils/capitalize.js

/**
 * Mengubah string menjadi kapitalisasi setiap kata (title case)
 * @param {string} str
 * @returns {string}
 */
function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

module.exports = { toTitleCase };