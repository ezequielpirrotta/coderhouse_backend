import { Link } from "react-router-dom";

const Item = ({product}) => 
{
    return(
        <div className="card" width= "18rem" >
            <Link to= {`/producto/`+product.id}>
                <img src={product.image} className="card-img-top img-fluid btn" alt={product.name} />
            </Link>
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{"Precio: " + product.currency + product.price}</p>
            </div>
        </div>
    );
}
export default Item;