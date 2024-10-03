import { changeLike, deleteCard } from "./api.js";
import { imageClick } from "../index.js";

export function createCard(
  cardData,
  userId,
  deleteCard,
  likeButtonClick,
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

  // Управление кнопкой удаления
  if (cardData.owner._id === userId) {
    cardDeleteButton.addEventListener("click", () => {
      deleteCard(cardData._id)
        .then(() => {
          placesItem.remove(); // Удаляем карточку из DOM
        })
        .catch((err) => {
          console.error("Ошибка при удалении карточки:", err);
        });
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
    const isCurrentlyLiked = cardLikeButton.classList.contains(
      "card__like-button_is-active"
    );

    changeLike(cardData._id, !isCurrentlyLiked) // Функция для изменения лайка
      .then((updatedCard) => {
        likeCount.textContent = updatedCard.likes.length; // Обновляем количество лайков
        cardLikeButton.classList.toggle("card__like-button_is-active"); // Переключаем класс активации
      })
      .catch((err) => {
        console.error(`Ошибка при изменении лайка: ${err}`); // Логируем ошибки
      });
  });

  if (open) {
    cardImage.addEventListener("click", () => open(cardData));
  }

  return placesItem; // Возвращаем элемент карточки
}
