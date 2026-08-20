import "./TextArea.css";

function TextArea({

    label,

    name,

    value,

    onChange,

    onBlur,

    rows = 5,

    placeholder = "",

    required = false,

    disabled = false,

    helperText,

    error,

    fullWidth = true,

    className = "",

    ...rest

}) {

    return (

        <div
            className={`textarea-group ${fullWidth ? "textarea-full" : ""}`}
        >

            {
                label && (

                    <label className="textarea-label">

                        {label}

                        {
                            required &&
                            <span className="required">*</span>
                        }

                    </label>

                )
            }

            <textarea

                name={name}

                value={value}

                onChange={onChange}

                onBlur={onBlur}

                rows={rows}

                placeholder={placeholder}

                disabled={disabled}

                className={`
                    custom-textarea
                    ${error ? "textarea-error" : ""}
                    ${className}
                `}

                {...rest}

            />

            {
                helperText && !error && (

                    <small className="helper-text">

                        {helperText}

                    </small>

                )
            }

            {
                error && (

                    <small className="error-text">

                        {error}

                    </small>

                )
            }

        </div>

    );

}

export default TextArea;