import { useEffect, useState } from "react";
import { getImageUrl, PRODUCT_PLACEHOLDER } from "../../../utils/getImageUrl";

function ProductImage({ image, alt = "", className = "", ...props }) {
    const [src, setSrc] = useState(() => getImageUrl(image));

    useEffect(() => {
        setSrc(getImageUrl(image));
    }, [image]);

    return (
        <img
            {...props}
            className={className}
            src={src}
            alt={alt}
            onError={() => {
                if (src !== PRODUCT_PLACEHOLDER) {
                    setSrc(PRODUCT_PLACEHOLDER);
                }
            }}
        />
    );
}

export default ProductImage;
