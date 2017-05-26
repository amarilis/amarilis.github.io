###### Смотреть можно тут: https://amarilis.github.io/

---

Страница адаптирована под мобильные устройства.

---
На странице реализована фильтрация:
- по школам, лекторам и датам осуществляется средствами выпадающих списков,
при этом эти списки независимые.
- фильтрация используя поисковую строку.
Поиск происходит по полям названия школы, названия лекции, имени лектора.

---
Дата генерируется Javascript`ом. Это сделано для того, чтобы также генерировалось значение этой даты в милисекундах для сортировки.

Также Javascript`ом выставляется класс *b-schedule__section_ended* для прошедшей лекции и класс *schedule__block_date-buttons_show* для показа блока с кнопками "Скачать" и "Смотреть", в зависимости от текущей даты.


Класс *js-schedule__show_tooltip-presence* добавляется к автору лекции, если присутствует data-tooltip с информацией о лекторе.


Блок с информацией о лекторе появляется при ширине устройства больше 700px в виде всплывающей подсказки, а при ширине устройства меньше 700px в виде появляющегося блока ниже имени лектора.
