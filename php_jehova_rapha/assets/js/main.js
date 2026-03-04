/**
 * JavaScript - Centre Médical Jéhova Rapha de Kindu
 * Fonctionnalités dynamiques et interaction utilisateur
 */

//等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
    
    // Menu mobile toggle
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
        
        // Fermer le menu quand on clique en dehors
        document.addEventListener('click', function(e) {
            if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        });
    }
    
    // Modal functions
    window.openModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
        }
    };
    
    window.closeModal = function(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    };
    
    // Fermer les modals en cliquant sur l'overlay
    document.querySelectorAll('.modal-overlay').forEach(function(overlay) {
        overlay.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
            }
        });
    });
    
    // Confirm dialog
    window.confirmAction = function(message) {
        return confirm(message || 'Êtes-vous sûr de vouloir effectuer cette action?');
    };
    
    // Auto-hide alerts after 5 seconds
    setTimeout(function() {
        document.querySelectorAll('.alert').forEach(function(alert) {
            alert.style.transition = 'opacity 0.5s';
            alert.style.opacity = '0';
            setTimeout(function() {
                alert.remove();
            }, 500);
        });
    }, 5000);
    
    // Search functionality
    const searchInputs = document.querySelectorAll('.search-input input');
    searchInputs.forEach(function(input) {
        input.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            const targetTable = this.getAttribute('data-table');
            if (targetTable) {
                filterTable(targetTable, query);
            }
        });
    });
    
    // Table filter function
    function filterTable(tableId, query) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(function(row) {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(query) ? '' : 'none';
        });
    }
    
    // Form validation
    const forms = document.querySelectorAll('.ajax-form');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn ? submitBtn.textContent : 'Envoi...';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'Chargement...';
            }
            
            fetch(this.action, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    showAlert(data.message || 'Opération réussie!', 'success');
                    if (data.redirect) {
                        setTimeout(function() {
                            window.location.href = data.redirect;
                        }, 1000);
                    }
                    if (data.reset) {
                        form.reset();
                    }
                    if (data.modal) {
                        closeModal(data.modal);
                    }
                } else {
                    showAlert(data.message || 'Une erreur est survenue', 'danger');
                }
            })
            .catch(function(error) {
                showAlert('Erreur de connexion', 'danger');
            })
            .finally(function() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }
            });
        });
    });
    
    // Show alert function
    window.showAlert = function(message, type) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-' + (type || 'info');
        alertDiv.innerHTML = '<span>' + (type === 'success' ? '✓' : type === 'danger' ? '⚠️' : 'ℹ️') + '</span> ' + message;
        
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            contentArea.insertBefore(alertDiv, contentArea.firstChild);
        }
        
        setTimeout(function() {
            alertDiv.style.opacity = '0';
            setTimeout(function() {
                alertDiv.remove();
            }, 500);
        }, 5000);
    };
    
    // Date picker initialization
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(function(input) {
        // Set max date to today for birth dates
        if (input.classList.contains('birth-date')) {
            input.max = new Date().toISOString().split('T')[0];
        }
    });
    
    // Select all checkbox
    const selectAllCheckbox = document.getElementById('selectAll');
    if (selectAllCheckbox) {
        selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = document.querySelectorAll('.row-checkbox');
            checkboxes.forEach(function(checkbox) {
                checkbox.checked = selectAllCheckbox.checked;
            });
        });
    }
    
    // Print functionality
    window.printPage = function() {
        window.print();
    };
    
    // Export to CSV
    window.exportToCSV = function(tableId, filename) {
        const table = document.getElementById(tableId);
        if (!table) return;
        
        let csv = [];
        const rows = table.querySelectorAll('tr');
        
        rows.forEach(function(row) {
            const cols = row.querySelectorAll('td, th');
            const rowData = [];
            cols.forEach(function(col) {
                rowData.push('"' + col.textContent.trim() + '"');
            });
            csv.push(rowData.join(','));
        });
        
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename || 'export.csv';
        link.click();
    };
    
    // Loading spinner
    window.showLoading = function() {
        const loader = document.createElement('div');
        loader.id = 'globalLoader';
        loader.className = 'loading';
        loader.innerHTML = '<div class="spinner"></div>';
        document.body.appendChild(loader);
    };
    
    window.hideLoading = function() {
        const loader = document.getElementById('globalLoader');
        if (loader) {
            loader.remove();
        }
    };
    
    // Format number as currency
    window.formatCurrency = function(amount) {
        return new Intl.NumberFormat('fr-CD', {
            style: 'currency',
            currency: 'FC'
        }).format(amount);
    };
    
    // Chart.js integration (if available)
    if (typeof Chart !== 'undefined') {
        // Charts can be initialized here
    }
});

// Mobile sidebar close on link click
document.querySelectorAll('.sidebar .nav-item').forEach(function(link) {
    link.addEventListener('click', function() {
        if (window.innerWidth <= 1024) {
            document.getElementById('sidebar').classList.remove('active');
        }
    });
});
