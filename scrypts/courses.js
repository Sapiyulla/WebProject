window.onload = async () => {
    var courses = await LoadCourses()

    var Main = document.createElement('main');

    // Создаем карусель ДО списка курсов
    var carousel = createCarousel(courses.slice(0, 5)); // Берем первые 5 курсов для карусели
    Main.appendChild(carousel);

    var ctxmenu = document.createElement('div');
    {
        // Добавляем кнопку удаления (только для авторов)
        if (localStorage.getItem('role') === 'author') {
            var deleteBtn = document.createElement('div');
            deleteBtn.textContent = `🗑️ Delete`
            deleteBtn.classList.add('ctxmenu-item', 'delete');
            ctxmenu.appendChild(deleteBtn);
        }

        ctxmenu.classList.add('menu');
        ctxmenu.classList.add('closed');
        ctxmenu.style.position = 'absolute';
    }

    var coursesList = document.createElement('div');
    coursesList.classList.add('courses')

    var currentCourseId = null; // Для хранения ID курса, на котором вызвали контекстное меню

    courses.forEach(course => {
        var el = document.createElement('div');
        el.classList.add('course');
        {
            var previewImage = document.createElement('img');
            previewImage.src = course.background_url;
            el.appendChild(previewImage);

            var title = document.createElement('h3');
            title.textContent = course.title;
            el.appendChild(title);

            var rate = "";
            for (let i = 0; i < 5; i++) {
                if (course.rating <= i) {
                    rate += '☆'
                } else {
                    rate += '★'
                }
            }
            var rating = document.createElement('p');
            rating.textContent = rate
            rating.classList.add('rating')
            el.appendChild(rating)

            el.addEventListener('contextmenu', (e) => {
                e.preventDefault()
                currentCourseId = course.id;
                ctxmenu.style.left = e.clientX + 'px';
                ctxmenu.style.top = e.clientY + 'px';
                ctxmenu.classList.replace('closed', 'opened');
                
                // Скрываем меню через 3 секунды
                setTimeout(() => { 
                    if (ctxmenu.classList.contains('opened')) {
                        ctxmenu.classList.replace('opened', 'closed') 
                    }
                }, 3000)
            })

            el.addEventListener('click', () => {
                localStorage.setItem('active_course', course.id);
                window.open('/info.html');
            })
        }
        coursesList.appendChild(el)
    });

    // Обработчики для контекстного меню
    ctxmenu.querySelector('.ctxmenu-item:first-child').addEventListener('click', () => {
        if (currentCourseId) {
            localStorage.setItem('active_course', currentCourseId);
            window.open('/info.html');
        }
        ctxmenu.classList.replace('opened', 'closed');
    });

    // Обработчик для удаления курса
    if (localStorage.getItem('role') === 'author') {
        ctxmenu.querySelector('.delete').addEventListener('click', async () => {
            if (currentCourseId) {
                const confirmDelete = confirm('Вы уверены, что хотите удалить этот курс? Это действие нельзя отменить.');
                if (confirmDelete) {
                    await deleteCourse(currentCourseId);
                    // Перезагружаем страницу для обновления списка курсов
                    location.reload();
                }
            }
            ctxmenu.classList.replace('opened', 'closed');
        });
    }

    // Закрытие контекстного меню при клике вне его
    document.addEventListener('click', (e) => {
        if (!ctxmenu.contains(e.target)) {
            ctxmenu.classList.replace('opened', 'closed');
        }
    });

    Main.appendChild(coursesList);
    Main.appendChild(ctxmenu)
    document.body.appendChild(Main);
}

async function deleteCourse(courseId) {
    try {
        // Загружаем текущие курсы
        let courses = await LoadCourses();
        
        // Фильтруем курсы, удаляя выбранный
        const updatedCourses = courses.filter(course => course.id !== courseId);
        
        // Сохраняем обновленный список
        localStorage.setItem('user_created_courses', JSON.stringify(updatedCourses));
        
        alert('Курс успешно удален!');
        
    } catch (error) {
        console.error('Ошибка при удалении курса:', error);
        alert('Произошла ошибка при удалении курса.');
    }
}

function createCarousel(featuredCourses) {
    const carousel = document.createElement('div');
    carousel.className = 'carousel-container';

    carousel.innerHTML = `
        <div class="carousel">
            ${featuredCourses.map((course, index) => `
                <div class="carousel-item ${index === 0 ? 'active' : ''}">
                    <img src="${course.background_url}" alt="${course.title}">
                    <div class="carousel-content">
                        <h3>${course.title}</h3>
                        <p>${course.description.substring(0, 100)}...</p>
                        <span class="carousel-rating">${'★'.repeat(Math.floor(course.rating))}${'☆'.repeat(5 - Math.floor(course.rating))}</span>
                    </div>
                </div>
            `).join('')}
        </div>
        <button class="carousel-btn prev">‹</button>
        <button class="carousel-btn next">›</button>
        <div class="carousel-indicators">
            ${featuredCourses.map((_, index) => `
                <span class="indicator ${index === 0 ? 'active' : ''}"></span>
            `).join('')}
        </div>
    `;

    // Добавляем функциональность карусели
    initializeCarousel(carousel);
    return carousel;
}

function initializeCarousel(carousel) {
    let currentIndex = 0;
    const items = carousel.querySelectorAll('.carousel-item');
    const indicators = carousel.querySelectorAll('.indicator');
    const totalItems = items.length;

    function showSlide(index) {
        items.forEach(item => item.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));

        items[index].classList.add('active');
        indicators[index].classList.add('active');
        currentIndex = index;
    }

    function nextSlide() {
        showSlide((currentIndex + 1) % totalItems);
    }

    function prevSlide() {
        showSlide((currentIndex - 1 + totalItems) % totalItems);
    }

    // Обработчики событий
    carousel.querySelector('.next').addEventListener('click', nextSlide);
    carousel.querySelector('.prev').addEventListener('click', prevSlide);

    // Автоматическая прокрутка
    let autoSlide = setInterval(nextSlide, 5000);

    // Останавливаем автопрокрутку при наведении
    carousel.addEventListener('mouseenter', () => clearInterval(autoSlide));
    carousel.addEventListener('mouseleave', () => {
        autoSlide = setInterval(nextSlide, 5000);
    });

    // Клик по индикаторам
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => showSlide(index));
    });
}

async function LoadCourses() {
    try {
        // Пытаемся загрузить пользовательские курсы из localStorage
        const userCourses = localStorage.getItem('user_created_courses');
        if (userCourses) {
            return JSON.parse(userCourses);
        }
        
        // Если нет пользовательских курсов, загружаем оригинальные
        var courses = await fetch('data/courses.json')
            .then(data => data.json());
            
        // Сохраняем оригинальные курсы в localStorage для консистентности
        localStorage.setItem('user_created_courses', JSON.stringify(courses));
        
        return courses;
    } catch (error) {
        alert(`Error: courses loading error: ${error}`)
        return [];
    }
}