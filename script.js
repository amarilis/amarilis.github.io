'use strict';

/**
 * Генератор случайной даты
 *
 * @returns {Date} возвращает случайную дату
 */
function randomDate(){
    var startDate = new Date(2014,0,1).getTime();
    var endDate =  new Date(2020,0,1).getTime();
    var spaces = (endDate - startDate);
    var timestamp = Math.round(Math.random() * spaces);
    timestamp += startDate;
    return new Date(timestamp);
}

/**
 * Запись случайной даты
 *
 * @param arrDates {Array} массив со случайными датами
 */
var blockScheduleSection = document.querySelector('.b-schedule__sort').querySelectorAll('.b-schedule__section');
var arrDates = [];
for (var i =0; i< blockScheduleSection.length; i++) {
    arrDates.push(randomDate());
};

/**
 * Запись случайной даты в:
 *   атрибут блока .schedule__block_date
 *   внутрь блока .schedule__block_date-date
 * Добавления класса для показа:
 *   прошедшей лекции .b-schedule__section_ended
 *   блока с кнопками скачать и смотреть .schedule__block_date-buttons_show
 */
for (var j =0; j< blockScheduleSection.length; j++) {
    if (+new Date > +arrDates[j]) {
        blockScheduleSection[j].classList.add('b-schedule__section_ended');
        blockScheduleSection[j].querySelector('.schedule__block_date-buttons').classList.add('schedule__block_date-buttons_show');
    }
    blockScheduleSection[j].querySelector('.schedule__block_date').setAttribute('data-date',+arrDates[j]);
    blockScheduleSection[j].querySelector('.schedule__block_date-date').innerHTML =  new Date(arrDates[j]).toLocaleString("ru", {year: 'numeric',month: 'long',day: 'numeric'});
};



/**
 * Переменные для тултипа
 *
 * showingTooltip для тултипа descktop
 * showTooltipMobile для тултипа mobile
 */
var showingTooltip,
    showTooltipMobile;

/**
 * Показ тултипа при наведении на элемент с атрибутом data-tooltip
 *
 * для экранов больше 700
 */
document.addEventListener('mouseover', function (e) {
    if (document.documentElement.clientWidth < 700) return;
    e = e || event;
    var target = e.target || e.srcElement;
    var tooltip = target.getAttribute('data-tooltip');
    if (!tooltip) return;
    var tooltipElem = document.createElement('div');
    tooltipElem.className = 'schedule__reader-tooltip';
    tooltipElem.innerHTML = tooltip;
    document.body.appendChild(tooltipElem);
    var coords = getCoords(target);
    var scroll = getPageScroll();
    var left = coords.left + (target.offsetWidth - tooltipElem.offsetWidth)/2^0;
    if (left < scroll.left) left = scroll.left;
    var top = coords.top - tooltipElem.offsetHeight - 5;
    if (top < scroll.top) {
        top = coords.top + target.offsetHeight + 5;
    }
    tooltipElem.style.left = left + 'px';
    tooltipElem.style.top = top + 'px';
    tooltipElem.style.opacity = 1;
    showingTooltip = tooltipElem;
}, false);


/**
 * Скрытие тултипа
 */
document.addEventListener('mouseout', function (e) {
    if (showingTooltip) {
        document.body.removeChild(showingTooltip);
        showingTooltip = null;
    }
}, false);


/**
 * Получение координат прокрутки
 *
 * @returns {*} координаты
 */
function getPageScroll() {
    if (window.pageXOffset != undefined) {
        return {
            left: pageXOffset,
            top: pageYOffset
        }
    }
    var html = document.documentElement;
    var body = document.body;
    var top = html.scrollTop || body && body.scrollTop || 0;
    top -= html.clientTop;
    var left = html.scrollLeft || body && body.scrollLeft || 0;
    left -= html.clientLeft;
    return { top: top, left: left };
}

/**
 * Получение координат
 *
 * @param elem
 * @returns {{top: number, left: number}} координаты
 */
function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    var body = document.body;
    var docEl = document.documentElement;
    var scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop;
    var scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft;
    var clientTop = docEl.clientTop || body.clientTop || 0;
    var clientLeft = docEl.clientLeft || body.clientLeft || 0;
    var top  = box.top +  scrollTop - clientTop;
    var left = box.left + scrollLeft - clientLeft;
    return { top: Math.round(top), left: Math.round(left) };
}

/**
 * Показ тултипа при клике на элементе с атрибутом data-tooltip,
 * срабатывает при ширине экрана меньше 700px
 */
document.addEventListener('click', function (e) {

    if (document.documentElement.clientWidth > 700) return;

    if (!e.target.closest('.schedule__reader-tooltip-mobile') && document.querySelector('.schedule__reader-tooltip-mobile') != null) {
        document.querySelector('.schedule__reader-tooltip-mobile').parentNode.removeChild(document.querySelector('.schedule__reader-tooltip-mobile'));
    }

    var target = e.target;

    while (target !== this) {
        if (target.getAttribute('data-tooltip') == null) return;
        var tooltip = target.getAttribute('data-tooltip');
        if (!!tooltip) break;
        target = target.parentNode;
    }

    if (!tooltip) return;

    var tooltipElem = document.createElement('div');
    tooltipElem.className = 'schedule__reader-tooltip-mobile';
    tooltipElem.innerHTML = tooltip;
    target.parentNode.insertBefore(tooltipElem, target.nextSibling);
    tooltipElem.style.opacity = 1;

    return tooltipElem;

}, false);



/**
 * Переменные с данными для сортировки
 *
 * sortableBlock - блок, в котором находится список лекций
 * arrLectures - массив лекций после загрузки
 * arrLecturesCopy - копия arrLectures
 * arrLecturesEnded - массив лекций, которые уже закончились
 * arrLecturesFuture - массив лекций, которые еще не начались
 */
var sortableBlock = document.querySelector('.b-schedule__sort');
var arrLectures = [].slice.call(sortableBlock.querySelectorAll('.b-schedule__section'));
var arrLecturesCopy = arrLectures.slice();
var arrLecturesEnded = [].slice.call(sortableBlock.querySelectorAll('.b-schedule__section_ended'));
var arrLecturesFuture = [].slice.call(sortableBlock.querySelectorAll('.b-schedule__section:not(.b-schedule__section_ended'));

/**
 * Сортировка при вводе в строке поиска
 */
document.querySelector('.search__input').oninput = function () {

    var val = this.value;

    if ( val.length >= 0 ) {
        var filteredData = arrLectures.filter(function(obj){
            var str = [].slice.call(obj.querySelectorAll('.schedule__item')).slice(0,3)[0].textContent
                    + ' ' +
                    [].slice.call(obj.querySelectorAll('.schedule__item')).slice(0,3)[1].textContent
                    + ' ' +
                    [].slice.call(obj.querySelectorAll('.schedule__item')).slice(0,3)[2].textContent

            return str.toLowerCase().search(val.toLowerCase())!== -1;
        });

        refactorListReaders(filteredData);

    };
};

/**
 * Сортировка по школам
 */
document.querySelector('.select__item-school').onchange = function () {
    sortSelectSchool(this,0)
};

/**
 * Сортировка по лекторам
 */
document.querySelector('.select__item-reader').onchange = function () {
    sortSelectSchool(this,2)
};

/**
 * Сортировка по дате
 */
document.querySelector('.select__item-date').onchange = function () {

    switch (this.selectedIndex) {
        case 0:
            refactorListReaders(arrLecturesCopy);
            break;

        case 1:
            arrLectures.sort(function(a, b) {
                return a.children[3].dataset.date - b.children[3].dataset.date;
            });
            refactorListReaders(arrLectures);
            break;

        case 2:
            arrLectures.sort(function(a, b) {
                return b.children[3].dataset.date - a.children[3].dataset.date;
            });
            refactorListReaders(arrLectures);
            break;

        case 3:
            arrLecturesEnded.sort(function(a, b) {
                return b.children[3].dataset.date - a.children[3].dataset.date;
            });
            refactorListReaders(arrLecturesEnded);
            break;

        case 4:
            arrLecturesFuture.sort(function(a, b) {
                return a.children[3].dataset.date - b.children[3].dataset.date;
            });
            refactorListReaders(arrLecturesFuture);
            break;
    }

};

/**
 * Рефакторинг блока лекций
 *
 * @param arr {Object} объект, которым будет заполнен блок лекций
 */
function refactorListReaders(arr) {
    // Опустошаем блок лекций
    sortableBlock.innerHTML = "";
    // Заполняем блок лекций
    for (var i = 0; i < arr.length; i++) {
        sortableBlock.appendChild(arr[i]);
    }
}

/**
 * Функция сортировки по полю лекции и по полю школы
 *
 * @param obj {Object} текущий select
 * @param field {Number} номер поля в строке лекции, по которому будет произведена сортировка
 */
function sortSelectSchool(obj,field) {

    var val = obj.options[obj.selectedIndex].text;

    if ( obj.selectedIndex != 0 ) {
        var filteredData = arrLectures.filter(function(obj){
            var str = [].slice.call(obj.querySelectorAll('.schedule__item')).slice(0,3)[field].textContent;

            return str.toLowerCase().search(val.toLowerCase())!== -1;
        });

        refactorListReaders(filteredData);

    } else {

        refactorListReaders(arrLecturesCopy);

    };
}