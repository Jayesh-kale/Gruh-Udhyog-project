import "./Modal.css";

function Modal({

    open,

    title,

    children,

    footer,

    onClose

}){

    if(!open) return null;

    return(

        <div className="modal-overlay scrollable-content" style={{ maxHeight: "100vh", overflowY: "auto" }}>

            <div className="modal-box">

                <div className="modal-header">

                    <h4>{title}</h4>

                    <button onClick={onClose}>✕</button>

                </div>

                <div className="modal-body">

                    {children}

                </div>

                {

                    footer &&

                    <div className="modal-footer">

                        {footer}

                    </div>

                }

            </div>

        </div>

    );

}

export default Modal;