import "./CartItem.css";
//this code is for the cart item component which is used to display the cart item in the cart page. 
//It takes the item object as a prop and displays the item details like name, type, category, price, quantity and ,
// line total. It also has a quantity selector to increase or decrease the quantity of the item and a remove button 
// to remove the item from the cart. It also has a confirm dialog to confirm the removal of the item from the cart.
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

import Card from "../../../common/Card";
import Badge from "../../../common/Badge";
import Button from "../../../common/Button/Button";
import ConfirmDialog from "../../../common/ConfirmDialog/ConfirmDialog";

import QuantitySelector from "../../QuantitySelector/QuantitySelector";
import { getImageUrl } from "../../../../utils/getImageUrl";

function CartItem({

    item,

    onUpdateQuantity,

    onRemove

}) {

    const [openDialog, setOpenDialog] = useState(false);

    const lineTotal =
        item.defaultOnlinePrice * item.quantity;

    return (

        <>

            <Card
                className="cart-item"
                padding="lg"
            >

                <div className="cart-item-image">

                    <img

                        src={getImageUrl(item.image)}

                        alt={item.name}

                    />

                </div>

                <div className="cart-item-content">

                    <div className="cart-item-header">

                        <div>

                            <h4>

                                {item.name}

                            </h4>

                            {

                                item.type &&

                                <p>

                                    {item.type}

                                </p>

                            }

                        </div>

                        <Badge>

                            {item.category}

                        </Badge>

                    </div>

                    <div className="cart-price">

                        ₹{item.defaultOnlinePrice}

                        <span>

                            {" "} / {item.unit}

                        </span>

                    </div>

                    <div className="cart-quantity">

                        <span>

                            Quantity

                        </span>

                        <QuantitySelector

                            quantity={item.quantity}

                            onIncrease={() =>
                                onUpdateQuantity(
                                    item._id,
                                    item.quantity + 1
                                )
                            }

                            onDecrease={() =>
                                onUpdateQuantity(
                                    item._id,
                                    item.quantity - 1
                                )
                            }

                        />

                    </div>

                    <div className="cart-footer">

                        <div className="line-total">

                            Line Total

                            <strong>

                                ₹{lineTotal}

                            </strong>

                        </div>

                        <Button

                            variant="danger"

                            size="sm"

                            leftIcon={<FaTrashAlt />}

                            onClick={() =>
                                setOpenDialog(true)
                            }

                        >

                            Remove

                        </Button>

                    </div>

                </div>

            </Card>

            <ConfirmDialog

                open={openDialog}

                title="Remove Product"

                message={`Remove "${item.name}" from your cart?`}

                onConfirm={() => {

                    onRemove(item._id);

                    setOpenDialog(false);

                }}

                onCancel={() =>
                    setOpenDialog(false)
                }

            />

        </>

    );

}

export default CartItem;