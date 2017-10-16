;(() => {
    "use strict";

    class MainPageSearchHandler {
        /**
         * MainPageSearchHandler's constructor.
         * @param {HTMLElement} searchInputElement
         * @param {HTMLElement} resultsContainer
         */
        constructor(searchInputElement, resultsContainer) {
            this.searchInputElement = searchInputElement;
            this.resultsContainer = resultsContainer;
        }

        attachHandlers() {
            this.searchInputElement.addEventListener('keypress', this._searchKeyPressHandler.bind(this));
        }

        /**
         *
         * @param {KeyboardEvent} e
         * @private
         */
        _searchKeyPressHandler(e) {
            switch (e.keyCode) {
                case 13:
                    // Key Pressed: Enter
                    this._createNewResultsOverlay(this.searchInputElement.value.trim());
                    this.searchInputElement.setAttribute('disabled', 'disabled');
            }
            /* We would, certainly, have to handle auto-suggestion as we type. */
            /* This would be a good place to implement it. */
            // TODO: See above
        }

        /**
         *
         * @param {String} query
         * @private
         */
        _createNewResultsOverlay(query) {
            console.info(`Query: ${query}`);
            // Flush everything down the toilet, before pooping new shit
            this.resultsContainer.innerHTML = `<section class="placeholder"><div class="loader">Loading...</div></section>`;
            this.resultsContainer.classList.remove('active');

            fetch(`/search/${query}`)
                .then((data) => {
                    return data.json();
                }).then((json) => {
                    this.resultsContainer.innerHTML = '';

                    this.resultsContainer.classList.add('active');

                    this._fillResults(this.resultsContainer, json);
                    this.searchInputElement.removeAttribute('disabled');
                });
        }

        /**
         *
         * @param {HTMLElement} container
         * @param json
         * @private
         */
        _fillResults(container, json) {
            let resultContent = '';
            json.forEach((result) => {
                let name = result['name'];

                if(name.length > 25) {
                    name = name.substr(0, 25) + '&#8230;'
                }

                resultContent += `
                <section class="manga" style="background-image: url('${result['cover']}');" data-manga-details='${JSON.stringify(result).replace(/'/g, '~')}'>
                    <section class="name">${name}</section>
                </section>
                `;
            });
            container.innerHTML += resultContent;
            this._attachMangaCardOpenHandler(Array.from(document.querySelectorAll('.manga')));
        }

        static _buildTags(tags) {
            let html = '';
            let breakOut = false;
            tags.forEach((tag, key) => {
               if(!breakOut)
                   html += `<span class="tag">${tag}</span>`;
               if(key === 4) {
                   breakOut = true;
               }
            });
            return html;
        }

        /**
         * Attaches on click handlers to the returned manga result
         * cards.
         * @param {Array<HTMLElement>} mangaCards
         * @return {boolean}
         * @private
         */
        _attachMangaCardOpenHandler(mangaCards) {
            mangaCards.forEach((card) => {
                card.addEventListener('click', this._openMangaDetails.bind(card));
            });
            return true;
        }

        /**
         * Opens the card into a broader view, and shows details and buttons,
         * and all those shits.
         * @param {MouseEvent} e
         * @callback
         * @private
         */
        _openMangaDetails(e) {
            let cardDetails = this.getAttribute('data-manga-details').replace(/~/g, "'");
            cardDetails = eval(`(function () { return ${cardDetails}; })();`);

            let broadCardElement = document.createElement('section');
            broadCardElement.classList.add('broad-fixed-card');

            broadCardElement.innerHTML = `
            <h1 class="title">${cardDetails['name']}</h1>
            <section class="simple-flex">
                <section class="cosmetic-details">
                    <img src="${cardDetails['cover']}" class="cover" />
                </section>
                <section class="details">
                    <div class="content">${(typeof cardDetails['info'] === "undefined" ? "No description found." : cardDetails['info'])}</div>
                    <div class="buttons"><button data-cancel>Cancel</button><button data-open="${cardDetails["mangaId"]}">Open</button></div>
                </section>
            </section>
            `;

            document.querySelector('.backdrop').classList.add('active');
            document.body.appendChild(broadCardElement);

            MainPageSearchHandler._attachMangaReadActionEvents();
        }

        static _attachMangaReadActionEvents() {
            document.querySelector('[data-cancel]').addEventListener('click', (e) => {
                document.querySelector('.backdrop').classList.remove('active');
                document.querySelector('.broad-fixed-card').parentNode.removeChild(document.querySelector('.broad-fixed-card'));
            });

            document.querySelector('[data-open]').addEventListener('click', (e) => {
                window.location = '/manga/' + document.querySelector('[data-open]').getAttribute('data-open');
            });
        }
    }
    window.MainPageSearchHandler = MainPageSearchHandler;
})();