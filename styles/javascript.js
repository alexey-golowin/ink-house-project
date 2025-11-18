document.addEventListener('DOMContentLoaded', function() {
    // ===== ФИЛЬТРАЦИЯ КАРТОЧЕК =====
    function filterCards(country) {
        const cards = document.querySelectorAll('.card-list-item');

        cards.forEach((card) => {
            if (country === 'all' || card.dataset.country === country) {
                card.classList.remove('hidden');
            } else {
                card.classList.add('hidden');
            }
        });

        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach((button) => {
            if (button.dataset.filter === country) {
                button.classList.add('filter-btn--active');
            } else {
                button.classList.remove('filter-btn--active');
            }
        });
    }

    // Инициализация фильтрации
    filterCards('france');

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterCards(filter);
        });
    });

    // ===== КОРЗИНА =====
    let cart = [];
    const cartBadges = document.querySelectorAll('.cart-badge');

    function updateCartDisplay() {
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        
        cartBadges.forEach(badge => {
            if (totalItems > 0) {
                badge.textContent = totalItems;
                badge.style.display = 'flex';
            } else {
                badge.style.display = 'none';
            }
        });
    }

    function addToCart(product, button) {
        const existingItem = cart.find(item => 
            item.title === product.title && item.artist === product.artist);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCartDisplay();
        updateButtonState(button, true);
        
        // Визуальная обратная связь
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    function removeFromCart(product, button) {
        const existingItemIndex = cart.findIndex(item => 
            item.title === product.title && item.artist === product.artist);
        
        if (existingItemIndex !== -1) {
            if (cart[existingItemIndex].quantity > 1) {
                cart[existingItemIndex].quantity -= 1;
            } else {
                cart.splice(existingItemIndex, 1);
            }
        }
        
        updateCartDisplay();
        updateButtonState(button, false);
        
        // Визуальная обратная связь
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    function updateButtonState(button, isInCart) {
        const card = button.closest('.card');
        const product = {
            artist: card.querySelector('.card__artist').textContent,
            title: card.querySelector('.card__title').textContent,
            materials: card.querySelector('.card__materials').textContent,
            price: card.querySelector('.card__price').textContent,
            image: card.querySelector('.card__image').src
        };
        
        const isProductInCart = cart.some(item => 
            item.title === product.title && item.artist === product.artist);
        
        if (isProductInCart) {
            button.textContent = 'Удалить из корзины';
            button.classList.add('card__button--remove');
            button.classList.remove('card__button--add');
        } else {
            button.textContent = 'В корзину';
            button.classList.add('card__button--add');
            button.classList.remove('card__button--remove');
        }
    }

    function handleCartButtonClick(event) {
        const button = event.target;
        const card = button.closest('.card');
        const product = {
            artist: card.querySelector('.card__artist').textContent,
            title: card.querySelector('.card__title').textContent,
            materials: card.querySelector('.card__materials').textContent,
            price: card.querySelector('.card__price').textContent,
            image: card.querySelector('.card__image').src
        };
        
        const isProductInCart = cart.some(item => 
            item.title === product.title && item.artist === product.artist);
        
        if (isProductInCart) {
            removeFromCart(product, button);
        } else {
            addToCart(product, button);
        }
    }

    // Инициализация корзины
    const addToCartButtons = document.querySelectorAll('.card__button');
    addToCartButtons.forEach(button => {
        button.classList.add('card__button--add');
        button.addEventListener('click', handleCartButtonClick);
        
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });
    
    updateCartDisplay();

    // ===== БУРГЕР-МЕНЮ =====
    const burgerBtn = document.getElementById('burgerBtn');
    const headerNav = document.getElementById('headerNav');
    const body = document.body;

    if (burgerBtn && headerNav) {
        // Функция для добавления/удаления логотипа в меню
        function handleNavLogo() {
            const existingNavLogo = headerNav.querySelector('.header__nav-logo');
            
            if (window.innerWidth <= 479) {
                // Добавляем логотип если его нет
                if (!existingNavLogo) {
                    const navLogo = document.createElement('div');
                    navLogo.className = 'header__nav-logo';
                    navLogo.innerHTML = '<a class="header__logo" href="/"><img src="./svg/logo.svg" alt="Логотип Ink. House"></a>';
                    headerNav.insertBefore(navLogo, headerNav.firstChild);
                    
                    // Добавляем обработчик клика по логотипу в меню
                    const navLogoLink = navLogo.querySelector('.header__logo');
                    if (navLogoLink) {
                        navLogoLink.addEventListener('click', closeMenu);
                    }
                }
            } else {
                // Удаляем логотип если он есть
                if (existingNavLogo) {
                    existingNavLogo.remove();
                }
            }
        }

        // Инициализация логотипа при загрузке
        handleNavLogo();

        function openMenu() {
            headerNav.classList.add('header__nav--active');
            burgerBtn.classList.add('burger--active');
            body.classList.add('menu-open');
            
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleEscapePress);
            
            // Фокус на первое меню при открытии
            const firstNavLink = headerNav.querySelector('.header__link');
            if (firstNavLink) {
                setTimeout(() => firstNavLink.focus(), 100);
            }
        }

        function closeMenu() {
            headerNav.classList.remove('header__nav--active');
            burgerBtn.classList.remove('burger--active');
            body.classList.remove('menu-open');
            
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscapePress);
            
            // Возвращаем фокус на бургер-кнопку
            burgerBtn.focus();
        }

        function handleClickOutside(event) {
            const isClickInsideNav = headerNav.contains(event.target);
            const isClickOnBurger = burgerBtn.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnBurger) {
                closeMenu();
            }
        }

        function handleEscapePress(event) {
            if (event.key === 'Escape') {
                closeMenu();
            }
        }

        burgerBtn.addEventListener('click', function(event) {
            event.stopPropagation();
            
            if (headerNav.classList.contains('header__nav--active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Обработка навигационных ссылок
        const navLinks = headerNav.querySelectorAll('.header__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
            
            link.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    closeMenu();
                }
            });
        });

        // Закрытие меню при ресайзе и управление логотипом
        window.addEventListener('resize', function() {
            // Закрываем меню при увеличении ширины
            if (window.innerWidth > 320 && headerNav.classList.contains('header__nav--active')) {
                closeMenu();
            }
            
            // Управляем логотипом в меню
            handleNavLogo();
        });

        // Предотвращение закрытия при клике внутри меню
        headerNav.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }

    // ===== ОБРАБОТКА КОРЗИНЫ В ШАПКЕ =====
    const headerCart = document.querySelector('.header__cart');
    if (headerCart) {
        headerCart.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Открытие корзины');
        });
        
        headerCart.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    }

    // ===== ГЛАВНЫЕ КНОПКИ =====
    const heroButton = document.querySelector('.hero__button');
    const collectionButtons = document.querySelectorAll('.collection-button');

    if (heroButton) {
        heroButton.addEventListener('click', function() {
            console.log('Переход к продукции');
        });
        
        heroButton.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    }

    collectionButtons.forEach((button) => {
        button.addEventListener('click', function() {
            console.log('Ознакомление с коллекцией');
        });
        
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });

    // ===== СОЦИАЛЬНЫЕ ИКОНКИ =====
    function initSocialIcons() {
        const socialLinks = document.querySelectorAll('.footer__social-link');
        
        function clearAllActive() {
            socialLinks.forEach(link => link.classList.remove('active'));
        }
        
        document.addEventListener('mouseup', clearAllActive);
        document.addEventListener('dragend', clearAllActive);
        window.addEventListener('blur', clearAllActive);
        
        socialLinks.forEach(link => {
            let isMouseDown = false;
            
            link.addEventListener('mousedown', function(e) {
                isMouseDown = true;
                clearAllActive();
                this.classList.add('active');
            });
            
            link.addEventListener('mouseup', function() {
                isMouseDown = false;
                this.classList.remove('active');
            });
            
            link.addEventListener('mouseleave', function() {
                if (isMouseDown) {
                    isMouseDown = false;
                    this.classList.remove('active');
                }
            });
            
            link.addEventListener('touchstart', function() {
                clearAllActive();
                this.classList.add('active');
            }, { passive: true });
            
            link.addEventListener('touchend', function() {
                this.classList.remove('active');
            });
            
            link.addEventListener('touchcancel', function() {
                this.classList.remove('active');
            });
            
            link.addEventListener('click', function(e) {
                e.preventDefault();
                setTimeout(clearAllActive, 150);
            });
            
            link.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.click();
                }
            });
        });
    }

    initSocialIcons();

    // ===== ФИКС ДЛЯ COLLECTION-BUTTON =====
    function initCollectionButtons() {
        const collectionButtons = document.querySelectorAll('.collection-button');
        
        collectionButtons.forEach(button => {
            // Сбрасываем фокус при уходе курсора
            button.addEventListener('mouseleave', function() {
                // Небольшая задержка чтобы убедиться что это действительно уход курсора
                setTimeout(() => {
                    if (!this.matches(':hover')) {
                        this.blur(); // Снимаем фокус
                    }
                }, 50);
            });
            
            // Альтернативный вариант - сброс при mouseup (отпускании кнопки мыши)
            button.addEventListener('mouseup', function() {
                // Если кнопка была нажата и отпущена, сбрасываем фокус
                setTimeout(() => {
                    this.blur();
                }, 150);
            });
            
            // Дополнительно: предотвращаем сохранение фокуса после клика
            button.addEventListener('click', function(event) {
                // Для тач-устройств сразу сбрасываем фокус
                if ('ontouchstart' in window) {
                    setTimeout(() => {
                        this.blur();
                    }, 300);
                }
            });
            
            // Обработка клавиатуры - сброс фокуса при нажатии Escape
            button.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    this.blur();
                }
            });
        });
    }

    // Инициализируем при загрузке
    initCollectionButtons();

    // ===== ДОПОЛНИТЕЛЬНЫЕ УЛУЧШЕНИЯ =====
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const button = this.querySelector('.card__button');
                if (button) {
                    button.click();
                    button.focus();
                }
            }
        });
    });

    filterButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                const nextButton = filterButtons[index + 1] || filterButtons[0];
                nextButton.focus();
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                const prevButton = filterButtons[index - 1] || filterButtons[filterButtons.length - 1];
                prevButton.focus();
            } else if (event.key === 'Home') {
                event.preventDefault();
                filterButtons[0].focus();
            } else if (event.key === 'End') {
                event.preventDefault();
                filterButtons[filterButtons.length - 1].focus();
            }
        });
    });
    
    console.log('Все скрипты инициализированы');
});