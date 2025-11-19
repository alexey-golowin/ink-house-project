document.addEventListener('DOMContentLoaded', function() {


    // ===== ФУНКЦИОНАЛ ФИЛЬТРАЦИИ КАРТОЧЕК ПО СТРАНАМ =====

    /**
     * Функция фильтрации карточек по стране
     * @param {string} country - страна для фильтрации ('france', 'germany', 'england', 'all')
     */

    function filterCards(country) {
        // Находим все карточки товаров
        const cards = document.querySelectorAll('.card-list-item');

        // Перебираем все карточки и скрываем/показываем в зависимости от фильтра
        cards.forEach((card) => {
            if (country === 'all' || card.dataset.country === country) {
                card.classList.remove('hidden'); // Показываем карточку
            } else {
                card.classList.add('hidden'); // Скрываем карточку
            }
        });

        // Обновляем состояние кнопок фильтров
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach((button) => {
            if (button.dataset.filter === country) {
                button.classList.add('filter-btn--active'); // Активная кнопка
            } else {
                button.classList.remove('filter-btn--active'); // Неактивная кнопка
            }
        });
    }

    // Инициализация фильтрации - по умолчанию показываем Францию
    filterCards('france');

    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach((button) => {
        button.addEventListener('click', function() {
            const filter = this.dataset.filter;
            filterCards(filter);
        });
    });

    let cart = []; // Массив для хранения товаров в корзине
    const cartBadges = document.querySelectorAll('.cart-badge'); // Бейджи корзины

    /**
     * Обновляет отображение корзины (количество товаров в бейджах)
     */

    function updateCartDisplay() {
        // Считаем общее количество товаров в корзине
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

        // Обновляем все бейджи на странице
        cartBadges.forEach(badge => {
            if (totalItems > 0) {
                badge.textContent = totalItems; // Показываем количество
                badge.style.display = 'flex'; // Показываем бейдж
            } else {
                badge.style.display = 'none'; // Скрываем бейдж если корзина пуста
            }
        });
    }

    /**
     * Добавляет товар в корзину
     * @param {Object} product - объект товара
     * @param {HTMLElement} button - кнопка, на которую нажали
     */

    function addToCart(product, button) {
        // Проверяем, есть ли уже такой товар в корзине
        const existingItem = cart.find(item => 
            item.title === product.title && item.artist === product.artist);
        
        if (existingItem) {
            // Если товар уже есть - увеличиваем количество
            existingItem.quantity += 1;
        } else {
            // Если товара нет - добавляем новый
            cart.push({
                ...product, // Копируем свойства товара
                quantity: 1 // Устанавливаем количество
            });
        }
        
        updateCartDisplay(); // Обновляем отображение корзины
        updateButtonState(button, true); // Обновляем состояние кнопки
        
        // Визуальная обратная связь - анимация нажатия
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    /**
     * Удаляет товар из корзины
     * @param {Object} product - объект товара
     * @param {HTMLElement} button - кнопка, на которую нажали
     */

    function removeFromCart(product, button) {
        // Находим индекс товара в корзине
        const existingItemIndex = cart.findIndex(item => 
            item.title === product.title && item.artist === product.artist);
        
        if (existingItemIndex !== -1) {
            if (cart[existingItemIndex].quantity > 1) {
                // Если больше 1 штуки - уменьшаем количество
                cart[existingItemIndex].quantity -= 1;
            } else {
                // Если 1 штука - удаляем товар полностью
                cart.splice(existingItemIndex, 1);
            }
        }
        
        updateCartDisplay(); // Обновляем отображение корзины
        updateButtonState(button, false); // Обновляем состояние кнопки
        
        // Визуальная обратная связь
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    /**
     * Обновляет состояние кнопки (добавить/удалить из корзины)
     * @param {HTMLElement} button - кнопка для обновления
     * @param {boolean} isInCart - находится ли товар в корзине
     */

    function updateButtonState(button, isInCart) {
        const card = button.closest('.card');
        const product = {
            // Собираем данные о товаре из карточки
            artist: card.querySelector('.card__artist').textContent,
            title: card.querySelector('.card__title').textContent,
            materials: card.querySelector('.card__materials').textContent,
            price: card.querySelector('.card__price').textContent,
            image: card.querySelector('.card__image').src
        };
        
        // Проверяем, есть ли товар в корзине
        const isProductInCart = cart.some(item => 
            item.title === product.title && item.artist === product.artist);
        
        if (isProductInCart) {
            // Если товар в корзине - меняем кнопку на "Удалить"
            button.textContent = 'Удалить из корзины';
            button.classList.add('card__button--remove');
            button.classList.remove('card__button--add');
        } else {
            // Если товара нет в корзине - меняем кнопку на "В корзину"
            button.textContent = 'В корзину';
            button.classList.add('card__button--add');
            button.classList.remove('card__button--remove');
        }
    }

    /**
     * Обработчик клика по кнопке корзины
     * @param {Event} event - событие клика
     */

    function handleCartButtonClick(event) {
        const button = event.target;
        const card = button.closest('.card');
        // Собираем данные о товаре
        const product = {
            artist: card.querySelector('.card__artist').textContent,
            title: card.querySelector('.card__title').textContent,
            materials: card.querySelector('.card__materials').textContent,
            price: card.querySelector('.card__price').textContent,
            image: card.querySelector('.card__image').src
        };

        // Проверяем, есть ли товар в корзине
        const isProductInCart = cart.some(item => 
            item.title === product.title && item.artist === product.artist);
        
        if (isProductInCart) {
            removeFromCart(product, button); // Удаляем из корзины
        } else {
            addToCart(product, button); // Добавляем в корзину
        }
    }

    // Инициализация функционала корзины
    const addToCartButtons = document.querySelectorAll('.card__button');
    addToCartButtons.forEach(button => {
        button.classList.add('card__button--add'); // Добавляем класс по умолчанию
        button.addEventListener('click', handleCartButtonClick); // Обработчик клика
        
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click(); // Эмулируем клик при нажатии Enter или пробела
            }
        });
    });
    
    updateCartDisplay(); // Первоначальное обновление корзины

    // Функционал бургер-меню
    const burgerBtn = document.getElementById('burgerBtn');
    const headerNav = document.getElementById('headerNav');
    const body = document.body;

    if (burgerBtn && headerNav) {
        function handleNavLogo() {
            const existingNavLogo = headerNav.querySelector('.header__nav-logo');

            /**
            * Управляет логотипом в мобильном меню
            */

            if (window.innerWidth <= 479) {
                // На мобильных устройствах добавляем логотип в меню
                if (!existingNavLogo) {
                    const navLogo = document.createElement('div');
                    navLogo.className = 'header__nav-logo';
                    navLogo.innerHTML = '<a class="header__logo" href="/"><img src="./svg/logo.svg" alt="Логотип Ink. House"></a>';
                    headerNav.insertBefore(navLogo, headerNav.firstChild);
                    
                    // Добавляем обработчик клика по логотипу для закрытия меню
                    const navLogoLink = navLogo.querySelector('.header__logo');
                    if (navLogoLink) {
                        navLogoLink.addEventListener('click', closeMenu);
                    }
                }
            } else {
                // На десктопе удаляем логотип из меню
                if (existingNavLogo) {
                    existingNavLogo.remove();
                }
            }
        }

        // Инициализация логотипа при загрузке
        handleNavLogo();

        /**
         * Открывает мобильное меню
         */

        function openMenu() {
            headerNav.classList.add('header__nav--active');
            burgerBtn.classList.add('burger--active');
            body.classList.add('menu-open');

            // Добавляем обработчики для закрытия меню
            document.addEventListener('click', handleClickOutside);
            document.addEventListener('keydown', handleEscapePress);
            
            // Фокус на первую ссылку меню для доступности
            const firstNavLink = headerNav.querySelector('.header__link');
            if (firstNavLink) {
                setTimeout(() => firstNavLink.focus(), 100);
            }
        }

        /**
         * Закрывает мобильное меню
         */

        function closeMenu() {
            headerNav.classList.remove('header__nav--active');
            burgerBtn.classList.remove('burger--active');
            body.classList.remove('menu-open');

            // Убираем обработчики закрытия
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEscapePress);
            
            // Возвращаем фокус на кнопку бургера
            burgerBtn.focus();
        }

        /**
         * Обработчик клика вне меню
         * @param {Event} event - событие клика
         */

        function handleClickOutside(event) {
            const isClickInsideNav = headerNav.contains(event.target);
            const isClickOnBurger = burgerBtn.contains(event.target);
            
            if (!isClickInsideNav && !isClickOnBurger) {
                closeMenu(); // Закрываем меню если клик вне его
            }
        }

        /**
         * Обработчик нажатия Escape
         * @param {Event} event - событие клавиатуры
         */

        function handleEscapePress(event) {
            if (event.key === 'Escape') {
                closeMenu(); // Закрываем меню при нажатии Escape
            }
        }

        // Обработчик клика по бургер-кнопке
        burgerBtn.addEventListener('click', function(event) {
            event.stopPropagation(); // Предотвращаем всплытие
            
            if (headerNav.classList.contains('header__nav--active')) {
                closeMenu(); // Если меню открыто - закрываем
            } else {
                openMenu(); // Если меню закрыто - открываем
            }
        });

        // Обработка навигационных ссылок в меню
        const navLinks = headerNav.querySelectorAll('.header__link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu(); // Закрываем меню при клике на ссылку
            });
            
            link.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    closeMenu(); // Закрываем меню при Escape на ссылке
                }
            });
        });

        // Обработчик изменения размера окна
        window.addEventListener('resize', function() {
            // Закрываем меню при увеличении ширины экрана
            if (window.innerWidth > 320 && headerNav.classList.contains('header__nav--active')) {
                closeMenu();
            }
            
            // Управляем логотипом в меню при изменении размера
            handleNavLogo();
        });

        // Предотвращение закрытия меню при клике внутри него
        headerNav.addEventListener('click', function(event) {
            event.stopPropagation();
        });
    }

    // Обработка корзины в шапке
    const headerCart = document.querySelector('.header__cart');
    if (headerCart) {
        headerCart.addEventListener('click', function(event) {
            event.preventDefault();
            console.log('Открытие корзины'); // Заглушка для функционала корзины
        });

        // Обработка клавиатуры для доступности
        headerCart.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    }

    // обраюотка главных кнопок
    const heroButton = document.querySelector('.hero__button');
    const collectionButtons = document.querySelectorAll('.collection-button');

    if (heroButton) {
        heroButton.addEventListener('click', function() {
            console.log('Переход к продукции'); // Заглушка для функционала
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
            console.log('Ознакомление с коллекцией'); // Заглушка для функционала
        });
        
        button.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.click();
            }
        });
    });

    // Функционал социальнчх иконок
    function initSocialIcons() {
        const socialLinks = document.querySelectorAll('.footer__social-link');

        /**
         * Сбрасывает активное состояние всех социальных иконок
         */

        function clearAllActive() {
            socialLinks.forEach(link => link.classList.remove('active'));
        }
        
        // Добавляем обработчики для сброса активного состояния
        document.addEventListener('mouseup', clearAllActive);
        document.addEventListener('dragend', clearAllActive);
        window.addEventListener('blur', clearAllActive);
        
        socialLinks.forEach(link => {
            let isMouseDown = false;

            // Обработчики для мыши
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

            // Обработка клавиатуры
            link.addEventListener('keydown', function(event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    this.click();
                }
            });
        });
    }

    initSocialIcons();

    // Фикс для кнопок коллекции (устранение проблемы с фокусом)
    function initCollectionButtons() {
        const collectionButtons = document.querySelectorAll('.collection-button');
        
        collectionButtons.forEach(button => {
            // Сбрасываем фокус при уходе курсора
            button.addEventListener('mouseleave', function() {
                setTimeout(() => {
                    if (!this.matches(':hover')) {
                        this.blur(); // Снимаем фокус если курсор ушел
                    }
                }, 50);
            });
            
            // Сброс фокуса при отпускании кнопки мыши
            button.addEventListener('mouseup', function() {
                setTimeout(() => {
                    this.blur();
                }, 150);
            });
            
            // Для тач-устройств сбрасываем фокус после клика
            button.addEventListener('click', function(event) {
                if ('ontouchstart' in window) {
                    setTimeout(() => {
                        this.blur();
                    }, 300);
                }
            });
            
            // Сброс фокуса при нажатии Escape
            button.addEventListener('keydown', function(event) {
                if (event.key === 'Escape') {
                    this.blur();
                }
            });
        });
    }

    // Инициализация фикса для кнопок коллекции
    initCollectionButtons();

    // Дополнительные улучшения доступности

    // Делаем карточки доступными с клавиатуры
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.setAttribute('tabindex', '0'); // Делаем фокусируемыми
        
        card.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                const button = this.querySelector('.card__button');
                if (button) {
                    button.click(); // Эмулируем клик по кнопке
                    button.focus(); // Передаем фокус кнопке
                }
            }
        });
    });

    // Улучшенная навигация по фильтрам с клавиатуры
    filterButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowRight') {
                event.preventDefault();
                const nextButton = filterButtons[index + 1] || filterButtons[0];
                nextButton.focus(); // Фокус на следующую кнопку
            } else if (event.key === 'ArrowLeft') {
                event.preventDefault();
                const prevButton = filterButtons[index - 1] || filterButtons[filterButtons.length - 1];
                prevButton.focus(); // Фокус на предыдущую кнопку
            } else if (event.key === 'Home') {
                event.preventDefault();
                filterButtons[0].focus(); // Фокус на первую кнопку
            } else if (event.key === 'End') {
                event.preventDefault();
                filterButtons[filterButtons.length - 1].focus(); // Фокус на последнюю кнопку
            }
        });
    });
    
    console.log('Все скрипты инициализированы');
});