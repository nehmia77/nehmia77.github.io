// Basic script file for SwiftGoods Inc.
// Currently minimal functionality for the home page.
// Will be expanded for other pages (form validation, interactions, etc.)

document.addEventListener('DOMContentLoaded', () => {
    console.log("SwiftGoods Inc. Home Page Loaded");

    // Example: Smooth scroll for anchor links (if any were added)
    // document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    //     anchor.addEventListener('click', function (e) {
    //         e.preventDefault();
    //         document.querySelector(this.getAttribute('href')).scrollIntoView({
    //             behavior: 'smooth'
    //         });
    //     });
    // });

    // Add other interactive elements or initializations here if needed
});
document.addEventListener('DOMContentLoaded', () => {
    console.log("SwiftGoods Inc. Catalogue Page Logic Loaded");

    // --- Category Filtering ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');

    if (filterButtons.length > 0 && productItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');

                // Update active button state
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filter products
                productItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    if (category === 'all' || itemCategory === category) {
                        // item.style.display = 'flex'; // Or 'grid', 'block' depending on original display type
                        item.classList.remove('hidden');
                    } else {
                        // item.style.display = 'none';
                         item.classList.add('hidden');
                    }
                });
            });
        });
    }

    // --- Learn More Modal Logic ---
    const modal = document.getElementById('product-modal');
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
    const closeModalBtn = document.querySelector('.close-btn');

    if (modal && learnMoreButtons.length > 0 && closeModalBtn) {
        learnMoreButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Find the parent product item card
                const productCard = button.closest('.product-item');
                if (!productCard) return; // Safety check

                // --- Fetch data from the clicked card ---
                // In a real application, you might fetch more details via AJAX using the data-product-id
                // For this example, we'll pull info directly from the card
                const title = productCard.querySelector('h3').innerText;
                const description = productCard.querySelector('p').innerText; // Basic description
                const price = productCard.querySelector('.price').innerText;
                const imgSrc = productCard.querySelector('img').src;
                const productId = button.getAttribute('data-product-id'); // Example product ID

                // --- Populate modal content ---
                modal.querySelector('#modal-title').innerText = title;
                // You might want a more detailed description here in a real app
                modal.querySelector('#modal-description').innerText = `More detailed information about ${title} (ID: ${productId}). ${description}`; // Example placeholder
                modal.querySelector('#modal-price').innerText = price;
                modal.querySelector('#modal-img').src = imgSrc;
                modal.querySelector('#modal-img').alt = title; // Set alt text

                // --- Display the modal ---
                modal.style.display = 'block';
            });
        });

        // Close modal when the close button is clicked
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close modal when clicking outside the modal content
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    } else {
         // console.warn("Modal elements not found, Learn More buttons might not work.");
    }


    // Add other interactive elements or initializations here if needed
});
document.addEventListener('DOMContentLoaded', () => {
    console.log("SwiftGoods Inc. Site Logic Loaded");

    // --- Run Catalogue Logic (if on catalogue page) ---
    if (document.querySelector('.catalogue-section')) {
        runCatalogueLogic();
    }

    // --- Run Order Page Logic (if on order page) ---
    if (document.getElementById('order-form')) {
        runOrderPageLogic();
    }

    // --- Run Confirmation Page Logic (if on confirmation page) ---
    if (document.querySelector('.confirmation-details')) {
         runConfirmationPageLogic();
    }

}); // End DOMContentLoaded

// Encapsulate Catalogue Logic
function runCatalogueLogic() {
     console.log("Running Catalogue Logic");
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productItems = document.querySelectorAll('.product-item');
    const modal = document.getElementById('product-modal');
    const learnMoreButtons = document.querySelectorAll('.learn-more-btn');
    const closeModalBtn = document.querySelector('.close-btn');

    // Filtering
    if (filterButtons.length > 0 && productItems.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category');
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                productItems.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    item.classList.toggle('hidden', !(category === 'all' || itemCategory === category));
                });
            });
        });
    }

    // Modal Logic
    if (modal && learnMoreButtons.length > 0 && closeModalBtn) {
        learnMoreButtons.forEach(button => {
            button.addEventListener('click', () => {
                const productCard = button.closest('.product-item');
                if (!productCard) return;
                const title = productCard.querySelector('h3').innerText;
                const description = productCard.querySelector('p').innerText;
                const price = productCard.querySelector('.price').innerText;
                const imgSrc = productCard.querySelector('img').src;
                const productId = button.getAttribute('data-product-id');

                modal.querySelector('#modal-title').innerText = title;
                modal.querySelector('#modal-description').innerText = `More detailed information about ${title} (ID: ${productId}). ${description}`;
                modal.querySelector('#modal-price').innerText = price;
                modal.querySelector('#modal-img').src = imgSrc;
                modal.querySelector('#modal-img').alt = title;
                modal.style.display = 'block';
            });
        });

        closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (event) => {
            if (event.target === modal) modal.style.display = 'none';
        });
    }
}


// Encapsulate Order Page Logic
function runOrderPageLogic() {
    console.log("Running Order Page Logic");
    const form = document.getElementById('order-form');
    const quantityInputs = document.querySelectorAll('.product-quantity');
    const summaryItemsDiv = document.getElementById('summary-items');
    const subtotalSpan = document.getElementById('summary-subtotal');
    const taxSpan = document.getElementById('summary-tax');
    const totalSpan = document.getElementById('summary-total');
    const formSubmissionErrorDiv = document.getElementById('form-submission-error');

    const TAX_RATE = 0.05; // 5% tax rate

    // Function to update the order summary
    const updateOrderSummary = () => {
        let subtotal = 0;
        summaryItemsDiv.innerHTML = ''; // Clear previous summary items
        let hasItems = false;

        quantityInputs.forEach(input => {
            const quantity = parseInt(input.value, 10);
            if (quantity > 0) {
                hasItems = true;
                const itemDiv = input.closest('.order-product-item');
                const price = parseFloat(itemDiv.getAttribute('data-price'));
                const name = itemDiv.querySelector('.product-name').innerText;
                const itemTotal = quantity * price;
                subtotal += itemTotal;

                // Add item to summary display
                const summaryItem = document.createElement('p');
                summaryItem.innerHTML = `${name} (x${quantity}) <span>$${itemTotal.toFixed(2)}</span>`;
                summaryItemsDiv.appendChild(summaryItem);
            }
        });

        if (!hasItems) {
            summaryItemsDiv.innerHTML = '<p><em>Select products to see summary...</em></p>';
        }

        const tax = subtotal * TAX_RATE;
        const total = subtotal + tax;

        subtotalSpan.textContent = `$${subtotal.toFixed(2)}`;
        taxSpan.textContent = `$${tax.toFixed(2)}`;
        totalSpan.textContent = `$${total.toFixed(2)}`;
    };

    // Add event listeners to quantity inputs
    quantityInputs.forEach(input => {
        input.addEventListener('change', updateOrderSummary);
        input.addEventListener('keyup', updateOrderSummary); // Handle typing
    });

    // Initial summary calculation on page load
    updateOrderSummary();

    // --- Form Validation ---
    const validateForm = () => {
        let isValid = true;
        formSubmissionErrorDiv.style.display = 'none'; // Hide general error first
        formSubmissionErrorDiv.textContent = '';

        // Clear previous errors
         document.querySelectorAll('#order-form .error-message').forEach(el => el.style.display = 'none');
         document.querySelectorAll('#order-form input.invalid, #order-form textarea.invalid').forEach(el => el.classList.remove('invalid'));


        // Validate Required Fields (Name, Email, Address, City, Zip)
        const requiredTextFields = ['customer-name', 'customer-email', 'shipping-address', 'shipping-city', 'shipping-zip'];
        requiredTextFields.forEach(id => {
            const input = document.getElementById(id);
            const errorDiv = input.parentElement.querySelector('.error-message');
            if (!input.value.trim()) {
                isValid = false;
                input.classList.add('invalid');
                if (errorDiv) {
                    errorDiv.textContent = 'This field is required.';
                    errorDiv.style.display = 'block';
                 }
            } else {
                 input.classList.remove('invalid');
                 if (errorDiv) errorDiv.style.display = 'none';
            }
        });

        // Validate Email Format
        const emailInput = document.getElementById('customer-email');
        const emailErrorDiv = emailInput.parentElement.querySelector('.error-message');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailInput.value.trim() && !emailRegex.test(emailInput.value.trim())) {
            isValid = false;
            emailInput.classList.add('invalid');
             if (emailErrorDiv) {
                emailErrorDiv.textContent = 'Please enter a valid email address.';
                emailErrorDiv.style.display = 'block';
            }
        } else if (emailInput.value.trim()) { // Only remove error if valid and not empty
             // emailInput.classList.remove('invalid'); // Handled by required check
             if (emailErrorDiv && emailErrorDiv.textContent.includes('valid email')) emailErrorDiv.style.display = 'none';
        }


        // Validate ZIP Code Format (Simple 5 digit)
        const zipInput = document.getElementById('shipping-zip');
        const zipErrorDiv = zipInput.parentElement.querySelector('.error-message');
        const zipRegex = /^\d{5}(-\d{4})?$/; // US ZIP code format
        if (zipInput.value.trim() && !zipRegex.test(zipInput.value.trim())) {
            isValid = false;
            zipInput.classList.add('invalid');
             if (zipErrorDiv) {
                 zipErrorDiv.textContent = 'Please enter a valid ZIP code (e.g., 12345).';
                 zipErrorDiv.style.display = 'block';
             }
        } else if (zipInput.value.trim()) {
             // zipInput.classList.remove('invalid'); // Handled by required check
             if (zipErrorDiv && zipErrorDiv.textContent.includes('valid ZIP')) zipErrorDiv.style.display = 'none';
        }


        // Validate that at least one product has quantity > 0
        let hasProducts = false;
        quantityInputs.forEach(input => {
            if (parseInt(input.value, 10) > 0) {
                hasProducts = true;
            }
        });

        if (!hasProducts) {
            isValid = false;
            // Display error near the product selection or summary
             formSubmissionErrorDiv.textContent = 'Please select at least one product.';
             formSubmissionErrorDiv.style.display = 'block';
            // Optionally, highlight the product section
            // document.getElementById('product-selection').style.border = '1px solid red';
        } else {
            // document.getElementById('product-selection').style.border = 'none';
        }


        return isValid;
    };


    // --- Form Submission ---
    form.addEventListener('submit', (event) => {
        if (!validateForm()) {
            event.preventDefault(); // Prevent submission if validation fails
             formSubmissionErrorDiv.textContent = formSubmissionErrorDiv.textContent || 'Please fix the errors above.';
             formSubmissionErrorDiv.style.display = 'block';
             // Scroll to the first error? (Optional Enhancement)
             const firstError = document.querySelector('.invalid, .error-message[style*="block"]');
             if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
             }
        } else {
            // Optional: Display a loading message or disable button
            console.log("Form is valid, submitting...");
            // Form will submit and redirect to order_confirmation.html (using GET for demo)
            // In a real app with POST, you'd likely handle response here or server would redirect.
             formSubmissionErrorDiv.style.display = 'none';
        }
    });
}

// Encapsulate Confirmation Page Logic
function runConfirmationPageLogic() {
     console.log("Running Confirmation Page Logic");
     const params = new URLSearchParams(window.location.search);
     const name = params.get('customer_name');
     const email = params.get('customer_email');
     const address = params.get('shipping_address');
     const city = params.get('shipping_city');
     const zip = params.get('shipping_zip');

     const confName = document.getElementById('conf-name');
     const confEmail = document.getElementById('conf-email');
     const confAddress = document.getElementById('conf-address');

     if (confName && name) confName.textContent = name;
     if (confEmail && email) confEmail.textContent = email;

     let fullAddress = '';
     if(address) fullAddress += address;
     if(city) fullAddress += (fullAddress ? ', ' : '') + city;
     if(zip) fullAddress += (fullAddress ? ', ' : '') + zip;
     if (confAddress && fullAddress) {
         confAddress.textContent = fullAddress;
     } else if (confAddress && address) { // Fallback if only address textarea was passed
         confAddress.textContent = address;
     }

     // Clear the simple placeholder if data was populated
     const summaryDiv = document.getElementById('confirmation-summary');
     if (summaryDiv && (name || email || address)) {
         const placeholder = summaryDiv.querySelector('p > em');
         if (placeholder) placeholder.parentElement.style.display = 'none';
     }
     // You could expand this to show the ordered items if passed via URL parameters too
     // e.g., iterate params like qty_prod001, qty_prod002...
}
document.addEventListener('DOMContentLoaded', () => {
    console.log("SwiftGoods Inc. Site Logic Loaded");

    // --- Router simulation based on page ID/class ---
    if (document.querySelector('.catalogue-section')) {
        runCatalogueLogic();
    } else if (document.getElementById('order-form')) {
        runOrderPageLogic();
    } else if (document.querySelector('.confirmation-details')) {
        runConfirmationPageLogic();
    } else if (document.querySelector('.management-section')) {
        runProcurementPageLogic(); // New function for this page
    }

}); // End DOMContentLoaded

// --- Existing functions (runCatalogueLogic, runOrderPageLogic, runConfirmationPageLogic) ---
// Keep the previously defined functions here...
// function runCatalogueLogic() { ... }
// function runOrderPageLogic() { ... }
// function runConfirmationPageLogic() { ... }


// =======================================================
// --- Procurement & Management Page Logic ---
// =======================================================
function runProcurementPageLogic() {
    console.log("Running Procurement Management Logic");

    // --- Data Storage (using localStorage for basic persistence) ---
    const storageKeys = {
        orders: 'swiftGoodsProcOrders',
        suppliers: 'swiftGoodsSuppliers',
        inventory: 'swiftGoodsInventory'
    };

    const loadData = (key, defaultValue) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    };

    const saveData = (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    };

    // Sample Data (used if localStorage is empty)
    const sampleOrders = [
        { id: 'PO001', supplier: 'FreshFarm Co.', date: '2024-05-20', item: 'Apples', quantity: 100, status: 'Delivered' },
        { id: 'PO002', supplier: 'DairyBest Ltd.', date: '2024-05-22', item: 'Milk', quantity: 50, status: 'Approved' },
        { id: 'PO003', supplier: 'GrainCorp', date: '2024-05-25', item: 'Rice', quantity: 200, status: 'Pending' },
    ];
    const sampleSuppliers = [
        { id: 'S01', name: 'FreshFarm Co.', email: 'sales@freshfarm.com', phone: '111-222-3333', products: 'Apples, Bananas, Vegetables' },
        { id: 'S02', name: 'DairyBest Ltd.', email: 'orders@dairybest.net', phone: '444-555-6666', products: 'Milk, Cheese, Yogurt' },
        { id: 'S03', name: 'GrainCorp', email: 'info@graincorp.org', phone: '777-888-9999', products: 'Rice, Flour, Oats' },
    ];
    const sampleInventory = [
        { name: 'Apples', stock: 150, lastUpdated: '2024-05-21' },
        { name: 'Milk', stock: 75, lastUpdated: '2024-05-20' },
        { name: 'Rice', stock: 500, lastUpdated: '2024-05-18' },
        { name: 'Potato Chips', stock: 120, lastUpdated: '2024-05-15' },
    ];

    let procurementOrders = loadData(storageKeys.orders, sampleOrders);
    let suppliers = loadData(storageKeys.suppliers, sampleSuppliers);
    let inventory = loadData(storageKeys.inventory, sampleInventory);

    // --- DOM Element References ---
    const orderTableBody = document.querySelector('#procurement-orders-table tbody');
    const supplierTableBody = document.querySelector('#suppliers-table tbody');
    const inventoryTableBody = document.querySelector('#inventory-table tbody');
    const addOrderForm = document.getElementById('add-order-form');
    const supplierSelect = document.getElementById('order-supplier');
    const addOrderFeedback = document.getElementById('add-order-feedback');

    const searchOrdersInput = document.getElementById('search-orders');
    const filterOrderStatusSelect = document.getElementById('filter-order-status');
    const searchSuppliersInput = document.getElementById('search-suppliers');
    const searchInventoryInput = document.getElementById('search-inventory');

    // Supplier Modal Elements
    const supplierModal = document.getElementById('supplier-modal');
    const addSupplierBtn = document.getElementById('add-supplier-btn');
    const closeSupplierModalBtns = document.querySelectorAll('.supplier-modal-close');
    const editSupplierForm = document.getElementById('edit-supplier-form');
    const supplierModalTitle = document.getElementById('supplier-modal-title');
    const editSupplierId = document.getElementById('edit-supplier-id');
    const editSupplierName = document.getElementById('edit-supplier-name');
    const editSupplierEmail = document.getElementById('edit-supplier-email');
    const editSupplierPhone = document.getElementById('edit-supplier-phone');
    const editSupplierProducts = document.getElementById('edit-supplier-products');
    const editSupplierFeedback = document.getElementById('edit-supplier-feedback');

     // Stock Modal Elements
    const stockModal = document.getElementById('stock-modal');
    const closeStockModalBtns = document.querySelectorAll('.stock-modal-close');
    const updateStockForm = document.getElementById('update-stock-form');
    const stockModalTitle = document.getElementById('stock-modal-title');
    const updateStockItemName = document.getElementById('update-stock-item-name');
    const stockItemDisplayName = document.getElementById('stock-item-display-name');
    const updateStockQuantity = document.getElementById('update-stock-quantity');
    const updateStockFeedback = document.getElementById('update-stock-feedback');


    // --- Rendering Functions ---
    const renderOrders = (ordersToRender = procurementOrders) => {
        orderTableBody.innerHTML = ''; // Clear table
        if (ordersToRender.length === 0) {
            orderTableBody.innerHTML = '<tr><td colspan="7">No orders found.</td></tr>';
            return;
        }
        ordersToRender.forEach(order => {
            const row = orderTableBody.insertRow();
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.supplier}</td>
                <td>${order.date}</td>
                <td>${order.item}</td>
                <td>${order.quantity}</td>
                <td><span class="status status-${order.status}">${order.status}</span></td>
                <td>
                    <select class="action-btn update-status-select" data-order-id="${order.id}">
                        <option value="Pending" ${order.status === 'Pending' ? 'selected' : ''}>Pending</option>
                        <option value="Approved" ${order.status === 'Approved' ? 'selected' : ''}>Approved</option>
                        <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                        <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                    <!-- Add delete button if needed -->
                    <button class="action-btn delete-btn delete-order-btn" data-order-id="${order.id}" title="Delete Order">×</button>
                </td>
            `;
        });
        addOrderEventListeners(); // Re-attach listeners after render
    };

    const renderSuppliers = (suppliersToRender = suppliers) => {
        supplierTableBody.innerHTML = '';
        if (suppliersToRender.length === 0) {
            supplierTableBody.innerHTML = '<tr><td colspan="5">No suppliers found.</td></tr>';
            return;
        }
        suppliersToRender.forEach(supplier => {
            const row = supplierTableBody.insertRow();
            row.innerHTML = `
                <td>${supplier.name}</td>
                <td>${supplier.email}</td>
                <td>${supplier.phone || '-'}</td>
                <td>${supplier.products || '-'}</td>
                <td>
                    <button class="action-btn edit-btn edit-supplier-btn" data-supplier-id="${supplier.id}">Edit</button>
                    <button class="action-btn delete-btn delete-supplier-btn" data-supplier-id="${supplier.id}">Delete</button>
                </td>
            `;
        });
        // Populate supplier dropdown in add order form
        supplierSelect.innerHTML = '<option value="">Select Supplier</option>';
        suppliers.forEach(s => {
            supplierSelect.innerHTML += `<option value="${s.name}">${s.name}</option>`;
        });
        addSupplierEventListeners(); // Re-attach listeners
    };

     const renderInventory = (inventoryToRender = inventory) => {
        inventoryTableBody.innerHTML = '';
        if (inventoryToRender.length === 0) {
            inventoryTableBody.innerHTML = '<tr><td colspan="4">No inventory items found.</td></tr>';
            return;
        }
        inventoryToRender.forEach(item => {
            const row = inventoryTableBody.insertRow();
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.stock}</td>
                <td>${item.lastUpdated || '-'}</td>
                 <td>
                    <button class="action-btn update-stock-btn" data-item-name="${item.name}" data-current-stock="${item.stock}">Update Stock</button>
                </td>
            `;
        });
         addInventoryEventListeners(); // Re-attach listeners
    };

    // --- Utility Functions ---
    const showFeedback = (element, message, isSuccess) => {
        element.textContent = message;
        element.className = `feedback-message ${isSuccess ? 'success' : 'error'}`;
        element.style.display = 'block';
        setTimeout(() => { element.style.display = 'none'; }, 3000); // Hide after 3 seconds
    };

    const generateId = (prefix) => {
        return prefix + Date.now().toString().slice(-6); // Simple timestamp-based ID
    };

    const getCurrentDate = () => {
        return new Date().toISOString().split('T')[0];
    }

    // --- Event Handlers ---

    // Add Order Form Submission
    addOrderForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Simple Validation (more robust needed in real app)
         const supplier = document.getElementById('order-supplier').value;
         const item = document.getElementById('order-item').value.trim();
         const quantity = document.getElementById('order-quantity').value;
         const date = document.getElementById('order-date').value;

         if (!supplier || !item || !quantity || quantity <= 0 || !date) {
             showFeedback(addOrderFeedback, 'Please fill all fields correctly.', false);
             // Add individual field highlighting here
             return;
         }

        const newOrder = {
            id: generateId('PO'),
            supplier: supplier,
            date: date,
            item: item,
            quantity: parseInt(quantity, 10),
            status: 'Pending' // Default status
        };
        procurementOrders.push(newOrder);
        saveData(storageKeys.orders, procurementOrders);
        renderOrders(); // Re-render table
        addOrderForm.reset(); // Clear form
        showFeedback(addOrderFeedback, 'Order added successfully!', true);
        // Optional: Update inventory expectation or trigger other logic
    });

    // Order Table Actions (Status Update, Delete)
    function addOrderEventListeners() {
        document.querySelectorAll('.update-status-select').forEach(select => {
             // Remove existing listener before adding new one to prevent duplicates
            const newSelect = select.cloneNode(true);
            select.parentNode.replaceChild(newSelect, select);
            newSelect.addEventListener('change', (e) => {
                const orderId = e.target.getAttribute('data-order-id');
                const newStatus = e.target.value;
                const orderIndex = procurementOrders.findIndex(o => o.id === orderId);
                if (orderIndex !== -1) {
                    procurementOrders[orderIndex].status = newStatus;
                    // If status is 'Delivered', update inventory
                    if (newStatus === 'Delivered') {
                        updateInventoryStock(procurementOrders[orderIndex].item, procurementOrders[orderIndex].quantity, true); // Add stock
                    }
                    saveData(storageKeys.orders, procurementOrders);
                    renderOrders(); // Re-render with updated status and inventory if changed
                }
            });
        });

        document.querySelectorAll('.delete-order-btn').forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
            newButton.addEventListener('click', (e) => {
                if (!confirm('Are you sure you want to delete this order?')) return;
                const orderId = e.target.getAttribute('data-order-id');
                procurementOrders = procurementOrders.filter(o => o.id !== orderId);
                saveData(storageKeys.orders, procurementOrders);
                renderOrders();
            });
        });
    }

    // Supplier Modal Handling
    addSupplierBtn.addEventListener('click', () => {
        supplierModalTitle.textContent = 'Add New Supplier';
        editSupplierForm.reset();
        editSupplierId.value = ''; // Ensure no ID is set for adding
        editSupplierFeedback.style.display = 'none';
        supplierModal.style.display = 'block';
    });

    closeSupplierModalBtns.forEach(btn => btn.addEventListener('click', () => {
        supplierModal.style.display = 'none';
    }));

    // Edit Supplier Button Handling (in table)
    function addSupplierEventListeners() {
         document.querySelectorAll('.edit-supplier-btn').forEach(button => {
             const newButton = button.cloneNode(true);
             button.parentNode.replaceChild(newButton, button);
             newButton.addEventListener('click', (e) => {
                const supplierId = e.target.getAttribute('data-supplier-id');
                const supplier = suppliers.find(s => s.id === supplierId);
                if (supplier) {
                    supplierModalTitle.textContent = 'Edit Supplier';
                    editSupplierId.value = supplier.id;
                    editSupplierName.value = supplier.name;
                    editSupplierEmail.value = supplier.email;
                    editSupplierPhone.value = supplier.phone || '';
                    editSupplierProducts.value = supplier.products || '';
                    editSupplierFeedback.style.display = 'none';
                    supplierModal.style.display = 'block';
                }
            });
        });
         document.querySelectorAll('.delete-supplier-btn').forEach(button => {
            const newButton = button.cloneNode(true);
            button.parentNode.replaceChild(newButton, button);
             newButton.addEventListener('click', (e) => {
                if (!confirm('Are you sure you want to delete this supplier? This might affect existing orders.')) return;
                 const supplierId = e.target.getAttribute('data-supplier-id');
                 suppliers = suppliers.filter(s => s.id !== supplierId);
                 saveData(storageKeys.suppliers, suppliers);
                 renderSuppliers();
                 // Consider how to handle orders linked to this supplier - maybe just leave the name as text?
            });
         });
    }

     // Edit/Add Supplier Form Submission
    editSupplierForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = editSupplierId.value;
        const name = editSupplierName.value.trim();
        const email = editSupplierEmail.value.trim();
        const phone = editSupplierPhone.value.trim();
        const products = editSupplierProducts.value.trim();

        if (!name || !email) { // Basic validation
             showFeedback(editSupplierFeedback, 'Supplier Name and Email are required.', false);
            return;
        }
         // Simple email validation
         if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
             showFeedback(editSupplierFeedback, 'Please enter a valid email address.', false);
             return;
         }

        if (id) { // Editing existing supplier
            const index = suppliers.findIndex(s => s.id === id);
            if (index !== -1) {
                suppliers[index] = { ...suppliers[index], name, email, phone, products };
                showFeedback(editSupplierFeedback, 'Supplier updated successfully!', true);
            }
        } else { // Adding new supplier
            const newSupplier = {
                id: generateId('S'),
                name, email, phone, products
            };
            suppliers.push(newSupplier);
             showFeedback(editSupplierFeedback, 'Supplier added successfully!', true);
        }
        saveData(storageKeys.suppliers, suppliers);
        renderSuppliers(); // Update table and dropdown
        setTimeout(() => { supplierModal.style.display = 'none'; }, 1500); // Close modal after feedback
    });


    // Inventory Management (Update Stock)
    const updateInventoryStock = (itemName, quantity, isAdding) => {
        const itemIndex = inventory.findIndex(item => item.name.toLowerCase() === itemName.toLowerCase());
        let updated = false;
        if (itemIndex !== -1) {
            inventory[itemIndex].stock = isAdding
                ? inventory[itemIndex].stock + quantity
                : Math.max(0, inventory[itemIndex].stock - quantity); // Ensure stock doesn't go below 0
            inventory[itemIndex].lastUpdated = getCurrentDate();
            updated = true;
        } else if (isAdding) {
            // If item doesn't exist and we're adding stock (e.g., from delivery), create it
            inventory.push({
                name: itemName, // Use the name from the order
                stock: quantity,
                lastUpdated: getCurrentDate()
            });
             updated = true;
        }

        if (updated) {
            saveData(storageKeys.inventory, inventory);
            renderInventory(); // Re-render inventory table
            console.log(`Inventory updated for ${itemName}. New stock: ${inventory[itemIndex]?.stock ?? quantity}`);
        } else {
             console.warn(`Item ${itemName} not found in inventory for stock deduction.`);
        }
    };

     // Stock Update Modal Handling
    function addInventoryEventListeners() {
         document.querySelectorAll('.update-stock-btn').forEach(button => {
             const newButton = button.cloneNode(true);
             button.parentNode.replaceChild(newButton, button);
             newButton.addEventListener('click', (e) => {
                 const itemName = e.target.getAttribute('data-item-name');
                 const currentStock = e.target.getAttribute('data-current-stock');
                 updateStockItemName.value = itemName;
                 stockItemDisplayName.textContent = itemName;
                 updateStockQuantity.value = currentStock; // Pre-fill with current stock
                 updateStockFeedback.style.display = 'none';
                 stockModal.style.display = 'block';
             });
         });
    }

     closeStockModalBtns.forEach(btn => btn.addEventListener('click', () => {
        stockModal.style.display = 'none';
    }));

     updateStockForm.addEventListener('submit', (e) => {
         e.preventDefault();
         const itemName = updateStockItemName.value;
         const newStock = parseInt(updateStockQuantity.value, 10);

         if (isNaN(newStock) || newStock < 0) {
             showFeedback(updateStockFeedback, 'Please enter a valid non-negative stock quantity.', false);
             return;
         }

         const itemIndex = inventory.findIndex(item => item.name === itemName);
         if (itemIndex !== -1) {
             inventory[itemIndex].stock = newStock;
             inventory[itemIndex].lastUpdated = getCurrentDate();
             saveData(storageKeys.inventory, inventory);
             renderInventory();
              showFeedback(updateStockFeedback, 'Stock updated successfully!', true);
              setTimeout(() => { stockModal.style.display = 'none'; }, 1500);
         } else {
             showFeedback(updateStockFeedback, 'Error: Item not found.', false);
         }
     });


    // --- Search and Filter ---
    const filterAndSearch = () => {
        const orderSearchTerm = searchOrdersInput.value.toLowerCase();
        const orderStatusFilter = filterOrderStatusSelect.value;
        const supplierSearchTerm = searchSuppliersInput.value.toLowerCase();
        const inventorySearchTerm = searchInventoryInput.value.toLowerCase();

        // Filter Orders
        const filteredOrders = procurementOrders.filter(order => {
            const matchesSearch = order.id.toLowerCase().includes(orderSearchTerm) ||
                                  order.supplier.toLowerCase().includes(orderSearchTerm) ||
                                  order.item.toLowerCase().includes(orderSearchTerm);
            const matchesStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter;
            return matchesSearch && matchesStatus;
        });
        renderOrders(filteredOrders);

        // Filter Suppliers
        const filteredSuppliers = suppliers.filter(supplier => {
            return supplier.name.toLowerCase().includes(supplierSearchTerm) ||
                   (supplier.products && supplier.products.toLowerCase().includes(supplierSearchTerm)) ||
                   supplier.email.toLowerCase().includes(supplierSearchTerm);
        });
        renderSuppliers(filteredSuppliers);

         // Filter Inventory
         const filteredInventory = inventory.filter(item => {
             return item.name.toLowerCase().includes(inventorySearchTerm);
         });
         renderInventory(filteredInventory);
    };

    searchOrdersInput.addEventListener('keyup', filterAndSearch);
    filterOrderStatusSelect.addEventListener('change', filterAndSearch);
    searchSuppliersInput.addEventListener('keyup', filterAndSearch);
    searchInventoryInput.addEventListener('keyup', filterAndSearch);


    // --- Initial Render ---
    renderOrders();
    renderSuppliers();
    renderInventory();
    // Set default date for new order
    document.getElementById('order-date').value = getCurrentDate();

} // End runProcurementPageLogic

// =============================================
// Make sure existing functions are defined above
// =============================================
// function runCatalogueLogic() { /* ... */ }
// function runOrderPageLogic() { /* ... */ }
// function runConfirmationPageLogic() { /* ... */ }
document.addEventListener('DOMContentLoaded', () => {
    // Router Simulation
    if (document.getElementById('catalogue-content')) {
        runCatalogueLogic();
    } else if (document.getElementById('order-content')) {
        runOrderPageLogic();
    } else if (document.getElementById('admin-content')) { // Check for admin content area
        runAdminPageLogic(); // New function for admin page
    }
});

function runAdminPageLogic() {
    console.log("Running Admin Dashboard Logic");

    // DOM Element References
    const loginGate = document.getElementById('admin-login-gate');
    const adminContent = document.getElementById('admin-content');
    const passwordInput = document.getElementById('admin-password');
    const loginButton = document.getElementById('login-button');
    const loginError = document.getElementById('login-error');

    // Ensure DOM elements exist
    if (!loginGate || !adminContent || !passwordInput || !loginButton || !loginError) {
        console.error("Required DOM elements for Admin Dashboard are missing.");
        return;
    }

    const CORRECT_PASSWORD = "admin123"; // Hardcoded for demo; replace with a secure method in production.

    // Login Check
    const checkLogin = () => {
        const isLoggedIn = sessionStorage.getItem('isAdminLoggedIn') === 'true';
        loginGate.style.display = isLoggedIn ? 'none' : 'block';
        adminContent.style.display = isLoggedIn ? 'block' : 'none';

        if (isLoggedIn) {
            initializeAdminDashboard();
        }
    };

    loginButton.addEventListener('click', () => {
        const password = passwordInput.value.trim();
        if (password === CORRECT_PASSWORD) {
            sessionStorage.setItem('isAdminLoggedIn', 'true');
            loginError.style.display = 'none';
            checkLogin();
        } else {
            loginError.textContent = 'Incorrect password.';
            loginError.style.display = 'block';
            sessionStorage.removeItem('isAdminLoggedIn');
        }
    });

    function initializeAdminDashboard() {
        console.log("Initializing Admin Dashboard Content");

        // Storage Keys
        const storageKeys = {
            orders: 'swiftGoodsProcOrders',
            suppliers: 'swiftGoodsSuppliers',
            inventory: 'swiftGoodsInventory',
            users: 'swiftGoodsUsers'
        };

        const loadData = (key, defaultValue) => {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : defaultValue;
        };

        const saveData = (key, data) => {
            localStorage.setItem(key, JSON.stringify(data));
        };

        // Sample Users
        const sampleUsers = [
            { id: 'U001', name: 'Admin User', email: 'admin@swiftgoods.com', role: 'Admin' },
            { id: 'U002', name: 'Priya Khan', email: 'priya.k@swiftgoods.com', role: 'ProcurementManager' },
            { id: 'U003', name: 'Mark Lee', email: 'mark.l@swiftgoods.com', role: 'Staff' },
        ];

        const users = loadData(storageKeys.users, sampleUsers);

        const userTableBody = document.querySelector('#users-table tbody');
        const searchUsersInput = document.getElementById('search-users');

        if (!userTableBody || !searchUsersInput) {
            console.error("Required DOM elements for user management are missing.");
            return;
        }

        const renderUsers = (usersToRender = users) => {
            userTableBody.innerHTML = '';
            if (usersToRender.length === 0) {
                userTableBody.innerHTML = '<tr><td colspan="5">No users found.</td></tr>';
                return;
            }
            usersToRender.forEach(user => {
                const row = userTableBody.insertRow();
                row.innerHTML = `
                    <td>${user.id}</td>
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td><span class="role-${user.role}">${user.role}</span></td>
                    <td>
                        <button class="action-btn edit-btn edit-user-btn" data-user-id="${user.id}">Edit</button>
                        <button class="action-btn delete-btn delete-user-btn" data-user-id="${user.id}">Delete</button>
                    </td>
                `;
            });
            addUserEventListeners();
        };

        const addUserEventListeners = () => {
            document.querySelectorAll('.edit-user-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    const userId = e.target.getAttribute('data-user-id');
                    const user = users.find(u => u.id === userId);
                    if (user) {
                        console.log("Edit user:", user);
                    }
                });
            });

            document.querySelectorAll('.delete-user-btn').forEach(button => {
                button.addEventListener('click', (e) => {
                    if (!confirm('Are you sure you want to delete this user?')) return;
                    const userId = e.target.getAttribute('data-user-id');
                    const index = users.findIndex(u => u.id === userId);
                    if (index !== -1) {
                        users.splice(index, 1);
                        saveData(storageKeys.users, users);
                        renderUsers();
                    }
                });
            });
        };

        searchUsersInput.addEventListener('keyup', () => {
            const searchTerm = searchUsersInput.value.toLowerCase();
            const filteredUsers = users.filter(user => {
                return user.name.toLowerCase().includes(searchTerm) ||
                    user.email.toLowerCase().includes(searchTerm) ||
                    user.role.toLowerCase().includes(searchTerm);
            });
            renderUsers(filteredUsers);
        });

        renderUsers();
    }

    checkLogin();
}