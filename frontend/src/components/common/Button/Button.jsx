import "./Button.css";
import { Link } from "react-router-dom";

function Button({

    children,

    type = "button",

    variant = "primary",

    size = "md",

    leftIcon,

    rightIcon,

    loading = false,

    disabled = false,

    fullWidth = false,

    className = "",

    onClick,

    to,

    target = "_self"

}) {

    const classes = `
        btn-custom
        btn-${variant}
        btn-${size}
        ${fullWidth ? "btn-full" : ""}
        ${className}
    `;

    const content = (

        <>

            {

                loading ?

                    <span className="spinner"></span>

                    :

                    <>

                        {

                            leftIcon &&

                            <span className="btn-icon">

                                {leftIcon}

                            </span>

                        }

                        <span className="btn-text">

                            {children}

                        </span>

                        {

                            rightIcon &&

                            <span className="btn-icon">

                                {rightIcon}

                            </span>

                        }

                    </>

            }

        </>

    );

    if (to) {

        return (

            <Link
                to={to}
                target={target}
                className={classes}
            >

                {content}

            </Link>

        );

    }

    return (

        <button

            type={type}

            className={classes}

            onClick={onClick}

            disabled={disabled || loading}

        >

            {content}

        </button>

    );

}

export default Button;