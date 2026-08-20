import "./Select.css";

function Select({

    label,

    name,

    value,

    onChange,

    onBlur,

    options = [],

    placeholder = "Select an option",

    error,

    helperText,

    required = false,

    disabled = false,

    fullWidth = true,

    className = "",

    ...rest

}) {

    const normalizedOptions = options.map((option) => {

        if (typeof option === "string" || typeof option === "number") {

            return {

                value: option,

                label: option

            };

        }

        return {

            value: option?.value ?? option?.id ?? option?.name ?? "",

            label: option?.label ?? option?.name ?? option?.value ?? ""

        };

    }).filter((option) => option.value !== "" && option.value != null && option.label !== "");

    return (

        <div className={`select-group ${fullWidth ? "select-full" : ""}`}>

            {
                    normalizedOptions.map((option,index) => (

                    <label className="select-label" key={index}>

                        {label}
                        {required && <span className="required">*</span>}

                    </label>

                ))
            }

            <select

                name={name}

                value={value}

                onChange={onChange}

                onBlur={onBlur}

                disabled={disabled}

                className={`
                    custom-select
                    ${error ? "select-error" : ""}
                    ${className}
                `}

                {...rest}

            >

                <option value="">

                    {placeholder}

                </option>

                {

                    options.map((option) => (

                        <option

                            key={option.value}

                            value={option.value}

                        >

                            {option.label}

                        </option>

                    ))

                }

            </select>

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

export default Select;