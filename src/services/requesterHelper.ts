// helper to wrap fetch with error handling
export async function safeFetch<T>(url: string, options: RequestInit): Promise<T> {
    try {
        const res = await fetch(url, options);

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Request failed (${res.status}): ${errorText}`);
        }

        return res.json() as Promise<T>;
    } catch (err) {
        console.error("Fetch error:", err);
        throw err; // always throw so frontend can catch
    }
}