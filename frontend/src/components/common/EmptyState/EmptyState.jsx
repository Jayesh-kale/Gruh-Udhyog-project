import "./EmptyState.css";

function EmptyState({

    image,

    title,

    subtitle,

    action

}) {

    return (

        <div className="empty-state">

            {

                image &&

                <img

                    src={image}

                    alt={title}

                />

            }

            <h3>{title}</h3>

            <p>{subtitle}</p>

            {action}

        </div>

    );

}

export default EmptyState;