/* =========================================================================
   MAccessoris Storefront
   Satu file untuk katalog produk, keranjang, favorit, akun, checkout,
   riwayat transaksi, pencarian, dan notifikasi.
   Data disimpan di localStorage sehingga seluruh halaman saling terhubung.
   ========================================================================= */
(function () {
    'use strict';

    /* ---------------------------------------------------------------------
       Konfigurasi penyimpanan
       --------------------------------------------------------------------- */
    var KEYS = {
        cart: 'maccessoris.cart.v1',
        wishlist: 'maccessoris.wishlist.v1',
        coupon: 'maccessoris.coupon.v1',
        orders: 'maccessoris.orders.v1',
        users: 'maccessoris.users.v1',
        session: 'maccessoris.session.v1',
        address: 'maccessoris.address.v1',
        subscription: 'maccessoris.subscription.v1'
    };

    var SHIPPING = {
        shippingOption1: { label: 'Pengiriman Standar', cost: 0, eta: '3-7 hari kerja' },
        shippingOption2: { label: 'Pengiriman Ekspres', cost: 12000, eta: '2-4 hari kerja' },
        shippingOption3: { label: 'Pengiriman Hari Berikutnya', cost: 21000, eta: '1 hari kerja' }
    };

    var COUPONS = {
        MAC10: { code: 'MAC10', type: 'percent', value: 10, label: 'Diskon 10%' }
    };

    var CATEGORY_LABELS = {
        bross: 'Bross',
        strap: 'Strap Phone',
        ring: 'Ring',
        bando: 'Bando',
        aksesoris: 'Aksesoris'
    };

    var GALLERY_CLASS = {
        bross: 'bulbs',
        strap: 'fruits',
        ring: 'podded-vegetables',
        bando: 'root-and-tuberous',
        aksesoris: 'accessories'
    };

    /* ---------------------------------------------------------------------
       Katalog produk
       --------------------------------------------------------------------- */
    var PRODUCTS = [
        {
            id: 'bros-dubai-juntai-1',
            name: 'Bros Dubai Juntai 1',
            price: 15000,
            oldPrice: 20000,
            image: 'images/img-pro-01.jpg',
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
            image: 'images/img-pro-02.jpg',
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
            image: 'images/img-pro-03.jpg',
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
            image: 'images/img-pro-04.jpg',
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
            image: 'images/img-pro-05.jpg',
            category: 'bando',
            badge: 'Diskon',
            stock: 23,
            sold: 7,
            rating: 4.8,
            description: 'Bando Mutiara adalah aksesori kepala yang elegan dan memikat, dirancang untuk menambah sentuhan kemewahan pada setiap penampilan. Dibuat dengan hati-hati menggunakan mutiara pilihan yang menonjolkan keanggunan dan keindahan alami mutiara.'
        },
        {
            id: 'bros-kebaya-h5-silver',
            name: 'Bros Kebaya H5 ( Silver )',
            price: 35000,
            image: 'images/img-pro-06.jpg',
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
            image: 'images/img-pro-07.jpg',
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
            image: 'images/img-pro-08.jpg',
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
            image: 'images/gallery-img-04.jpg',
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
            image: 'images/gallery-img-09.jpg',
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
            image: 'images/gallery-img-10.jpg',
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
            image: 'images/gallery-img-11.jpg',
            category: 'ring',
            badge: 'Terlaris',
            stock: 22,
            sold: 23,
            rating: 4.7,
            description: 'Ring motif bunga dengan ukuran adjustable, nyaman dipakai berbagai ukuran jari. Detail bunga yang lembut membuat tampilan lebih manis dan menarik.'
        }
    ];

    var productMap = {};
    PRODUCTS.forEach(function (product) {
        productMap[product.id] = product;
    });

    /* ---------------------------------------------------------------------
       Helper umum
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
            /* localStorage bisa penuh atau diblokir; abaikan agar UI tetap jalan. */
        }
    }

    function remove(key) {
        try {
            window.localStorage.removeItem(key);
        } catch (error) { /* noop */ }
    }

    function clampInt(value, min, max) {
        var number = parseInt(value, 10);
        if (isNaN(number)) number = min;
        return Math.max(min, Math.min(max, number));
    }

    function formatRupiah(number) {
        var amount = Math.round(Number(number) || 0);
        return 'Rp ' + amount.toLocaleString('id-ID');
    }

    function formatDate(value) {
        var date = value ? new Date(value) : new Date();
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    }

    function normalize(value) {
        return String(value || '')
            .toLowerCase()
            .replace(/bross/g, 'bros')
            .replace(/[^a-z0-9]+/g, ' ')
            .trim();
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function imageFile(src) {
        return String(src || '').split('?')[0].split('/').pop().toLowerCase();
    }

    function getProduct(id) {
        return productMap[id] || null;
    }

    function categoryLabel(category) {
        return CATEGORY_LABELS[category] || 'Aksesoris';
    }

    function debounce(fn, delay) {
        var timer = null;
        return function () {
            var args = arguments;
            var context = this;
            window.clearTimeout(timer);
            timer = window.setTimeout(function () {
                fn.apply(context, args);
            }, delay || 250);
        };
    }

    function $(selector, scope) {
        return (scope || document).querySelector(selector);
    }

    function $all(selector, scope) {
        return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
    }

    /* ---------------------------------------------------------------------
       Keranjang
       --------------------------------------------------------------------- */
    function getCart() {
        var raw = read(KEYS.cart, []);
        if (!Array.isArray(raw)) return [];

        var result = [];
        raw.forEach(function (entry) {
            if (!entry || !productMap[entry.id]) return;
            var qty = clampInt(entry.qty, 1, 99);
            var existing = null;
            result.forEach(function (item) {
                if (item.id === entry.id) existing = item;
            });
            if (existing) {
                existing.qty = clampInt(existing.qty + qty, 1, 99);
            } else {
                result.push({ id: entry.id, qty: qty });
            }
        });
        return result;
    }

    function saveCart(cart) {
        write(KEYS.cart, cart);
        updateBadges();
    }

    function addToCart(productId, qty) {
        var product = getProduct(productId);
        if (!product) return null;

        var cart = getCart();
        var quantity = clampInt(qty, 1, 99);
        var existing = null;
        cart.forEach(function (item) {
            if (item.id === productId) existing = item;
        });

        if (existing) {
            existing.qty = clampInt(existing.qty + quantity, 1, 99);
        } else {
            cart.push({ id: productId, qty: quantity });
        }

        saveCart(cart);
        pulseCartBadge();
        return product;
    }

    function setCartQty(productId, qty) {
        var cart = getCart();
        var quantity = clampInt(qty, 0, 99);
        if (quantity === 0) {
            cart = cart.filter(function (item) { return item.id !== productId; });
        } else {
            cart.forEach(function (item) {
                if (item.id === productId) item.qty = quantity;
            });
        }
        saveCart(cart);
        return cart;
    }

    function removeFromCart(productId) {
        saveCart(getCart().filter(function (item) { return item.id !== productId; }));
    }

    function clearCart() {
        remove(KEYS.cart);
        updateBadges();
    }

    function cartCount() {
        return getCart().reduce(function (total, item) {
            return total + item.qty;
        }, 0);
    }

    function cartSubtotal() {
        return getCart().reduce(function (total, item) {
            var product = getProduct(item.id);
            return total + (product ? product.price * item.qty : 0);
        }, 0);
    }

    function productDiscount() {
        return getCart().reduce(function (total, item) {
            var product = getProduct(item.id);
            if (!product || !product.oldPrice || product.oldPrice <= product.price) return total;
            return total + ((product.oldPrice - product.price) * item.qty);
        }, 0);
    }

    function getCoupon() {
        var coupon = read(KEYS.coupon, null);
        if (!coupon || !coupon.code || !COUPONS[coupon.code]) return null;
        return COUPONS[coupon.code];
    }

    function setCoupon(code) {
        var normalized = String(code || '').trim().toUpperCase();
        if (!normalized) {
            remove(KEYS.coupon);
            return { ok: true, removed: true };
        }
        if (!COUPONS[normalized]) {
            return { ok: false, message: 'Kode kupon tidak valid. Coba MAC10.' };
        }
        write(KEYS.coupon, { code: normalized, appliedAt: Date.now() });
        return { ok: true, coupon: COUPONS[normalized] };
    }

    function clearCoupon() {
        remove(KEYS.coupon);
    }

    function cartTotals(shippingCost) {
        var subtotal = cartSubtotal();
        var discount = productDiscount();
        var coupon = getCoupon();
        var couponDiscount = 0;

        if (coupon) {
            var base = Math.max(0, subtotal - discount);
            couponDiscount = coupon.type === 'percent'
                ? Math.round((base * coupon.value) / 100)
                : Math.min(coupon.value, base);
        }

        var shipping = Number(shippingCost) || 0;
        var total = Math.max(0, subtotal - discount - couponDiscount + shipping);

        return {
            subtotal: subtotal,
            discount: discount,
            coupon: coupon,
            couponDiscount: couponDiscount,
            shipping: shipping,
            total: total
        };
    }

    /* ---------------------------------------------------------------------
       Favorit
       --------------------------------------------------------------------- */
    function getWishlist() {
        var raw = read(KEYS.wishlist, []);
        if (!Array.isArray(raw)) return [];
        return raw.filter(function (entry) {
            return entry && productMap[entry.id];
        }).map(function (entry) {
            return { id: entry.id, qty: clampInt(entry.qty, 1, 99) };
        });
    }

    function saveWishlist(items) {
        write(KEYS.wishlist, items);
        updateBadges();
    }

    function isWishlisted(productId) {
        return getWishlist().some(function (item) { return item.id === productId; });
    }

    function toggleWishlist(productId) {
        var items = getWishlist();
        var exists = items.some(function (item) { return item.id === productId; });
        if (exists) {
            items = items.filter(function (item) { return item.id !== productId; });
            saveWishlist(items);
            return false;
        }
        items.push({ id: productId, qty: 1 });
        saveWishlist(items);
        return true;
    }

    function setWishlistQty(productId, qty) {
        var items = getWishlist();
        items.forEach(function (item) {
            if (item.id === productId) item.qty = clampInt(qty, 1, 99);
        });
        saveWishlist(items);
    }

    function removeFromWishlist(productId) {
        saveWishlist(getWishlist().filter(function (item) { return item.id !== productId; }));
    }

    function wishlistCount() {
        return getWishlist().length;
    }

    /* ---------------------------------------------------------------------
       Akun pengguna
       --------------------------------------------------------------------- */
    function seedUsers() {
        var users = read(KEYS.users, null);
        if (Array.isArray(users) && users.length) return;
        write(KEYS.users, [{
            id: 'user-demo',
            name: 'Demo MAccessoris',
            email: 'demo@maccessoris.com',
            password: 'demo123',
            phone: '081234567890',
            address: 'Perumahan Grand Surya, Sidoarjo'
        }]);
    }

    function getUsers() {
        var users = read(KEYS.users, []);
        return Array.isArray(users) ? users : [];
    }

    function saveUsers(users) {
        write(KEYS.users, users);
    }

    function findUser(email) {
        var needle = String(email || '').trim().toLowerCase();
        var found = null;
        getUsers().forEach(function (user) {
            if (String(user.email || '').toLowerCase() === needle) found = user;
        });
        return found;
    }

    function registerUser(data) {
        var name = String(data.name || '').trim();
        var email = String(data.email || '').trim().toLowerCase();
        var password = String(data.password || '');

        if (name.length < 2) return { ok: false, message: 'Nama minimal 2 karakter.' };
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, message: 'Alamat email tidak valid.' };
        if (password.length < 6) return { ok: false, message: 'Kata sandi minimal 6 karakter.' };
        if (findUser(email)) return { ok: false, message: 'Email sudah terdaftar. Silakan masuk.' };

        var users = getUsers();
        var user = {
            id: 'user-' + Date.now(),
            name: name,
            email: email,
            password: password,
            phone: String(data.phone || ''),
            address: String(data.address || ''),
            createdAt: new Date().toISOString()
        };
        users.push(user);
        saveUsers(users);
        return { ok: true, user: user };
    }

    function loginUser(email, password) {
        var user = findUser(email);
        if (!user) return { ok: false, message: 'Email belum terdaftar.' };
        if (String(user.password) !== String(password)) return { ok: false, message: 'Kata sandi salah.' };
        write(KEYS.session, { id: user.id, at: Date.now() });
        return { ok: true, user: user };
    }

    function currentUser() {
        var session = read(KEYS.session, null);
        if (!session || !session.id) return null;
        var found = null;
        getUsers().forEach(function (user) {
            if (user.id === session.id) found = user;
        });
        return found;
    }

    function logoutUser() {
        remove(KEYS.session);
    }

    function updateCurrentUser(patch) {
        var user = currentUser();
        if (!user) return null;
        var users = getUsers().map(function (item) {
            if (item.id !== user.id) return item;
            return Object.assign({}, item, patch);
        });
        saveUsers(users);
        return currentUser();
    }

    /* ---------------------------------------------------------------------
       Riwayat transaksi
       --------------------------------------------------------------------- */
    function getOrders() {
        var orders = read(KEYS.orders, []);
        return Array.isArray(orders) ? orders : [];
    }

    function createOrder(data) {
        var orders = getOrders();
        var now = new Date();
        var random = String(Math.floor(Math.random() * 900) + 100);
        var order = Object.assign({}, data, {
            id: 'TRX' + now.getFullYear() + String(now.getMonth() + 1).padStart(2, '0') +
                String(now.getDate()).padStart(2, '0') + '-' + random,
            date: now.toISOString(),
            status: 'Selesai'
        });
        orders.push(order);
        write(KEYS.orders, orders);
        return order;
    }

    /* ---------------------------------------------------------------------
       Notifikasi & badge
       --------------------------------------------------------------------- */
    function ensureToast() {
        var toast = document.getElementById('ma-toast');
        if (toast) return toast;
        toast = document.createElement('div');
        toast.id = 'ma-toast';
        toast.className = 'ma-toast';
        document.body.appendChild(toast);
        return toast;
    }

    function showToast(message, type, actionText, actionHref) {
        var toast = ensureToast();
        toast.className = 'ma-toast ' + (type || 'success');
        toast.innerHTML = '<div class="ma-toast-icon">' +
            (type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' :
                type === 'info' ? '<i class="fas fa-info-circle"></i>' : '<i class="fas fa-check-circle"></i>') +
            '</div><div class="ma-toast-body"><span class="ma-toast-message">' + escapeHtml(message) + '</span>' +
            (actionText && actionHref ? '<a class="ma-toast-action" href="' + escapeHtml(actionHref) + '">' + escapeHtml(actionText) + '</a>' : '') +
            '</div><button type="button" class="ma-toast-close" aria-label="Tutup">&times;</button>';

        var close = toast.querySelector('.ma-toast-close');
        if (close) {
            close.addEventListener('click', function () {
                toast.classList.remove('show');
            });
        }

        toast.classList.add('show');
        window.clearTimeout(showToast._timer);
        showToast._timer = window.setTimeout(function () {
            toast.classList.remove('show');
        }, 4200);
    }

    function setBadge(link, count) {
        if (!link) return;
        var badge = link.querySelector('.badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'badge';
            link.appendChild(badge);
        }
        badge.textContent = String(count);
        badge.style.display = count > 0 ? 'inline-block' : 'none';
    }

    function pulseCartBadge() {
        var cartLink = $('nav .navbar-nav [data-ma-cart-link]');
        if (!cartLink) return;
        cartLink.classList.remove('ma-badge-pulse');
        /* restart animasi */
        void cartLink.offsetWidth;
        cartLink.classList.add('ma-badge-pulse');
    }

    function updateBadges() {
        var nav = $('nav.navbar');
        if (!nav) return;

        var cartLink = $('[data-ma-cart-link]', nav);
        if (!cartLink) {
            var bagLink = $('.navbar-nav li.nav-item > a[href="wishlist.html"]', nav);
            if (bagLink && bagLink.querySelector('.fa-shopping-bag')) {
                bagLink.setAttribute('data-ma-cart-link', '');
                bagLink.setAttribute('href', 'cart.html');
                bagLink.setAttribute('title', 'Keranjang Belanja');
                bagLink.setAttribute('aria-label', 'Keranjang Belanja');
                cartLink = bagLink;
            }
        }

        if (cartLink) {
            setBadge(cartLink, cartCount());
            var li = cartLink.closest('li');
            if (li && !$('[data-ma-wishlist-link]', li.parentNode)) {
                var wishLi = document.createElement('li');
                wishLi.className = 'nav-item ma-wishlist-nav';
                wishLi.innerHTML = '<a href="wishlist.html" data-ma-wishlist-link title="Daftar Favorit" aria-label="Daftar Favorit">' +
                    '<i class="far fa-heart"></i><span class="badge">0</span></a>';
                li.parentNode.insertBefore(wishLi, li);
            }
        }

        var wishLink = $('[data-ma-wishlist-link]', nav);
        if (wishLink) setBadge(wishLink, wishlistCount());

        /* Rapikan label dropdown agar sesuai isi halaman. */
        var cartDropdown = $('.navbar-nav .dropdown-menu a[href="cart.html"]', nav);
        if (cartDropdown && normalize(cartDropdown.textContent) === 'pemesanan') {
            cartDropdown.textContent = 'Keranjang';
        }
        var wishDropdown = $('.navbar-nav .dropdown-menu a[href="wishlist.html"]', nav);
        if (wishDropdown && normalize(wishDropdown.textContent).indexOf('keranjang') === 0) {
            wishDropdown.textContent = 'Favorit';
        }
    }

    /* ---------------------------------------------------------------------
       Header akun
       --------------------------------------------------------------------- */
    function enhanceHeader() {
        var loginBox = $('.login-box');
        if (!loginBox) return;

        var user = currentUser();
        if (!user) return;

        var firstName = String(user.name || '').trim().split(/\s+/)[0];
        loginBox.classList.add('ma-login-box');
        loginBox.innerHTML =
            '<a href="my-account.html" class="ma-user-link" title="Buka akun saya">' +
            '<i class="fa fa-user"></i> Hai, ' + escapeHtml(firstName) + '</a>' +
            '<a href="#" class="ma-logout" data-logout title="Keluar dari akun">' +
            '<i class="fas fa-sign-out-alt"></i> Keluar</a>';
    }

    /* ---------------------------------------------------------------------
       Resolusi produk dari elemen
       --------------------------------------------------------------------- */
    function resolveProduct(element) {
        if (!element || !element.closest) return null;

        var withId = element.closest('[data-product-id]');
        if (withId) {
            var direct = getProduct(withId.getAttribute('data-product-id'));
            if (direct) return direct;
        }

        var ownId = element.getAttribute && element.getAttribute('data-product-id');
        if (ownId && getProduct(ownId)) return getProduct(ownId);

        var card = element.closest('.products-single, .product, .special-grid, .item, tr');
        if (!card) return null;

        var cardId = card.getAttribute('data-product-id');
        if (cardId && getProduct(cardId)) return getProduct(cardId);

        var image = card.querySelector('img');
        if (image) {
            var file = imageFile(image.getAttribute('src'));
            var byImage = null;
            PRODUCTS.forEach(function (product) {
                if (imageFile(product.image) === file) byImage = product;
            });
            if (byImage) return byImage;
        }

        var nameElement = card.querySelector('h4, .name-pr a, .why-text h4');
        if (nameElement) {
            var target = normalize(nameElement.textContent);
            var byName = null;
            PRODUCTS.forEach(function (product) {
                if (normalize(product.name) === target) byName = product;
            });
            if (byName) return byName;
        }

        return null;
    }

    function resolveQty(element) {
        var scope = element && element.closest ? element.closest('.single-product-details, tr, .special-grid, .product, .item, .products-single') : null;
        if (scope) {
            var input = scope.querySelector('input[type="number"]');
            if (input) return clampInt(input.value, 1, 99);
        }
        var ownQty = element && element.getAttribute ? element.getAttribute('data-qty') : null;
        return ownQty ? clampInt(ownQty, 1, 99) : 1;
    }

    /* ---------------------------------------------------------------------
       Kartu produk
       --------------------------------------------------------------------- */
    function wishlistButtonHtml(productId) {
        return '<li><a href="#" class="wishlist-toggle" data-product-id="' + productId + '"' +
            ' data-toggle="tooltip" data-placement="right" title="Tambah ke favorit">' +
            '<i class="far fa-heart"></i></a></li>';
    }

    function hydrateCard(card) {
        if (!card || card.getAttribute('data-ma-hydrated') === '1') return;
        var product = resolveProduct(card);
        if (!product) return;

        card.setAttribute('data-product-id', product.id);
        card.setAttribute('data-ma-hydrated', '1');

        var viewIcon = card.querySelector('.mask-icon .fa-eye');
        if (viewIcon) {
            var viewLink = viewIcon.closest('a');
            if (viewLink) viewLink.setAttribute('href', 'shop-detail.html?id=' + encodeURIComponent(product.id));
        }

        var addLink = card.querySelector('.mask-icon > a.cart');
        if (addLink) {
            addLink.setAttribute('href', '#');
            addLink.setAttribute('data-product-id', product.id);
            addLink.setAttribute('data-add-to-cart', '');
        }

        var list = card.querySelector('.mask-icon ul');
        if (list && !list.querySelector('.wishlist-toggle')) {
            list.insertAdjacentHTML('beforeend', wishlistButtonHtml(product.id));
        }
    }

    function hydrateAllCards() {
        $all('.products-single').forEach(hydrateCard);
        syncWishlistIcons();
    }

    function syncWishlistIcons() {
        $all('.wishlist-toggle').forEach(function (link) {
            var productId = link.getAttribute('data-product-id');
            if (!productId) return;
            var active = isWishlisted(productId);
            link.classList.toggle('active', active);
            link.setAttribute('title', active ? 'Hapus dari favorit' : 'Tambah ke favorit');
            var icon = link.querySelector('i');
            if (icon) {
                icon.classList.toggle('fas', active);
                icon.classList.toggle('far', !active);
            }
        });
    }

    /* ---------------------------------------------------------------------
       Render halaman toko & katalog
       --------------------------------------------------------------------- */
    function productCardHtml(product, options) {
        var opts = options || {};
        var columnClass = opts.columnClass || 'col-sm-6 col-md-6 col-lg-4 col-xl-4';
        var extraClass = opts.extraClass || '';
        var badgeClass = product.oldPrice ? 'sale' : 'new';
        var badgeText = product.badge || (product.oldPrice ? 'Diskon' : 'Baru');
        var priceHtml = formatRupiah(product.price) +
            (product.oldPrice ? ' <del>' + formatRupiah(product.oldPrice) + '</del>' : '');

        return '<div class="' + columnClass + ' product special-grid ' + extraClass + '"' +
            ' data-price="' + product.price + '"' +
            ' data-product-id="' + product.id + '"' +
            ' data-category="' + product.category + '"' +
            ' data-name="' + escapeHtml(product.name.toLowerCase()) + '"' +
            ' data-ma-hydrated="1">' +
            '<div class="products-single fix">' +
            '<div class="box-img-hover">' +
            '<div class="type-lb"><p class="' + badgeClass + '">' + escapeHtml(badgeText) + '</p></div>' +
            '<img src="' + product.image + '" class="img-fluid" alt="' + escapeHtml(product.name) + '">' +
            '<div class="mask-icon"><ul>' +
            '<li><a href="shop-detail.html?id=' + encodeURIComponent(product.id) + '" data-toggle="tooltip" data-placement="right" title="Lihat"><i class="fas fa-eye"></i></a></li>' +
            wishlistButtonHtml(product.id) +
            '</ul><a class="cart" href="#" data-product-id="' + product.id + '" data-add-to-cart>Masuk Keranjang</a></div>' +
            '</div>' +
            '<div class="why-text">' +
            '<h4>' + escapeHtml(product.name) + '</h4>' +
            '<h5>' + priceHtml + '</h5>' +
            '<p class="ma-product-meta">' + escapeHtml(categoryLabel(product.category)) + '</p>' +
            '</div>' +
            '</div></div>';
    }

    function renderShopProducts() {
        var container = document.getElementById('itemsContainer');
        if (!container) return;
        container.innerHTML = PRODUCTS.map(function (product) {
            return productCardHtml(product, {
                columnClass: 'col-sm-6 col-md-6 col-lg-4 col-xl-4'
            });
        }).join('');
    }

    function renderGalleryProducts() {
        if (!/gallery\.html$/i.test(window.location.pathname)) return;
        var container = $('.special-list');
        if (!container) return;

        container.innerHTML = PRODUCTS.map(function (product) {
            return productCardHtml(product, {
                columnClass: 'col-lg-3 col-md-6',
                extraClass: GALLERY_CLASS[product.category] || 'accessories'
            });
        }).join('');

        /* Pastikan filter Isotope memakai kartu yang baru dirender. */
        if (window.jQuery && window.jQuery.fn && window.jQuery.fn.isotope) {
            window.setTimeout(function () {
                var grid = window.jQuery('.special-list');
                if (grid.data('isotope')) {
                    grid.isotope('reloadItems').isotope({ filter: '*' });
                }
            }, 0);
        }
    }

    function initShopFilter() {
        var container = document.getElementById('itemsContainer');
        if (!container) return;

        var params = new URLSearchParams(window.location.search);
        var searchInput = $('.top-search input.form-control');
        if (searchInput && params.get('q')) searchInput.value = params.get('q');

        function applyFilter(updateUrl) {
            var q = String(params.get('q') || '').trim().toLowerCase();
            var category = String(params.get('category') || '').trim().toLowerCase();
            var visible = 0;

            $all('.product', container).forEach(function (card) {
                var name = String(card.getAttribute('data-name') || '') + ' ' + normalize(card.textContent);
                var matchQuery = !q || name.indexOf(q) !== -1;
                var matchCategory = !category || card.getAttribute('data-category') === category;
                var show = matchQuery && matchCategory;
                card.style.display = show ? '' : 'none';
                if (show) visible += 1;
            });

            var info = $('.product-item-filter p');
            if (info) {
                info.textContent = visible > 0
                    ? 'Menampilkan ' + visible + ' produk' + (q ? ' untuk "' + q + '"' : '')
                    : 'Tidak ada produk yang cocok' + (q ? ' untuk "' + q + '"' : '');
            }

            if (updateUrl) {
                var next = new URLSearchParams();
                if (q) next.set('q', q);
                if (category) next.set('category', category);
                var query = next.toString();
                history.replaceState(null, '', window.location.pathname + (query ? '?' + query : ''));
            }
        }

        if (searchInput) {
            searchInput.addEventListener('input', debounce(function () {
                params.set('q', searchInput.value.trim());
                applyFilter(true);
            }, 250));
        }

        applyFilter(false);
    }

    /* ---------------------------------------------------------------------
       Render halaman detail produk
       --------------------------------------------------------------------- */
    function renderShopDetail() {
        var details = $('.single-product-details');
        if (!details) return;

        var params = new URLSearchParams(window.location.search);
        var product = getProduct(params.get('id'));

        if (!product) {
            var title = details.querySelector('h2');
            product = title ? resolveProduct(title) : null;
        }
        if (!product) product = PRODUCTS[4];

        document.title = product.name + ' - MAccessoris';
        document.body.setAttribute('data-product-id', product.id);

        var heading = details.querySelector('h2');
        if (heading) heading.textContent = product.name;

        var price = details.querySelector('h5');
        if (price) {
            price.innerHTML = '<span class="ma-detail-price">' + formatRupiah(product.price) + '</span>' +
                (product.oldPrice ? ' <del>' + formatRupiah(product.oldPrice) + '</del>' : '');
        }

        var stock = details.querySelector('.available-stock');
        if (stock) {
            stock.innerHTML = '<span>Stok Tersedia ' + product.stock + '<a href="#">' + product.sold + ' Terjual</a></span>';
        }

        var descHeading = details.querySelector('h4');
        if (descHeading) {
            var desc = descHeading.nextElementSibling;
            if (desc && desc.tagName === 'P') desc.textContent = product.description;
        }

        var qtyInput = details.querySelector('.quantity-box input');
        if (qtyInput) {
            qtyInput.value = '1';
            qtyInput.setAttribute('min', '1');
            qtyInput.setAttribute('max', '99');
        }

        var actions = details.querySelector('.add-to-btn .add-comp');
        if (actions) {
            actions.innerHTML =
                '<a class="btn hvr-hover" href="#" data-buy-now data-product-id="' + product.id + '">Beli Sekarang</a>' +
                '<a class="btn hvr-hover" href="#" data-add-to-cart data-product-id="' + product.id + '">Masuk Keranjang</a>' +
                '<a class="btn hvr-hover wishlist-toggle" href="#" data-product-id="' + product.id + '">' +
                '<i class="far fa-heart"></i> Daftar Favorite</a>';
        }

        /* Galeri gambar detail: gunakan foto produk + produk sekategori. */
        var carousel = document.getElementById('carousel-example-1');
        if (carousel) {
            var relatedImages = [product.image];
            PRODUCTS.forEach(function (item) {
                if (item.category === product.category && item.image !== product.image && relatedImages.length < 3) {
                    relatedImages.push(item.image);
                }
            });
            while (relatedImages.length < 3) relatedImages.push(product.image);

            $all('.carousel-item img', carousel).forEach(function (img, index) {
                img.setAttribute('src', relatedImages[index] || product.image);
                img.setAttribute('alt', product.name);
            });
            $all('.carousel-indicators img', carousel).forEach(function (img, index) {
                img.setAttribute('src', relatedImages[index] || product.image);
                img.setAttribute('alt', product.name);
            });
        }

        syncWishlistIcons();
    }

    /* ---------------------------------------------------------------------
       Render halaman keranjang
       --------------------------------------------------------------------- */
    function cartRowHtml(item) {
        var product = getProduct(item.id);
        if (!product) return '';
        var lineTotal = product.price * item.qty;
        return '<tr data-product-id="' + product.id + '">' +
            '<td class="thumbnail-img"><a href="shop-detail.html?id=' + encodeURIComponent(product.id) + '">' +
            '<img class="img-fluid" src="' + product.image + '" alt="' + escapeHtml(product.name) + '"></a></td>' +
            '<td class="name-pr"><a href="shop-detail.html?id=' + encodeURIComponent(product.id) + '">' + escapeHtml(product.name) + '</a>' +
            '<div class="ma-product-meta">' + escapeHtml(categoryLabel(product.category)) + '</div></td>' +
            '<td class="price-pr"><p>' + formatRupiah(product.price) + '</p></td>' +
            '<td class="quantity-box"><input type="number" value="' + item.qty + '" min="1" max="99" step="1" class="c-input-text qty text cart-qty"></td>' +
            '<td class="total-pr"><p>' + formatRupiah(lineTotal) + '</p></td>' +
            '<td class="remove-pr"><a href="#" class="cart-remove" title="Hapus produk"><i class="fas fa-times"></i></a></td>' +
            '</tr>';
    }

    function orderBoxHtml(scope) {
        var prefix = scope === 'checkout' ? 'checkout' : 'cart';
        return '<h3>Rincian Pemesanan</h3>' +
            '<div class="d-flex"><h4>Jumlah Sementara</h4><div class="ml-auto font-weight-bold" id="' + prefix + 'Subtotal">Rp 0</div></div>' +
            '<div class="d-flex"><h4>Diskon Produk</h4><div class="ml-auto font-weight-bold" id="' + prefix + 'ProductDiscount">Rp 0</div></div>' +
            '<hr class="my-1">' +
            '<div class="d-flex"><h4>Kupon Diskon</h4><div class="ml-auto font-weight-bold" id="' + prefix + 'Coupon">Rp 0</div></div>' +
            '<div class="d-flex"><h4>Pajak</h4><div class="ml-auto font-weight-bold">-</div></div>' +
            '<div class="d-flex"><h4>Biaya Pengiriman</h4><div class="ml-auto font-weight-bold" id="' + prefix + 'Shipping">Gratis</div></div>' +
            '<hr>' +
            '<div class="d-flex gr-total"><h5>Total Keseluruhan</h5><div class="ml-auto h5" id="' + prefix + 'Total">Rp 0</div></div>' +
            '<hr>';
    }

    function renderCartPage() {
        var table = $('.cart-box-main table');
        if (!table || $('.shipping-method-box')) return;

        var container = table.closest('.container');
        var cart = getCart();
        var tableRow = table.closest('.row');
        var actionRows = $all('.row.my-5', container);
        var empty = $('.ma-empty-state', container);

        if (!empty) {
            empty = document.createElement('div');
            empty.className = 'ma-empty-state';
            container.insertBefore(empty, container.firstChild);
        }

        var orderBox = $('.order-box', container);

        if (!cart.length) {
            empty.style.display = '';
            empty.innerHTML = '<div class="ma-empty-card"><i class="fas fa-shopping-bag"></i>' +
                '<h3>Keranjang masih kosong</h3><p>Yuk pilih aksesoris favoritmu terlebih dahulu.</p>' +
                '<a href="shop.html" class="btn hvr-hover">Mulai Belanja</a></div>';
            if (tableRow) tableRow.style.display = 'none';
            actionRows.forEach(function (row) { row.style.display = 'none'; });
            return;
        }

        empty.style.display = 'none';
        if (tableRow) tableRow.style.display = '';
        actionRows.forEach(function (row) { row.style.display = ''; });

        table.querySelector('tbody').innerHTML = cart.map(cartRowHtml).join('');

        if (orderBox) orderBox.innerHTML = orderBoxHtml('cart');

        var couponInput = $('.coupon-box input', container);
        var couponBtn = $('.coupon-box button', container);
        var couponBox = $('.coupon-box', container);
        var coupon = getCoupon();

        if (couponInput) couponInput.value = coupon ? coupon.code : '';
        if (couponBtn) couponBtn.textContent = 'Pakai Kupon';

        var note = $('.ma-coupon-note', couponBox || container);
        if (coupon) {
            if (!note && couponBox) {
                note = document.createElement('div');
                note.className = 'ma-coupon-note';
                couponBox.appendChild(note);
            }
            if (note) {
                note.innerHTML = 'Kupon <strong>' + coupon.code + '</strong> aktif (' + coupon.label + '). ' +
                    '<a href="#" class="remove-coupon">Hapus</a>';
            }
        } else if (note) {
            note.parentNode.removeChild(note);
        }

        updateCartSummary();
    }

    function updateCartSummary() {
        var totals = cartTotals(0);
        var mapping = {
            cartSubtotal: totals.subtotal,
            cartProductDiscount: totals.discount,
            cartCoupon: totals.couponDiscount,
            cartTotal: totals.total
        };
        Object.keys(mapping).forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.textContent = formatRupiah(mapping[id]);
        });
        var shipping = document.getElementById('cartShipping');
        if (shipping) shipping.textContent = 'Gratis';
    }

    /* ---------------------------------------------------------------------
       Render halaman favorit
       --------------------------------------------------------------------- */
    function wishlistRowHtml(item) {
        var product = getProduct(item.id);
        if (!product) return '';
        return '<tr data-product-id="' + product.id + '">' +
            '<td class="thumbnail-img"><a href="shop-detail.html?id=' + encodeURIComponent(product.id) + '">' +
            '<img class="img-fluid" src="' + product.image + '" alt="' + escapeHtml(product.name) + '"></a></td>' +
            '<td class="name-pr"><a href="shop-detail.html?id=' + encodeURIComponent(product.id) + '">' + escapeHtml(product.name) + '</a>' +
            '<div><a href="#" class="btn hvr-hover wishlist-add" data-add-to-cart data-product-id="' + product.id + '">Masuk Keranjang</a></div></td>' +
            '<td class="price-pr"><p>' + formatRupiah(product.price) + '</p></td>' +
            '<td class="quantity-box"><input type="number" value="' + item.qty + '" min="1" max="99" step="1" class="c-input-text qty text wish-qty"></td>' +
            '<td class="total-pr"><p>' + formatRupiah(product.price * item.qty) + '</p></td>' +
            '<td class="remove-pr"><a href="#" class="wishlist-remove" title="Hapus dari favorit"><i class="fas fa-times"></i></a></td>' +
            '</tr>';
    }

    function renderWishlistPage() {
        var table = $('.wishlist-box-main table');
        if (!table) return;

        var container = table.closest('.container');
        var wishlist = getWishlist();
        var tableRow = table.closest('.row');
        var empty = $('.ma-empty-state', container);
        var tools = $('.ma-wishlist-tools', container);

        if (!empty) {
            empty = document.createElement('div');
            empty.className = 'ma-empty-state';
            container.insertBefore(empty, container.firstChild);
        }

        if (!tools) {
            tools = document.createElement('div');
            tools.className = 'ma-wishlist-tools';
            container.insertBefore(tools, tableRow || container.firstChild);
        }

        if (!wishlist.length) {
            empty.style.display = '';
            empty.innerHTML = '<div class="ma-empty-card"><i class="far fa-heart"></i>' +
                '<h3>Belum ada barang favorit</h3><p>Simpan produk yang kamu suka agar mudah ditemukan kembali.</p>' +
                '<a href="shop.html" class="btn hvr-hover">Jelajahi Produk</a></div>';
            if (tableRow) tableRow.style.display = 'none';
            tools.style.display = 'none';
            return;
        }

        empty.style.display = 'none';
        if (tableRow) tableRow.style.display = '';
        tools.style.display = '';
        tools.innerHTML = '<button type="button" class="btn hvr-hover" id="moveAllWishlist">' +
            '<i class="fas fa-cart-plus"></i> Pindahkan Semua ke Keranjang</button>';

        table.querySelector('tbody').innerHTML = wishlist.map(wishlistRowHtml).join('');
        syncWishlistIcons();
    }

    /* ---------------------------------------------------------------------
       Render halaman checkout
       --------------------------------------------------------------------- */
    function getShippingOption() {
        var selected = $('input[name="shipping-option"]:checked');
        var key = selected ? selected.id : 'shippingOption1';
        return SHIPPING[key] || SHIPPING.shippingOption1;
    }

    function updatePaymentFields() {
        var selected = $('input[name="paymentMethod"]:checked');
        var isCard = selected && (selected.id === 'credit' || selected.id === 'debit');
        ['cc-name', 'cc-number'].forEach(function (id) {
            var input = document.getElementById(id);
            if (input) input.required = !!isCard;
        });
    }

    function renderCheckoutPage() {
        var cartBox = $('.cart-box-main');
        if (!cartBox || !$('.shipping-method-box')) return;

        var cart = getCart();
        var itemsBox = $('.odr-box .rounded');
        var orderBox = $('.order-box');

        if (itemsBox) {
            if (!cart.length) {
                itemsBox.innerHTML = '<div class="ma-empty-card ma-empty-card-sm"><i class="fas fa-shopping-bag"></i>' +
                    '<h4>Keranjang masih kosong</h4><p>Tambahkan produk terlebih dahulu sebelum melakukan pembayaran.</p>' +
                    '<a href="shop.html" class="btn hvr-hover">Mulai Belanja</a></div>';
            } else {
                itemsBox.innerHTML = cart.map(function (item) {
                    var product = getProduct(item.id);
                    if (!product) return '';
                    return '<div class="media mb-2 border-bottom">' +
                        '<img class="mr-2 rounded" src="' + product.image + '" alt="' + escapeHtml(product.name) + '" width="48" height="48" style="object-fit:cover">' +
                        '<div class="media-body"><a href="shop-detail.html?id=' + encodeURIComponent(product.id) + '">' +
                        escapeHtml(product.name) + '</a>' +
                        '<div class="small text-muted">Harga: ' + formatRupiah(product.price) +
                        ' <span class="mx-2">|</span> Jml: ' + item.qty +
                        ' <span class="mx-2">|</span> Subtotal: ' + formatRupiah(product.price * item.qty) + '</div></div></div>';
                }).join('');
            }
        }

        if (orderBox) orderBox.innerHTML = orderBoxHtml('checkout');

        var user = currentUser();
        if (user) {
            var loginArea = $('.new-account-login');
            if (loginArea) loginArea.style.display = 'none';
            prefillCheckout(user);
        } else {
            var saved = read(KEYS.address, null);
            if (saved) prefillCheckout(saved);
        }

        var email = document.getElementById('email');
        var city = document.getElementById('country');
        var province = document.getElementById('state');
        if (email) email.required = true;
        if (city) city.required = true;
        if (province) province.required = true;

        updatePaymentFields();
        updateCheckoutTotals();
    }

    function prefillCheckout(data) {
        var parts = String(data.name || '').trim().split(/\s+/);
        var firstName = parts.shift() || '';
        var lastName = parts.join(' ');
        setInputValue('firstName', firstName);
        setInputValue('lastName', lastName);
        setInputValue('username', data.username || data.name || '');
        setInputValue('email', data.email || '');
        setInputValue('address', data.address || '');
    }

    function setInputValue(id, value) {
        var input = document.getElementById(id);
        if (input && value) input.value = value;
    }

    function updateCheckoutTotals() {
        var shipping = getShippingOption();
        var totals = cartTotals(shipping.cost);
        var mapping = {
            checkoutSubtotal: totals.subtotal,
            checkoutProductDiscount: totals.discount,
            checkoutCoupon: totals.couponDiscount,
            checkoutTotal: totals.total
        };
        Object.keys(mapping).forEach(function (id) {
            var el = document.getElementById(id);
            if (el) el.textContent = formatRupiah(mapping[id]);
        });
        var shippingEl = document.getElementById('checkoutShipping');
        if (shippingEl) shippingEl.textContent = shipping.cost > 0 ? formatRupiah(shipping.cost) : 'Gratis';
    }

    function submitCheckout() {
        var cart = getCart();
        if (!cart.length) {
            showToast('Keranjang masih kosong. Tambahkan produk dahulu.', 'error', 'Belanja', 'shop.html');
            return;
        }

        var form = $('.checkout-address form');
        if (!form) return;

        updatePaymentFields();
        form.classList.add('was-validated');

        if (!form.checkValidity()) {
            var invalid = form.querySelector(':invalid');
            if (invalid) {
                invalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
                if (invalid.focus) invalid.focus();
            }
            showToast('Lengkapi data pengiriman dan pembayaran terlebih dahulu.', 'error');
            return;
        }

        var shipping = getShippingOption();
        var totals = cartTotals(shipping.cost);
        var method = $('input[name="paymentMethod"]:checked');
        var methodLabel = method ? ($('label[for="' + method.id + '"]') || {}).textContent : 'Kartu Kredit';
        var city = document.getElementById('country');
        var province = document.getElementById('state');
        var customer = {
            name: (((document.getElementById('firstName') || {}).value || '').trim() + ' ' +
                ((document.getElementById('lastName') || {}).value || '').trim()).trim(),
            username: ((document.getElementById('username') || {}).value || '').trim(),
            email: ((document.getElementById('email') || {}).value || '').trim(),
            address: ((document.getElementById('address') || {}).value || '').trim(),
            city: city ? city.options[city.selectedIndex].text.trim() : '',
            province: province ? province.options[province.selectedIndex].text.trim() : '',
            payment: String(methodLabel || '').trim()
        };

        var order = createOrder({
            items: cart.map(function (item) {
                var product = getProduct(item.id);
                return {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    qty: item.qty,
                    image: product.image
                };
            }),
            customer: customer,
            subtotal: totals.subtotal,
            discount: totals.discount,
            coupon: totals.couponDiscount,
            couponCode: totals.coupon ? totals.coupon.code : null,
            shipping: totals.shipping,
            shippingLabel: shipping.label,
            total: totals.total,
            payment: customer.payment
        });

        if (document.getElementById('save-info') && document.getElementById('save-info').checked) {
            if (currentUser()) {
                updateCurrentUser({
                    name: customer.name.trim(),
                    address: customer.address,
                    city: customer.city,
                    province: customer.province
                });
            } else {
                write(KEYS.address, customer);
            }
        }

        clearCart();
        clearCoupon();
        updateBadges();

        showToast('Pembayaran berhasil. Pesanan ' + order.id + ' telah dibuat.', 'success');
        window.setTimeout(function () {
            window.location.href = 'history.html?success=' + encodeURIComponent(order.id);
        }, 900);
    }

    function initCheckoutAuth() {
        if (!$('.shipping-method-box')) return;

        var loginForm = document.getElementById('formLogin');
        if (loginForm) {
            loginForm.addEventListener('submit', function (event) {
                event.preventDefault();
                var email = (document.getElementById('InputEmail') || {}).value || '';
                var password = (document.getElementById('InputPassword') || {}).value || '';
                var result = loginUser(email, password);
                if (!result.ok) {
                    showToast(result.message, 'error');
                    return;
                }
                showToast('Selamat datang, ' + result.user.name + '!', 'success');
                window.setTimeout(function () { window.location.reload(); }, 500);
            });
        }

        var registerForm = document.getElementById('formRegister');
        if (registerForm) {
            registerForm.addEventListener('submit', function (event) {
                event.preventDefault();
                var name = ((document.getElementById('InputName') || {}).value || '') + ' ' +
                    ((document.getElementById('InputLastname') || {}).value || '');
                var result = registerUser({
                    name: name.trim(),
                    email: (document.getElementById('InputEmail1') || {}).value || '',
                    password: (document.getElementById('InputPassword1') || {}).value || ''
                });
                if (!result.ok) {
                    showToast(result.message, 'error');
                    return;
                }
                loginUser(result.user.email, result.user.password);
                showToast('Akun berhasil dibuat. Selamat berbelanja!', 'success');
                window.setTimeout(function () { window.location.reload(); }, 600);
            });
        }

        $all('input[name="shipping-option"]').forEach(function (radio) {
            radio.addEventListener('change', updateCheckoutTotals);
        });
        $all('input[name="paymentMethod"]').forEach(function (radio) {
            radio.addEventListener('change', updatePaymentFields);
        });

        var payLink = $('.shopping-box a');
        if (payLink) {
            payLink.addEventListener('click', function (event) {
                event.preventDefault();
                submitCheckout();
            });
        }
    }

    /* ---------------------------------------------------------------------
       Render halaman riwayat
       --------------------------------------------------------------------- */
    function renderHistoryPage() {
        var table = $('.transaction-history table');
        if (!table) return;

        var container = table.closest('.container');
        var orders = getOrders().slice().reverse();
        var tbody = table.querySelector('tbody');

        if (!orders.length) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center py-4">Belum ada transaksi. ' +
                '<a href="shop.html">Mulai belanja sekarang</a>.</td></tr>';
        } else {
            tbody.innerHTML = orders.map(function (order, index) {
                var items = (order.items || []).map(function (item) {
                    return item.name + ' &times; ' + item.qty;
                }).join('<br>');
                return '<tr>' +
                    '<td>' + (index + 1) + '</td>' +
                    '<td><strong>' + escapeHtml(order.id) + '</strong><br><span class="ma-status">' + escapeHtml(order.status || 'Selesai') + '</span></td>' +
                    '<td>' + items + '</td>' +
                    '<td>' + formatDate(order.date) + '</td>' +
                    '<td>' + formatRupiah(order.total) + '</td>' +
                    '</tr>';
            }).join('');
        }

        var summary = $('.ma-history-summary', container);
        if (!summary) {
            summary = document.createElement('div');
            summary.className = 'ma-history-summary';
            var heading = container.querySelector('h2');
            container.insertBefore(summary, heading || container.firstChild);
        }
        var totalSpend = orders.reduce(function (sum, order) { return sum + (Number(order.total) || 0); }, 0);
        var totalItems = orders.reduce(function (sum, order) {
            return sum + (order.items || []).reduce(function (inner, item) { return inner + (Number(item.qty) || 0); }, 0);
        }, 0);
        summary.innerHTML =
            '<div class="ma-stat"><span>Total Transaksi</span><strong>' + orders.length + '</strong></div>' +
            '<div class="ma-stat"><span>Total Item</span><strong>' + totalItems + '</strong></div>' +
            '<div class="ma-stat"><span>Total Belanja</span><strong>' + formatRupiah(totalSpend) + '</strong></div>';

        var params = new URLSearchParams(window.location.search);
        if (params.get('success')) {
            showToast('Pesanan ' + params.get('success') + ' berhasil dibuat.', 'success');
        }
    }

    /* ---------------------------------------------------------------------
       Render halaman akun
       --------------------------------------------------------------------- */
    function renderAccountPage() {
        var page = $('.my-account-page');
        if (!page) return;

        var user = currentUser();
        var panel = $('.ma-account-panel', page);
        if (!panel) {
            panel = document.createElement('div');
            panel.className = 'ma-account-panel';
            page.insertBefore(panel, page.firstChild);
        }

        if (!user) {
            panel.innerHTML = '<div class="ma-account-card ma-account-guest">' +
                '<i class="fa fa-user-circle"></i>' +
                '<div><h3>Anda belum masuk</h3><p>Masuk atau daftar untuk menyimpan alamat, melihat riwayat transaksi, dan mengelola favorit.</p>' +
                '<a href="login.html?redirect=my-account.html" class="btn hvr-hover">Masuk</a> ' +
                '<a href="register.html" class="btn btn-outline-secondary">Daftar Akun</a></div></div>';
            var securityLink = $('.my-account-page a[href="detail-profile.html"]');
            if (securityLink) securityLink.setAttribute('href', 'login.html?redirect=my-account.html');
            return;
        }

        var initials = String(user.name || '?').trim().charAt(0).toUpperCase();
        panel.innerHTML = '<div class="ma-account-card" id="profile">' +
            '<div class="ma-account-avatar">' + escapeHtml(initials) + '</div>' +
            '<div class="ma-account-detail">' +
            '<h3>Hai, ' + escapeHtml(user.name) + '</h3>' +
            '<p class="ma-account-email">' + escapeHtml(user.email) + '</p>' +
            '<form class="ma-profile-form">' +
            '<div class="form-row">' +
            '<div class="form-group col-md-6"><label for="profileName">Nama</label>' +
            '<input type="text" class="form-control" id="profileName" value="' + escapeHtml(user.name) + '" required></div>' +
            '<div class="form-group col-md-6"><label for="profilePhone">Nomor Telepon</label>' +
            '<input type="tel" class="form-control" id="profilePhone" value="' + escapeHtml(user.phone || '') + '" placeholder="08xxxxxxxxxx"></div>' +
            '</div>' +
            '<div class="form-group"><label for="profileEmail">Email</label>' +
            '<input type="email" class="form-control" id="profileEmail" value="' + escapeHtml(user.email) + '" readonly></div>' +
            '<div class="form-group"><label for="profileAddress">Alamat</label>' +
            '<textarea class="form-control" id="profileAddress" rows="2" placeholder="Alamat pengiriman">' + escapeHtml(user.address || '') + '</textarea></div>' +
            '<button type="submit" class="btn hvr-hover">Simpan Perubahan</button> ' +
            '<button type="button" class="btn btn-outline-secondary" data-logout>Keluar</button>' +
            '</form></div></div>';

        var form = $('.ma-profile-form', panel);
        if (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var name = (document.getElementById('profileName') || {}).value || '';
                var phone = (document.getElementById('profilePhone') || {}).value || '';
                var address = (document.getElementById('profileAddress') || {}).value || '';
                if (String(name).trim().length < 2) {
                    showToast('Nama minimal 2 karakter.', 'error');
                    return;
                }
                updateCurrentUser({ name: name.trim(), phone: phone.trim(), address: address.trim() });
                enhanceHeader();
                showToast('Profil berhasil diperbarui.', 'success');
                renderAccountPage();
            });
        }

        var securityLink = $('.my-account-page a[href="detail-profile.html"]');
        if (securityLink) securityLink.setAttribute('href', '#profile');
    }

    /* ---------------------------------------------------------------------
       Halaman login & daftar
       --------------------------------------------------------------------- */
    function initAuthPage() {
        var loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', function (event) {
                event.preventDefault();
                var email = (document.getElementById('email') || {}).value || '';
                var password = (document.getElementById('password') || {}).value || '';
                var result = loginUser(email, password);
                if (!result.ok) {
                    showToast(result.message, 'error');
                    return;
                }
                var params = new URLSearchParams(window.location.search);
                var redirect = params.get('redirect') || 'index.html';
                showToast('Selamat datang, ' + result.user.name + '!', 'success');
                window.setTimeout(function () {
                    window.location.href = redirect;
                }, 500);
            });
        }

        var registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', function (event) {
                event.preventDefault();
                var name = (document.getElementById('regName') || {}).value || '';
                var email = (document.getElementById('regEmail') || {}).value || '';
                var password = (document.getElementById('regPassword') || {}).value || '';
                var confirm = (document.getElementById('regConfirm') || {}).value || '';

                if (password !== confirm) {
                    showToast('Konfirmasi kata sandi tidak sama.', 'error');
                    return;
                }

                var result = registerUser({ name: name, email: email, password: password });
                if (!result.ok) {
                    showToast(result.message, 'error');
                    return;
                }
                showToast('Akun berhasil dibuat. Silakan masuk.', 'success');
                window.setTimeout(function () {
                    window.location.href = 'login.html?registered=1';
                }, 700);
            });
        }

        var params = new URLSearchParams(window.location.search);
        if (params.get('registered')) {
            showToast('Akun berhasil dibuat. Silakan masuk dengan email dan kata sandi kamu.', 'success');
        }
    }

    /* ---------------------------------------------------------------------
       Pencarian, footer, newsletter
       --------------------------------------------------------------------- */
    function initSearch() {
        var bar = $('.top-search');
        var trigger = $('nav .navbar-nav li.search > a');
        if (trigger && bar) {
            trigger.addEventListener('click', function (event) {
                event.preventDefault();
                var isOpen = bar.style.display === 'block' ||
                    (bar.style.display !== 'none' && window.getComputedStyle(bar).display !== 'none');
                bar.style.display = isOpen ? 'none' : 'block';
                if (!isOpen) {
                    var input = bar.querySelector('input');
                    if (input) input.focus();
                }
            });
        }

        var close = $('.top-search .close-search');
        if (close && bar) {
            close.addEventListener('click', function (event) {
                event.preventDefault();
                bar.style.display = 'none';
            });
        }

        var inputs = $all('.top-search input.form-control');
        var isShop = !!document.getElementById('itemsContainer');

        inputs.forEach(function (input) {
            if (isShop) {
                return; /* input shop ditangani oleh initShopFilter */
            }
            input.addEventListener('keydown', function (event) {
                if (event.key !== 'Enter' && event.keyCode !== 13) return;
                event.preventDefault();
                var query = input.value.trim();
                if (!query) return;
                window.location.href = 'shop.html?q=' + encodeURIComponent(query);
            });
        });
    }

    function initFooterLinks() {
        var map = {
            'layanan pelanggan': 'contact-us.html',
            'situs web': 'index.html',
            'syarat dan ketentuan': 'about.html',
            'keamanan privasi': 'about.html',
            'informasi pengiriman': 'contact-us.html'
        };

        $all('footer .footer-link a').forEach(function (link) {
            var href = link.getAttribute('href');
            var text = normalize(link.textContent);
            if ((href === '#' || !href) && map[text]) link.setAttribute('href', map[text]);
        });
    }

    function initNewsletter() {
        $all('form.newsletter-box').forEach(function (form) {
            form.addEventListener('submit', function (event) {
                event.preventDefault();
                var input = form.querySelector('input[type="email"]');
                if (!input || !input.value.trim() || !input.checkValidity()) {
                    showToast('Masukkan alamat email yang valid.', 'error');
                    return;
                }
                var list = read(KEYS.subscription, []);
                if (!Array.isArray(list)) list = [];
                if (list.indexOf(input.value.trim().toLowerCase()) === -1) {
                    list.push(input.value.trim().toLowerCase());
                    write(KEYS.subscription, list);
                }
                form.reset();
                showToast('Terima kasih! Email kamu sudah terdaftar untuk info promo.', 'success');
            });
        });
    }

    /* ---------------------------------------------------------------------
       Event global
       --------------------------------------------------------------------- */
    function applyCouponFromInput() {
        var input = $('.coupon-box input');
        if (!input) return;
        var code = input.value.trim();
        if (!code) {
            clearCoupon();
            renderCartPage();
            showToast('Kupon dihapus.', 'info');
            return;
        }
        var result = setCoupon(code);
        if (!result.ok) {
            showToast(result.message, 'error');
            input.focus();
            return;
        }
        renderCartPage();
        showToast('Kupon ' + result.coupon.code + ' berhasil dipakai (' + result.coupon.label + ').', 'success');
    }

    function bindGlobalEvents() {
        document.addEventListener('click', function (event) {
            var target = event.target;
            if (!target || !target.closest) return;

            var logout = target.closest('[data-logout]');
            if (logout) {
                event.preventDefault();
                logoutUser();
                showToast('Anda telah keluar dari akun.', 'info');
                window.setTimeout(function () {
                    if ($('.my-account-page')) {
                        window.location.href = 'login.html';
                    } else {
                        window.location.reload();
                    }
                }, 500);
                return;
            }

            var buyNow = target.closest('[data-buy-now]');
            if (buyNow) {
                event.preventDefault();
                var buyProduct = resolveProduct(buyNow);
                if (!buyProduct) return;
                addToCart(buyProduct.id, resolveQty(buyNow));
                showToast(buyProduct.name + ' siap dibayar.', 'success');
                window.setTimeout(function () {
                    window.location.href = 'checkout.html';
                }, 500);
                return;
            }

            var add = target.closest('a.cart, [data-add-to-cart]');
            if (add) {
                event.preventDefault();
                var product = resolveProduct(add);
                if (!product) {
                    showToast('Produk tidak dikenali. Coba dari halaman toko.', 'error');
                    return;
                }
                addToCart(product.id, resolveQty(add));
                showToast(product.name + ' masuk ke keranjang.', 'success', 'Lihat Keranjang', 'cart.html');
                return;
            }

            var wish = target.closest('.wishlist-toggle, [data-wishlist]');
            if (wish) {
                event.preventDefault();
                var wishProduct = resolveProduct(wish);
                if (!wishProduct) return;
                var added = toggleWishlist(wishProduct.id);
                syncWishlistIcons();
                showToast(added
                    ? wishProduct.name + ' ditambahkan ke favorit.'
                    : wishProduct.name + ' dihapus dari favorit.', added ? 'success' : 'info');
                if ($('.wishlist-box-main')) renderWishlistPage();
                return;
            }

            var removeCart = target.closest('.cart-remove');
            if (removeCart) {
                event.preventDefault();
                var cartRow = removeCart.closest('tr[data-product-id]');
                if (cartRow) {
                    removeFromCart(cartRow.getAttribute('data-product-id'));
                    renderCartPage();
                    showToast('Produk dihapus dari keranjang.', 'info');
                }
                return;
            }

            var removeWishlist = target.closest('.wishlist-remove');
            if (removeWishlist) {
                event.preventDefault();
                var wishRow = removeWishlist.closest('tr[data-product-id]');
                if (wishRow) {
                    removeFromWishlist(wishRow.getAttribute('data-product-id'));
                    renderWishlistPage();
                    showToast('Produk dihapus dari favorit.', 'info');
                }
                return;
            }

            var removeCouponLink = target.closest('.remove-coupon');
            if (removeCouponLink) {
                event.preventDefault();
                clearCoupon();
                renderCartPage();
                showToast('Kupon dihapus.', 'info');
                return;
            }

            var applyCoupon = target.closest('.coupon-box button');
            if (applyCoupon) {
                event.preventDefault();
                applyCouponFromInput();
                return;
            }

            var moveAll = target.closest('#moveAllWishlist');
            if (moveAll) {
                event.preventDefault();
                var items = getWishlist();
                if (!items.length) return;
                items.forEach(function (item) {
                    addToCart(item.id, item.qty);
                });
                saveWishlist([]);
                renderWishlistPage();
                showToast('Semua favorit dipindahkan ke keranjang.', 'success', 'Lihat Keranjang', 'cart.html');
                return;
            }
        });

        document.addEventListener('change', function (event) {
            var target = event.target;
            if (!target) return;

            if (target.classList.contains('cart-qty')) {
                var cartRow = target.closest('tr[data-product-id]');
                if (cartRow) {
                    setCartQty(cartRow.getAttribute('data-product-id'), target.value);
                    renderCartPage();
                }
                return;
            }

            if (target.classList.contains('wish-qty')) {
                var wishRow = target.closest('tr[data-product-id]');
                if (wishRow) {
                    setWishlistQty(wishRow.getAttribute('data-product-id'), target.value);
                    renderWishlistPage();
                }
            }
        });
    }

    /* ---------------------------------------------------------------------
       Inisialisasi
       --------------------------------------------------------------------- */
    function init() {
        seedUsers();
        enhanceHeader();
        updateBadges();

        renderShopProducts();
        renderGalleryProducts();
        renderShopDetail();

        renderCartPage();
        renderWishlistPage();
        renderCheckoutPage();
        renderHistoryPage();
        renderAccountPage();

        initAuthPage();
        initShopFilter();
        initCheckoutAuth();

        hydrateAllCards();
        syncWishlistIcons();

        bindGlobalEvents();
        initSearch();
        initFooterLinks();
        initNewsletter();

        updateBadges();
    }

    if (document.body) {
        init();
    } else if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    /* Ekspos API kecil untuk debugging / pengembangan lanjutan. */
    window.MAccessoris = {
        products: PRODUCTS,
        getProduct: getProduct,
        getCart: getCart,
        addToCart: addToCart,
        cartTotals: cartTotals,
        getWishlist: getWishlist,
        toggleWishlist: toggleWishlist,
        currentUser: currentUser,
        getOrders: getOrders,
        formatRupiah: formatRupiah,
        showToast: showToast
    };
}());
