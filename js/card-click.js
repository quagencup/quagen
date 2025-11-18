class CardClickHandler {
    constructor() {
        this.overlay = null;
        this.currentExpandedCard = null;
        this.init();
    }
                                
    init() {
        // Create overlay element
        this.createOverlay();
        
        // Add click listeners to all cards
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();
                this.expandCard(card);
            });
        });
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'card-overlay';
        document.body.appendChild(this.overlay);
        
        // Close card when clicking overlay
        this.overlay.addEventListener('click', () => {
            this.closeCard();
        });
        
        // Close card when pressing Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentExpandedCard) {
                this.closeCard();
            }
        });
    }

    expandCard(originalCard) {
        // Close any currently expanded card
        this.closeCard();

        // Create a new expanded card element
        const expandedCard = document.createElement('div');
                    expandedCard.className = 'card-expanded';

        // Clone the content from the original card
        const profileImg = originalCard.querySelector('.profile-img');
        const nameTag = originalCard.querySelector('.name-tag');
        const socialLinks = originalCard.querySelector('.social-links');

        // Build social links HTML if they exist
        let socialLinksHTML = '';
        if (socialLinks) {
            const links = socialLinks.querySelectorAll('.social-link');
            if (links.length > 0) {
                socialLinksHTML = '<div class="social-links-expanded">';
                links.forEach(link => {
                    const img = link.querySelector('img');
                    socialLinksHTML += `
                        <a href="${link.href}" target="_blank" rel="noopener noreferrer" class="social-link-expanded">
                            <img src="${img.src}" alt="${img.alt}">
                        </a>
                    `;
                });
                socialLinksHTML += '</div>';
            }
        }

        expandedCard.innerHTML = `
            <div class="profile">
                <img src="${profileImg.src}" alt="${profileImg.alt}" class="profile-img">
                <div class="name-tag">
                    ${nameTag.innerHTML}
                </div>
            </div>
            ${socialLinksHTML}
        `;

        // Add to DOM
        document.body.appendChild(expandedCard);

        // Show overlay and store reference
        this.overlay.classList.add('active');
        this.currentExpandedCard = expandedCard;

        // Prevent body scrolling when card is expanded
        document.body.style.overflow = 'hidden';
    }

    closeCard() {
        if (this.currentExpandedCard) {
            document.body.removeChild(this.currentExpandedCard);
            this.currentExpandedCard = null;
        }
        
        this.overlay.classList.remove('active');
        
        // Re-enable body scrolling
        document.body.style.overflow = '';
    }
}

// Initialize the click handler when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CardClickHandler();
});
