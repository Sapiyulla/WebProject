window.onload = async () => {
    var courses = await LoadCourses();

    var active_course;

    courses.forEach(course => {
        if (course.id == localStorage.getItem('active_course')) {
            active_course = course;
        }
    });

    var info_block = document.getElementById('info_block');

    // Устанавливаем фон, который займет всю ширину блока
    info_block.style.backgroundImage = `url("${active_course.background_url}")`;

    // Обновляем заголовок
    var title = info_block.querySelector('h1');
    title.textContent = active_course.title;

    // Добавляем информацию об авторе и рейтинге
    var authorInfo = document.createElement('div');
    authorInfo.style.cssText = `
        position: relative;
        background-color: #1e1e1e;
        z-index: 2;
        color: white;
        font-size: 1.1rem;
        margin: 0 30px 10px 30px;
        padding-left: 20px;
        padding-top: 5px;
        padding-bottom: 5px;
        padding-right: 20px;
        border-radius: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
    `;

    var authorSpan = document.createElement('span');
    authorSpan.textContent = `Автор: ${active_course.author}`;
    authorSpan.style.fontWeight = 'bold';

    var ratingSpan = document.createElement('span');
    var rate = "";
    for (let i = 0; i < 5; i++) {
        if (active_course.rating <= i) {
            rate += '☆'
        } else {
            rate += '★'
        }
    }
    ratingSpan.textContent = `Рейтинг: ${rate} (${active_course.rating})`;
    ratingSpan.style.color = '#FFD700';

    authorInfo.appendChild(authorSpan);
    authorInfo.appendChild(ratingSpan);
    info_block.appendChild(authorInfo);

    // Добавляем описание курса
    var description = document.createElement('p');
    description.textContent = active_course.description;
    description.style.cssText = `
        position: relative;
        z-index: 2;
        color: white;
        font-size: 1.1rem;
        margin: 0;
        padding: 20px 30px;
        line-height: 1.6;
        max-height: 200px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 10px;
        margin: 0 30px 20px 30px;
    `;
    info_block.appendChild(description);

    // Проверяем, записан ли пользователь уже на этот курс
    var userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
    var isEnrolled = userCourses.some(course => course.id === active_course.id);

    var zapis = document.createElement('button');
    zapis.type = 'submit';

    if (isEnrolled) {
        zapis.textContent = '✔️ Вы записаны';
        zapis.style.backgroundColor = '#28a745';
        zapis.disabled = true;
    } else {
        zapis.textContent = 'Записаться на курс';
    }

    zapis.onclick = (e) => {
        e.preventDefault();

        // Добавляем курс в список курсов пользователя
        var userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');
        if (!userCourses.some(course => course.id === active_course.id)) {
            userCourses.push({
                id: active_course.id,
                title: active_course.title,
                author: active_course.author,
                rating: active_course.rating,
                background_url: active_course.background_url,
                enrolledDate: new Date().toISOString(),
                progress: 0
            });
            localStorage.setItem('user_courses', JSON.stringify(userCourses));
        }

        zapis.textContent = '✔️ Вы записаны';
        zapis.style.backgroundColor = '#28a745';
        zapis.disabled = true;

        setTimeout(() => {
            var loadsvg = document.getElementById('loading');
            loadsvg.style.visibility = 'visible';
            document.body.textContent = '';
            document.body.appendChild(loadsvg);
        }, 1000);

        setTimeout(() => {
            window.close();
        }, 2000);
    }

    info_block.appendChild(zapis);
}

async function LoadCourses() {
    try {
        var courses = await fetch('../data/courses.json')
            .then(data => data)

        return courses.json()
    } catch (error) {
        alert(`Error: courses loading error: ${error}`)
    }
}