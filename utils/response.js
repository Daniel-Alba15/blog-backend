module.exports = class ApiResponse {
    constructor({ success = true, data = [], error = null }) {
        this.data = data;
        this.success = success;
        this.error = error;

    }

    toJSON() {
        return {
            success: this.success,
            data: this.data,
            error: this.error,
        };
    }
}