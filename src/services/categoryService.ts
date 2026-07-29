const API_URL = import.meta.env.VITE_API_URL;

export const getCategories = async () => {
    const response = await fetch(
        `${API_URL}/api/Category`,
        {
            credentials: "include",
        }
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch categories"
        );
    }

    return response.json();
};