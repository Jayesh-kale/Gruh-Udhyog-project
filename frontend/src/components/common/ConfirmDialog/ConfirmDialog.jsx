import Modal from "../Modal";
import Button from "../Button";

function ConfirmDialog({

    open,

    title="Confirmation",

    message,

    onConfirm,

    onCancel

}){

    return(

        <Modal

            open={open}

            title={title}

            onClose={onCancel}

            footer={

                <>

                    <Button
                        variant="secondary"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="danger"
                        onClick={onConfirm}
                    >
                        Confirm
                    </Button>

                </>

            }

        >

            <p>{message}</p>

        </Modal>

    );

}

export default ConfirmDialog;