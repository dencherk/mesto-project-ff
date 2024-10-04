import { changeLike, deleteCard } from "./api.js";
import { imageClick } from "../index.js";

export function createCard(
  cardData,
  userId,
  deleteCallback,
  likeCallback,
  open
) {
  const cardTemplate = document.querySelector("#card-template").content;
  const placesItem = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = placesItem.querySelector(".card__image");
  const cardTitle = placesItem.querySelector(".card__title");
  const cardDeleteButton = placesItem.querySelector(".card__delete-button");
  const cardLikeButton = placesItem.querySelector(".card__like-button");
  const likeCount = placesItem.querySelector(".card__like-count");

  // Устанавливаем данные карточки
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  likeCount.textContent = cardData.likes.length;

  cardImage.addEventListener("click", () => imageClick(cardData));

// Обработчик кнопки удаления
if (cardData.owner._id === userId) {
  cardDeleteButton.addEventListener("click", () => {
    deleteCallback(cardData._id, placesItem); // Передаем данные в колбэк
  });
} else {
  cardDeleteButton.remove();
}

  // Проверка, был ли лайк
  const isLiked = () => cardData.likes.some((like) => like._id === userId);
  if (isLiked()) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }

// Обработчик клика по кнопке лайка
cardLikeButton.addEventListener("click", () => {
  const isCurrentlyLiked = cardLikeButton.classList.contains("card__like-button_is-active");
  
  // Передаем данные в колбэк для изменения лайка
  likeCallback(cardData._id, !isCurrentlyLiked, cardLikeButton, likeCount);
});

  if (open) {
    cardImage.addEventListener("click", () => open(cardData));
  }

  return placesItem; // Возвращаем элемент карточки
}
