;(() => {
    "use strict";

    class Reader {
        constructor(initPage, container) {
            this.page = initPage;
            this.fetchedResources = false;
            this.container = container;
            this.getChapter();
            this._attachEventHandlers();
        }

        getChapter() {
            fetch(`/api/get-chapter/${MANGA_ID}/${CHAPTER_ID}`)
                .then((data) => {
                    return data.json();
                })
                .then((json) => {
                    this.chapter = json;
                    this.fetchedResources = true;
                });
        }

        init() {
            if(!this.fetchedResources) {
                setTimeout(() => this.init(), 5000);
                return;
            }

            this._setPage();
        }

        _setPage() {
            this.container.innerHTML = `
            <div class="progress">
              <div class="indeterminate"></div>
            </div>
            `;
            // Get real index of the array of pages
            let realIndex = this.page - 1;
            if(
                typeof this.chapter['pages'][realIndex] === 'undefined'
                && typeof this.chapter['pages'][realIndex + 1] === 'undefined'
            ) {
                this._showChapterFinished();
            } else if(
                typeof this.chapter['pages'][realIndex] === 'undefined'
                && typeof this.chapter['pages'][realIndex - 1] === 'undefined'
            ) {
                this._showPreviousChapter();
            }

            let imageUri = this.chapter['pages'][realIndex].url;

            let image = new Image();

            image.src = imageUri;
            image.classList.add('image-container');
            image.setAttribute('data-image-container', '');

            image.onload = () => {
                this.container.innerHTML = '';
                this.container.appendChild(image);
                window.location.hash = `#page=${this.page}`;
            };
        }

        _attachEventHandlers() {
            if(typeof this._handleKeyPress !== 'undefined')
                document.body.addEventListener('keypress', (ev) => this._handleKeyPress(ev.keyCode).bind(this));
        }

        _handleKeyPress(keyCode) {
            switch (keyCode) {
                case 39:
                    this.page++;
                    this._setPage();
                    break;
                case 37:
                    this.page--;
                    this._setPage();
                    break;
                default:
                    console.log(keyCode);
            }
        }

        _showChapterFinished() {
            this.container.innerHTML = `
            <section class="alert-container">
                <h1 class="title">Chapter Finished</h1>
                <p class="content">
                    You've reached the end of the chapter ${CHAPTER_ID}.
                    You shall be taken (if necessary by force), to the next chapter in about 5 second.
                </p>
            </section>
            `;

            setTimeout(() => window.location.href = `/read/manga/${MANGA_ID}/c/${parseInt(CHAPTER_ID) + 1}#page=1`, 5500);
        }

        _showPreviousChapter() {
            this.container.innerHTML = `
            <section class="alert-container">
                <h1 class="title">Previous Chapter</h1>
                <p class="content">
                    You've tried to come back from page 1 of Chapter ${CHAPTER_ID} to Chapter ${parseInt(CHAPTER_ID) - 1}.
                    You shall be taken (if necessary by force), to the previous chapter in about 5 second.
                </p>
            </section>
            `;

            setTimeout(() => window.location.href = `/read/manga/${MANGA_ID}/c/${parseInt(CHAPTER_ID) - 1}#page=1`, 5500);
        }
    }

    let hashSplit = window.location.hash.split('=');
    let page = 0;
    if(hashSplit[0].substr(1) === 'page') {
        page = parseInt(hashSplit[1]);
    }

    let reader = new Reader(page, document.querySelector('main'));
    reader.init();
})();