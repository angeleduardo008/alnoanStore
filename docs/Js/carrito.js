document.addEventListener('DOMContentLoaded', function() {
    // Configuración base
    const BACKEND_URL = 'http://localhost:5000'; // URL de tu backend Node.js
    let cartId = localStorage.getItem('cartId') || null;

    // Selectores mejorados
    const cartContainer = document.querySelector('.cart-items');
    const summaryContainer = document.querySelector('.cart-summary');
    
    // Función mejorada para hacer peticiones al backend
    async function fetchCart(action, method = 'POST', data = {}) {
        try {
            const url = `${BACKEND_URL}/api/cart${action}`;
            const options = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
                }
            };
            
            if (method !== 'GET') {
                options.body = JSON.stringify(data);
            }
            
            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en la petición');
            }
            return await response.json();
        } catch (error) {
            console.error('Error:', error);
            showAlert(error.message, 'error');
            return null;
        }
    }

    // Función para añadir productos al carrito (reemplaza los onclick)
    async function setupAddToCartButtons() {
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.add-to-cart')) {
                const button = e.target.closest('.add-to-cart');
                const productCard = button.closest('.product-card');
                const productId = productCard.dataset.productId;
                const productName = productCard.querySelector('h3').textContent;
                
                try {
                    const result = await fetchCart('/add', 'POST', { 
                        productId, 
                        quantity: 1 
                    });
                    
                    if (result) {
                        showAlert(`${productName} añadido al carrito`, 'success');
                        await loadCart(); // Actualizar vista del carrito
                        updateCartCount(); // Actualizar contador
                    }
                } catch (error) {
                    showAlert(error.message, 'error');
                }
            }
        });
    }

    // Actualizar contador de productos en el ícono del carrito
    function updateCartCount() {
        const countElement = document.getElementById('cart-count');
        const count = document.querySelectorAll('.cart-item').length;
        countElement.textContent = count;
        countElement.style.display = count > 0 ? 'block' : 'none';
    }

    // Función para manejar cambios de cantidad
    async function handleQuantityChange(productId, change) {
        const quantityElement = document.querySelector(`.quantity[data-id="${productId}"]`);
        let newQuantity = parseInt(quantityElement.textContent) + change;
        newQuantity = Math.max(1, newQuantity); // No permitir menos de 1
        
        const result = await fetchCart('/update', 'PUT', {
            productId,
            quantity: newQuantity
        });
        
        if (result) {
            quantityElement.textContent = newQuantity;
            updateTotals(result); // Usar datos del backend
        }
    }

    // Función para eliminar items
    async function handleRemoveItem(productId) {
        const result = await fetchCart(`/remove/${productId}`, 'DELETE');
        if (result) {
            document.querySelector(`.cart-item[data-id="${productId}"]`).remove();
            updateTotals(result);
            updateCartCount();
        }
    }

    // Función mejorada para actualizar totales
    function updateTotals(cartData) {
        if (cartData) {
            // Usar datos del backend si están disponibles
            document.querySelector('.subtotal span').textContent = `$${cartData.subtotal.toFixed(2)}`;
            document.querySelector('.discount-value').textContent = `-$${cartData.discount.toFixed(2)}`;
            document.querySelector('.shipping span').textContent = `$${cartData.shipping.toFixed(2)}`;
            document.querySelector('.total-value').textContent = `$${cartData.total.toFixed(2)}`;
        } else {
            // Cálculo de respaldo (solo frontend)
            const subtotal = Array.from(document.querySelectorAll('.cart-item')).reduce((total, item) => {
                const price = parseFloat(item.querySelector('.product-price').textContent.replace('$', ''));
                const quantity = parseInt(item.querySelector('.quantity').textContent);
                return total + (price * quantity);
            }, 0);
            
            document.querySelector('.subtotal span').textContent = `$${subtotal.toFixed(2)}`;
            document.querySelector('.total-value').textContent = `$${(subtotal + 5).toFixed(2)}`;
        }
    }

    // Función para cargar el carrito
    async function loadCart() {
        try {
            const cartData = await fetchCart('', 'GET');
            if (cartData) {
                renderCart(cartData);
                updateTotals(cartData);
            }
        } catch (error) {
            console.error('Error cargando carrito:', error);
        }
    }

    // Función para renderizar el carrito
    function renderCart(cartData) {
        if (!cartData.items || cartData.items.length === 0) {
            cartContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
            return;
        }

        cartContainer.innerHTML = cartData.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imagen}" alt="${item.nombre}" class="product-image">
                <div class="product-details">
                    <h3>${item.nombre}</h3>
                    <p class="product-variant">${item.variante || 'Sin variante'}</p>
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity" data-id="${item.id}">${item.cantidad}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
                <div class="product-price">$${item.precio.toFixed(2)}</div>
                <button class="remove-item" data-id="${item.id}">×</button>
            </div>
        `).join('');

        // Agregar event listeners a los nuevos elementos
        setupCartEventListeners();
    }

    // Configurar event listeners para el carrito
    function setupCartEventListeners() {
        document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                handleQuantityChange(e.target.dataset.id, -1);
            });
        });

        document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
            btn.addEventListener('click', (e) => {
                handleQuantityChange(e.target.dataset.id, 1);
            });
        });

        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                handleRemoveItem(e.target.dataset.id);
            });
        });
    }

    // Función para aplicar descuentos
    async function applyDiscount() {
        const discountInput = document.querySelector('.discount-section input');
        const code = discountInput.value.trim();
        
        if (!code) {
            showAlert('Por favor ingresa un código de descuento', 'error');
            return;
        }

        try {
            const result = await fetchCart('/discount', 'POST', { code });
            if (result) {
                updateTotals(result);
                showAlert('Descuento aplicado correctamente', 'success');
            }
        } catch (error) {
            showAlert(error.message, 'error');
        }
    }

    // Función para mostrar alertas (mejorada)
    function showAlert(message, type) {
        // Eliminar alertas anteriores
        const existingAlert = document.querySelector('.alert');
        if (existingAlert) existingAlert.remove();

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(alert);
        
        setTimeout(() => {
            alert.classList.add('fade-out');
            setTimeout(() => alert.remove(), 500);
        }, 3000);
    }

    // Inicialización
    async function init() {
        await setupAddToCartButtons();
        await loadCart();
        
        // Configurar botón de descuento
        document.querySelector('.apply-btn')?.addEventListener('click', applyDiscount);
        
        // Configurar botón de checkout
        document.querySelector('.checkout-btn')?.addEventListener('click', () => {
            showAlert('Redirigiendo a la página de pago...', 'info');
            // window.location.href = '/checkout.html';
        });
    }

    // Iniciar todo
    init();
});