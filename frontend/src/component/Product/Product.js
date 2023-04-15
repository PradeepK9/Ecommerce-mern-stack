import { Link } from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const options = {
    edit: false,
    color: "rgba(255,255,255,0.1",
    activeColor: 'tomato',
    size: window.innerWidth < 600 ? 15 : 20,
    value: 2.5,
    isHalf: true
}

const Product = ({ product }) => {
    return (
        <Link className="productCard" to={product.id}>
            <img src={product.images[0].url} alt={product.name} />
            <p>{product.name}</p>
            <div>
                <ReactStars {...options} /> <span>446 Reviews</span>
            </div>
            <span>{product.price}</span>
        </Link>
    )
}

export default Product;