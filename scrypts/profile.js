window.onload = () => {
    var main = document.createElement('main');
    {
        var infoCard = document.createElement('div');
        infoCard.classList.add('info-card');
        {
            let name = document.createElement('h2')
            name.textContent = 'Личный кабинет'
            name.style.cssText = `
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
                margin-bottom: 30px;
            `;
            infoCard.appendChild(name)

            // Информация о пользователе
            let userInfoSection = document.createElement('div');
            userInfoSection.style.cssText = `
                background: rgba(255,255,255,0.9);
                padding: 20px;
                border-radius: 15px;
                margin-bottom: 30px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            `;

            let userInfoTitle = document.createElement('h3');
            userInfoTitle.textContent = 'Информация о пользователе';
            userInfoTitle.style.cssText = `
                margin-top: 0;
                color: #2c3e50;
                border-bottom: 2px solid lightseagreen;
                padding-bottom: 10px;
            `;
            userInfoSection.appendChild(userInfoTitle);

            let loginInput = document.createElement('input')
            loginInput.type = 'text'
            loginInput.value = localStorage.getItem('login')
            loginInput.placeholder = 'Логин'
            loginInput.classList.add('login')
            loginInput.onchange = () => {
                localStorage.setItem('login', loginInput.value)
            }

            let emailInput = document.createElement('input')
            emailInput.type = 'email'
            emailInput.value = localStorage.getItem('email')
            emailInput.placeholder = 'E-mail'
            emailInput.classList.add('email')
            emailInput.onchange = () => {
                localStorage.setItem('email', emailInput.value)
            }

            let roleInfo = document.createElement('p');
            roleInfo.textContent = `Роль: ${localStorage.getItem('role') === 'author' ? 'Автор' : 'Студент'}`;
            roleInfo.style.cssText = `
                color: #34495e;
                font-weight: bold;
                margin: 10px 0;
            `;

            userInfoSection.appendChild(loginInput);
            userInfoSection.appendChild(emailInput);
            userInfoSection.appendChild(roleInfo);
            infoCard.appendChild(userInfoSection);

            // Мои курсы
            let coursesSection = document.createElement('div');
            coursesSection.style.cssText = `
                background: rgba(255,255,255,0.9);
                padding: 20px;
                border-radius: 15px;
                box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            `;

            let coursesTitle = document.createElement('h3');
            coursesTitle.textContent = 'Мои курсы';
            coursesTitle.style.cssText = `
                margin-top: 0;
                color: #2c3e50;
                border-bottom: 2px solid lightseagreen;
                padding-bottom: 10px;
            `;
            coursesSection.appendChild(coursesTitle);

            // Получаем курсы пользователя
            var userCourses = JSON.parse(localStorage.getItem('user_courses') || '[]');

            if (userCourses.length === 0) {
                let noCourses = document.createElement('p');
                noCourses.textContent = 'Вы еще не записаны ни на один курс';
                noCourses.style.cssText = `
                    color: #7f8c8d;
                    text-align: center;
                    font-style: italic;
                    padding: 20px;
                `;
                coursesSection.appendChild(noCourses);
            } else {
                userCourses.forEach(course => {
                    let courseCard = document.createElement('div');
                    courseCard.style.cssText = `
                        display: flex;
                        align-items: center;
                        background: white;
                        padding: 15px;
                        margin: 10px 0;
                        border-radius: 10px;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                        border-left: 4px solid lightseagreen;
                    `;

                    let courseImage = document.createElement('img');
                    courseImage.src = course.background_url;
                    courseImage.style.cssText = `
                        width: 60px;
                        height: 60px;
                        object-fit: cover;
                        border-radius: 8px;
                        margin-right: 15px;
                    `;

                    let courseInfo = document.createElement('div');
                    courseInfo.style.flex = '1';

                    let courseTitle = document.createElement('h4');
                    courseTitle.textContent = course.title;
                    courseTitle.style.cssText = `
                        margin: 0 0 5px 0;
                        color: #2c3e50;
                    `;

                    let courseAuthor = document.createElement('p');
                    courseAuthor.textContent = `Автор: ${course.author}`;
                    courseAuthor.style.cssText = `
                        margin: 0 0 5px 0;
                        color: #7f8c8d;
                        font-size: 0.9rem;
                    `;

                    let courseProgress = document.createElement('div');
                    courseProgress.style.cssText = `
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        margin-top: 8px;
                    `;

                    let progressBar = document.createElement('div');
                    progressBar.style.cssText = `
                        flex: 1;
                        height: 8px;
                        background: #ecf0f1;
                        border-radius: 4px;
                        overflow: hidden;
                        margin-right: 10px;
                    `;

                    let progressFill = document.createElement('div');
                    progressFill.style.cssText = `
                        height: 100%;
                        background: linear-gradient(90deg, lightseagreen, #2ecc71);
                        width: ${course.progress || 0}%;
                        border-radius: 4px;
                        transition: width 0.3s ease;
                    `;

                    let progressText = document.createElement('span');
                    progressText.textContent = `${course.progress || 0}%`;
                    progressText.style.cssText = `
                        font-size: 0.8rem;
                        font-weight: bold;
                        color: #2c3e50;
                        min-width: 40px;
                    `;

                    progressBar.appendChild(progressFill);
                    courseProgress.appendChild(progressBar);
                    courseProgress.appendChild(progressText);

                    courseInfo.appendChild(courseTitle);
                    courseInfo.appendChild(courseAuthor);
                    courseInfo.appendChild(courseProgress);

                    courseCard.appendChild(courseImage);
                    courseCard.appendChild(courseInfo);

                    coursesSection.appendChild(courseCard);
                });
            }

            infoCard.appendChild(coursesSection);
        }
        main.appendChild(infoCard);
    }

    document.body.insertBefore(main, document.body.childNodes.item(1))
}