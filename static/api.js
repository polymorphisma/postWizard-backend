// api.js - Reusable API handler
export async function apiRequest(url, method, data) {
    try {
        const response = await fetch(url, {
            method: method,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }
        return result;
    } catch (error) {
        throw error;
    }
}