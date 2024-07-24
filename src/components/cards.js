// @todo: Темплейт карточки
const cardTemplate = document.querySelector("#card-template").content;
// @todo: Функция создания карточки
export function createCard(cardItem, deleteCard, likeButtonClick, imageClick) {
  const placesItem = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  const cardImage = placesItem.querySelector(".card__image");
  const cardTitle = placesItem.querySelector(".card__title");
  const cardDeleteButton = placesItem.querySelector(".card__delete-button");
  const cardLikeButton = placesItem.querySelector(".card__like-button");

  cardImage.src = cardItem.link;
  cardImage.alt = cardItem.name;
  cardTitle.textContent = cardItem.name;

  cardDeleteButton.addEventListener("click", deleteCard);
  cardLikeButton.addEventListener("click", () =>
    likeButtonClick(cardLikeButton)
  );
  cardImage.addEventListener("click", () => imageClick(cardItem));

  return placesItem;
}

// @todo: Функция удаления карточки
export function deleteCard(event) {
  const listItem = event.target.closest(".places__item");
  listItem.remove();
}

//лайк карточки
export function likeButtonClick(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}
