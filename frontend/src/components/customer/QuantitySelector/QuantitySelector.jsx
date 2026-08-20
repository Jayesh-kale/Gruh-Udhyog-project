import "./QuantitySelector.css";

import Button from "../../../components/common/Button/index";

function QuantitySelector({

    quantity,

    onIncrease,

    onDecrease,

    min = 1,

    max = 99

}) {

    return (

        <div className="quantity-selector">

            <Button

                variant="secondary"

                size="sm"

                onClick={onDecrease}

                disabled={quantity <= min}

                iconOnly

            >

                −

            </Button>

            <span className="quantity-value">

                {quantity}

            </span>

            <Button

                variant="primary"

                size="sm"

                onClick={onIncrease}

                disabled={quantity >= max}

                iconOnly

            >

                +

            </Button>

        </div>

    );

}

export default QuantitySelector;