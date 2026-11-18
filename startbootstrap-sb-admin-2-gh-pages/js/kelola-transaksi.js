/* =========================================================================
   Halaman Data Transaksi
   ========================================================================= */
(function (window, document) {
    'use strict';

    var Admin = window.AdminData;
    if (!Admin) return;

    var orders = Admin.getOrders().slice();
    var editingId = null;

    var tbody = document.getElementById('trxTableBody');
    var tableInfo = document.getElementById('trxTableInfo');
    var searchInput = document.getElementById('trxSearch');
    var statusFilter = document.getElementById('trxStatusFilter');
    var exportButton = document.getElementById('exportTrxBtn');
    var statusModal = document.getElementById('trxStatusModal');
    var statusSelect = document.getElementById('trxStatusSelect');
    var statusOrderId = document.getElementById('trxStatusOrderId');
    var statusForm = document.getElementById('trxStatusForm');

    function showModal(id) {
        if (window.jQuery) window.jQuery('#' + id).modal('show');
    }

    function hideModal(id) {
        if (window.jQuery) window.jQuery('#' + id).modal('hide');
    }

    function findOrder(id) {
        var found = null;
        orders.forEach(function (order) {
            if (String(order.id) === String(id)) found = order;
        });
        return found;
    }

    function orderStatus(order) {
        return String(order.status || 'Selesai');
    }

    function imagePath(src) {
        var value = String(src || '');
        if (/^images\//i.test(value)) return '../' + value;
        return value;
    }

    function customerName(order) {
        var customer = order.customer || {};
        return String(customer.name || order.name || '-').trim() || '-';
    }

    function customerEmail(order) {
        var customer = order.customer || {};
        return String(customer.email || order.email || '').trim();
    }

    function itemSummary(order) {
        var items = Array.isArray(order.items) ? order.items : [];
        if (!items.length) return 'Tanpa rincian';
        var first = items[0].name || 'Produk';
        if (items.length === 1) return first;
        return first + ' +' + (items.length - 1) + ' lainnya';
    }

    function itemCount(order) {
        var items = Array.isArray(order.items) ? order.items : [];
        return items.reduce(function (total, item) {
            return total + (Number(item.qty) || 0);
        }, 0);
    }

    function sortedOrders() {
        return orders.slice().sort(function (a, b) {
            var dateA = new Date(a.date || 0).getTime() || 0;
            var dateB = new Date(b.date || 0).getTime() || 0;
            return dateB - dateA;
        });
    }

    function filteredOrders() {
        var term = String(searchInput.value || '').trim().toLowerCase();
        var status = statusFilter.value;

        return sortedOrders().filter(function (order) {
            if (status && orderStatus(order) !== status) return false;
            if (!term) return true;

            var customer = order.customer || {};
            return [
                order.id,
                order.status,
                order.payment,
                customer.name,
                customer.email,
                customer.phone,
                customer.city,
                customer.province,
                itemSummary(order)
            ].join(' ').toLowerCase().indexOf(term) !== -1;
        });
    }

    function renderSummary() {
        var revenue = orders.reduce(function (total, order) {
            if (orderStatus(order) === 'Dibatalkan') return total;
            return total + (Number(order.total) || 0);
        }, 0);

        Admin.setText('trxStatTotal', orders.length);
        Admin.setText('trxStatRevenue', Admin.formatRupiah(revenue));
        Admin.setText('trxStatPending', orders.filter(function (order) {
            var status = orderStatus(order);
            return status === 'Menunggu' || status === 'Diproses';
        }).length);
    }

    function render() {
        var rows = filteredOrders();
        var table = tbody.closest('table');
        if (table) table.classList.toggle('table-empty', !rows.length);

        tbody.innerHTML = rows.map(function (order, index) {
            var status = Admin.transactionStatus(orderStatus(order));
            var email = customerEmail(order);
            return '<tr data-id="' + Admin.escapeHtml(order.id) + '">' +
                '<td class="text-center text-muted">' + (index + 1) + '</td>' +
                '<td><strong>' + Admin.escapeHtml(order.id || '-') + '</strong>' +
                '<span class="text-muted-small">' + Admin.escapeHtml(Admin.formatDateTime(order.date)) + '</span></td>' +
                '<td><strong>' + Admin.escapeHtml(customerName(order)) + '</strong>' +
                (email ? '<span class="text-muted-small">' + Admin.escapeHtml(email) + '</span>' : '') + '</td>' +
                '<td class="text-nowrap">' + Admin.escapeHtml(Admin.formatDate(order.date)) + '</td>' +
                '<td class="text-wrap-cell">' + Admin.escapeHtml(itemSummary(order)) +
                '<span class="text-muted-small">' + itemCount(order) + ' item</span></td>' +
                '<td class="text-nowrap"><strong>' + Admin.escapeHtml(Admin.formatRupiah(order.total)) + '</strong></td>' +
                '<td>' + Admin.escapeHtml(order.payment || '-') + '</td>' +
                '<td class="text-center">' + Admin.badge(status.label, status.tone) + '</td>' +
                '<td class="text-center table-actions">' +
                '<button type="button" class="btn btn-info" data-action="view" data-id="' + Admin.escapeHtml(order.id) + '" title="Lihat detail"><i class="fas fa-eye"></i></button>' +
                '<button type="button" class="btn btn-primary" data-action="status" data-id="' + Admin.escapeHtml(order.id) + '" title="Ubah status"><i class="fas fa-pen"></i></button>' +
                '<button type="button" class="btn btn-danger" data-action="delete" data-id="' + Admin.escapeHtml(order.id) + '" title="Hapus transaksi"><i class="fas fa-trash"></i></button>' +
                '</td>' +
                '</tr>';
        }).join('');

        if (!rows.length) {
            tbody.innerHTML = '<tr><td colspan="9" class="p-0">' +
                Admin.emptyState(
                    'fas fa-receipt',
                    orders.length ? 'Transaksi tidak ditemukan' : 'Belum ada transaksi',
                    orders.length ? 'Coba kata kunci atau status lain.' : 'Transaksi akan muncul otomatis setelah pelanggan menyelesaikan checkout di toko.'
                ) + '</td></tr>';
        }

        tableInfo.textContent = 'Menampilkan ' + rows.length + ' dari ' + orders.length + ' transaksi';
        renderSummary();
    }

    function openDetail(id) {
        var order = findOrder(id);
        if (!order) return;

        var customer = order.customer || {};
        var items = Array.isArray(order.items) ? order.items : [];
        var status = Admin.transactionStatus(orderStatus(order));
        var body = document.getElementById('trxDetailBody');
        if (!body) return;

        var itemsHtml = items.map(function (item) {
            return '<tr>' +
                '<td><div class="d-flex align-items-center">' +
                (item.image ? '<img src="' + Admin.escapeHtml(imagePath(item.image)) + '" alt="' + Admin.escapeHtml(item.name) +
                    '" width="36" height="36" class="rounded mr-2" style="object-fit:cover">' : '') +
                '<span>' + Admin.escapeHtml(item.name || '-') + '</span></div></td>' +
                '<td class="text-center">' + (Number(item.qty) || 0) + '</td>' +
                '<td class="text-right">' + Admin.escapeHtml(Admin.formatRupiah(item.price)) + '</td>' +
                '<td class="text-right">' + Admin.escapeHtml(Admin.formatRupiah((Number(item.price) || 0) * (Number(item.qty) || 0))) + '</td>' +
                '</tr>';
        }).join('');

        if (!itemsHtml) {
            itemsHtml = '<tr><td colspan="4" class="text-center text-muted py-3">Tidak ada rincian produk.</td></tr>';
        }

        var address = [customer.address, customer.city, customer.province]
            .filter(function (part) { return String(part || '').trim(); })
            .join(', ');

        body.innerHTML =
            '<div class="row">' +
            '<div class="col-lg-6">' +
            '<dl class="row detail-list">' +
            '<dt class="col-sm-5">ID Transaksi</dt><dd class="col-sm-7"><strong>' + Admin.escapeHtml(order.id || '-') + '</strong></dd>' +
            '<dt class="col-sm-5">Tanggal</dt><dd class="col-sm-7">' + Admin.escapeHtml(Admin.formatDateTime(order.date)) + '</dd>' +
            '<dt class="col-sm-5">Status</dt><dd class="col-sm-7">' + Admin.badge(status.label, status.tone) + '</dd>' +
            '<dt class="col-sm-5">Pembayaran</dt><dd class="col-sm-7">' + Admin.escapeHtml(order.payment || '-') + '</dd>' +
            '<dt class="col-sm-5">Pengiriman</dt><dd class="col-sm-7">' + Admin.escapeHtml(order.shippingLabel || '-') + '</dd>' +
            '</dl>' +
            '</div>' +
            '<div class="col-lg-6">' +
            '<dl class="row detail-list">' +
            '<dt class="col-sm-5">Pelanggan</dt><dd class="col-sm-7">' + Admin.escapeHtml(customer.name || '-') + '</dd>' +
            '<dt class="col-sm-5">Email</dt><dd class="col-sm-7">' + Admin.escapeHtml(customer.email || '-') + '</dd>' +
            '<dt class="col-sm-5">Telepon</dt><dd class="col-sm-7">' + Admin.escapeHtml(customer.phone || '-') + '</dd>' +
            '<dt class="col-sm-5">Alamat</dt><dd class="col-sm-7">' + Admin.escapeHtml(address || '-') + '</dd>' +
            '</dl>' +
            '</div>' +
            '</div>' +
            '<h6 class="font-weight-bold text-gray-800 mt-2 mb-2">Rincian Produk</h6>' +
            '<div class="table-responsive">' +
            '<table class="table order-items-table mb-3">' +
            '<thead><tr><th>Produk</th><th class="text-center">Jumlah</th><th class="text-right">Harga</th><th class="text-right">Subtotal</th></tr></thead>' +
            '<tbody>' + itemsHtml + '</tbody>' +
            '</table>' +
            '</div>' +
            '<div class="order-summary">' +
            '<div class="summary-row"><span>Subtotal</span><strong>' + Admin.escapeHtml(Admin.formatRupiah(order.subtotal)) + '</strong></div>' +
            '<div class="summary-row"><span>Diskon Produk</span><strong>' + Admin.escapeHtml(Admin.formatRupiah(order.discount)) + '</strong></div>' +
            '<div class="summary-row"><span>Kupon Diskon' +
            (order.couponCode ? ' (' + Admin.escapeHtml(order.couponCode) + ')' : '') + '</span><strong>' +
            Admin.escapeHtml(Admin.formatRupiah(order.coupon)) + '</strong></div>' +
            '<div class="summary-row"><span>Biaya Pengiriman</span><strong>' +
            (Number(order.shipping) > 0 ? Admin.escapeHtml(Admin.formatRupiah(order.shipping)) : 'Gratis') + '</strong></div>' +
            '<div class="summary-row total"><span>Total</span><span>' + Admin.escapeHtml(Admin.formatRupiah(order.total)) + '</span></div>' +
            '</div>';

        showModal('trxDetailModal');
    }

    function openStatus(id) {
        var order = findOrder(id);
        if (!order) return;

        editingId = order.id;
        statusSelect.value = orderStatus(order);
        Admin.setText('trxStatusOrderId', order.id || '-');
        showModal(statusModal.id);
    }

    function saveStatus(event) {
        event.preventDefault();
        if (!editingId) return;

        var status = statusSelect.value;
        orders = orders.map(function (order) {
            if (String(order.id) !== String(editingId)) return order;
            return Object.assign({}, order, { status: status });
        });

        Admin.saveOrders(orders);
        hideModal(statusModal.id);
        render();
        Admin.toast('Status transaksi berhasil diperbarui.', 'success');
    }

    function deleteOrder(id) {
        var order = findOrder(id);
        if (!order) return;

        Admin.confirmAction({
            title: 'Hapus Transaksi',
            message: 'Hapus transaksi "' + (order.id || '-') + '"? Data transaksi akan hilang permanen.',
            confirmText: 'Hapus Transaksi'
        }, function () {
            orders = orders.filter(function (item) {
                return String(item.id) !== String(id);
            });
            Admin.saveOrders(orders);
            render();
            Admin.toast('Transaksi berhasil dihapus.', 'success');
        });
    }

    function exportOrders() {
        if (!orders.length) {
            Admin.toast('Belum ada transaksi untuk diekspor.', 'warning');
            return;
        }

        var rows = [
            ['ID Transaksi', 'Tanggal', 'Pelanggan', 'Email', 'Produk', 'Jumlah Item',
                'Subtotal', 'Diskon Produk', 'Kupon', 'Pengiriman', 'Total', 'Pembayaran', 'Status']
        ];

        sortedOrders().forEach(function (order) {
            var customer = order.customer || {};
            rows.push([
                order.id,
                Admin.formatDateTime(order.date),
                customerName(order),
                customerEmail(order),
                itemSummary(order),
                itemCount(order),
                Number(order.subtotal) || 0,
                Number(order.discount) || 0,
                Number(order.coupon) || 0,
                Number(order.shipping) || 0,
                Number(order.total) || 0,
                order.payment || '-',
                orderStatus(order)
            ]);
        });

        Admin.downloadCsv('transaksi-maccessoris-' + Admin.todayInput() + '.csv', rows);
        Admin.toast('Data transaksi berhasil diekspor.', 'success');
    }

    searchInput.addEventListener('input', render);
    statusFilter.addEventListener('change', render);
    exportButton.addEventListener('click', exportOrders);
    statusForm.addEventListener('submit', saveStatus);

    tbody.addEventListener('click', function (event) {
        var button = event.target.closest('button[data-action]');
        if (!button) return;

        var action = button.getAttribute('data-action');
        var id = button.getAttribute('data-id');

        if (action === 'view') openDetail(id);
        if (action === 'status') openStatus(id);
        if (action === 'delete') deleteOrder(id);
    });

    render();
})(window, document);
