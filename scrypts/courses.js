window.onload = async () => {
    var courses = await LoadCourses()

    var Main = document.createElement('main');

    // Создаем карусель ДО списка курсов
    var carousel = createCarousel(courses.slice(0, 5)); // Берем первые 5 курсов для карусели
    Main.appendChild(carousel);

    var ctxmenu = document.createElement('div');
    {
        var info = document.createElement('div');
        info.textContent = `🛈 Information`
        ctxmenu.appendChild(info);

        ctxmenu.classList.add('menu');
        ctxmenu.classList.add('closed');
        ctxmenu.style.position = 'absolute';
    }

    var coursesList = document.createElement('div');
    coursesList.classList.add('courses')

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
                ctxmenu.style.left = e.clientX + 'px';
                ctxmenu.style.top = e.clientY + 'px';
                ctxmenu.classList.replace('closed', 'opened');
                setTimeout(() => { ctxmenu.classList.replace('opened', 'closed') }, 3000)
            })

            el.addEventListener('click', () => {
                localStorage.setItem('active_course', course.id);
                window.open('/info.html');
            })
        }
        coursesList.appendChild(el)
    });

    Main.appendChild(coursesList);
    Main.appendChild(ctxmenu)
    document.body.appendChild(Main);
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
        var courses = await fetch('data/courses.json')
            .then(data => data)

        return courses.json()
    } catch (error) {
        alert(`Error: courses loading error: ${error}`)
    }
}