/**
 * Parses URL parameters and converts them to specified types (supports automatic conversion of strings, numbers, arrays, etc.)
 * @param url - The full URL or query parameter string
 * @returns Parsed parameter objects (generic T)
 */
export function parseUrlParams(url) {
    const searchParams = new URLSearchParams(url.includes("?") ? url.split("?")[1] : url);
    const result = {};
    searchParams.forEach((value, key) => {
        // 自动转换数字、布尔值和数组
        if (!isNaN(Number(value))) {
            result[key] = Number(value);
        }
        else if (value.toLowerCase() === "true" || value.toLowerCase() === "false") {
            result[key] = value.toLowerCase() === "true";
        }
        else if (value.includes(",")) {
            result[key] = value.split(",").map(item => decodeURIComponent(item));
        }
        else {
            result[key] = decodeURIComponent(value);
        }
    });
    return result;
}
