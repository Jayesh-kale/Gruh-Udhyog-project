import { Badge, Button, Card } from "../../common";
import { getImageUrl } from "../../../utils/getImageUrl";



function SeasonalProductCard({ product,icon }) {

    return (

        <Card className="h-100">

            <Badge className="m-3" variant="success">
                <small>{product.season?.join(", ")}</small>
            </Badge>

            <img
                src={getImageUrl(product.image)}
                alt={product.name}
                className="img-fluid rounded mb-3"
            />

            <h5 className="fw-bold">
                {product.name}
            </h5>

            <p className="text-muted small mb-2">
                {product.description}
            </p>

            <div className="d-flex justify-content-between align-items-center">

                <span className="fw-bold text-success">

                    ₹ {product.defaultOnlinePrice}/kg

                </span>

                {/* <Button>

                    Order Now{<small>{""}{icon}</small>}

                </Button> */}

            </div>

        </Card>

    );

}

export default SeasonalProductCard;