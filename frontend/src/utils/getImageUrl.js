export const PRODUCT_PLACEHOLDER = "/images/product-placeholder.svg";

export function getImageUrl(image) {
    if (typeof image === "string" && image.trim()) {
        return image;
    }

    if (image?.url && typeof image.url === "string") {
        return image.url;
    }

    return PRODUCT_PLACEHOLDER;
}
