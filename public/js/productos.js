
document.addEventListener('DOMContentLoaded', () => {
const productsContainer = document.getElementById('products-container')

  // Función para traer productos desde la API
async function fetchProducts() {
    try {
    const res = await fetch('/api/products')
    if (!res.ok) throw new Error('Error al cargar productos')

    const products = await res.json()

    renderProducts(products)
    } catch (error) {
    productsContainer.innerHTML = `<p>Error cargando productos: ${error.message}</p>`
    }
}

  // Función para renderizar productos
function renderProducts(products) {
    if (!products.length) {
        productsContainer.innerHTML = '<p>No hay productos disponibles</p>'
        return
    }

    const html = products.map(product => `
        <div class="product-card">
        <img src="${product.image || '/public/images/default-product.png'}" alt="${product.title}">
        <h3>${product.title}</h3>
        <p>${product.description || ''}</p>
        <p><strong>Precio:</strong> $${product.price}</p>
        <button data-id="${product._id}" class="add-to-cart-btn">Agregar al carrito</button>
        </div>
    `).join('')

    productsContainer.innerHTML = html
    attachAddToCartEvents()
}

  // Función para manejar el click en "Agregar al carrito"
function attachAddToCartEvents() {
    const buttons = document.querySelectorAll('.add-to-cart-btn')
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
        const productId = btn.getAttribute('data-id')
        alert(`Agregaste el producto con ID: ${productId}`)
        // Aquí podés hacer la llamada para agregar al carrito si querés
    })
    })
}

fetchProducts()
})
