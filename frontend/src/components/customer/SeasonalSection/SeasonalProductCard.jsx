import { Badge, Button, Card } from "../../common";
import ProductImage from "../ProductImage/ProductImage";



function SeasonalProductCard({ product,icon }) {

    return (

        <Card className="h-100">

            <Badge className="m-3" variant="success">
                <small>{product.season?.join(", ")}</small>
            </Badge>

            <ProductImage
                image={product.image}
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

                    From ₹ {product.packages?.[0]?.price ?? product.defaultOnlinePrice}/
                    {product.packages?.[0]?.label ?? product.unit}

                </span>

                {/* <Button>

                    Order Now{<small>{""}{icon}</small>}

                </Button> */}

            </div>

        </Card>

    );

}

export default SeasonalProductCard;