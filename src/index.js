import "./pages/index.css";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getProfileInfo,
  getInitialCards,
  updateProfile,
  addNewCard,
  deleteCard,
  checkUrl,
  handleError,
  patchNewAvatar,
} from "./components/api.js";
import { createCard } from "./components/cards.js";
import { openPopup, closePopup } from "./components/modal.js";

const placesList = document.querySelector(".places__list");
const profileEditButton = document.querySelector(".profile__edit-button");
const profilePopup = document.querySelector(".popup_type_edit");
const popupAvatarEdit = document.querySelector(".popup_type_edit-avatar");
const popupsClose = document.querySelectorAll(".popup__close");
const addCardButton = document.querySelector(".profile__add-button");
const addCardPopup = document.querySelector(".popup_type_new-card");
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");
const imagePopupLink = imagePopup.querySelector(".popup__image");

const profileForm = document.forms["edit-profile"];
const placeForm = document.forms["new-place"];
const nameInput = document.querySelector(".profile__title");
const jobInput = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

const newAvatarForm = document.forms["edit-avatar"];
const newAvatarUrl = newAvatarForm.elements["avatar-url"];

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

// открытие катринки карточки
export function imageClick(cardData) {
  imagePopupLink.src = cardData.link;
  imagePopup.alt = cardData.name;
  imagePopupCaption.textContent = cardData.name;
  openPopup(imagePopup);
}

// Сообщение о загрузке у кнопки 'submit'
function renderLoading(isLoading, popup) {
  const button = popup.querySelector(".popup__button");
  if (isLoading) {
    button.textContent = "Сохранение...";
  } else {
    button.textContent = "Сохранить";
  }
}

Promise.all([getProfileInfo(), getInitialCards()])

  .then(([userData, cards]) => {
    // Заполнение данными профиля
    const userID = userData._id;
    nameInput.textContent = userData.name;
    jobInput.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    // Заполнение галереи карточками
    cards.forEach((item) => {
      placesList.append(
        createCard(item, userID, deleteCard, {
          open: imageClick,
        })
      );
    });
  })
  .catch((err) => {
    console.error("Ошибка:", err);
  });

//Открытие попапа редактирования профиля
profileEditButton.addEventListener("click", function () {
  //заполняем поля формы
  profileForm.elements.name.value = nameInput.textContent;
  profileForm.elements.description.value = jobInput.textContent;
  openPopup(profilePopup);
  clearValidation(profileForm, validationConfig);
});

// Открытие попапа добавления нового места
addCardButton.addEventListener("click", function () {
  openPopup(addCardPopup);
  placeForm.reset();
  clearValidation(placeForm, validationConfig);
});
//закрытие попапа кнопкой
popupsClose.forEach((item) => {
  item.addEventListener("click", function (evt) {
    closePopup(evt.target.closest(".popup"));
  });
});
//закрытие попапа на оверлей
document.addEventListener("click", function (evt) {
  const popup = evt.target.closest(".popup");
  if (popup && evt.target === popup) closePopup(popup);
});

//отправка формы редактировния профиля
function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  const profileData = {
    name: profileForm.elements.name.value,
    about: profileForm.elements.description.value,
  };
  renderLoading(true, profileForm);
  updateProfile(profileData)
    .then((updatedProfile) => {
      nameInput.textContent = updatedProfile.name;
      jobInput.textContent = updatedProfile.about;
      closePopup(evt.target.closest(".popup"));
    })
    .catch(handleError)
    .finally(() => renderLoading(false, profileForm));
}
//обработчик к форме
profileForm.addEventListener("submit", handleProfileFormSubmit);
//добавление новой карточки
const addCardForm = document.forms["new-place"];
const newPlaceName = addCardForm.elements["place-name"];
const newPlaceLink = addCardForm.elements.link;

addCardForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderLoading(true, addCardForm);
  const newCardItem = {
    name: newPlaceName.value,
    link: newPlaceLink.value,
    alt: newPlaceName.value,
  };

  addNewCard(newCardItem)
    .then((cardData) => {
      const newCard = createCard(
        cardData,
        cardData.owner._id,
        deleteCard,
        imageClick
      );
      placesList.prepend(newCard);
      addCardForm.reset();
      closePopup(addCardPopup);
    })
    .catch(handleError)
    .finally(() => renderLoading(false, addCardForm));
});

// Открытие попапа для аватара
profileImage.addEventListener("click", function () {
  openPopup(popupAvatarEdit);
  clearValidation(newAvatarForm, validationConfig);
  newAvatarForm.reset();
});

// Обработчик формы замены аватара
function changeAvatar() {
  renderLoading(true, newAvatarForm);
  checkUrl(newAvatarUrl.value)
    .then((res) => {
      console.log(res.headers.get("content-type"), res.status);
      if (
        res.headers.get("content-type").startsWith("image/") &&
        res.status === 200
      ) {
        patchNewAvatar(newAvatarUrl.value)
          .then((data) => {
            closePopup(popupAvatarEdit);
            profileImage.style.backgroundImage = `url(${data.avatar})`;
          })
          .catch(handleError)
          .finally(() => renderLoading(false, newAvatarForm));
      }
    })
    .catch(handleError);
}

// Клик на сабмит у попапа смены аватара
newAvatarForm.addEventListener("submit", changeAvatar);

enableValidation(validationConfig);
