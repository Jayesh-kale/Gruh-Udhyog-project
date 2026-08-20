import "./Card.css";

function Card({

    children,

    className = "",

    hover = true,

    shadow = "md",

    padding = "md",

    rounded = "lg",

    onClick,

}) {

    return (

        <div

            onClick={onClick}

            className={`
                card-custom
                card-shadow-${shadow}
                card-padding-${padding}
                card-rounded-${rounded}
                ${hover ? "card-hover" : ""}
                ${className}
            `}

        >

            {children}

        </div>

    );

}

export default Card;