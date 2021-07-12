/* eslint-env es6 */
'use strict';

// //////////////// аккордион
const footer = document.querySelector('.footer');
const accordionBtns = footer.querySelectorAll('.accordion__btn');

const addcordion = (mainBtns) => {
  mainBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      mainBtns.forEach((btnj, j) => {
        if (i !== j) {
          btnj.parentElement.classList.remove('accordion--open');
        }
      });
      btn.parentElement.classList.toggle('accordion--open');
    });
    // btn.addEventListener('click', (evt) => {
    //   evt.target.parentElement.classList.toggle('accordion--open');
    //   if (index === 0) {
    //     accordionBtns[1].parentElement.classList.remove('accordion--open');
    //   }
    //   if (index === 1) {
    //     accordionBtns[0].parentElement.classList.remove('accordion--open');
    //   }
    // });
  });
};

const openAccordionMenu = (mainBtns) => {
  mainBtns.forEach(btn => {
    btn.parentElement.classList.remove('accordion--open');
  });
};

const closeAccordionMenu = (mainBtns) => {
  mainBtns.forEach(btn => {
    btn.parentElement.classList.remove('accordion--open');
  });
};

const onMobileShowFooterAccordionMenu = (mainBtns) => {
  if (window.matchMedia('(max-width: 767.9px)').matches) {
    closeAccordionMenu(mainBtns);
    addcordion(mainBtns);
  } else {
    openAccordionMenu(mainBtns);
  }
};
// ////////////////  КОНЕЦ аккордион

// ////////////////  форма связи
const feedbackForm = document.querySelector('.feedback__form');
const phoneInput = feedbackForm.querySelector('#form-tel');
const nameInput = feedbackForm.querySelector('#form-name');

const helpOnInputTel = (input, event) => {
  if (!(event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'Backspace' || event.key === 'Tab')) {
    event.preventDefault();
  }
  let mask = '+7 (111) 111-11-11'; // Задаем маску

  if (/[0-9\+\ \-\(\)]/.test(event.key)) {
    // Здесь начинаем сравнивать this.value и mask
    // к примеру опять же
    var currentString = input.value;
    var currentLength = currentString.length;
    if (/[0-9]/.test(event.key)) {
      if (mask[currentLength] === '1') {
        input.value = currentString + event.key;
      } else {
        for (var i = currentLength; i < mask.length; i++) {
          if (mask[i] === '1') {
            input.value = currentString + event.key;
            break;
          }
          currentString += mask[i];
        }
      }
    }
  }
  if (input.value.length < 18 & input.value.length !== 0) {
    input.setCustomValidity('Введите номер целиком');
  } else {
    input.setCustomValidity('');
  }
};

const ipnutTelHelperListener = (input) => {
  input.addEventListener('keydown', helpOnInputTel.bind(null, input));
};

const showSuccessPopupMessage = (form) => {
  form.classList.add('form--sended');
  setTimeout(() => {
    form.classList.remove('form--sended');
  }, 750);
};

const onSubmitFeadbackForm = () => {
  feedbackForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    localStorage.setItem('contactName', nameInput.value);
    localStorage.setItem('contactTel', phoneInput.value);
    feedbackForm.reset();
    showSuccessPopupMessage(feedbackForm);
  });
};
// ////////////////  КОНЕЦ форма связи

// /////////////// модальное окно
const body = document.querySelector('.page');
const header = body.querySelector('.header');
const modal = document.querySelector('.modal');
const modalForm = modal.querySelector('.modal__form');
const buttonOpenModal = document.querySelector('.modal-btn');
const inputTelModalForm = modalForm.querySelector('#modal-form-tel');
const inputNameModalForm = modalForm.querySelector('#modal-form-name');

const getScrollWidth = () => {
  let div = document.createElement('div');
  div.style.overflowY = 'scroll';
  div.style.width = '50px';
  div.style.height = '50px';
  document.body.append(div);
  let scrollWidth = div.offsetWidth - div.clientWidth;
  div.remove();
  return scrollWidth;
};

const lockBody = (lockPad) => {
  let paddingValue = `${lockPad}px`;
  body.classList.add('lock');
  body.style.paddingRight = `${paddingValue}`;
  header.style.setProperty('--lock-pad', `${paddingValue}`);
};

const unlockBody = () => {
  body.classList.remove('lock');
  header.style.removeProperty('--lock-pad');
  body.style.paddingRight = '';
};

const isEscEvent = (evt) => {
  return evt.key === ('Escape' || 'Esc');
};

let bindHelpOnInputTel = helpOnInputTel.bind(null, inputTelModalForm);

const closeModal = () => {
  modal.setAttribute('aria-hidden', 'true');
  unlockBody();
  modalForm.reset();
  document.removeEventListener('keydown', onEscKeydownCloseModal);
  document.removeEventListener('click', onClickAwayCloseModal);
  inputTelModalForm.removeEventListener('keydown', bindHelpOnInputTel);
};

const onBtnCloseModal = (btnClose) => {
  if (modal) {
    btnClose.addEventListener('click', (evt) => {
      evt.preventDefault();
      closeModal();
    }, { once: true });
  }
};

const onEscKeydownCloseModal = (evt) => {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    closeModal();
  }
};

const onClickAwayCloseModal = (evt) => {
  if (!evt.target.closest('.modal__wrapper')) {
    closeModal();
  }
};

const addListenerOnOpenModal = () => {
  setTimeout(() => {
    document.addEventListener('click', onClickAwayCloseModal);
    document.addEventListener('keydown', onEscKeydownCloseModal);
  }, 200);
};

const openModal = () => {
  modal.setAttribute('aria-hidden', 'false');
  inputTelModalForm.focus();
  let bodyLockPadding = getScrollWidth();
  lockBody(bodyLockPadding);

  const btnClose = modalForm.querySelector('.form__btn-close');
  onBtnCloseModal(btnClose, modal);

  addListenerOnOpenModal();
  inputTelModalForm.addEventListener('keydown', bindHelpOnInputTel);
};

const onSuccessSubmit = () => {
  showSuccessPopupMessage(modalForm);
  setTimeout(() => {
    closeModal();
  }, 750);
};

const onSubmitModalFormSendData = () => {
  modalForm.addEventListener('submit', (evt) => {
    evt.preventDefault();
    localStorage.setItem('modal-tel', inputTelModalForm.value);
    localStorage.setItem('modal-mail', inputNameModalForm.value);
    onSuccessSubmit();
  }, { once: true });
};

const onBtnShowModal = (btn) => {
  btn.addEventListener('click', () => {
    openModal();
    onSubmitModalFormSendData();
  });
};
// /////////////// КОНЕЦ модальное окно

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('page--no-js');
  // headerMenu.classList.remove('header-menu--no-js');
  // headerMenu.classList.add('header-menu--closed');

  // аккордион в подвале на мобильном
  onMobileShowFooterAccordionMenu(accordionBtns);

  // форма обратной свзяи
  ipnutTelHelperListener(phoneInput);
  onSubmitFeadbackForm();

  // модальное окно
  onBtnShowModal(buttonOpenModal);

});
