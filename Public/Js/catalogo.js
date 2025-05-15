document.addEventListener('DOMContentLoaded', function() {
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
