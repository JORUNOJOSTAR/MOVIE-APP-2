// Client-side sanitization utility
class ClientSanitizer {
    /**
     * Escape HTML entities for safe display
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    static escapeHtml(text) {
        if (!text || typeof text !== 'string') {
            return '';
        }
        
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    /**
     * Safely set text content (prevents HTML injection)
     * @param {HTMLElement} element - Target element
     * @param {string} text - Text to set
     */
    static setTextContent(element, text) {
        if (element && text !== undefined) {
            element.textContent = text || '';
        }
    }
    
    /**
     * Safely get text content (prevents HTML injection)
     * @param {HTMLElement} element - Source element
     * @returns {string} - Safe text content
     */
    static getTextContent(element) {
        return element ? element.textContent || '' : '';
    }
    
    /**
     * Create safe HTML content for templates
     * @param {string} template - EJS template string
     * @param {Object} data - Data object with potentially unsafe content
     * @returns {string} - Safe HTML with escaped content
     */
    static renderSafeTemplate(template, data) {
        // Pre-escape all string values in data
        const safeData = {};
        for (const [key, value] of Object.entries(data)) {
            if (typeof value === 'string') {
                safeData[key] = this.escapeHtml(value);
            } else {
                safeData[key] = value;
            }
        }
        
        return ejs.render(template, safeData);
    }
}

// Export for use in modules
export default ClientSanitizer;
