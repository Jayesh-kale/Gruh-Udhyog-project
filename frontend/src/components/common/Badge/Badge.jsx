import "./Badge.css";

function Badge({
    children,
    variant = "primary",
    rounded = true
}) {
    return (
        <span
            className={`
                badge-custom
                badge-${variant}
                ${rounded ? "badge-rounded" : ""}
            `}
        >
            {children}
        </span>
    );
}

export default Badge;