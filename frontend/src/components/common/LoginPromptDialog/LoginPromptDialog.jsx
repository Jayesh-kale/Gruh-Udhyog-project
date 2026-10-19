import Modal from "../Modal";
import Button from "../Button";

function LoginPromptDialog({ open, onConfirm, onCancel }) {
    return (
        <Modal
            open={open}
            title="Login required"
            onClose={onCancel}
            footer={
                <>
                    <Button variant="secondary" onClick={onCancel}>
                        No
                    </Button>
                    <Button variant="primary" onClick={onConfirm}>
                        Yes
                    </Button>
                </>
            }
        >
            <p>Do you want to login to continue?</p>
        </Modal>
    );
}

export default LoginPromptDialog;
