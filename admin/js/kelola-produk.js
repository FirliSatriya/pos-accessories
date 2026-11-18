/* =========================================================================
   Halaman Data Produk
   ========================================================================= */
(function (window, document) {
    'use strict';

    var Admin = window.AdminData;
    if (!Admin) return;

    var PLACEHOLDER = '../images/img-pro-01.jpg';
    var products = Admin.getProducts().slice();
    var editingId = null;
    var pendingImage = '';

    var tbody = document.getElementById('productTableBody');
    var tableInfo = document.getElementById('productTableInfo');
    var searchInput = document.getElementById('productSearch');
    var categoryFilter = document.getElementById('productCategoryFilter');
    var form = document.getElementById('productForm');
    var modal = document.getElementById('productModal');
    var modalTitle = document.getElementById('productModalLabel');
    var addButton = document.getElementById('addProductBtn');
    var fileInput = document.getElementById('productImage');
    var fileLabel = document.getElementById('productImageLabel');
    var preview = document.getElementById('productImagePreview');
    var defaultFileLabel = 'Pilih gambar produk (maks. 1 MB)';

    var fields = {
        name: document.getElementById('productName'),
        category: document.getElementById('productCategory'),
        price: document.getElementById('productPrice'),
        oldPrice: document.getElementById('productOldPrice'),
        stock: document.getElementById('productStock'),
        sold: document.getElementById('productSold'),
        badge: document.getElementById('productBadge'),
        description: document.getElementById('productDescription')
    };

    function showModal(id) {
        if (window.jQuery) window.jQuery('#' + id).modal('show');
    }

    function hideModal(id) {
        if (window.jQuery) window.jQuery('#' + id).modal('hide');
    }

    function findProduct(id) {
        var found = null;
        products.forEach(function (product) {
            if (String(product.id) === String(id)) found = product;
        });
        return found;
    }

    function productStatus(product) {
        return Admin.stockStatus(product.stock);
    }

    function uniqueId(name, currentId) {
        var base = Admin.slugify(name);
        var candidate = base;
        var counter = 1;

        while (products.some(function (product) {
            return String(product.id) === candidate && String(product.id) !== String(currentId);
        })) {
            counter += 1;
            candidate = base + '-' + counter;
        }

        return candidate;
    }

    function filteredProducts() {
        var term = String(searchInput.value || '').trim().toLowerCase();
        var category = categoryFilter.value;

        return products.filter(function (product) {
            var matchesCategory = !category || String(product.category) === category;
            if (!matchesCategory) return false;
            if (!term) return true;

            var haystack = [
                product.name,
                Admin.categoryLabel(product.category),
                product.badge,
                product.description
            ].join(' ').toLowerCase();
            return haystack.indexOf(term) !== -1;
        });
    }

    function renderSummary() {
        Admin.setText('productStatTotal', products.length);
        Admin.setText('productStatStock', products.reduce(function (total, product) {
            return total + (Number(product.stock) || 0);
        }, 0));
        Admin.setText('productStatLow', products.filter(function (product) {
            return (Number(product.stock) || 0) <= 5;
        }).length);
    }

    function render() {
        var rows = filteredProducts();
        var table = tbody.closest('table');
        if (table) table.classList.toggle('table-empty', !rows.length);

        tbody.innerHTML = rows.map(function (product, index) {
            var status = productStatus(product);
            var badge = product.badge ?
                '<span class="badge badge-soft-primary ml-1">' + Admin.escapeHtml(product.badge) + '</span>' : '';

            return '<tr data-id="' + Admin.escapeHtml(product.id) + '">' +
                '<td class="text-center text-muted">' + (index + 1) + '</td>' +
                '<td class="text-center"><img class="table-thumb" src="' + Admin.escapeHtml(product.image || PLACEHOLDER) +
                '" alt="' + Admin.escapeHtml(product.name) + '"></td>' +
                '<td><strong>' + Admin.escapeHtml(product.name || '-') + '</strong>' + badge +
                '<span class="text-muted-small">' + Admin.escapeHtml(Admin.truncate(product.description, 60)) + '</span></td>' +
                '<td>' + Admin.escapeHtml(Admin.categoryLabel(product.category)) + '</td>' +
                '<td><strong>' + Admin.escapeHtml(Admin.formatRupiah(product.price)) + '</strong>' +
                (product.oldPrice ? '<span class="text-muted-small"><del>' + Admin.escapeHtml(Admin.formatRupiah(product.oldPrice)) + '</del></span>' : '') +
                '</td>' +
                '<td class="text-center">' + (Number(product.stock) || 0) + '</td>' +
                '<td class="text-center">' + (Number(product.sold) || 0) + '</td>' +
                '<td class="text-center">' + Admin.badge(status.label, status.tone) + '</td>' +
                '<td class="text-center table-actions">' +
                '<button type="button" class="btn btn-info" data-action="view" data-id="' + Admin.escapeHtml(product.id) + '" title="Lihat detail"><i class="fas fa-eye"></i></button>' +
                '<button type="button" class="btn btn-primary" data-action="edit" data-id="' + Admin.escapeHtml(product.id) + '" title="Edit produk"><i class="fas fa-pen"></i></button>' +
                '<button type="button" class="btn btn-danger" data-action="delete" data-id="' + Admin.escapeHtml(product.id) + '" title="Hapus produk"><i class="fas fa-trash"></i></button>' +
                '</td>' +
                '</tr>';
        }).join('');

        if (!rows.length) {
            tbody.innerHTML = '<tr><td colspan="9" class="p-0">' +
                Admin.emptyState(
                    'fas fa-box-open',
                    products.length ? 'Produk tidak ditemukan' : 'Belum ada produk',
                    products.length ? 'Coba kata kunci atau kategori lain.' : 'Tambahkan produk pertama melalui tombol di atas.'
                ) + '</td></tr>';
        }

        tableInfo.textContent = 'Menampilkan ' + rows.length + ' dari ' + products.length + ' produk';
        renderSummary();
    }

    function setPreview(src) {
        pendingImage = src || PLACEHOLDER;
        if (preview) preview.src = pendingImage;
    }

    function openAdd() {
        editingId = null;
        form.reset();
        form.classList.remove('was-validated');
        fields.category.value = 'bross';
        fields.stock.value = '1';
        fields.sold.value = '0';
        if (fileLabel) fileLabel.textContent = defaultFileLabel;
        setPreview(PLACEHOLDER);
        modalTitle.innerHTML = '<i class="fas fa-plus-circle mr-2"></i>Tambah Produk';
        showModal(modal.id);
    }

    function openEdit(id) {
        var product = findProduct(id);
        if (!product) return;

        editingId = product.id;
        form.reset();
        form.classList.remove('was-validated');
        fields.name.value = product.name || '';
        fields.category.value = product.category || 'bross';
        fields.price.value = Number(product.price) || 0;
        fields.oldPrice.value = Number(product.oldPrice) || '';
        fields.stock.value = Number(product.stock) || 0;
        fields.sold.value = Number(product.sold) || 0;
        fields.badge.value = product.badge || '';
        fields.description.value = product.description || '';
        if (fileLabel) fileLabel.textContent = defaultFileLabel;
        setPreview(product.image || PLACEHOLDER);
        modalTitle.innerHTML = '<i class="fas fa-pen mr-2"></i>Edit Produk';
        showModal(modal.id);
    }

    function openDetail(id) {
        var product = findProduct(id);
        if (!product) return;

        var status = productStatus(product);
        var image = document.getElementById('detailProductImage');
        if (image) {
            image.src = product.image || PLACEHOLDER;
            image.alt = product.name || 'Produk';
        }

        Admin.setText('detailProductName', product.name || '-');
        Admin.setText('detailProductCategory', Admin.categoryLabel(product.category));
        Admin.setText('detailProductPrice', Admin.formatRupiah(product.price));
        Admin.setText('detailProductOldPrice', product.oldPrice ? Admin.formatRupiah(product.oldPrice) : '-');
        Admin.setText('detailProductStock', Number(product.stock) || 0);
        Admin.setText('detailProductSold', Number(product.sold) || 0);
        Admin.setText('detailProductBadge', product.badge || '-');
        Admin.setText('detailProductDescription', product.description || '-');
        Admin.setText('detailProductId', product.id || '-');

        var statusElement = document.getElementById('detailProductStatus');
        if (statusElement) statusElement.innerHTML = Admin.badge(status.label, status.tone);

        showModal('productDetailModal');
    }

    function saveProduct(event) {
        event.preventDefault();
        form.classList.add('was-validated');
        if (!form.checkValidity()) return;

        var name = fields.name.value.trim();
        var category = fields.category.value;
        var price = Number(fields.price.value);
        var oldPrice = Number(fields.oldPrice.value) || 0;
        var stock = Number(fields.stock.value);
        var sold = Number(fields.sold.value) || 0;
        var badge = fields.badge.value.trim();
        var description = fields.description.value.trim();

        if (name.length < 2) {
            Admin.toast('Nama produk minimal 2 karakter.', 'error');
            return;
        }
        if (!price || price <= 0) {
            Admin.toast('Harga produk harus lebih dari 0.', 'error');
            return;
        }
        if (oldPrice && oldPrice <= price) {
            Admin.toast('Harga sebelum diskon harus lebih besar dari harga jual.', 'error');
            return;
        }
        if (stock < 0 || sold < 0) {
            Admin.toast('Stok dan jumlah terjual tidak boleh negatif.', 'error');
            return;
        }

        var id = editingId || uniqueId(name, null);
        var base = editingId ? findProduct(editingId) : { rating: 0 };
        var product = Object.assign({}, base, {
            id: id,
            name: name,
            category: category,
            price: price,
            oldPrice: oldPrice,
            stock: stock,
            sold: sold,
            badge: badge,
            description: description,
            image: pendingImage || PLACEHOLDER
        });

        if (editingId) {
            products = products.map(function (item) {
                return String(item.id) === String(editingId) ? product : item;
            });
            Admin.toast('Data produk berhasil diperbarui.', 'success');
        } else {
            products.push(product);
            Admin.toast('Produk baru berhasil ditambahkan.', 'success');
        }

        Admin.saveProducts(products);
        hideModal(modal.id);
        render();
    }

    function deleteProduct(id) {
        var product = findProduct(id);
        if (!product) return;

        Admin.confirmAction({
            title: 'Hapus Produk',
            message: 'Hapus produk "' + (product.name || '-') + '" dari daftar?',
            confirmText: 'Hapus Produk'
        }, function () {
            products = products.filter(function (item) {
                return String(item.id) !== String(id);
            });
            Admin.saveProducts(products);
            render();
            Admin.toast('Produk berhasil dihapus.', 'success');
        });
    }

    fileInput.addEventListener('change', function () {
        var file = fileInput.files[0];
        if (!file) return;

        if (file.size > 1000000) {
            Admin.toast('Ukuran gambar maksimal 1 MB.', 'error');
            fileInput.value = '';
            if (fileLabel) fileLabel.textContent = defaultFileLabel;
            return;
        }

        var reader = new FileReader();
        reader.onload = function (event) {
            setPreview(event.target.result);
        };
        reader.readAsDataURL(file);
        if (fileLabel) fileLabel.textContent = file.name;
    });

    searchInput.addEventListener('input', render);
    categoryFilter.addEventListener('change', render);
    addButton.addEventListener('click', openAdd);
    form.addEventListener('submit', saveProduct);

    tbody.addEventListener('click', function (event) {
        var button = event.target.closest('button[data-action]');
        if (!button) return;

        var action = button.getAttribute('data-action');
        var id = button.getAttribute('data-id');

        if (action === 'view') openDetail(id);
        if (action === 'edit') openEdit(id);
        if (action === 'delete') deleteProduct(id);
    });

    render();
})(window, document);
