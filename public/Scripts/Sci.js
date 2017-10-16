"use strict";

let mainPageSearchHandler = new MainPageSearchHandler(
    document.querySelector('#search'),
    document.querySelector('.results')
);
mainPageSearchHandler.attachHandlers();