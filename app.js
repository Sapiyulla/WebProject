

document.addEventListener('DOMContentLoaded', async () => {
    // Проверяем, находимся ли мы на странице регистрации
    if (location.pathname.endsWith('reg.html')) {
        return; // Не выполняем проверку авторизации на странице регистрации
    }

    if (
        !localStorage.getItem('login') ||
        !localStorage.getItem('email') ||
        !localStorage.getItem('role')
    ) {
        window.open(location.origin + '/reg.html', '_self')
        return;
    }

    var loaded_svgs = await loadAllSVG()

    let sidebar = document.createElement('article')
    sidebar.classList.add('sidebar');
    // инкапсулируем реализацию кнопок навигации
    {
        var nav_items = [
            'courses',
            'profile'
        ]

        let courses = document.createElement('nav');
        {
            courses.classList.add('nav-item', 'courses');
            courses.appendChild(loaded_svgs.get('ni_courses'));

            let title = document.createElement('p');
            title.textContent = 'Courses'

            courses.appendChild(title)

            if (location.pathname != '/index.html') {
                courses.addEventListener('click', () => {
                    window.open(location.origin + '/index.html', '_self')
                })
            }
        }
        let profile = document.createElement('nav');
        {
            profile.classList.add('nav-item', 'profile');
            profile.appendChild(loaded_svgs.get('ni_profile'))

            let title = document.createElement('p');
            title.textContent = 'Profile'

            profile.appendChild(title)

            if (location.pathname != '/profile.html') {
                profile.addEventListener('click', () => {
                    window.open(location.origin + '/profile.html', '_self')
                })
            }
        }

        if (localStorage.getItem('role') === 'author') {
            let editor = document.createElement('nav');
            {
                editor.classList.add('nav-item', 'editor');
                editor.appendChild(loaded_svgs.get('ni_settings')) // Используем иконку настроек для редактора
                
                let title = document.createElement('p');
                title.textContent = 'Editor'
                
                editor.appendChild(title)
                
                if (location.pathname != '/editor.html') {
                    editor.addEventListener('click', () => {
                        window.open(location.origin + '/editor.html', '_self')
                    })
                }
            }
            
            if (location.pathname === '/editor.html') {
                editor.classList.add('active');
            }
            
            sidebar.appendChild(editor);
        }

        switch (location.pathname) {
            case '/index.html':
                courses.classList.add('active')
                profile.classList.remove('active')
                break;
            case '/profile.html':
                courses.classList.remove('active')
                profile.classList.add('active')
                break;
        }

        sidebar.appendChild(courses);
        sidebar.appendChild(profile);
    }

    // инкапсулируем реализацию кнопки сайдбара
    {
        let sbCloseBtn = document.createElement('button');
        sbCloseBtn.classList.add('sidebar-close-open-btn')

        // Определяем начальное состояние из localStorage
        let initialState = localStorage.getItem('sb_state') || 'open';
        sidebar.classList.add(initialState);

        // Устанавливаем правильную иконку в зависимости от состояния
        if (initialState === 'open') {
            sbCloseBtn.appendChild(loaded_svgs.get('sb_close').cloneNode(true));
        } else {
            sbCloseBtn.appendChild(loaded_svgs.get('sb_open').cloneNode(true));
        }

        sbCloseBtn.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                // Закрываем сайдбар
                localStorage.setItem('sb_state', 'close');
                sidebar.classList.replace('open', 'close');
                sbCloseBtn.replaceChild(
                    loaded_svgs.get('sb_open').cloneNode(true),
                    sbCloseBtn.firstChild
                );
            } else {
                // Открываем сайдбар
                localStorage.setItem('sb_state', 'open');
                sidebar.classList.replace('close', 'open');
                sbCloseBtn.replaceChild(
                    loaded_svgs.get('sb_close').cloneNode(true),
                    sbCloseBtn.firstChild
                );
            }
        })
        sidebar.prepend(sbCloseBtn)
    }
    document.body.prepend(sidebar);
}
)

async function loadAllSVG() {
    var svgs_paths = [
        'sidebar-btn-svg/close',
        'sidebar-btn-svg/open',
        'nav-items-svg/courses',
        'nav-items-svg/profile',
        'nav-items-svg/settings'
    ]

    var svg_map = new Map()

    try {
        svg_map.set('sb_close', await createSVGElement(svgs_paths[0]))
        svg_map.set('sb_open', await createSVGElement(svgs_paths[1]))
        svg_map.set('ni_courses', await createSVGElement(svgs_paths[2]))
        svg_map.set('ni_profile', await createSVGElement(svgs_paths[3]))
        svg_map.set('ni_settings', await createSVGElement(svgs_paths[4]))
    } catch (error) {
        alert(`svg on ${path} loading error: ${err}`)
    }

    return svg_map
}

async function createSVGElement(path) {
    const response = await fetch(`sources/${path}.svg`);
    const svgText = await response.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    return svgDoc.documentElement;
}