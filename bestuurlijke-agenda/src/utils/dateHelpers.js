// Deze functie zet "25-11-2025" om naar een echte datum waarmee we kunnen rekenen
export function parseDate(dateStr) {
    if (!dateStr) return new Date(9999, 11, 31); // Geen datum? Achteraan de rij.
    
    // Kwartalen opvangen (Q1 2026 -> 01-03-2026)
    if (dateStr.toLowerCase().includes('q')) {
        const parts = dateStr.split(' '); // ["Q3", "2026"]
        const year = parseInt(parts[1]);
        if (dateStr.includes('Q1')) return new Date(year, 2, 1); // Maart
        if (dateStr.includes('Q2')) return new Date(year, 5, 1); // Juni
        if (dateStr.includes('Q3')) return new Date(year, 8, 1); // September
        if (dateStr.includes('Q4')) return new Date(year, 11, 1); // December
        return new Date(year, 0, 1);
    }

    // Jaren (2027)
    if (dateStr.length === 4 && !isNaN(dateStr)) {
        return new Date(parseInt(dateStr), 0, 1);
    }

    // Normale datum: 25-11-2025
    const parts = dateStr.split('-');
    if (parts.length !== 3) return new Date(9999, 11, 31);
    
    // Let op: Maanden in Javascript beginnen bij 0 (0 = Januari, 11 = December)
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Deze functie bepaalt wat de 'sorterings-datum' is van een item
// Hij kijkt naar de EERSTE datum die in het schedule staat.
export function getSortDate(item) {
    if (!item.schedule) return new Date(9999, 11, 31);
    
    // We pakken alle datums uit het schedule
    const dates = Object.values(item.schedule).map(d => parseDate(d));
    
    if (dates.length === 0) return new Date(9999, 11, 31);
    
    // We sorteren ze en pakken de vroegste
    dates.sort((a, b) => a - b);
    return dates[0];
}

// Hulpfunctie voor de maandnaam (bijv: "Januari 2026")
export function getMonthName(dateObj) {
    const months = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
    if (dateObj.getFullYear() === 9999) return "Datum onbekend";
    return `${months[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
}