import "./pages/index.css"; // добавьте импорт главного файла стилей
import { initialCards } from "./scripts/cards.js";
import { createCard, deleteCard, likeButtonClick } from "./components/cards.js";
import { openPopup, closePopup, handleEscape } from "./components/modal.js";

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");
const profileEditButton = document.querySelector(".profile__edit-button");
const profilePopup = document.querySelector(".popup_type_edit");
const popupsClose = document.querySelectorAll(".popup__close");
const addCardButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupCaption = imagePopup.querySelector('.popup__caption');
const imagePopupLink = imagePopup.querySelector('.popup__image');

// Находим форму в DOM
const profileForm = document.forms["edit-profile"]; // Воспользуйтесь методом querySelector()
// Находим поля формы в DOM
const nameInput = document.querySelector(".profile__title"); // Воспользуйтесь инструментом .querySelector()
const jobInput = document.querySelector(".profile__description"); // Воспользуйтесь инструментом .querySelector()

// @todo: Вывести карточки на страницу
initialCards.forEach(function (cardItem) {
  const card = createCard(cardItem, deleteCard, likeButtonClick, imageClick);
  placesList.append(card);
});

// Открытие Попапа профиля
profileEditButton.addEventListener("click", function () {
  //заполняем поля формы
profileForm.elements.name.value = nameInput.textContent;
profileForm.elements.description.value = jobInput.textContent;
  openPopup(profilePopup);
});

// Открытия Попапа добавления
addCardButton.addEventListener("click", function (evt) {
  openPopup(addCardPopup);
});

// открытие катринки карточки
function imageClick(cardItem) {
  imagePopupLink.src = cardItem.link;
  imagePopup.alt = cardItem.name;
  imagePopupCaption.textContent = cardItem.name;
  openPopup(imagePopup);
}

// Закрытие Попапа кнопкой
popupsClose.forEach((item) => {
  item.addEventListener("click", function (evt) {
    closePopup(evt.target.closest(".popup"));
  });
});

// Закрытие попап на оверлей
document.addEventListener("click", function (evt) {
  const popup = evt.target.closest(".popup");
  if (popup && evt.target === popup) closePopup(popup);
});


// Обработчик «отправки» формы, хотя пока
// она никуда отправляться не будет
function handleFormSubmit(evt) {
  evt.preventDefault();
  nameInput.textContent = profileForm.elements.name.value;
  jobInput.textContent = profileForm.elements.description.value;
  closePopup(evt.target.closest(".popup"));
}
// Прикрепляем обработчик к форме:
// он будет следить за событием “submit” - «отправка»
profileForm.addEventListener("submit", handleFormSubmit);

//добавление новой карточки
const addCardForm = document.forms["new-place"];
const newPlaceName = addCardForm.elements["place-name"];
const newPlaceLink = addCardForm.elements.link;
addCardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const newCardItem = {
    name: newPlaceName.value,
    link: newPlaceLink.value,
    alt: newPlaceName.value,
  };

  const newCard = createCard(
    newCardItem,
    deleteCard,
    likeButtonClick,
    imageClick
  );
  placesList.prepend(newCard);

  addCardForm.reset();
  closePopup(addCardPopup);
});
