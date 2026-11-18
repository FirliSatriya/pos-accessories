/* =========================================================================
   Dashboard Admin MAccessoris
   ========================================================================= */
(function (window, document) {
    'use strict';

    var Admin = window.AdminData;
    if (!Admin) return;

    var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

    function orderStatus(order) {
        return String(order.status || 'Selesai');
    }

    function sortedOrders() {
        return Admin.getOrders().slice().sort(function (a, b) {
            var dateA = new Date(a.date || 0).getTime() || 0;
            var dateB = new Date(b.date || 0).getTime() || 0;
            return dateB - dateA;
        });
    }

    function customerName(order) {
        var customer = order.customer || {};
        return String(customer.name || order.name || '-').trim() || '-';
    }

    function renderDate() {
        var label = document.getElementById('dashboardDate');
        if (!label) return;
        label.textContent = new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    function renderStats() {
        var stats = Admin.getStats();
        Admin.setText('statUsers', stats.users);
        Admin.setText('statUserSub', stats.activeUsers + ' pengguna aktif');
        Admin.setText('statProducts', stats.products);
        Admin.setText('statProductSub', stats.stock + ' total stok · ' + stats.lowStock + ' menipis');
        Admin.setText('statArticles', stats.articles);
        Admin.setText('statArticleSub', stats.published + ' terbit · ' + stats.drafts + ' draf');
        Admin.setText('statOrders', stats.orders);
        Admin.setText('statOrderSub', Admin.formatRupiah(stats.revenue) + ' pendapatan');
    }

    function renderRecentOrders() {
        var tbody = document.getElementById('recentOrdersBody');
        if (!tbody) return;

        var orders = sortedOrders().slice(0, 5);
        tbody.innerHTML = orders.map(function (order) {
            var status = Admin.transactionStatus(orderStatus(order));
            return '<tr>' +
                '<td><strong>' + Admin.escapeHtml(order.id || '-') + '</strong></td>' +
                '<td>' + Admin.escapeHtml(customerName(order)) + '</td>' +
                '<td class="text-nowrap">' + Admin.escapeHtml(Admin.formatDate(order.date)) + '</td>' +
                '<td class="text-nowrap font-weight-bold">' + Admin.escapeHtml(Admin.formatRupiah(order.total)) + '</td>' +
                '<td class="text-center">' + Admin.badge(status.label, status.tone) + '</td>' +
                '</tr>';
        }).join('');

        var table = tbody.closest('table');
        if (table) table.classList.toggle('table-empty', !orders.length);

        if (!orders.length) {
            tbody.innerHTML = '<tr><td colspan="5" class="p-0">' +
                Admin.emptyState(
                    'fas fa-receipt',
                    'Belum ada transaksi',
                    'Transaksi dari halaman checkout akan tampil di sini.'
                ) + '</td></tr>';
        }
    }

    function renderTopProducts() {
        var container = document.getElementById('topProductsList');
        if (!container) return;

        var products = Admin.getProducts().slice().sort(function (a, b) {
            return (Number(b.sold) || 0) - (Number(a.sold) || 0);
        }).slice(0, 5);

        if (!products.length) {
            container.innerHTML = Admin.emptyState(
                'fas fa-box-open',
                'Belum ada produk',
                'Tambahkan produk untuk melihat performa penjualan.'
            );
            return;
        }

        var maxSold = Math.max.apply(null, products.map(function (product) {
            return Number(product.sold) || 0;
        })) || 1;

        container.innerHTML = products.map(function (product) {
            var sold = Number(product.sold) || 0;
            var percent = Math.max(4, Math.round((sold / maxSold) * 100));
            return '<div class="top-product">' +
                '<img src="' + Admin.escapeHtml(product.image || '../images/img-pro-01.jpg') + '" alt="' +
                Admin.escapeHtml(product.name) + '">' +
                '<div class="flex-grow-1">' +
                '<div class="top-product-name">' + Admin.escapeHtml(product.name) + '</div>' +
                '<div class="top-product-meta">' + Admin.escapeHtml(Admin.categoryLabel(product.category)) +
                ' · ' + sold + ' terjual</div>' +
                '<div class="progress"><div class="progress-bar bg-primary" role="progressbar" style="width: ' +
                percent + '%" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100"></div></div>' +
                '</div></div>';
        }).join('');
    }

    function monthKey(date) {
        return date.getFullYear() + '-' + date.getMonth();
    }

    function renderCharts() {
        if (!window.Chart) return;

        var orders = Admin.getOrders();

        Chart.defaults.global.defaultFontFamily = 'Nunito, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
        Chart.defaults.global.defaultFontColor = '#858796';

        /* Grafik pendapatan 6 bulan terakhir */
        var areaCanvas = document.getElementById('myAreaChart');
        if (areaCanvas) {
            var labels = [];
            var totals = [];
            var now = new Date();
            var compact = window.innerWidth < 576;

            for (var offset = 5; offset >= 0; offset -= 1) {
                var monthDate = new Date(now.getFullYear(), now.getMonth() - offset, 1);
                labels.push(compact ?
                    MONTHS[monthDate.getMonth()] :
                    MONTHS[monthDate.getMonth()] + ' ' + String(monthDate.getFullYear()).slice(2));
                totals.push(0);
            }

            orders.forEach(function (order) {
                if (orderStatus(order) === 'Dibatalkan') return;
                var date = new Date(order.date || 0);
                if (isNaN(date.getTime())) return;

                var key = monthKey(date);
                for (var index = 0; index < 6; index += 1) {
                    var target = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
                    if (monthKey(target) === key) {
                        totals[index] += Number(order.total) || 0;
                    }
                }
            });

            new Chart(areaCanvas, {
                type: 'line',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Pendapatan',
                        lineTension: 0.3,
                        backgroundColor: 'rgba(165, 163, 116, 0.14)',
                        borderColor: 'rgba(165, 163, 116, 1)',
                        pointRadius: 3,
                        pointBackgroundColor: 'rgba(165, 163, 116, 1)',
                        pointBorderColor: 'rgba(165, 163, 116, 1)',
                        pointHoverRadius: 4,
                        pointHoverBackgroundColor: 'rgba(165, 163, 116, 1)',
                        pointHoverBorderColor: 'rgba(165, 163, 116, 1)',
                        pointHitRadius: 10,
                        pointBorderWidth: 2,
                        data: totals
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    layout: {
                        padding: { left: 10, right: 25, top: 25, bottom: 0 }
                    },
                    scales: {
                        xAxes: [{
                            gridLines: { display: false, drawBorder: false },
                            ticks: {
                                maxTicksLimit: window.innerWidth < 576 ? 6 : 7,
                                maxRotation: 0,
                                minRotation: 0
                            }
                        }],
                        yAxes: [{
                            ticks: {
                                beginAtZero: true,
                                precision: 0,
                                suggestedMax: Math.max.apply(null, totals.concat([0])) > 0 ?
                                    Math.max.apply(null, totals.concat([0])) * 1.2 : 100000,
                                maxTicksLimit: 5,
                                padding: 10,
                                callback: function (value) {
                                    if (value >= 1000000) return 'Rp ' + (value / 1000000).toFixed(1).replace('.', ',') + ' jt';
                                    if (value >= 1000) return 'Rp ' + Math.round(value / 1000) + ' rb';
                                    return 'Rp ' + value;
                                }
                            },
                            gridLines: {
                                color: 'rgb(234, 236, 244)',
                                zeroLineColor: 'rgb(234, 236, 244)',
                                drawBorder: false,
                                borderDash: [2],
                                zeroLineBorderDash: [2]
                            }
                        }]
                    },
                    legend: { display: false },
                    tooltips: {
                        backgroundColor: 'rgb(255,255,255)',
                        bodyFontColor: '#858796',
                        titleMarginBottom: 10,
                        titleFontColor: '#6e707e',
                        titleFontSize: 14,
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        intersect: false,
                        mode: 'index',
                        caretPadding: 10,
                        callbacks: {
                            label: function (tooltipItem) {
                                return 'Pendapatan: ' + Admin.formatRupiah(tooltipItem.yLabel);
                            }
                        }
                    }
                }
            });
        }

        /* Grafik status transaksi */
        var pieCanvas = document.getElementById('myPieChart');
        if (pieCanvas) {
            var statuses = Admin.transactionStatuses;
            var colors = {
                Menunggu: '#f6c23e',
                Diproses: '#36b9cc',
                Dikirim: '#a5a374',
                Selesai: '#1cc88a',
                Dibatalkan: '#e74a3b'
            };
            var counts = statuses.map(function (status) {
                return orders.filter(function (order) {
                    return orderStatus(order) === status;
                }).length;
            });
            var pieLabels = statuses.slice();
            var pieColors = statuses.map(function (status) {
                return colors[status];
            });

            if (!orders.length) {
                pieLabels = ['Belum ada transaksi'];
                counts = [1];
                pieColors = ['#dddfeb'];
            }

            new Chart(pieCanvas, {
                type: 'doughnut',
                data: {
                    labels: pieLabels,
                    datasets: [{
                        data: counts,
                        backgroundColor: pieColors,
                        hoverBackgroundColor: pieColors,
                        hoverBorderColor: 'rgba(234, 236, 244, 1)'
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    tooltips: {
                        backgroundColor: 'rgb(255,255,255)',
                        bodyFontColor: '#858796',
                        borderColor: '#dddfeb',
                        borderWidth: 1,
                        xPadding: 15,
                        yPadding: 15,
                        displayColors: false,
                        caretPadding: 10,
                        callbacks: {
                            label: function (tooltipItem, chart) {
                                if (!orders.length) return 'Belum ada transaksi';
                                return (chart.labels[tooltipItem.index] || '') + ': ' + tooltipItem.value + ' transaksi';
                            }
                        }
                    },
                    legend: { display: false },
                    cutoutPercentage: 78
                }
            });
        }
    }

    function downloadReport() {
        var stats = Admin.getStats();
        var orders = sortedOrders();
        var rows = [
            ['Laporan MAccessoris', Admin.formatDate(new Date())],
            [],
            ['Ringkasan', 'Nilai'],
            ['Total Pengguna', stats.users],
            ['Pengguna Aktif', stats.activeUsers],
            ['Total Produk', stats.products],
            ['Total Stok', stats.stock],
            ['Artikel Terbit', stats.published],
            ['Total Transaksi', stats.orders],
            ['Pendapatan', stats.revenue],
            ['Transaksi Perlu Diproses', stats.pending],
            [],
            ['ID Transaksi', 'Tanggal', 'Pelanggan', 'Total', 'Pembayaran', 'Status']
        ];

        orders.forEach(function (order) {
            rows.push([
                order.id,
                Admin.formatDateTime(order.date),
                customerName(order),
                Number(order.total) || 0,
                order.payment || '-',
                orderStatus(order)
            ]);
        });

        Admin.downloadCsv('laporan-maccessoris-' + Admin.todayInput() + '.csv', rows);
        Admin.toast('Laporan berhasil diunduh.', 'success');
    }

    renderDate();
    renderStats();
    renderRecentOrders();
    renderTopProducts();
    renderCharts();

    var reportButton = document.getElementById('downloadReportBtn');
    if (reportButton) {
        reportButton.addEventListener('click', function (event) {
            event.preventDefault();
            downloadReport();
        });
    }
})(window, document);
