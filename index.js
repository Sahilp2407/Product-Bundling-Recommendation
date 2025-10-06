document.addEventListener('DOMContentLoaded', function() {
    // Tab Functionality for Big Deals
    const tabButtons = document.querySelectorAll('.big-deals-tabs button');
    const productCards = document.querySelectorAll('.deal-card');

    function filterProducts(category) {
        productCards.forEach(card => {
            if (category === 'All Deals' || card.dataset.category === category.toLowerCase().replace(/\s+and\s+/g, '-').replace(/\s+/g, '-')) {
                card.closest('.product-link').style.display = 'block';
            } else {
                card.closest('.product-link').style.display = 'none';
            }
        });
    }

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            // Filter products based on selected category
            filterProducts(button.textContent.trim());
        });
    });
}); 
