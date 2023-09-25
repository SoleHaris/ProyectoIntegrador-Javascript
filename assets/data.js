const productsData = [
    {
        id: 1,
        name: "El monstruo de colores",
        category: "0-2",
        price: 8500,
        cardImg: "./assets/img/cuentos de 0-2 años/El monstruo de colores.jpg",
    },
    {
        id: 2,
        name: "El Principito",
        category: "0-2",
        price: 3900,
        cardImg: "./assets/img/cuentos de 0-2 años/El principito para los mas pequenos.jpg",
    },
    {
        id: 3,
        name: "Miau",
        category: "0-2",
        price: 7600,
        cardImg: "./assets/img/cuentos de 0-2 años/Miau.jpg",
    },
    {
        id: 4,
        name: "Tortitas de manteca",
        category: "0-2",
        price: 6000,
        cardImg: "./assets/img/cuentos de 0-2 años/Tortitas de manteca.jpg",
    },
    {
        id: 5,
        name: "A veces mamá...",
        category: "3-5",
        price: 12750,
        cardImg: "./assets/img/cuentos de 3-5 años/A veces mama tiene truenos en la cabeza.jpg",
    },
    {
        id: 6,
        name: "El ratón Perez y su socio",
        category: "3-5",
        price: 5900,
        cardImg: "./assets/img/cuentos de 3-5 años/El raton Perez y su socio.jpg",
    },
    {
        id: 7,
        name: "Helado de dragón",
        category: "3-5",
        price: 4990,
        cardImg: "./assets/img/cuentos de 3-5 años/Helado de Dragon.jpg",
    },
    {
        id: 8,
        name: "El gran libro...",
        category: "3-5",
        price: 9500,
        cardImg: "./assets/img/cuentos de 3-5 años/El gran libro de los super poderes.jpg",
    },
    {
        id: 9,
        name: "Diario de un hada",
        category: "6-8",
        price: 4000,
        cardImg: "./assets/img/cuentos de 6-8 años/Diario de un hada.jpg",
    },
    {
        id: 10,
        name: "Hay un monstruo...",
        category: "6-8",
        price: 6000,
        cardImg: "./assets/img/cuentos de 6-8 años/Hay un monstruo debajo de mi cama.jpg",
    },
    {
        id: 11,
        name: "El poder de los abrazos",
        category: "6-8",
        price: 3950,
        cardImg: "./assets/img/cuentos de 6-8 años/El poder de los abrazos.jpg",
    },
    {
        id: 12,
        name: "Diario de un monstruo",
        category: "6-8",
        price: 4750,
        cardImg: "./assets/img/cuentos de 6-8 años/Diario de un monstruo.jpg",
    },
    {
        id: 13,
        name: "Aquí estamos",
        category: "+9",
        price: 9900,
        cardImg: "./assets/img/cuentos más 9 años/Aqui estamos.jpg",
    },
    {
        id: 14,
        name: "Los atrevidos...",
        category: "+9",
        price: 5500,
        cardImg: "./assets/img/cuentos más 9 años/Los atrevidos y las aventuras en el faro.jpg",
    },
    {
        id: 15,
        name: "El gran libro...",
        category: "+9",
        price: 8700,
        cardImg: "./assets/img/cuentos más 9 años/El gran libro de los mosntruos.jpg",
    },
    {
        id: 16,
        name: "Malvarina",
        category: "+9",
        price: 7400,
        cardImg: "./assets/img/cuentos más 9 años/Malvarina quiero ser bruja.jpg",
    },
];

//función para dividir los productos en arrays de "size" productos
const divideProductsInParts = (size) => {
    let productsList = [];
    for (let i = 0; i < productsData.length; i += size)
        productsList.push(productsData.slice(i, i + size))
    return productsList;
};

//agregamos el concepto de estado
//su función va a ser escuchar, guardar información y manejar mi aplicación
const appState = {
    products: divideProductsInParts(6), 
    currentProductsIndex: 0, 
    productsLimit: divideProductsInParts(6).length,
    activeFilter: null
};