//Contenedor de productos
const productsContainer = document.querySelector(".products-container");
const showMoreBtn = document.querySelector(".btn-load");
//Contenedor de categorías
const categoriesContainer = document.querySelector(".categories");
const categoriesList = document.querySelectorAll(".category");
//Carrito
const cartBtn = document.querySelector(".cart-label");
const cartMenu = document.querySelector(".cart");
//Botón Menú
const menuBtn = document.querySelector(".menu-label");
//Navbar-List
const barsMenu = document.querySelector(".navbar-list");
//Overlay
const overlay = document.querySelector(".overlay");
//
const productsCart = document.querySelector(".cart-container");
//
const total = document.querySelector(".total");
//
const successModal = document.querySelector(".add-modal");
//Botón comprar
const buyBtn = document.querySelector(".btn-buy");
//Botón vaciar
const deleteBtn = document.querySelector(".btn-delete");
//Burbuja carrito
const cartBubble = document.querySelector(".cart-bubble");

//Formulario contacto


//Función rpara renderizas una lista de productos
const createProductTemplate = (product) => {
    const { id, name, price, cardImg } = product;
    return `

    <div class="product">
        <img src="${cardImg}" alt=${name}>
        <div class="product-txt">
            <h3>${name}</h3>
            <p>$${price}</p>
        </div>    
        <div class="btn">
            <button class="btn-add"
            data-id='${id}' 
            data-name='${name}' 
            data-price='${price}' 
            data-img='${cardImg}'>Agregar al carrito</button>
        </div>
    </div>
    `;
};

//Función para averiguar si el índice actual renderizado de la lista de productos es igual al límite de productos
const isLastIndexOf = () => {
    return appState.currentProductsIndex === appState.productsLimit -1;
};

//Función para mostrar más productos ante el click del usuario en el botón "ver más"
const showMoreProducts = () => {
    appState.currentProductsIndex += 1;
    let { products, currentProductsIndex } = appState;
    renderProducts(products[currentProductsIndex]);
    if (isLastIndexOf()) {
        showMoreBtn.classList.add("hidden");
    }
};

//Función que me permite el primer renderizado de mi aplicación
//sin necesidad de escuchar un evento
const renderProducts = (productsList) => {
    productsContainer.innerHTML += productsList
    .map(createProductTemplate)
    .join("");
};

//Función para aplicar el filtro cuando se clickea el botón de categoría
const applyFilter = ({ target }) => {
    if(!isInactiveFilterBtn(target)) return;
    changeFilterState(target);
    //si vamos a mostrar cosas filtradas tengo que limpiar el div
    productsContainer.innerHTML = '';
    if (appState.activeFilter) {
        renderFilteredProducts();
        appState.currentProductsIndex = 0;
        return;
    }
    renderProducts(appState.products[0]);
};

//Renderizar los productos filtrados
const renderFilteredProducts = () => {
    const filteredProducts = productsData.filter((product) => product.category === appState.activeFilter
    );
    renderProducts(filteredProducts);
};

//Chequeo si el botón que se apretó no es un botón de categoría o ya está activo, no hace nada
const isInactiveFilterBtn = (element) => {
    return (
        element.classList.contains("category") && !element.classList.contains("active")
    );
};

//Cambio el estado del filtro
const changeFilterState = (btn) => {
    appState.activeFilter = btn.dataset.category;
    changeBtnActiveState(appState.activeFilter);
    setShowMoreVisibility();
};

//Función para cambiar el estado de los botones de categorías
const changeBtnActiveState = (selectedCategory) => {
    const categories = [...categoriesList];
    categories.forEach((categoryBtn) => {
        if (categoryBtn.dataset.category !== selectedCategory) {
            categoryBtn.classList.remove("active");
            return;
        }
        categoryBtn.classList.add("active");
    }) 
};

//Función para mostrar u ocultar el botón de "ver más" según corresponda
const setShowMoreVisibility = () => {
    if (!appState.activeFilter) {
        showMoreBtn.classList.remove("hidden")
        return
    }
    showMoreBtn.classList.add("hidden")
};

//Esta función tiene que hacer un par de cosas
//Togglea el cart (abrir y cerrar) y si el menú está abierto, lo cierra. Finalmente esta función muestra el overlay si no había nada abierto y se está abriendo el carrito
const toggleCart = () => {
    //acá le digo a cartMenu que cada vez que el user haga click, va a tener la clase open-cart
    cartMenu.classList.toggle("open-cart");

    //chequear si el menú hamburguesa está abierto, lo cierro y retorno
    if (barsMenu.classList.contains("open-menu")) {
        barsMenu.classList.remove("open-menu");
        return; //si ya había algo abierto, no se togglea el overlay
    }
    //si está cerrado, entramos a la clase y la cambiamos con toggle
    overlay.classList.toggle("show-overlay");
};

//Función para mostrar u ocultar el menú hamburguesa y el overlay, según corresponda
const toggleMenu = () => {
    barsMenu.classList.toggle("open-menu");
    if (cartMenu.classList.contains("open-cart")) {
        cartMenu.classList.remove("open-cart");
        return; //si ya había algo abierto, no se togglea el overlay, por eso el return
    }
    overlay.classList.toggle("show-overlay");
};

//Función para cerrar el menú hamburguesa o el carrito y ocultar el overlay cuando el user scrolee
const closeOnScroll = () => {
    if (
        !barsMenu.classList.contains("open-menu") && 
        !cartMenu.classList.contains("open-cart")
    ) {
        return
    };
    barsMenu.classList.remove("open-menu");
    cartMenu.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
};

//Función para cerrar el menú hamburguesa y el overlay cuando se hace click en un link
const closeOnClick = (e) => {
    //chequeo que sea un click en el link
    if (!e.target.classList.contains("navbar-link")) {
        return
    };
    //si estoy efectivamente haciendo click en una etiqueta a
    barsMenu.classList.remove("open-menu");
    overlay.classList.remove("show-overlay");
};

//Función para cerrar el menú hamburguesa o el carrito y ocultar el overlay cuando el usuario hace click en el overlay
const closeOnOverlayClick = () => {
    barsMenu.classList.remove("open-menu");
    cartMenu.classList.remove("open-cart");
    overlay.classList.remove("show-overlay");
};


//RENDERIZAR EL CARRITO
//el carrito será un arreglo de pequeños objetos y vamos a aplicarle una lógica parecida al todoList

//setear el carrito vacío o lo que esté en localStorage (para hacerlo persistente)
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const saveCart = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
};

//ya tenemos el carrito guardado, ahora hay que armar la lógica del renderizado
//hacer una función para renderizar los productos del carrito o enviar el mensaje "no hay productos"
const renderCart = () => {
    //capturo el lugar a donde quiero mostrar el carrito
    if (!cart.length) {
        productsCart.innerHTML = `
        <p class="empty-msg">No hay productos en el carrito</p>
        `;
        return;
    }
    productsCart.innerHTML = cart.map(createCartProductTemplate).join("");
};

//Función para crear el template de un producto del carrito
const createCartProductTemplate = (cartProduct) => {
    const  { id, name, price, img, quantity } = cartProduct;
    return `
    <div class="cart-item">
        <img src="${img}" alt=${name} />
        <div class="item-info">
            <h3 class="item-title">${name}</h3>
            <span class="item-price">$${price}</span>
        </div>
        <div class="item-handler">
            <span class="quantity-handler down" data-id=${id}>-</span>
            <span class="item-quantity">${quantity}</span>
            <span class="quantity-handler up" data-id=${id}>+</span>
        </div>  
    </div>
    `
};

//Función para mostrar el total de la compra
const showCartTotal = () => {
    //acá voy a necesitar una función auxiliar que me traiga el total del carrito
    total.innerHTML = `$${getCartTotal().toFixed(2)}`;
};

//Función para obtener el total de la compra
//método reduce = valor actual (cur/current) + el acc (acumulado)
const getCartTotal = () => {
    return cart.reduce((acc, cur) => acc + Number(cur.price) * cur.quantity, 0)
};

//ahora pasamos a la lógica para agregar al carrito
//Función para crear un objeto con la información del producto que quiero agregar al carrito o bien agregar una unidad de un producto ya incorporado en mi carrito
const addProduct = (e) => {
    //primero mi función recibe el evento y después tengo que saber si el click proviene del botón del producto
    if (!e.target.classList.contains("btn-add")) { 
        return 
    };
    //ahora vamos a la otra lógica y acá me voy a guardar el dataset del producto que estoy agregando para luego revisar si existe o no en el carrito (para saber si agrego la card o la cantidad de ese producto)

    //llamo a la función para desestructurar lo que necesito utilizar
    const product = createProductData(e.target.dataset);
    //comprobar si el producto ya lo tengo en el carrito
    if (isExistingCartProduct(product)) {
        addUnitToProduct(product);
        //mostrar un feedback al usuario
        showSuccessModal("Se agregó una unidad del producto al carrito");
    } else {
        //creamos el producto en el carrito y dar feedback al usuario
        createCartProduct(product);
        showSuccessModal("El producto se ha agregado al carrito")
    };
    
    updateCartState();

};

//Función para darle una devolución al usuario
const showSuccessModal = (msg) => {
    successModal.classList.add("active-modal");
    successModal.textContent = msg;
    setTimeout(() => {
        successModal.classList.remove("active-modal")
    }, 1500);
};

//Función desestructuradora
const createProductData = (product) => {
    const { id, name, price, img } = product;
    return { id, name, price, img };
};

//Función que comprueba si el producto ya fue agregado al carrito
const isExistingCartProduct = (product) => {
    return cart.find((item) => item.id === product.id);
};

//Función que me va a permitir agregar una unidad al producto que ya tengo en el carrito
const addUnitToProduct = (product) => {
    cart = cart.map((cartProduct) => 
        cartProduct.id === product.id
            ? { ...cartProduct, quantity: cartProduct.quantity + 1 }
            : cartProduct
    );
};

//Creamos un objeto con la info del producto que queremos agregar
const createCartProduct = (product) => {
    cart = [...cart, {...product, quantity: 1}];
};

//Habilitar o deshabiliar un botón según corresponda
//la lógica la comparten, si el carrito está vacío los saco a ambos, por el contrario, si hay algo en el cart los habilito
const disableBtn = (btn) => {
    if (!cart.length) {
        btn.classList.add("disabled");
    } else {
        btn.classList.remove("disabled");
    }
};

//Función para actualizar la cantidad de productos que el usuario va guardando en el carrito 
const renderCartBubble = () => {
    //acá tenemos que mostrar la suma de los quantitis, por lo tanto aplico un método que se llama reduce
    cartBubble.textContent = cart.reduce((acc, cur) => {
        return acc + cur.quantity;
    }, 0); 
};

//Función de actualización del carro
const updateCartState = () => {
    //guardar carrito en localStorage
    saveCart();
    //renderizo el carrito
    renderCart();
    //muestro el total
    showCartTotal();
    //usamos la misma función para ambos botones
    disableBtn(buyBtn);
    disableBtn(deleteBtn);

    //burbuja
    renderCartBubble();
};

//Función para manejar el evento click del botón de más de cada producto del carrito
const handlePlusBtnEvent = (id) => {
    const existingCartProduct = cart.find((item) => item.id === id);
    addUnitToProduct(existingCartProduct);
};

//Función para manejar el evento click del botón menos de cada producto del carrito

const handleMinusBtnEvent = (id) => {
    const existingCartProduct = cart.find((item) => item.id === id);
    // Si se toco en un item con uno solo de cantidad
    if (existingCartProduct.quantity === 1) {
        if (window.confirm("¿Desea Eliminar el producto del carrito?")) {
        removeProductFromCart(existingCartProduct);
    }
      return; // Si no termino confirmando la eliminación, no hace nada, ya que sino la cantidad quedaría en 0, así que cortamos la ejecución.
    }
    substractProductUnit(existingCartProduct);
};

//Función parad quitar una unidad de producto
//se recorre el array del carrito y se busca el producto que se quiere eliminar una unidad. Si el producto pasado como parámetro es igual al producto que se está recorriendo, se le resta una unidad a la propiedad "quantity" y se actualiza el array del carrito. Si eso no ocurre, se retorna el producto que se esta recorriendo tal cual está.
const substractProductUnit = (existingProduct) => {
    cart = cart.map((product) => {
        return product.id === existingProduct.id
        ? { ...product, quantity: Number(product.quantity) - 1 }
        : product;
    });
};

//Función para eliminar un producto del carrito
const removeProductFromCart = (existingProduct) => {
    cart = cart.filter((product) => product.id !== existingProduct.id);
    updateCartState();
};

//Función que maneja los eventos de apretar el botón de más o de menos según corresponda
const handleQuantity = (e) => {
    if (e.target.classList.contains("down")) {
        handleMinusBtnEvent(e.target.dataset.id);
    } else if (e.target.classList.contains("up")) {
        handlePlusBtnEvent(e.target.dataset.id);
    }
    //Para todos los casos
    updateCartState();
};

//Función para vaciar el carrito
const resetCartItems = () => {
    cart = [];
    updateCartState();
};

//Función para completar la compra o vaciar el carrito
const completeCartAction = (confirmMsg, successMsg) => {
    if (!cart.length) return; //Si el carrito está vacío, no hace nada.
    if (window.confirm(confirmMsg)) {
        resetCartItems();
        alert(successMsg);
    }
};

//Función para disparar el mensaje de compra exitosa y su posterior mensaje de exito en caso de darse la confirmación.
const completeBuy = () => {
    completeCartAction("¿Desea completar su compra?", "¡Gracias por su compra!");
};

//Función para disparar el mensaje de vaciado de carrito y su posterior mensaje de exito en caso de darse la confirmación
const deleteCart = () => {
    completeCartAction(
        "¿Desea vaciar el carrito?",
        "No hay productos en el carrito"
    );
};

//Función inicializadora
const init = () => {
    renderProducts(appState.products[0]);
    showMoreBtn.addEventListener("click", showMoreProducts);
    categoriesContainer.addEventListener("click", applyFilter);
    cartBtn.addEventListener("click", toggleCart);
    menuBtn.addEventListener("click", toggleMenu);
    window.addEventListener("scroll", closeOnScroll);
    barsMenu.addEventListener("click", closeOnClick);
    overlay.addEventListener("click", closeOnOverlayClick);
    document.addEventListener("DOMContentLoaded", renderCart);
    document.addEventListener("DOMContentLoaded", showCartTotal);
    productsContainer.addEventListener("click", addProduct);
    productsCart.addEventListener("click", handleQuantity);
    buyBtn.addEventListener("click", completeBuy);
    deleteBtn.addEventListener("click", deleteCart);
    disableBtn(buyBtn);
    disableBtn(deleteBtn);
    renderCartBubble(cart);
};  
init();
