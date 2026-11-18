/* =========================================================================
   Halaman Data Artikel
   ========================================================================= */
(function (window, document) {
    'use strict';

    var Admin = window.AdminData;
    if (!Admin) return;

    var PLACEHOLDER = '../images/blog-img.jpg';
    var articles = Admin.getArticles().slice();
    var editingId = null;
    var pendingImage = '';

    var tbody = document.getElementById('articleTableBody');
    var tableInfo = document.getElementById('articleTableInfo');
    var searchInput = document.getElementById('articleSearch');
    var statusFilter = document.getElementById('articleStatusFilter');
    var form = document.getElementById('articleForm');
    var modal = document.getElementById('articleModal');
    var modalTitle = document.getElementById('articleModalLabel');
    var addButton = document.getElementById('addArticleBtn');
    var fileInput = document.getElementById('articleImage');
    var fileLabel = document.getElementById('articleImageLabel');
    var preview = document.getElementById('articleImagePreview');
    var defaultFileLabel = 'Pilih gambar artikel (maks. 1 MB)';

    var fields = {
        title: document.getElementById('articleTitle'),
        date: document.getElementById('articleDate'),
        status: document.getElementById('articleStatus'),
        link: document.getElementById('articleLink'),
        excerpt: document.getElementById('articleExcerpt')
    };

    function showModal(id) {
        if (window.jQuery) window.jQuery('#' + id).modal('show');
    }

    function hideModal(id) {
        if (window.jQuery) window.jQuery('#' + id).modal('hide');
    }

    function findArticle(id) {
        var found = null;
        articles.forEach(function (article) {
            if (String(article.id) === String(id)) found = article;
        });
        return found;
    }

    function articleStatus(status) {
        return String(status || 'Terbit') === 'Draf' ?
            Admin.badge('Draf', 'secondary') :
            Admin.badge('Terbit', 'success');
    }

    function safeLink(link) {
        var value = String(link || '').trim();
        if (!value || value === '#') return '';
        if (/^(https?:\/\/|\.\.?\/|\/)/i.test(value)) return value;
        return '';
    }

    function uniqueId(title, currentId) {
        var base = Admin.slugify(title);
        var candidate = base;
        var counter = 1;

        while (articles.some(function (article) {
            return String(article.id) === candidate && String(article.id) !== String(currentId);
        })) {
            counter += 1;
            candidate = base + '-' + counter;
        }

        return candidate;
    }

    function sortedArticles() {
        return articles.slice().sort(function (a, b) {
            var dateA = new Date(a.date || 0).getTime() || 0;
            var dateB = new Date(b.date || 0).getTime() || 0;
            return dateB - dateA;
        });
    }

    function filteredArticles() {
        var term = String(searchInput.value || '').trim().toLowerCase();
        var status = statusFilter.value;

        return sortedArticles().filter(function (article) {
            if (status && String(article.status || 'Terbit') !== status) return false;
            if (!term) return true;

            return [article.title, article.excerpt, article.status, article.date]
                .join(' ')
                .toLowerCase()
                .indexOf(term) !== -1;
        });
    }

    function renderSummary() {
        Admin.setText('articleStatTotal', articles.length);
        Admin.setText('articleStatPublished', articles.filter(function (article) {
            return String(article.status || 'Terbit') !== 'Draf';
        }).length);
        Admin.setText('articleStatDraft', articles.filter(function (article) {
            return String(article.status || 'Terbit') === 'Draf';
        }).length);
    }

    function render() {
        var rows = filteredArticles();
        var table = tbody.closest('table');
        if (table) table.classList.toggle('table-empty', !rows.length);

        tbody.innerHTML = rows.map(function (article, index) {
            var link = safeLink(article.link);
            return '<tr data-id="' + Admin.escapeHtml(article.id) + '">' +
                '<td class="text-center text-muted">' + (index + 1) + '</td>' +
                '<td class="text-center"><img class="table-thumb" src="' + Admin.escapeHtml(article.image || PLACEHOLDER) +
                '" alt="' + Admin.escapeHtml(article.title) + '"></td>' +
                '<td class="text-wrap-cell"><strong>' + Admin.escapeHtml(article.title || '-') + '</strong>' +
                (link ? '<span class="text-muted-small"><i class="fas fa-link mr-1"></i>' + Admin.escapeHtml(article.link) + '</span>' : '') +
                '</td>' +
                '<td class="text-wrap-cell">' + Admin.escapeHtml(Admin.truncate(article.excerpt, 95)) + '</td>' +
                '<td class="text-nowrap">' + Admin.escapeHtml(Admin.formatDate(article.date)) + '</td>' +
                '<td class="text-center">' + articleStatus(article.status) + '</td>' +
                '<td class="text-center table-actions">' +
                '<button type="button" class="btn btn-info" data-action="view" data-id="' + Admin.escapeHtml(article.id) + '" title="Lihat detail"><i class="fas fa-eye"></i></button>' +
                '<button type="button" class="btn btn-primary" data-action="edit" data-id="' + Admin.escapeHtml(article.id) + '" title="Edit artikel"><i class="fas fa-pen"></i></button>' +
                '<button type="button" class="btn btn-danger" data-action="delete" data-id="' + Admin.escapeHtml(article.id) + '" title="Hapus artikel"><i class="fas fa-trash"></i></button>' +
                '</td>' +
                '</tr>';
        }).join('');

        if (!rows.length) {
            tbody.innerHTML = '<tr><td colspan="7" class="p-0">' +
                Admin.emptyState(
                    'fas fa-newspaper',
                    articles.length ? 'Artikel tidak ditemukan' : 'Belum ada artikel',
                    articles.length ? 'Coba kata kunci atau status lain.' : 'Tulis artikel pertama melalui tombol di atas.'
                ) + '</td></tr>';
        }

        tableInfo.textContent = 'Menampilkan ' + rows.length + ' dari ' + articles.length + ' artikel';
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
        fields.date.value = Admin.todayInput();
        fields.status.value = 'Terbit';
        fields.link.value = '#';
        if (fileLabel) fileLabel.textContent = defaultFileLabel;
        setPreview(PLACEHOLDER);
        modalTitle.innerHTML = '<i class="fas fa-plus-circle mr-2"></i>Tambah Artikel';
        showModal(modal.id);
    }

    function openEdit(id) {
        var article = findArticle(id);
        if (!article) return;

        editingId = article.id;
        form.reset();
        form.classList.remove('was-validated');
        fields.title.value = article.title || '';
        fields.date.value = Admin.toInputDate(article.date) || Admin.todayInput();
        fields.status.value = article.status || 'Terbit';
        fields.link.value = article.link || '#';
        fields.excerpt.value = article.excerpt || '';
        if (fileLabel) fileLabel.textContent = defaultFileLabel;
        setPreview(article.image || PLACEHOLDER);
        modalTitle.innerHTML = '<i class="fas fa-pen mr-2"></i>Edit Artikel';
        showModal(modal.id);
    }

    function openDetail(id) {
        var article = findArticle(id);
        if (!article) return;

        var image = document.getElementById('detailArticleImage');
        if (image) {
            image.src = article.image || PLACEHOLDER;
            image.alt = article.title || 'Artikel';
        }

        Admin.setText('detailArticleTitle', article.title || '-');
        Admin.setText('detailArticleDate', Admin.formatDate(article.date));
        Admin.setText('detailArticleExcerpt', article.excerpt || '-');
        Admin.setText('detailArticleId', article.id || '-');

        var status = document.getElementById('detailArticleStatus');
        if (status) status.innerHTML = articleStatus(article.status);

        var link = safeLink(article.link);
        var linkElement = document.getElementById('detailArticleLink');
        if (linkElement) {
            if (link) {
                linkElement.href = link;
                linkElement.textContent = article.link;
                linkElement.target = '_blank';
                linkElement.rel = 'noopener';
            } else {
                linkElement.removeAttribute('href');
                linkElement.textContent = '-';
            }
        }

        showModal('articleDetailModal');
    }

    function saveArticle(event) {
        event.preventDefault();
        form.classList.add('was-validated');
        if (!form.checkValidity()) return;

        var title = fields.title.value.trim();
        var date = fields.date.value;
        var status = fields.status.value;
        var link = fields.link.value.trim() || '#';
        var excerpt = fields.excerpt.value.trim();

        if (title.length < 3) {
            Admin.toast('Judul artikel minimal 3 karakter.', 'error');
            return;
        }
        if (!date) {
            Admin.toast('Tanggal artikel wajib diisi.', 'error');
            return;
        }
        if (excerpt.length < 10) {
            Admin.toast('Ringkasan artikel minimal 10 karakter.', 'error');
            return;
        }

        var id = editingId || uniqueId(title, null);
        var base = editingId ? findArticle(editingId) : {};
        var article = Object.assign({}, base, {
            id: id,
            title: title,
            date: date,
            status: status,
            link: link,
            excerpt: excerpt,
            image: pendingImage || PLACEHOLDER
        });

        if (editingId) {
            articles = articles.map(function (item) {
                return String(item.id) === String(editingId) ? article : item;
            });
            Admin.toast('Data artikel berhasil diperbarui.', 'success');
        } else {
            articles.push(article);
            Admin.toast('Artikel baru berhasil ditambahkan.', 'success');
        }

        Admin.saveArticles(articles);
        hideModal(modal.id);
        render();
    }

    function deleteArticle(id) {
        var article = findArticle(id);
        if (!article) return;

        Admin.confirmAction({
            title: 'Hapus Artikel',
            message: 'Hapus artikel "' + (article.title || '-') + '"?',
            confirmText: 'Hapus Artikel'
        }, function () {
            articles = articles.filter(function (item) {
                return String(item.id) !== String(id);
            });
            Admin.saveArticles(articles);
            render();
            Admin.toast('Artikel berhasil dihapus.', 'success');
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
    statusFilter.addEventListener('change', render);
    addButton.addEventListener('click', openAdd);
    form.addEventListener('submit', saveArticle);

    tbody.addEventListener('click', function (event) {
        var button = event.target.closest('button[data-action]');
        if (!button) return;

        var action = button.getAttribute('data-action');
        var id = button.getAttribute('data-id');

        if (action === 'view') openDetail(id);
        if (action === 'edit') openEdit(id);
        if (action === 'delete') deleteArticle(id);
    });

    render();
})(window, document);
