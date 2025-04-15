/**
 * Color utility functions for consistent company color representation
 */

// A predefined set of visually distinct colors
const COMPANY_COLORS = [
  '#3f51b5', // Indigo
  '#f50057', // Pink
  '#4caf50', // Green
  '#ff9800', // Orange
  '#2196f3', // Blue
  '#9c27b0', // Purple
  '#00bcd4', // Cyan
  '#ff5722', // Deep Orange
  '#8bc34a', // Light Green
  '#673ab7',  // Deep Purple
  '#cddc39', // Lime
];

/**
 * Returns a deterministic color for a given company ID or the custom color if set
 * @param {string|object} companyIdOrObj - The unique identifier for the company or company object
 * @returns {string} - Hex color code
 */
export const getCompanyColor = (companyIdOrObj) => {
  // Check if we received a company object with a color property
  if (typeof companyIdOrObj === 'object' && companyIdOrObj !== null) {
    if (companyIdOrObj.color) {
      return companyIdOrObj.color;
    }
    // If company object was passed but has no color, use the ID
    if (companyIdOrObj.id) {
      companyIdOrObj = companyIdOrObj.id;
    }
  }
  
  // Fall back to deterministic color based on ID
  const companyId = String(companyIdOrObj);
  let hash = 0;
  
  for (let i = 0; i < companyId.length; i++) {
    hash = companyId.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Ensure the hash is positive
  hash = Math.abs(hash);
  
  // Get a color from our predefined array using the hash
  return COMPANY_COLORS[hash % COMPANY_COLORS.length];
};

/**
 * Returns a lighter version of a color for hover or secondary elements
 * @param {string} hexColor - The original hex color
 * @param {number} factor - How much to lighten (0-1, default 0.3)
 * @returns {string} - Lightened hex color
 */
export const getLighterColor = (hexColor, factor = 0.3) => {
  // Convert hex to RGB
  let r = parseInt(hexColor.substring(1, 3), 16);
  let g = parseInt(hexColor.substring(3, 5), 16);
  let b = parseInt(hexColor.substring(5, 7), 16);
  
  // Lighten
  r = Math.min(255, r + (255 - r) * factor);
  g = Math.min(255, g + (255 - g) * factor);
  b = Math.min(255, b + (255 - b) * factor);
  
  // Convert back to hex
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
};

/**
 * Returns a darker version of a color for borders or highlights
 * @param {string} hexColor - The original hex color
 * @param {number} factor - How much to darken (0-1, default 0.2)
 * @returns {string} - Darkened hex color
 */
export const getDarkerColor = (hexColor, factor = 0.2) => {
  // Convert hex to RGB
  let r = parseInt(hexColor.substring(1, 3), 16);
  let g = parseInt(hexColor.substring(3, 5), 16);
  let b = parseInt(hexColor.substring(5, 7), 16);
  
  // Darken
  r = Math.max(0, r * (1 - factor));
  g = Math.max(0, g * (1 - factor));
  b = Math.max(0, b * (1 - factor));
  
  // Convert back to hex
  return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
};
