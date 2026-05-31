const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000";

// Token em memória — troque por AsyncStorage se quiser persistir entre sessões
let _token = null;

export function setToken(token) {
    _token = token;
}

async function request(path, options = {}) {
    const headers = { "Content-Type": "application/json" };
    if (_token) headers["Authorization"] = `Bearer ${_token}`;

    const response = await fetch(`${BASE_URL}${path}`, {
        headers,
        ...options,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
    }

    return response.status === 204 ? null : response.json();
}

function options(method, data) {
    return {
        method,
        body: JSON.stringify(data),
    }
}

export const api = {
    listCategories: () => request("/categories"),
    createCategory: (data) => request("/categories", options("POST", data)),
    updateCategory: (id, data) => request(`/categories/${id}`, options("PATCH", data)),
    deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

    listTransactions: (month, year) => request(`/transactions${(month && year)? `?month=${month}&year=${year}` : ""}`),
    createTransaction: (data) => request("/transactions", options("POST", data)),
    updateTransaction: (id, data) => request(`/transactions/${id}`, options("PATCH", data)),
    deleteTransaction: (id) => request(`/transactions/${id}`, { method: "DELETE" }),

    register: (data) => request("/auth/register", options("POST", data)),
    login: (data) => request("/auth/login", options("POST", data)),

    getUser: () => request("/users/"),
    updateUser: (data) => request("/users/", options("PATCH", data)),
};
