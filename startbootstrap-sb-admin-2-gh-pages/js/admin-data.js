/* =========================================================================
   MAccessoris Admin
   Helper data bersama untuk halaman Dashboard dan Data Admin.
   Data disimpan di localStorage sehingga seluruh halaman admin saling
   terhubung. Kunci pengguna & transaksi memakai kunci yang sama dengan
   storefront agar data toko dan admin tetap sinkron.
   ========================================================================= */
(function (window) {
    'use strict';

    var KEYS = {
        users: 'maccessoris.users.v1',
        orders: 'maccessoris.orders.v1',
        products: 'maccessoris.admin.products.v1',
        articles: 'maccessoris.admin.articles.v1'
    };

    var CATEGORY_LABELS = {
        bross: 'Bros',
        strap: 'Strap Phone',
        ring: 'Ring',
        bando: 'Bando',
        aksesoris: 'Aksesoris'
    };

    var TRANSACTION_STATUS = ['Menunggu', 'Diproses', 'Dikirim', 'Selesai', 'Dibatalkan'];

    var SEED_PRODUCTS = [
        {
            id: 'bros-dubai-juntai-1',
            name: 'Bros Dubai Juntai 1',
            price: 15000,
            oldPrice: 20000,
            image: '../images/img-pro-01.jpg',
            category: 'bross',
            badge: 'Diskon',
            stock: 23,
            sold: 7,
            rating: 4.8,
            description: 'Bros Dubai Juntai 1 hadir dengan detail juntai yang anggun dan kilau elegan. Cocok dipakai untuk acara formal, pesta, maupun mempercantik hijab sehari-hari.'
        },
        {
            id: 'bros-magnet-glitter',
            name: 'Bros Magnet Glitter',
            price: 10000,
            oldPrice: 0,
            image: '../images/img-pro-02.jpg',
            category: 'bross',
            badge: 'Terbaru',
            stock: 40,
            sold: 12,
            rating: 4.7,
            description: 'Bros magnet glitter dengan pengait magnet praktis tanpa merusak kain. Tampilan berkilau membuat penampilan lebih hidup dan tetap nyaman dipakai.'
        },
        {
            id: 'bros-motif-kupu-gold',
            name: 'Bros Motif Kupu ( Gold )',
            price: 25000,
            oldPrice: 0,
            image: '../images/img-pro-03.jpg',
            category: 'bross',
            badge: 'Terbaru',
            stock: 18,
            sold: 9,
            rating: 4.9,
            description: 'Bros motif kupu-kupu berwarna gold dengan detail sayap yang halus. Pilihan tepat untuk menambah kesan mewah pada kerudung dan blazer.'
        },
        {
            id: 'bros-kebaya-h7-gold',
            name: 'Bros Kebaya H7 ( Gold )',
            price: 35000,
            oldPrice: 45000,
            image: '../images/img-pro-04.jpg',
            category: 'bross',
            badge: 'Diskon',
            stock: 15,
            sold: 21,
            rating: 4.9,
            description: 'Bros kebaya H7 bernuansa gold, dirancang untuk melengkapi kebaya dan busana tradisional. Detailnya rapi, ringan, dan tidak mudah luntur.'
        },
        {
            id: 'bando-mutiara-polos',
            name: 'Bando Mutiara Polos',
            price: 5000,
            oldPrice: 10000,
            image: '../images/img-pro-05.jpg',
            category: 'bando',
            badge: 'Diskon',
            stock: 23,
            sold: 7,
            rating: 4.8,
            description: 'Bando mutiara yang elegan dan memikat, dirancang untuk menambah sentuhan kemewahan pada setiap penampilan. Dibuat menggunakan mutiara pilihan yang menonjolkan keanggunan dan keindahan alami mutiara.'
        },
        {
            id: 'bros-kebaya-h5-silver',
            name: 'Bros Kebaya H5 ( Silver )',
            price: 35000,
            oldPrice: 0,
            image: '../images/img-pro-06.jpg',
            category: 'bross',
            badge: 'Terlaris',
            stock: 12,
            sold: 34,
            rating: 4.9,
            description: 'Bros kebaya H5 silver dengan desain klasik yang mudah dipadukan. Finishing mengkilap dan ringan sehingga nyaman dipakai sepanjang acara.'
        },
        {
            id: 'tasbih-kristal-biru',
            name: 'Tasbih Kristal ( Biru )',
            price: 20000,
            oldPrice: 0,
            image: '../images/img-pro-07.jpg',
            category: 'aksesoris',
            badge: 'Terlaris',
            stock: 20,
            sold: 27,
            rating: 4.7,
            description: 'Tasbih kristal biru dengan butiran bening dan tali kuat. Praktis dibawa ke mana saja serta cocok dijadikan hadiah untuk keluarga dan sahabat.'
        },
        {
            id: 'bros-dagu-mawar',
            name: 'Bros Dagu Mawar',
            price: 10000,
            oldPrice: 0,
            image: '../images/img-pro-08.jpg',
            category: 'bross',
            badge: 'Terlaris',
            stock: 30,
            sold: 19,
            rating: 4.6,
            description: 'Bros dagu mawar dengan bentuk bunga yang manis dan pemasangan nyaman. Memberikan sentuhan feminin pada hijab untuk aktivitas harian.'
        },
        {
            id: 'strap-phone-luxury-gold',
            name: 'Strap Phone Luxury ( Gold )',
            price: 45000,
            oldPrice: 0,
            image: '../images/gallery-img-04.jpg',
            category: 'strap',
            badge: 'Terbaru',
            stock: 14,
            sold: 8,
            rating: 4.8,
            description: 'Strap phone luxury bernuansa gold dengan rantai kokoh dan tampilan mewah. Membuat ponsel lebih mudah dibawa sekaligus menjadi pelengkap gaya.'
        },
        {
            id: 'strap-phone-rantai-mutiara',
            name: 'Strap Phone Rantai Mutiara',
            price: 55000,
            oldPrice: 75000,
            image: '../images/gallery-img-09.jpg',
            category: 'strap',
            badge: 'Diskon',
            stock: 10,
            sold: 15,
            rating: 4.9,
            description: 'Strap phone rantai mutiara yang elegan dan kuat. Panjang dapat disesuaikan, aman untuk ponsel, dan cocok dipadukan dengan tas maupun outfit favorit.'
        },
        {
            id: 'ring-luxury-kristal',
            name: 'Ring Luxury Kristal',
            price: 30000,
            oldPrice: 0,
            image: '../images/gallery-img-10.jpg',
            category: 'ring',
            badge: 'Terbaru',
            stock: 16,
            sold: 6,
            rating: 4.8,
            description: 'Ring luxury dengan batu kristal berkilau dan ukuran yang dapat disesuaikan. Tampil elegan tanpa berlebihan untuk acara maupun pemakaian harian.'
        },
        {
            id: 'ring-bunga-adjustable',
            name: 'Ring Bunga Adjustable',
            price: 25000,
            oldPrice: 0,
            image: '../images/gallery-img-11.jpg',
            category: 'ring',
            badge: 'Terlaris',
            stock: 4,
            sold: 23,
            rating: 4.7,
            description: 'Ring motif bunga dengan ukuran adjustable, nyaman dipakai berbagai ukuran jari. Detail bunga yang lembut membuat tampilan lebih manis dan menarik.'
        }
    ];

    var SEED_ARTICLES = [
        {
            id: 'artikel-pentingnya-aksesoris',
            title: 'Pentingnya aksesoris bagi para artis',
            image: '../images/blog-img.jpg',
            excerpt: 'Aksesori bukan hanya sekedar pelengkap untuk penampilan, tetapi juga merupakan elemen penting yang dapat membuat perbedaan pada gaya seseorang. Di dunia fashion yang terus berkembang, aksesori memiliki peran yang sangat vital dalam menunjukkan kepribadian, mengekspresikan kreativitas, dan menyempurnakan setiap tampilan.',
            link: '../detail-artikel1.html',
            date: '2024-05-12',
            status: 'Terbit'
        },
        {
            id: 'artikel-aksesoris-kepala',
            title: 'Aksesoris Kepala Menambah Kesan Anggun',
            image: '../images/blog-img-01.jpg',
            excerpt: 'Aksesori kepala adalah elemen yang sering diabaikan dalam dunia fashion, namun memiliki kemampuan besar untuk menambah kesan anggun dan mempercantik penampilan. Dari topi yang elegan hingga bando yang manis, aksesori kepala dapat memberikan sentuhan yang unik dan memperkaya gaya Anda.',
            link: '../detail-artikel2.html',
            date: '2024-06-03',
            status: 'Terbit'
        },
        {
            id: 'artikel-aksesoris-handphone',
            title: 'Kesan Unik dan Lucu Aksesoris Pada Handphone',
            image: '../images/blog-img-02.jpg',
            excerpt: 'Handphone telah menjadi bagian penting dari kehidupan kita sehari-hari. Selain sebagai alat komunikasi, handphone juga sering dijadikan sebagai perpanjangan gaya dan kepribadian penggunanya. Salah satu cara untuk menambahkan sentuhan unik dan lucu pada handphone adalah menggunakan aksesori yang kreatif dan menarik.',
            link: '../detail-artikel3.html',
            date: '2024-07-18',
            status: 'Terbit'
        }
    ];

    var SEED_USERS = [
        {
            id: 'user-demo',
            name: 'Demo MAccessoris',
            email: 'demo@maccessoris.com',
            password: 'demo123',
            phone: '081234567890',
            address: 'Perumahan Grand Surya, Sidoarjo',
            status: 'Aktif',
            createdAt: '2024-08-20T09:15:00.000Z'
        }
    ];

    /* ---------------------------------------------------------------------
       Penyimpanan
       --------------------------------------------------------------------- */
    function read(key, fallback) {
        try {
            var raw = window.localStorage.getItem(key);
            return raw ? JSON.parse(raw) : fallback;
        } catch (error) {
            return fallback;
        }
    }

    function write(key, value) {
        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            /* localStorage bisa penuh atau diblokir; biarkan UI tetap jalan. */
        }
    }

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function ensureList(key, seed) {
        var data = read(key, null);
        if (Array.isArray(data)) return data;
        var seeded = clone(seed);
        write(key, seeded);
        return seeded;
    }

    function getProducts() {
        return ensureList(KEYS.products, SEED_PRODUCTS);
    }

    function saveProducts(list) {
        write(KEYS.products, list);
    }

    function getArticles() {
        return ensureList(KEYS.articles, SEED_ARTICLES);
    }

    function saveArticles(list) {
        write(KEYS.articles, list);
    }

    function getUsers() {
        return ensureList(KEYS.users, SEED_USERS);
    }

    function saveUsers(list) {
        write(KEYS.users, list);
    }

    function getOrders() {
        var orders = read(KEYS.orders, []);
        return Array.isArray(orders) ? orders : [];
    }

    function saveOrders(list) {
        write(KEYS.orders, list);
    }

    /* ---------------------------------------------------------------------
       Helper umum
       --------------------------------------------------------------------- */
    function escapeHtml(value) {
        return String(value === null || value === undefined ? '' : value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function formatRupiah(number) {
        var amount = Math.round(Number(number) || 0);
        return 'Rp ' + amount.toLocaleString('id-ID');
    }

    function formatDate(value) {
        if (!value) return '-';
        var date = new Date(value);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    function formatDateTime(value) {
        if (!value) return '-';
        var date = new Date(value);
        if (isNaN(date.getTime())) return '-';
        return formatDate(value) + ' · ' + date.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        }).replace('.', ':') + ' WIB';
    }

    function toInputDate(value) {
        if (!value) return '';
        var date = new Date(value);
        if (isNaN(date.getTime())) return '';
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return date.getFullYear() + '-' + month + '-' + day;
    }

    function todayInput() {
        return toInputDate(new Date().toISOString());
    }

    function categoryLabel(category) {
        return CATEGORY_LABELS[category] || 'Aksesoris';
    }

    function slugify(value) {
        var slug = String(value || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        return slug || 'item';
    }

    function uid(prefix) {
        return (prefix || 'id') + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    }

    function truncate(value, length) {
        var text = String(value || '');
        if (text.length <= length) return text;
        return text.slice(0, length - 1).replace(/\s+$/, '') + '…';
    }

    function badge(text, tone) {
        return '<span class="badge badge-soft-' + escapeHtml(tone || 'secondary') + '">' +
            escapeHtml(text) + '</span>';
    }

    function stockStatus(stock) {
        var value = Number(stock) || 0;
        if (value <= 0) return { label: 'Habis', tone: 'danger' };
        if (value <= 5) return { label: 'Stok Menipis', tone: 'warning' };
        return { label: 'Tersedia', tone: 'success' };
    }

    function transactionStatus(status) {
        var value = String(status || 'Menunggu');
        var tones = {
            Menunggu: 'warning',
            Diproses: 'info',
            Dikirim: 'primary',
            Selesai: 'success',
            Dibatalkan: 'danger'
        };
        return { label: value, tone: tones[value] || 'secondary' };
    }

    function emptyState(icon, title, message) {
        return '<div class="empty-state">' +
            '<i class="' + escapeHtml(icon || 'fas fa-inbox') + '"></i>' +
            '<h6>' + escapeHtml(title || 'Belum ada data') + '</h6>' +
            '<p class="mb-0">' + escapeHtml(message || 'Data akan muncul di sini.') + '</p>' +
            '</div>';
    }

    function setText(id, value) {
        var element = document.getElementById(id);
        if (element) element.textContent = value;
    }

    function getStats() {
        var users = getUsers();
        var products = getProducts();
        var articles = getArticles();
        var orders = getOrders();
        var activeUsers = users.filter(function (user) {
            return String(user.status || 'Aktif') !== 'Nonaktif';
        }).length;
        var revenue = orders.reduce(function (total, order) {
            if (String(order.status) === 'Dibatalkan') return total;
            return total + (Number(order.total) || 0);
        }, 0);
        var pending = orders.filter(function (order) {
            var status = String(order.status || 'Menunggu');
            return status === 'Menunggu' || status === 'Diproses';
        }).length;

        return {
            users: users.length,
            activeUsers: activeUsers,
            products: products.length,
            stock: products.reduce(function (total, product) {
                return total + (Number(product.stock) || 0);
            }, 0),
            lowStock: products.filter(function (product) {
                return (Number(product.stock) || 0) <= 5;
            }).length,
            articles: articles.length,
            published: articles.filter(function (article) {
                return String(article.status || 'Terbit') === 'Terbit';
            }).length,
            drafts: articles.filter(function (article) {
                return String(article.status || 'Terbit') === 'Draf';
            }).length,
            orders: orders.length,
            revenue: revenue,
            pending: pending
        };
    }

    /* ---------------------------------------------------------------------
       Notifikasi & konfirmasi
       --------------------------------------------------------------------- */
    function toast(message, type) {
        var container = document.getElementById('adminToastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'adminToastContainer';
            container.className = 'admin-toast-container';
            document.body.appendChild(container);
        }

        var icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            info: 'fas fa-info-circle',
            warning: 'fas fa-exclamation-triangle'
        };

        var item = document.createElement('div');
        item.className = 'admin-toast admin-toast-' + (type || 'success');
        item.innerHTML = '<i class="' + (icons[type] || icons.success) + '"></i><span>' +
            escapeHtml(message) + '</span>';
        container.appendChild(item);

        window.setTimeout(function () {
            item.classList.add('admin-toast-hide');
            window.setTimeout(function () {
                if (item.parentNode) item.parentNode.removeChild(item);
            }, 300);
        }, 3400);
    }

    function confirmAction(config, onConfirm) {
        var options = typeof config === 'string' ? { message: config } : (config || {});
        var modal = document.getElementById('adminConfirmModal');

        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'adminConfirmModal';
            modal.className = 'modal fade';
            modal.tabIndex = -1;
            modal.setAttribute('role', 'dialog');
            modal.setAttribute('aria-hidden', 'true');
            modal.innerHTML =
                '<div class="modal-dialog modal-dialog-centered" role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<h5 class="modal-title"><i class="fas fa-exclamation-triangle text-warning mr-2"></i>' +
                '<span class="admin-confirm-title">Konfirmasi</span></h5>' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Tutup">' +
                '<span aria-hidden="true">&times;</span></button>' +
                '</div>' +
                '<div class="modal-body"><p class="mb-0 admin-confirm-message"></p></div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-light border" data-dismiss="modal">Batal</button>' +
                '<button type="button" class="btn btn-danger admin-confirm-accept">Hapus</button>' +
                '</div></div></div>';
            document.body.appendChild(modal);
        }

        var title = modal.querySelector('.admin-confirm-title');
        var message = modal.querySelector('.admin-confirm-message');
        var accept = modal.querySelector('.admin-confirm-accept');

        if (title) title.textContent = options.title || 'Konfirmasi';
        if (message) message.textContent = options.message || 'Apakah Anda yakin?';
        if (accept) {
            accept.textContent = options.confirmText || 'Hapus';
            accept.className = 'btn admin-confirm-accept ' + (options.tone || 'btn-danger');
        }

        if (accept) {
            accept.onclick = function () {
                if (window.jQuery) window.jQuery(modal).modal('hide');
                if (typeof onConfirm === 'function') onConfirm();
            };
        }

        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.modal) {
            window.jQuery(modal).modal('show');
        } else if (window.confirm(options.message || 'Apakah Anda yakin?')) {
            if (typeof onConfirm === 'function') onConfirm();
        }
    }

    /* ---------------------------------------------------------------------
       Unduh CSV
       --------------------------------------------------------------------- */
    function downloadCsv(filename, rows) {
        var content = rows.map(function (row) {
            return row.map(function (cell) {
                return '"' + String(cell === null || cell === undefined ? '' : cell)
                    .replace(/"/g, '""') + '"';
            }).join(',');
        }).join('\r\n');

        var blob = new Blob(['\ufeff' + content], { type: 'text/csv;charset=utf-8;' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
    }

    window.AdminData = {
        KEYS: KEYS,
        categories: CATEGORY_LABELS,
        transactionStatuses: TRANSACTION_STATUS,
        getProducts: getProducts,
        saveProducts: saveProducts,
        getArticles: getArticles,
        saveArticles: saveArticles,
        getUsers: getUsers,
        saveUsers: saveUsers,
        getOrders: getOrders,
        saveOrders: saveOrders,
        getStats: getStats,
        escapeHtml: escapeHtml,
        formatRupiah: formatRupiah,
        formatDate: formatDate,
        formatDateTime: formatDateTime,
        toInputDate: toInputDate,
        todayInput: todayInput,
        categoryLabel: categoryLabel,
        slugify: slugify,
        uid: uid,
        truncate: truncate,
        badge: badge,
        stockStatus: stockStatus,
        transactionStatus: transactionStatus,
        emptyState: emptyState,
        setText: setText,
        toast: toast,
        confirmAction: confirmAction,
        downloadCsv: downloadCsv
    };
})(window);
