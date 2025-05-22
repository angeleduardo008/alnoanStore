document.addEventListener('DOMContentLoaded', function() {
    // Datos de categorías y subcategorías
    const categoriesData = {
        mujer: ['Trabajo', 'Viaje', 'Deporte', 'Moda', 'Escolar'],
        hombre: ['Sedentarismo', 'Viaje', 'Deporte', 'Trabajo', 'Gimnasio'],
        ninos: ['Escolar', 'Paseo', 'Deporte', 'Juguete'],
        ninas: ['Escolar', 'Paseo', 'Deporte', 'Juguete', 'Moda'],
        adolescentes: ['Escolar', 'Moda', 'Deporte', 'Tecnología']
    };
    
    // Elementos del DOM
    const menuToggle = document.getElementById('menu-toggle');
    const categoriesMenu = document.getElementById('categories-menu');
    const menuOverlay = document.getElementById('menu-overlay');
    const closeMenu = document.getElementById('close-menu');
    const backBtn = document.getElementById('back-btn');
    const level1 = document.getElementById('level-1');
    const level2 = document.getElementById('level-2');
    const subcategoriesList = document.getElementById('subcategories-list');
    const menuTitle = document.getElementById('menu-title');
    const searchToggle = document.getElementById('search-toggle');
    const searchBox = document.querySelector('.search-box');
    const searchInput = document.getElementById('search-input');
    const searchSuggestions = document.querySelector('.search-suggestions');
    const categoryPreview = document.getElementById('category-preview');
    const clickSound = document.getElementById('click-sound');
    
    // Variables de estado
    let currentCategory = '';
    let menuOpen = false;
    let searchTimeout;
    // Efecto ripple al hacer clic
    function createRipple(event) {
        const button = event.currentTarget;
        if (!button) return;
        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = `${size}px`;
        ripple.style.left = `${x}px`;
        ripple.style.top = `${y}px`;
        
        button.appendChild(ripple);
        
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });
    }
    
    // Abrir/cerrar menú de categorías
    function toggleMenu() {
        menuOpen = !menuOpen;
        
        if (menuOpen) {
            categoriesMenu.classList.add('active');
            menuOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            showLevel1();
        } else {
            closeAllMenus();
        }
    }
    
    // Cerrar menú completamente
    function closeAllMenus() {
        menuOpen = false;
        categoriesMenu.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => {
            showLevel1();
        }, 300);
    }
    
    // Mostrar nivel 1 (categorías principales)
    function showLevel1() {
        if (!level1 || !level2 || !menuTitle) return;
        
        level1.classList.add('active');
        level2.classList.remove('active');
        menuTitle.textContent = 'Categorías';
        currentCategory = '';
        
        // Resetear vista previa
        if (categoryPreview) {
            categoryPreview.style.backgroundImage = 'none';
        }
    }
    
    // Mostrar nivel 2 (subcategorías)
    function showLevel2(category) {
        if (!level1 || !level2 || !menuTitle || !subcategoriesList) return;
        
        currentCategory = category;
        level1.classList.remove('active');
        level2.classList.add('active');
        menuTitle.textContent = category.charAt(0).toUpperCase() + category.slice(1);
        
        // Actualizar vista previa si existe
        if (categoryPreview) {
            const previewItem = document.querySelector(`[data-category="${category}"][data-preview]`);
            if (previewItem && previewItem.dataset.preview) {
                categoryPreview.style.backgroundImage = `url(${previewItem.dataset.preview})`;
            }
        }
        
        // Limpiar y cargar subcategorías
        subcategoriesList.innerHTML = '';
        if (categoriesData[category]) {
            categoriesData[category].forEach(subcategory => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <a href="catalogo.html?category=${category}&subcategory=${subcategory.toLowerCase()}">
                        <span>${subcategory}</span>
                    </a>
                `;
                subcategoriesList.appendChild(li);
            });
        }
    }
    
    // Event listeners para categorías principales
    document.querySelectorAll('#level-1 li').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            if (category) {
                showLevel2(category);
            }
        });
    });
    
    // Botón para volver atrás
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            if (level2 && level2.classList.contains('active')) {
                showLevel1();
            } else {
                closeAllMenus();
            }
        });
    }
    
    // Botón de menú
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
    }
    
    // Cerrar menú con el botón X
    if (closeMenu) {
        closeMenu.addEventListener('click', closeAllMenus);
    }
    
    // Cerrar menú con overlay
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeAllMenus);
    }
    
    // Buscador
    if (searchToggle && searchBox) {
        searchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            searchBox.classList.toggle('active');
            
            if (searchBox.classList.contains('active') && searchInput) {
                searchInput.focus();
            }
        });
    }
    
    // Cerrar buscador al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (searchBox && searchToggle && searchSuggestions) {
            if (!searchToggle.contains(e.target) && !searchBox.contains(e.target)) {
                searchBox.classList.remove('active');
                searchSuggestions.style.display = 'none';
            }
        }
    });
    
    // Sugerencias de búsqueda
    if (searchInput && searchSuggestions) {
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            
            if (this.value.length > 1) {
                searchTimeout = setTimeout(() => {
                    // Simular búsqueda con datos estáticos
                    const suggestions = ['Mochila de viaje', 'Mochila escolar', 'Mochila deportiva'];
                    showSearchSuggestions(suggestions);
                    
                    // Mostrar resultados populares si no hay coincidencias
                    if (suggestions.length === 0 && this.value.length < 3) {
                        showPopularSearches();
                    }
                }, 300); // Debounce de 300ms
            } else {
                searchSuggestions.style.display = 'none';
            }
        });
    }
    
    function showSearchSuggestions(items) {
        if (!searchSuggestions) return;
        
        searchSuggestions.innerHTML = '';
        
        if (items && items.length > 0) {
            items.forEach(item => {
                const div = document.createElement('div');
                div.className = 'suggestion-item';
                div.textContent = item;
                div.addEventListener('click', function() {
                    if (searchInput) {
                        searchInput.value = item;
                    }
                    searchSuggestions.style.display = 'none';
                    // Ejecutar búsqueda
                    window.location.href = `busqueda.html?q=${encodeURIComponent(item)}`;
                });
                searchSuggestions.appendChild(div);
            });
            
            searchSuggestions.style.display = 'block';
        } else {
            searchSuggestions.style.display = 'none';
        }
    }
    
    function showPopularSearches() {
        if (!searchSuggestions) return;
        
        const popular = ['Mochila viaje', 'Mochila escolar', 'Mochila deportiva'];
        searchSuggestions.innerHTML = `
            <div class="suggestion-header">Búsquedas populares</div>
            ${popular.map(item => `
                <div class="suggestion-item popular">
                    <i class="fas fa-fire"></i>
                    <span>${item}</span>
                </div>
            `).join('')}
        `;
        searchSuggestions.style.display = 'block';
    }
    
    // Actualizar contador del carrito
    function updateCartCount(count) {
        const cartCount = document.querySelector('.cart-count');
        if (!cartCount) return;
        
        if (count > 0) {
            cartCount.textContent = count;
            cartCount.style.display = 'flex';
            const cartBadge = document.querySelector('.cart-badge');
            if (cartBadge) {
                cartBadge.classList.add('added');
                setTimeout(() => {
                    cartBadge.classList.remove('added');
                }, 600);
            }
        } else {
            cartCount.style.display = 'none';
        }
    }
    // Mostrar notificación de producto añadido
    function showFloatingCartItem(item) {
        const floater = document.createElement('div');
        floater.className = 'cart-floater';
        floater.innerHTML = `
            <img src="${item.image}" alt="${item.name}" onerror="this.src='img/placeholder.jpg'">
            <div>
                <div>¡Añadido al carrito!</div>
                <div class="item-name">${item.name}</div>
            </div>
        `;
        
        document.body.appendChild(floater);
        
        setTimeout(() => {
            floater.classList.add('show');
            setTimeout(() => {
                floater.classList.remove('show');
                setTimeout(() => {
                    floater.remove();
                }, 500);
            }, 3000);
        }, 100);
    }
    
    // // Simular actualización del carrito
    // function simulateCartUpdate() {
    //     let count = 0;
    //     const cartInterval = setInterval(() => {
    //         count = (count + 1) % 5;
    //         updateCartCount(count);
            
    //         // Mostrar notificación flotante cada 3 actualizaciones
    //         if (count % 3 === 0 && count > 0) {
    //             showFloatingCartItem({
    //                 name: `Mochila Ejemplo ${count}`,
    //                 image: 'img/products/example.jpg'
    //             });
    //         }
    //     }, 5000);
        
    //     // Limpiar intervalo cuando la página se cierre
    //     window.addEventListener('beforeunload', () => {
    //         clearInterval(cartInterval);
    //     });
    // }
    
    // Efecto al hacer scroll
    function handleScroll() {
        const currentScroll = window.scrollY;
        const navbar = document.querySelector('.navbar');
        const logo = document.querySelector('.logo');
        
        if (!navbar) return;
        
        // Mostrar/ocultar navbar al hacer scroll
        if (currentScroll > 100 && currentScroll > lastScroll && !menuOpen) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        // Efecto parallax en el logo
        if (logo && currentScroll <= 200) {
            const scale = 1 - (currentScroll * 0.001);
            const opacity = 1 - (currentScroll * 0.005);
            logo.style.transform = `scale(${Math.max(scale, 0.9)})`;
            logo.style.opacity = Math.max(opacity, 0.8);
        }
        
        // Añadir clase 'scrolled' después de cierto scroll
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    }
    
    let lastScroll = 0;
    window.addEventListener('scroll', handleScroll);
    
    // Precarga de imágenes de categorías
    function preloadCategoryImages() {
        const categoryPreviews = [
            'img/categories/women-preview.jpg',
            'img/categories/men-preview.jpg'
        ];
        
        categoryPreviews.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    }
/* ========== LISTA DE DESEOS ========== */
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Función para actualizar todos los iconos de wishlist
function updateAllWishlistIcons() {
    document.querySelectorAll('.add-to-wishlist').forEach(btn => {
        const productCard = btn.closest('.product-card');
        if (!productCard) return;
        
        const productId = productCard.dataset.productId;
        const isInWishlist = wishlist.some(item => item.id === productId);
        
        // Actualizar icono y estilos
        const icon = btn.querySelector('i');
        if (icon) {
            icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
            btn.style.borderColor = isInWishlist ? 'var(--secondary)' : 'var(--text-light)';
            btn.style.color = isInWishlist ? 'var(--secondary)' : 'var(--text-light)';
        }
    });
}

// Manejar clic en el botón de wishlist
function handleWishlistClick(e) {
    // Verificar si el click fue en el botón o en el icono dentro de él
    const wishlistBtn = e.target.closest('.add-to-wishlist');
    if (!wishlistBtn) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const productCard = wishlistBtn.closest('.product-card');
    if (!productCard) return;
    
    const productId = productCard.dataset.productId;
    const productName = productCard.querySelector('h3')?.textContent || 'Producto';
    const productPrice = productCard.querySelector('.price')?.textContent || '';
    const productImage = productCard.querySelector('img')?.src || '';
    
    // Verificar si ya está en la lista
    const existingIndex = wishlist.findIndex(item => item.id === productId);
    let isInWishlist = false;
    
    if (existingIndex >= 0) {
        // Remover de la lista
        wishlist.splice(existingIndex, 1);
        showNotification(`${productName} removido de tu lista de deseos`);
    } else {
        // Añadir a la lista
        wishlist.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage
        });
        showNotification(`${productName} añadido a tu lista de deseos`);
        isInWishlist = true;
    }
    
    // Actualizar localStorage
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Actualizar icono y estilos del botón clickeado
    const icon = wishlistBtn.querySelector('i');
    if (icon) {
        icon.className = isInWishlist ? 'fas fa-heart' : 'far fa-heart';
        wishlistBtn.style.borderColor = isInWishlist ? 'var(--secondary)' : 'var(--text-light)';
        wishlistBtn.style.color = isInWishlist ? 'var(--secondary)' : 'var(--text-light)';
    }
    
    // Efecto visual
    wishlistBtn.classList.add('animate-heart');
    setTimeout(() => {
        wishlistBtn.classList.remove('animate-heart');
    }, 1000);
}

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    updateAllWishlistIcons();
    document.addEventListener('click', handleWishlistClick);
});
/* ========== VISTA RÁPIDA (OJITO) ========== */
document.querySelectorAll('.quick-view').forEach(button => {
         button.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
             const productName = productCard.querySelector('h3').textContent;
             const productPrice = productCard.querySelector('.price').textContent;
             const productImage = productCard.querySelector('.product-image').src;
             const productDesc = productCard.querySelector('.product-description').textContent;
            const productId = productCard.dataset.productId;
            
             // Crear modal de vista rápida
             const quickViewModal = document.createElement('div');
             quickViewModal.className = 'quick-view-modal active';
             quickViewModal.innerHTML = `
                 <div class="quick-view-content">
                     <button class="close-quick-view">&times;</button>
                     <div class="quick-view-grid">
                         <div class="quick-view-image">
                             <img src="${productImage}" alt="${productName}">
                        </div>
                         <div class="quick-view-info">
                             <h3>${productName}</h3>
                             <div class="quick-view-price">${productPrice}</div>
                            <p class="quick-view-description">${productDesc}</p>
                            <div class="product-options">
                                 <div class="quantity-selector">
                                    <button class="decrease">-</button>
                                     <input type="number" value="1" min="1">
                                     <button class="increase">+</button>
                                </div>
                                 <button class="add-to-cart btn">Añadir al carrito <i class="fas fa-cart-plus"></i></button>
                             </div>
                        </div>
                     </div>
                 </div>
             `;
            
        document.body.appendChild(quickViewModal);
           document.body.style.overflow = 'hidden';
            
             // Cerrar modal
            document.querySelector('.close-quick-view').addEventListener('click', function() {
                document.body.removeChild(quickViewModal);
                document.body.style.overflow = '';
            });
          
             // Cerrar al hacer clic fuera
             quickViewModal.addEventListener('click', function(e) {
                 if (e.target === quickViewModal) {
                    document.body.removeChild(quickViewModal);
                     document.body.style.overflow = '';
               }
             });
            
         // Selector de cantidad
             const decreaseBtn = quickViewModal.querySelector('.decrease');
             const increaseBtn = quickViewModal.querySelector('.increase');
             const quantityInput = quickViewModal.querySelector('input[type="number"]');
            
            decreaseBtn.addEventListener('click', () => {
                 let value = parseInt(quantityInput.value);
                 if (value > 1) {
                     quantityInput.value = value - 1;
                 }
             });
            
             increaseBtn.addEventListener('click', () => {
                 let value = parseInt(quantityInput.value);
                 quantityInput.value = value + 1;
             });
         });
     });

    // Inicialización
    function init() {
        // updateCartCount(0);
        // simulateCartUpdate();
        // preloadCategoryImages();
        
        // Configurar vista previa en desktop
        if (window.innerWidth >= 992 && categoriesMenu && categoryPreview) {
            categoriesMenu.style.display = 'grid';
            categoryPreview.style.display = 'block';
        }
    }
    
    init();
});