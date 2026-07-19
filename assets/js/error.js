// assets/js/error.js

/**
 * Handles platform errors and drops structural trace reports to the debugger console
 */
export default class RoxinError {
    /**
     * @param {string} message 
     */
    constructor(message) {
        this.message = message;
        this.timestamp = new Date().toISOString();
        this.logError();
    }

    logError() {
        console.error(`[Roxin Error Reporting] Core Event Triggered At: ${this.timestamp}`);
        console.error(`Message Trace Details: ${this.message}`);
    }
}
