window.onload = async () => {
    // Проверяем, является ли пользователь автором
    if (localStorage.getItem('role') !== 'author') {
        alert('Только авторы могут создавать курсы!');
        window.open(location.origin + '/index.html', '_self');
        return;
    }

    var main = document.createElement('main');
    {
        var editorContainer = document.createElement('div');
        editorContainer.classList.add('editor-container');
        {
            let title = document.createElement('h2');
            title.textContent = 'Редактор курсов';
            title.classList.add('editor-title');
            editorContainer.appendChild(title);

            let form = document.createElement('form');
            form.classList.add('editor-form');
            {
                // Основная информация
                let basicInfoSection = document.createElement('div');
                basicInfoSection.classList.add('form-section');
                {
                    let sectionTitle = document.createElement('h3');
                    sectionTitle.textContent = 'Основная информация';
                    basicInfoSection.appendChild(sectionTitle);

                    // Название курса
                    let titleGroup = document.createElement('div');
                    titleGroup.classList.add('form-group');
                    {
                        let label = document.createElement('label');
                        label.textContent = 'Название курса *';
                        titleGroup.appendChild(label);

                        let input = document.createElement('input');
                        input.type = 'text';
                        input.id = 'courseTitle';
                        input.placeholder = 'Введите название курса';
                        input.required = true;
                        titleGroup.appendChild(input);
                    }
                    basicInfoSection.appendChild(titleGroup);

                    // Автор
                    let authorGroup = document.createElement('div');
                    authorGroup.classList.add('form-group');
                    {
                        let label = document.createElement('label');
                        label.textContent = 'Автор *';
                        authorGroup.appendChild(label);

                        let input = document.createElement('input');
                        input.type = 'text';
                        input.id = 'courseAuthor';
                        input.value = localStorage.getItem('login') || '';
                        input.required = true;
                        authorGroup.appendChild(input);
                    }
                    basicInfoSection.appendChild(authorGroup);

                    // Рейтинг
                    let ratingGroup = document.createElement('div');
                    ratingGroup.classList.add('form-group');
                    {
                        let label = document.createElement('label');
                        label.textContent = 'Рейтинг *';
                        ratingGroup.appendChild(label);

                        let input = document.createElement('input');
                        input.type = 'number';
                        input.id = 'courseRating';
                        input.min = '0';
                        input.max = '5';
                        input.step = '0.1';
                        input.value = '0.0';
                        input.required = true;
                        ratingGroup.appendChild(input);

                        let preview = document.createElement('div');
                        preview.id = 'ratingPreview';
                        preview.classList.add('rating-preview');
                        preview.textContent = '☆☆☆☆☆';
                        ratingGroup.appendChild(preview);

                        input.addEventListener('input', updateRatingPreview);
                    }
                    basicInfoSection.appendChild(ratingGroup);
                }
                form.appendChild(basicInfoSection);

                // Описание и изображение
                let contentSection = document.createElement('div');
                contentSection.classList.add('form-section');
                {
                    let sectionTitle = document.createElement('h3');
                    sectionTitle.textContent = 'Содержание курса';
                    contentSection.appendChild(sectionTitle);

                    // Описание
                    let descriptionGroup = document.createElement('div');
                    descriptionGroup.classList.add('form-group');
                    {
                        let label = document.createElement('label');
                        label.textContent = 'Описание курса *';
                        descriptionGroup.appendChild(label);

                        let textarea = document.createElement('textarea');
                        textarea.id = 'courseDescription';
                        textarea.placeholder = 'Подробное описание курса...';
                        textarea.required = true;
                        descriptionGroup.appendChild(textarea);
                    }
                    contentSection.appendChild(descriptionGroup);

                    // URL изображения
                    let imageGroup = document.createElement('div');
                    imageGroup.classList.add('form-group');
                    {
                        let label = document.createElement('label');
                        label.textContent = 'URL фонового изображения *';
                        imageGroup.appendChild(label);

                        let input = document.createElement('input');
                        input.type = 'url';
                        input.id = 'courseImage';
                        input.placeholder = 'https://example.com/image.jpg';
                        input.required = true;
                        imageGroup.appendChild(input);

                        let preview = document.createElement('div');
                        preview.id = 'imagePreview';
                        preview.classList.add('image-preview');
                        imageGroup.appendChild(preview);

                        input.addEventListener('input', updateImagePreview);
                    }
                    contentSection.appendChild(imageGroup);
                }
                form.appendChild(contentSection);

                // Кнопки действий
                let actionsSection = document.createElement('div');
                actionsSection.classList.add('form-actions');
                {
                    let cancelBtn = document.createElement('button');
                    cancelBtn.type = 'button';
                    cancelBtn.textContent = 'Отмена';
                    cancelBtn.classList.add('btn', 'btn-secondary');
                    cancelBtn.onclick = () => {
                        window.open(location.origin + '/index.html', '_self');
                    };
                    actionsSection.appendChild(cancelBtn);

                    let saveBtn = document.createElement('button');
                    saveBtn.type = 'button';
                    saveBtn.textContent = 'Создать курс';
                    saveBtn.classList.add('btn', 'btn-primary');
                    saveBtn.onclick = saveCourse;
                    actionsSection.appendChild(saveBtn);
                }
                form.appendChild(actionsSection);
            }
            editorContainer.appendChild(form);
        }
        main.appendChild(editorContainer);
    }

    document.body.insertBefore(main, document.body.childNodes.item(1));
}

function updateRatingPreview() {
    const rating = parseFloat(document.getElementById('courseRating').value) || 0;
    const preview = document.getElementById('ratingPreview');
    
    let stars = '';
    for (let i = 0; i < 5; i++) {
        if (rating <= i) {
            stars += '☆';
        } else {
            stars += '★';
        }
    }
    
    preview.textContent = stars;
}

function updateImagePreview() {
    const url = document.getElementById('courseImage').value;
    const preview = document.getElementById('imagePreview');
    
    if (url) {
        preview.innerHTML = '';
        const img = document.createElement('img');
        img.src = url;
        img.onerror = () => {
            preview.innerHTML = '<p style="color: red;">Не удалось загрузить изображение</p>';
        };
        preview.appendChild(img);
    } else {
        preview.innerHTML = '';
    }
}

async function saveCourse() {
    const title = document.getElementById('courseTitle').value.trim();
    const author = document.getElementById('courseAuthor').value.trim();
    const rating = parseFloat(document.getElementById('courseRating').value);
    const description = document.getElementById('courseDescription').value.trim();
    const backgroundUrl = document.getElementById('courseImage').value.trim();

    // Валидация
    if (!title || !author || !description || !backgroundUrl) {
        alert('Пожалуйста, заполните все обязательные поля!');
        return;
    }

    if (isNaN(rating) || rating < 0 || rating > 5) {
        alert('Рейтинг должен быть числом от 0 до 5!');
        return;
    }

    try {
        // Загружаем существующие курсы из localStorage или создаем новый список
        let courses = await loadCourses();
        
        // Создаем новый курс
        const newCourse = {
            id: generateCourseId(courses),
            title: title,
            author: author,
            rating: rating,
            background_url: backgroundUrl,
            description: description
        };

        // Добавляем новый курс в список
        courses.push(newCourse);

        // Сохраняем обновленный список курсов в localStorage
        saveCoursesToStorage(courses);
        
        alert('Курс успешно создан! ID: ' + newCourse.id);
        
        // Возвращаемся на главную страницу
        window.open(location.origin + '/index.html', '_self');

    } catch (error) {
        console.error('Ошибка при сохранении курса:', error);
        alert('Произошла ошибка при создании курса. Проверьте консоль для подробностей.');
    }
}

async function loadCourses() {
    try {
        // Сначала пытаемся загрузить из localStorage (пользовательские курсы)
        const userCourses = localStorage.getItem('user_created_courses');
        if (userCourses) {
            return JSON.parse(userCourses);
        }
        
        // Если в localStorage нет, загружаем из оригинального JSON
        const response = await fetch('data/courses.json');
        const originalCourses = await response.json();
        
        // Сохраняем оригинальные курсы в localStorage для дальнейшего использования
        localStorage.setItem('user_created_courses', JSON.stringify(originalCourses));
        
        return originalCourses;
    } catch (error) {
        console.error('Ошибка загрузки курсов:', error);
        return [];
    }
}

function saveCoursesToStorage(courses) {
    localStorage.setItem('user_created_courses', JSON.stringify(courses));
}

function generateCourseId(courses) {
    // Генерируем ID как максимальный существующий + 1
    const maxId = courses.reduce((max, course) => Math.max(max, course.id), 0);
    return maxId + 1;
}