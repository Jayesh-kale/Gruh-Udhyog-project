import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./Input.css";

function Input({

    label,

    type = "text",

    placeholder = "",

    value,

    onChange,

    onBlur,

    name,

    error,

    helperText,

    required = false,

    disabled = false,

    leftIcon,

    rightIcon,

    fullWidth = true,

    className = "",

    ...rest

}) {

    const [showPassword, setShowPassword] = useState(false);

    const inputType =
        type === "password"
            ? (showPassword ? "text" : "password")
            : type;

    return (

        <div
            className={`input-group-custom ${fullWidth ? "input-full" : ""}`}
        >

            {
                label &&

                <label className="input-label">

                    {label}

                    {
                        required &&
                        <span className="required">*</span>
                    }

                </label>
            }

            <div className={`input-wrapper ${error ? "input-error" : ""}`}>

                {
                    leftIcon &&
                    <span className="input-icon left">

                        {leftIcon}

                    </span>
                }

                <input

                    type={inputType}

                    name={name}

                    value={value}

                    onChange={onChange}

                    onBlur={onBlur}

                    placeholder={placeholder}

                    disabled={disabled}

                    className={`custom-input ${className}`}

                    {...rest}

                />

                {

                    type === "password" ?

                        <button

                            type="button"

                            className="password-toggle"

                            onClick={() => setShowPassword(!showPassword)}

                        >

                            {

                                showPassword ?

                                    <FaEyeSlash />

                                    :

                                    <FaEye />

                            }

                        </button>

                        :

                        rightIcon &&

                        <span className="input-icon right">

                            {rightIcon}

                        </span>

                }

            </div>

            {

                helperText && !error &&

                <small className="helper-text">

                    {helperText}

                </small>

            }

            {

                error &&

                <small className="error-text">

                    {error}

                </small>

            }

        </div>

    );

}

export default Input;