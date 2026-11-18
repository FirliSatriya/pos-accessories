/* =========================================================================
   Halaman Data Pengguna
   ========================================================================= */
(function (window, document) {
    'use strict';

    var Admin = window.AdminData;
    if (!Admin) return;

    var users = Admin.getUsers().slice();
    var editingId = null;

    var tbody = document.getElementById('userTableBody');
    var tableInfo = document.getElementById('userTableInfo');
    var searchInput = document.getElementById('userSearch');
    var form = document.getElementById('userForm');
    var modal = document.getElementById('userModal');
    var modalTitle = document.getElementById('userModalLabel');
    var addButton = document.getElementById('addUserBtn');

    var fields = {
        name: document.getElementById('userName'),
        email: document.getElementById('userEmail'),
        phone: document.getElementById('userPhone'),
        address: document.getElementById('userAddress'),
        status: document.getElementById('userStatus'),
        password: document.getElementById('userPassword'),
        passwordHint: document.getElementById('userPasswordHint')
    };

    var detailIds = {
        avatar: 'detailUserAvatar',
        name: 'detailUserName',
        email: 'detailUserEmail',
        phone: 'detailUserPhone',
        address: 'detailUserAddress',
        status: 'detailUserStatus',
        created: 'detailUserCreated',
        id: 'detailUserId'
    };

    function showModal(id) {
        if (window.jQuery) window.jQuery('#' + id).modal('show');
    }

    function hideModal(id) {
        if (window.jQuery) window.jQuery('#' + id).modal('hide');
    }

    function findUser(id) {
        var found = null;
        users.forEach(function (user) {
            if (String(user.id) === String(id)) found = user;
        });
        return found;
    }

    function initials(name) {
        var parts = String(name || '?').trim().split(/\s+/);
        var first = (parts[0] || '?').charAt(0);
        var second = parts.length > 1 ? parts[1].charAt(0) : '';
        return (first + second).toUpperCase();
    }

    function statusBadge(status) {
        var value = String(status || 'Aktif');
        return Admin.badge(value, value === 'Nonaktif' ? 'secondary' : 'success');
    }

    function filteredUsers() {
        var term = String(searchInput.value || '').trim().toLowerCase();
        if (!term) return users;

        return users.filter(function (user) {
            return [user.name, user.email, user.phone, user.address, user.status]
                .join(' ')
                .toLowerCase()
                .indexOf(term) !== -1;
        });
    }

    function renderSummary() {
        var now = new Date();
        var newThisMonth = users.filter(function (user) {
            if (!user.createdAt) return false;
            var created = new Date(user.createdAt);
            if (isNaN(created.getTime())) return false;
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        }).length;

        Admin.setText('userStatTotal', users.length);
        Admin.setText('userStatActive', users.filter(function (user) {
            return String(user.status || 'Aktif') !== 'Nonaktif';
        }).length);
        Admin.setText('userStatNew', newThisMonth);
    }

    function render() {
        var rows = filteredUsers();
        var table = tbody.closest('table');
        if (table) table.classList.toggle('table-empty', !rows.length);

        tbody.innerHTML = rows.map(function (user, index) {
            var muted = String(user.status || 'Aktif') === 'Nonaktif' ? ' avatar-muted' : '';
            return '<tr data-id="' + Admin.escapeHtml(user.id) + '">' +
                '<td class="text-center text-muted">' + (index + 1) + '</td>' +
                '<td class="text-center"><span class="avatar-circle' + muted + '">' +
                Admin.escapeHtml(initials(user.name)) + '</span></td>' +
                '<td><strong>' + Admin.escapeHtml(user.name || '-') + '</strong>' +
                '<span class="text-muted-small">Bergabung ' + Admin.escapeHtml(Admin.formatDate(user.createdAt)) + '</span></td>' +
                '<td>' + Admin.escapeHtml(user.email || '-') + '</td>' +
                '<td>' + Admin.escapeHtml(user.phone || '-') + '</td>' +
                '<td class="text-wrap-cell">' + Admin.escapeHtml(user.address || '-') + '</td>' +
                '<td>' + Admin.escapeHtml(Admin.formatDate(user.createdAt)) + '</td>' +
                '<td class="text-center">' + statusBadge(user.status) + '</td>' +
                '<td class="text-center table-actions">' +
                '<button type="button" class="btn btn-info" data-action="view" data-id="' + Admin.escapeHtml(user.id) + '" title="Lihat detail"><i class="fas fa-eye"></i></button>' +
                '<button type="button" class="btn btn-primary" data-action="edit" data-id="' + Admin.escapeHtml(user.id) + '" title="Edit pengguna"><i class="fas fa-pen"></i></button>' +
                '<button type="button" class="btn btn-danger" data-action="delete" data-id="' + Admin.escapeHtml(user.id) + '" title="Hapus pengguna"><i class="fas fa-trash"></i></button>' +
                '</td>' +
                '</tr>';
        }).join('');

        if (!rows.length) {
            tbody.innerHTML = '<tr><td colspan="9" class="p-0">' +
                Admin.emptyState(
                    'fas fa-users',
                    users.length ? 'Pengguna tidak ditemukan' : 'Belum ada pengguna',
                    users.length ? 'Coba kata kunci lain untuk menemukan pengguna.' : 'Tambahkan pengguna pertama melalui tombol di atas.'
                ) + '</td></tr>';
        }

        tableInfo.textContent = 'Menampilkan ' + rows.length + ' dari ' + users.length + ' pengguna';
        renderSummary();
    }

    function openAdd() {
        editingId = null;
        form.reset();
        form.classList.remove('was-validated');
        fields.status.value = 'Aktif';
        fields.password.required = true;
        fields.passwordHint.textContent = 'Minimal 6 karakter.';
        modalTitle.innerHTML = '<i class="fas fa-user-plus mr-2"></i>Tambah Pengguna';
        showModal(modal.id);
    }

    function openEdit(id) {
        var user = findUser(id);
        if (!user) return;

        editingId = user.id;
        form.reset();
        form.classList.remove('was-validated');
        fields.name.value = user.name || '';
        fields.email.value = user.email || '';
        fields.phone.value = user.phone || '';
        fields.address.value = user.address || '';
        fields.status.value = user.status || 'Aktif';
        fields.password.value = '';
        fields.password.required = false;
        fields.passwordHint.textContent = 'Biarkan kosong jika kata sandi tidak diubah.';
        modalTitle.innerHTML = '<i class="fas fa-user-edit mr-2"></i>Edit Pengguna';
        showModal(modal.id);
    }

    function openDetail(id) {
        var user = findUser(id);
        if (!user) return;

        var muted = String(user.status || 'Aktif') === 'Nonaktif' ? ' avatar-muted' : '';
        var avatar = document.getElementById(detailIds.avatar);
        if (avatar) {
            avatar.className = 'avatar-circle' + muted;
            avatar.textContent = initials(user.name);
        }
        Admin.setText(detailIds.name, user.name || '-');
        Admin.setText(detailIds.email, user.email || '-');
        Admin.setText(detailIds.phone, user.phone || '-');
        Admin.setText(detailIds.address, user.address || '-');
        Admin.setText(detailIds.created, Admin.formatDateTime(user.createdAt));
        Admin.setText(detailIds.id, user.id || '-');

        var status = document.getElementById(detailIds.status);
        if (status) status.innerHTML = statusBadge(user.status);

        showModal('userDetailModal');
    }

    function saveUser(event) {
        event.preventDefault();
        form.classList.add('was-validated');

        if (!form.checkValidity()) return;

        var name = fields.name.value.trim();
        var email = fields.email.value.trim().toLowerCase();
        var phone = fields.phone.value.trim();
        var address = fields.address.value.trim();
        var status = fields.status.value;
        var password = fields.password.value;

        if (name.length < 2) {
            Admin.toast('Nama minimal 2 karakter.', 'error');
            return;
        }

        if (password && password.length < 6) {
            Admin.toast('Kata sandi minimal 6 karakter.', 'error');
            return;
        }

        var duplicate = users.some(function (user) {
            return String(user.id) !== String(editingId) &&
                String(user.email || '').toLowerCase() === email;
        });
        if (duplicate) {
            Admin.toast('Email sudah dipakai oleh pengguna lain.', 'error');
            return;
        }

        if (editingId) {
            users = users.map(function (user) {
                if (String(user.id) !== String(editingId)) return user;
                var updated = Object.assign({}, user, {
                    name: name,
                    email: email,
                    phone: phone,
                    address: address,
                    status: status
                });
                if (password) updated.password = password;
                return updated;
            });
            Admin.toast('Data pengguna berhasil diperbarui.', 'success');
        } else {
            users.push({
                id: Admin.uid('user'),
                name: name,
                email: email,
                password: password,
                phone: phone,
                address: address,
                status: status,
                createdAt: new Date().toISOString()
            });
            Admin.toast('Pengguna baru berhasil ditambahkan.', 'success');
        }

        Admin.saveUsers(users);
        hideModal(modal.id);
        render();
    }

    function deleteUser(id) {
        var user = findUser(id);
        if (!user) return;

        Admin.confirmAction({
            title: 'Hapus Pengguna',
            message: 'Hapus akun "' + (user.name || user.email) + '"? Tindakan ini tidak dapat dibatalkan.',
            confirmText: 'Hapus Pengguna'
        }, function () {
            users = users.filter(function (item) {
                return String(item.id) !== String(id);
            });
            Admin.saveUsers(users);
            render();
            Admin.toast('Pengguna berhasil dihapus.', 'success');
        });
    }

    searchInput.addEventListener('input', render);

    addButton.addEventListener('click', openAdd);
    form.addEventListener('submit', saveUser);

    tbody.addEventListener('click', function (event) {
        var button = event.target.closest('button[data-action]');
        if (!button) return;

        var action = button.getAttribute('data-action');
        var id = button.getAttribute('data-id');

        if (action === 'view') openDetail(id);
        if (action === 'edit') openEdit(id);
        if (action === 'delete') deleteUser(id);
    });

    render();
})(window, document);
