// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
// @todo: Функция создания карточки
function createCard(cardItem, deleteCard) {
    const placesItem = cardTemplate.querySelector('.places__item').cloneNode(true);
    const cardImage = placesItem.querySelector('.card__image');
    const cardTitle = placesItem.querySelector('.card__title');
    const cardDeleteButton = placesItem.querySelector('.card__delete-button');

    cardImage.src = cardItem.link;
    cardImage.alt = cardItem.alt;
    cardTitle.textContent = cardItem.name;
    cardDeleteButton.addEventListener('click', deleteCard);

    return placesItem;
}
// @todo: Функция удаления карточки
function deleteCard(event) {
    const listItem = event.target.closest('.places__item');
    listItem.remove();
}
// @todo: Вывести карточки на страницу
initialCards.forEach(function(cardItem){
    const card = createCard(cardItem, deleteCard);
    placesList.append(card);
})
