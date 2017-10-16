;(() => {
    class MangaDetail {
        constructor(mangaId) {
            this.mangaId = mangaId;
        }

        setTemplateData() {
            fetch(`/api/manga/details/${this.mangaId}`)
                .then((data) => {
                    return data.json();
                }).then((json) => {
                    this._setTemplateData(json);
                });
        }

        _setTemplateData(details) {
            document.querySelector('[data-manga-title]').textContent = details.name;
            document.querySelector('[data-manga-cover]').setAttribute('style', `background-image: url(${details["cover"]})`);
            document.querySelector('[data-manga-author]').textContent = (details['author'].length === 0) ? "Not Found" : details['author'][0].replace(/-/g, ' ');
            document.querySelector('[data-manga-release-date]').textContent = (typeof details['yearOfRelease'] === "undefined") ? "Not Found" : details['yearOfRelease'];
            document.querySelector('[data-manga-info]').textContent = details['info'];
            document.querySelector('[data-manga-genres]').textContent = details['genres'].join(', ').replace(/-/g, ' ');
            console.log(new Date(details['lastUpdate']).toString());
            document.querySelector('[data-manga-container]').innerHTML = this._getMainContent(details);
        }

        _getMainContent(details) {
            let mainContent = '',
                chapters = details['chapters'],
                chunks = MangaDetail.chunk(chapters, 25);

            chunks.forEach((chunk, key) => {
                let index = key;
                mainContent += `<section class="volume-container">
                <section class="volume">${index * 25} - ${(index + 1) * 25}</section>
                <section class="chapter-container">`;
                chunk.forEach((chapter) => {
                    mainContent += `<a class="chapter" href="/read/manga/${this.mangaId}/c/${chapter["chapterId"]}#page=1">`;
                    mainContent += '<span class="bold">Chapter</span>: <span class="lighty">' + chapter["chapterId"] + '</span>';
                    mainContent += '</a>';
                });
                mainContent += `</section></section>`;
            });

            return mainContent;
        }

        static chunk (arr, len) {

            let chunks = [],
                i = 0,
                n = arr.length;

            while (i < n) {
                chunks.push(arr.slice(i, i += len));
            }

            return chunks;
        }
    }

    let reader = new MangaDetail(window.location.href.split('/').slice(-1).pop().replace(/#+$/, ''));
    reader.setTemplateData();
})();