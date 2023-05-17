export const generateProductErrorInfo = (product) => {
    return `Una o más propiedades fueron enviadas incompletas o no son válidas.
        Lista de propiedades requeridas:
            * title: type String, recibido: ${product.title}
            * price: type Int, recibido: ${product.price}
            * stock: type Int, recibido: ${product.stock}
            * image: type String, recibido: ${product.image}
            * id: type String, recibido: ${product.id}
    `;
};