/**
 * @typedef {Object} categoria
 * @description Categoria de uma transação
 * @property {string?} id
 * @property {string?} name
 * @property {string?} displayName
 * @property {string?} icon
 * @property {string?} background
 * @property {boolean?} isIncome
 */

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://10.0.2.2:3000";

let _token = null;

/**
 * @description Seta um token JWT internamente para rotas privadas
 * @param {string | null} token O token JWT
 */
export function setToken(token) {
    _token = token;
}

/**
 * @description Retorna dados da API do aplicativo.
 * Certifique-se que o MySQL está ativo, o banco foi criado, e que a API esteja OK
 * @param {string} path A rota da API REST
 * @param {{method?: "POST" | "DELETE" | "PATCH" | "GET", body?: string}} options Opções da requisição
 * @returns {null | Promise<any>} `null`, caso tenha havido DELETE, ou o JSON de resposta
 */
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

/**
 * @description Cria um objeto para realizar o `fetch()` das rotas
 * @param {"POST" | "DELETE" | "PATCH" | "GET"} method Verbo HTTP usado para a requisição
 * @param {Object} data Conteúdos do corpo da requisição
 * @returns {{method: "POST" | "DELETE" | "PATCH" | "GET", body: string}} Opções para `request()`
 */
function options(method, data) {
    return {
        method,
        body: JSON.stringify(data),
    }
}

/**
 * @description Retorna query formatada de mês e ano
 * @param {number?} month Mês
 * @param {number?} year ano
 * @returns {string} String formatada de query
 */
function dateQuery(month, year) {
    return (month && year)? `?month=${month}&year=${year}` : "";
}

export const api = {
    /**
     * @description Lista categorias
     * @returns {categoria[]} Uma lista de categorias
     */
    listCategories: () => request("/categories"),
    /**
     * @description Cria uma categoria
     * @param {categoria} data Dados da categoria
     * @returns {Promise<categoria>} A categoria criada
     */
    createCategory: (data) => request("/categories", options("POST", data)),
    /**
     * @description Atualiza uma categoria
     * @param {string} id O ID da categoria
     * @param {categoria} data Os novos dados da categoria
     * @returns {Promise<categoria>} A categoria com as atualizações
     */
    updateCategory: (id, data) => request(`/categories/${id}`, options("PATCH", data)),
    /**
     * @description Deleta uma categoria
     * @param {string} id O ID da categoria a ser deletada
     * @returns {Promise<void>}
     */
    deleteCategory: (id) => request(`/categories/${id}`, { method: "DELETE" }),

    listTransactions: (month, year) => request(`/transactions${dateQuery(month, year)}`),
    createTransaction: (data) => request("/transactions", options("POST", data)),
    updateTransaction: (id, data) => request(`/transactions/${id}`, options("PATCH", data)),
    deleteTransaction: (id) => request(`/transactions/${id}`, { method: "DELETE" }),

    register: (data) => request("/auth/register", options("POST", data)),
    login: (data) => request("/auth/login", options("POST", data)),

    getUser: () => request("/users/"),
    updateUser: (data) => request("/users/", options("PATCH", data)),
};
