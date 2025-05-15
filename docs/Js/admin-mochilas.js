document.addEventListener('DOMContentLoaded', function() {
    // Ordenar tabla
    const headers = document.querySelectorAll('th[data-sort]');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const sortBy = header.getAttribute('data-sort');
            const isAsc = header.classList.contains('asc');
            sortTable(sortBy, isAsc);
            headers.forEach(h => h.classList.remove('asc', 'desc'));
            header.classList.toggle(isAsc ? 'desc' : 'asc');
        });
    });
    
    // Buscar productos
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    
    searchBtn.addEventListener('click', filterProducts);
    searchInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') filterProducts();
    });
    
    // Filtrar productos
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const stockFilter = document.getElementById('stockFilter');
    
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    stockFilter.addEventListener('keyup', filterProducts);
    
    // Botón agregar producto
    const addProductBtn = document.getElementById('addProductBtn');
    addProductBtn.addEventListener('click', () => {
        alert('Funcionalidad para agregar nueva mochila');
        // Aquí iría el código para abrir un modal/formulario
    });
    
    // Botones de acciones
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('tr').cells[0].textContent;
            alert(`Ver detalles del producto ID: ${productId}`);
        });
    });
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('tr').cells[0].textContent;
            alert(`Editar producto ID: ${productId}`);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = e.target.closest('tr').cells[0].textContent;
            if (confirm(`¿Estás seguro de eliminar el producto ID: ${productId}?`)) {
                e.target.closest('tr').remove();
                alert('Producto eliminado');
            }
        });
    });
    
    function filterProducts() {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const maxPrice = priceFilter.value ? parseFloat(priceFilter.value) : Infinity;
        const minStock = stockFilter.value ? parseInt(stockFilter.value) : 0;
        
        const rows = document.querySelectorAll('#productsTable tbody tr');
        
        rows.forEach(row => {
            const name = row.cells[2].textContent.toLowerCase();
            const productCategory = row.cells[4].textContent;
            const price = parseFloat(row.cells[3].textContent.replace('S/ ', ''));
            const stock = parseInt(row.cells[5].textContent);
            
            const matchesSearch = name.includes(searchTerm);
            const matchesCategory = category === '' || productCategory === category;
            const matchesPrice = price <= maxPrice;
            const matchesStock = stock >= minStock;
            
            if (matchesSearch && matchesCategory && matchesPrice && matchesStock) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    }
    
    function sortTable(sortBy, isAsc) {
        const tbody = document.querySelector('#productsTable tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            let aValue, bValue;
            
            switch(sortBy) {
                case 'id':
                    aValue = parseInt(a.cells[0].textContent);
                    bValue = parseInt(b.cells[0].textContent);
                    break;
                case 'name':
                    aValue = a.cells[2].textContent.toLowerCase();
                    bValue = b.cells[2].textContent.toLowerCase();
                    break;
                case 'price':
                    aValue = parseFloat(a.cells[3].textContent.replace('S/ ', ''));
                    bValue = parseFloat(b.cells[3].textContent.replace('S/ ', ''));
                    break;
                case 'category':
                    aValue = a.cells[4].textContent.toLowerCase();
                    bValue = b.cells[4].textContent.toLowerCase();
                    break;
                case 'stock':
                    aValue = parseInt(a.cells[5].textContent);
                    bValue = parseInt(b.cells[5].textContent);
                    break;
                default:
                    return 0;
            }
            
            if (typeof aValue === 'string') {
                return isAsc ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            } else {
                return isAsc ? aValue - bValue : bValue - aValue;
            }
        });
        
        // Limpiar y reordenar la tabla
        tbody.innerHTML = '';
        rows.forEach(row => tbody.appendChild(row));
    }
});
