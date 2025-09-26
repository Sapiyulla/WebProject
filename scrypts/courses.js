window.onload = async () => {
    var courses = await LoadCourses()

    var Main = document.createElement('main')
    courses.forEach(element => {
        var node = document.createElement('div')
        node.classList.add('course')
        node.style.backgroundImage = `url(\"${element.background_url}\")`;

        let title = document.createElement('h3')
        title.classList.add('title')

        let author = document.createElement('p')
        author.classList.add('author')

        let rating = document.createElement('p')
        rating.classList.add('rating')

        title.textContent = element.title;
        author.textContent = 'Author: ' + element.author;
        rating.textContent = 'Rating: ' + element.rating;

        node.appendChild(title)
        node.appendChild(author)
        node.appendChild(rating)

        Main.appendChild(node)
    });

    document.body.appendChild(Main);
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