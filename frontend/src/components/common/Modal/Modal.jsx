import { useEffect } from "react";
import "./Modal.css";

function Modal({
    open,
    title,
    children,
    footer,
    onClose,
    size = "md",
}) {
    useEffect(() => {
        if (!open) return undefined;

        const handleEscape = (event) => {
            if (event.key === "Escape") {
                onClose?.();
            }
        };

        const originalOverflow = document.body.style.overflow;

        document.addEventListener("keydown", handleEscape);
        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = originalOverflow;
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleBackdropClick = (event) => {
        if (event.target === event.currentTarget) {
            onClose?.();
        }
    };

    return (
        <div
            className="modal-overlay"
            role="presentation"
            onMouseDown={handleBackdropClick}
         >
            <div
                className={`modal-box modal-box--${size}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="modal-header">
                    <div className="modal-title-wrapper">
                        {title && (
                            <h4 className="modal-title" id="modal-title">
                                {title}
                            </h4>
                        )}
                    </div>

                    <button
                        type="button"
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Close dialog"
                    >
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>

                <div className="modal-body scrollable-content">
                    {children}
                </div>

                {footer && (
                    <div className="modal-footer">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Modal;