import { Link } from "react-router-dom";
import { MDBCardImage,MDBCardBody,MDBCardText,MDBCardTitle } from "mdb-react-ui-kit";
const Item = ({product}) => 
{
    //console.log(product)
    return(
        
        <div className="card" width= "18rem" >
            <Link to= {`/producto/`+product._id}>
                <MDBCardImage position='top' src={product.thumbnail} alt={product.title}></MDBCardImage>
            </Link>
            <MDBCardBody>
                <MDBCardTitle>{product.title}</MDBCardTitle>
                <MDBCardText>
                    {"Precio: $ " + product.price}
                </MDBCardText>
            </MDBCardBody>
            
        </div>
    );
}
export default Item;
 /**
    <img src={product.thumbnail} className="card-img-top img-fluid btn" alt={product.title} />
  * <div className="card-body">
        <h5 className="card-title">{product.title}</h5>
        <p className="card-text">{"Precio: $ " + product.price}</p>
    </div>
  */