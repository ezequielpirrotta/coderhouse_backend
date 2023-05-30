import { Link } from "react-router-dom";

const Item = ({product}) => 
{
    return(
        <div className="card" width= "18rem" >
            <Link to= {`/producto/`+product._id}>
                <img src={product.thumbnail} className="card-img-top img-fluid btn" alt={product.title} />
            </Link>
            <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">{"Precio: $ " + product.price}</p>
            </div>
        </div>
    );
}
export default Item;