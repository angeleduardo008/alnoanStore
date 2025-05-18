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

    // Funcionalidad de filtros
    const searchInput = document.getElementById('search');
    const categoryFilter = document.getElementById('category');
    const priceFilter = document.getElementById('price');
    
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedCategory = categoryFilter.value;
        const selectedPrice = priceFilter.value;
        
        document.querySelectorAll('.product-card').forEach(product => {
            const title = product.querySelector('.product-title').textContent.toLowerCase();
            const category = product.getAttribute('data-category') || '';
            const price = parseFloat(product.querySelector('.product-price').textContent.replace('S/ ', ''));
            
            // Verificar coincidencia con los filtros
            const matchesSearch = title.includes(searchTerm);
            const matchesCategory = !selectedCategory || category === selectedCategory;
            let matchesPrice = true;
            
            if (selectedPrice === '0-100') {
                matchesPrice = price >= 0 && price <= 100;
            } else if (selectedPrice === '100-200') {
                matchesPrice = price > 100 && price <= 200;
            } else if (selectedPrice === '200+') {
                matchesPrice = price > 200;
            }
            
            // Mostrar u ocultar producto según los filtros
            if (matchesSearch && matchesCategory && matchesPrice) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
    
    // Event listeners para los filtros
    searchInput.addEventListener('input', filterProducts);
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    
    // Funcionalidad de favoritos
    document.querySelectorAll('.btn-secondary').forEach(btn => {
        btn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isActive = icon.classList.contains('fas');
            
            if (isActive) {
                icon.classList.replace('fas', 'far');
                this.innerHTML = '<i class="far fa-heart"></i> Favorito';
            } else {
                icon.classList.replace('far', 'fas');
                this.innerHTML = '<i class="fas fa-heart"></i> Favorito';
            }
            
            // Agregar animación
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 300);
        });
    });
    
    // Efecto hover para tarjetas de producto
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // Paginación activa
    const pageLinks = document.querySelectorAll('.page-link:not(:has(.fa-chevron-left, .fa-chevron-right))');
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector('.page-link.active').classList.remove('active');
            this.classList.add('active');
        });
    });
    
    // Flechas de paginación
    const prevPage = document.querySelector('.page-link:has(.fa-chevron-left)');
    const nextPage = document.querySelector('.page-link:has(.fa-chevron-right)');
    
    prevPage.addEventListener('click', function(e) {
        e.preventDefault();
        const activePage = document.querySelector('.page-link.active');
        const prev = activePage.previousElementSibling;
        
        if (prev && prev.classList.contains('page-link') && !prev.querySelector('i')) {
            activePage.classList.remove('active');
            prev.classList.add('active');
        }
    });
    
    nextPage.addEventListener('click', function(e) {
        e.preventDefault();
        const activePage = document.querySelector('.page-link.active');
        const next = activePage.nextElementSibling;
        
        if (next && next.classList.contains('page-link') && !next.querySelector('i')) {
            activePage.classList.remove('active');
            next.classList.add('active');
        }
    });
});
