import "./Spinner.css";

function Spinner({

    size = 18,

    color = "#fff"

}) {

    return (

        <span

            className="spinner"

            style={{

                width:size,

                height:size,

                borderTopColor:color

            }}

        />

    );

}

export default Spinner;