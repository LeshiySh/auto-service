const search = document.getElementById('search');
const cards = document.querySelectorAll('.card');

search.addEventListener('input', function () {
    const query = search.value.trim().toLowerCase();
    let visible = 0;

    cards.forEach(function (card) {
        const title = card.querySelector('h3').textContent.toLowerCase();

        if (title.includes(query)) {
            card.style.display = '';
            visible++;
        } else {
            card.style.display = 'none';
        }
    });
});