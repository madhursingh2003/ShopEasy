// Sample product data
const products = [
    {
        id: 1,
        name: "Wireless Bluetooth Headphones",
        price: 89.99,
        description: "High-quality wireless headphones with noise cancellation and 30-hour battery life.",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
        category: "Electronics"
    },
    {
        id: 2,
        name: "Smart Fitness Watch",
        price: 199.99,
        description: "Advanced fitness tracking with heart rate monitor, GPS, and water resistance.",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
        category: "Electronics"
    },
    {
        id: 3,
        name: "Organic Cotton T-Shirt",
        price: 29.99,
        description: "Comfortable and eco-friendly cotton t-shirt available in multiple colors.",
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
        category: "Clothing"
    },
    {
        id: 4,
        name: "Stainless Steel Water Bottle",
        price: 24.99,
        description: "Durable 32oz insulated water bottle that keeps drinks cold for 24 hours.",
        image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop",
        category: "Home & Garden"
    },
    {
        id: 5,
        name: "Wireless Charging Pad",
        price: 39.99,
        description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
        image: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=400&h=400&fit=crop",
        category: "Electronics"
    },
    {
        id: 6,
        name: "Yoga Mat",
        price: 34.99,
        description: "Premium non-slip yoga mat with carrying strap, perfect for home workouts.",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop",
        category: "Sports"
    },
    {
        id: 7,
        name: "Ceramic Coffee Mug Set",
        price: 19.99,
        description: "Set of 4 beautiful ceramic coffee mugs, perfect for your morning brew.",
        image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400&h=400&fit=crop",
        category: "Home & Garden"
    },
    {
        id: 8,
        name: "Portable Bluetooth Speaker",
        price: 79.99,
        description: "Waterproof portable speaker with 360-degree sound and 12-hour battery life.",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
        category: "Electronics"
    }
];

// Shopping cart state
let cart = [];
let cartTotal = 0;

// DOM elements
const productsGrid = document.getElementById('productsGrid');
const cartSidebar = document.getElementById('cartSidebar');
const cartOverlay = document.getElementById('cartOverlay');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotalElement = document.getElementById('cartTotal');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    displayProducts();
    loadCartFromStorage();
    updateCartDisplay();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
});

// Display products in the grid
function displayProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Create a product card element
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    
    card.innerHTML = `
        <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
        <div class="product-info">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">$${product.price.toFixed(2)}</p>
            <p class="product-description">${product.description}</p>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                Add to Cart
            </button>
        </div>
    `;
    
    return card;
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${product.name} added to cart!`);
}

// Remove product from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Update product quantity in cart
function updateQuantity(productId, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        updateCart();
    }
}

// Update cart display and storage
function updateCart() {
    cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    updateCartDisplay();
    saveCartToStorage();
}

// Update cart display
function updateCartDisplay() {
    // Update cart count
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Update cart items
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
    } else {
        cart.forEach(item => {
            const cartItem = createCartItemElement(item);
            cartItems.appendChild(cartItem);
        });
    }
    
    // Update total
    cartTotalElement.textContent = `$${cartTotal.toFixed(2)}`;
}

// Create cart item element
function createCartItemElement(item) {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    
    cartItem.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
            <h4 class="cart-item-title">${item.name}</h4>
            <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
            </div>
        </div>
        <button class="remove-item" onclick="removeFromCart(${item.id})">
            <i class="fas fa-trash"></i>
        </button>
    `;
    
    return cartItem;
}

// Toggle cart sidebar
function toggleCart() {
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('open');
    
    // Prevent body scroll when cart is open
    if (cartSidebar.classList.contains('open')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = 'auto';
    }
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Simulate checkout process
    showNotification('Processing checkout...', 'info');
    
    setTimeout(() => {
        // Clear cart
        cart = [];
        updateCart();
        toggleCart();
        
        // Show success message
        showNotification('Order placed successfully! Thank you for shopping with us!', 'success');
        
        // You could redirect to a checkout page or show order confirmation here
    }, 2000);
}

// Show notification
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `;
    
    // Set background color based on type
    switch (type) {
        case 'success':
            notification.style.background = '#28a745';
            break;
        case 'error':
            notification.style.background = '#dc3545';
            break;
        case 'info':
            notification.style.background = '#17a2b8';
            break;
        default:
            notification.style.background = '#28a745';
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// Handle contact form submission
function handleContactForm(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const name = formData.get('name') || e.target.querySelector('input[type="text"]').value;
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const message = formData.get('message') || e.target.querySelector('textarea').value;
    
    if (!name || !email || !message) {
        showNotification('Please fill in all fields', 'error');
        return;
    }
    
    // Simulate form submission
    showNotification('Sending message...', 'info');
    
    setTimeout(() => {
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        e.target.reset();
    }, 1500);
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('shopEasyCart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('shopEasyCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (error) {
            console.error('Error loading cart from storage:', error);
            cart = [];
        }
    }
}

// Search functionality
function searchProducts(query) {
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
    );
    
    displayFilteredProducts(filteredProducts);
}

// Display filtered products
function displayFilteredProducts(filteredProducts) {
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem; grid-column: 1 / -1;">No products found matching your search.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsGrid.appendChild(productCard);
    });
}

// Filter products by category
function filterByCategory(category) {
    if (category === 'all') {
        displayProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => product.category === category);
    displayFilteredProducts(filteredProducts);
}

// Sort products
function sortProducts(criteria) {
    let sortedProducts = [...products];
    
    switch (criteria) {
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        default:
            return;
    }
    
    displayFilteredProducts(sortedProducts);
}

// Add keyboard navigation for cart
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
});

// Add click outside cart to close
document.addEventListener('click', function(e) {
    if (!cartSidebar.contains(e.target) && !e.target.closest('.cart-btn') && cartSidebar.classList.contains('open')) {
        toggleCart();
    }
});

// Add smooth animations for product cards
function animateProductCards() {
    const cards = document.querySelectorAll('.product-card');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Initialize animations when products are displayed
setTimeout(animateProductCards, 100);

// Add loading states for better UX
function showLoading(element) {
    element.innerHTML = '<div class="loading"></div>';
}

function hideLoading(element, content) {
    element.innerHTML = content;
}

// Add error handling for image loading
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="%23f8f9fa"/><text x="200" y="200" text-anchor="middle" dy=".3em" fill="%23666" font-family="Arial" font-size="16">Image not available</text></svg>';
    }
}, true);

// Add performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize search with debouncing
const debouncedSearch = debounce(searchProducts, 300);

// Add accessibility improvements
function improveAccessibility() {
    // Add ARIA labels
    const cartBtn = document.querySelector('.cart-btn');
    if (cartBtn) {
        cartBtn.setAttribute('aria-label', 'Shopping cart');
    }
    
    // Add keyboard navigation for product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Add ${card.querySelector('.product-title').textContent} to cart`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const addToCartBtn = this.querySelector('.add-to-cart-btn');
                if (addToCartBtn) {
                    addToCartBtn.click();
                }
            }
        });
    });
}

// Initialize accessibility improvements
setTimeout(improveAccessibility, 200);
