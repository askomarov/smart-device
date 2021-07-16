/* eslint-env es6 */
'use strict';
// //////////////// аккордион
// const body = document.querySelector('.page');
const body = document.body;

const footer = document.querySelector('.footer');

const accordionBtns = document.querySelectorAll('.accordion__btn');

const accordion = (mainBtns) => {
  mainBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      mainBtns.forEach((btnj, j) => {
        if (i !== j) {
          btnj.parentElement.classList.remove('accordion--open');
        }
      });
      btn.parentElement.classList.toggle('accordion--open');
    });
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
    accordion(mainBtns);
  } else {
    openAccordionMenu(mainBtns);
  }
};
const initAccordion = () => {
  if (accordionBtns) {
    onMobileShowFooterAccordionMenu(accordionBtns);
  }
};
// ////////////////  КОНЕЦ аккордион

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
// ////////////////  форма связи
const feedbackForm = document.querySelector('.feedback__form');
const showSuccessPopupMessage = (form) => {
  form.classList.add('form--sended');
  setTimeout(() => {
    form.classList.remove('form--sended');
  }, 750);
};

const initFeedbackForm = () => {
  if (feedbackForm) {
    const phoneInput = feedbackForm.querySelector('#form-tel');
    const nameInput = feedbackForm.querySelector('#form-name');

    const onSubmitFeadbackForm = () => {
      feedbackForm.addEventListener('submit', (evt) => {
        evt.preventDefault();
        localStorage.setItem('contactName', nameInput.value);
        localStorage.setItem('contactTel', phoneInput.value);
        feedbackForm.reset();
        showSuccessPopupMessage(feedbackForm);
      });
    };

    if (phoneInput) {
      ipnutTelHelperListener(phoneInput);
    }
    onSubmitFeadbackForm();
  }
};
// ////////////////  КОНЕЦ форма связи

// /////////////// модальное окно

const header = body.querySelector('.header');

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

const modal = document.querySelector('.modal');
const buttonOpenModal = document.querySelector('.modal-btn');

const initModalForm = () => {
  if (buttonOpenModal && modal) {
    const modalForm = modal.querySelector('.modal__form');
    const inputTelModalForm = modalForm.querySelector('#modal-form-tel');
    const inputNameModalForm = modalForm.querySelector('#modal-form-name');
    let bindHelpOnInputTel = helpOnInputTel.bind(null, inputTelModalForm);

    const closeModal = () => {
      modal.setAttribute('aria-hidden', 'true');
      unlockBody();
      modalForm.reset();
      document.removeEventListener('keydown', onEscKeydownCloseModal);
      document.removeEventListener('click', onClickAwayCloseModal);
      inputTelModalForm.removeEventListener('keydown', bindHelpOnInputTel);

      if (header) {
        header.setAttribute('aria-hidden', 'false');
      }
      if (footer) {
        footer.setAttribute('aria-hidden', 'false');
      }
    };

    const onBtnCloseModal = (btnClose) => {
      btnClose.addEventListener('click', (evt) => {
        evt.preventDefault();
        closeModal();
      }, {once: true});
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

      if (header) {
        header.setAttribute('aria-hidden', 'true');
      }
      if (footer) {
        footer.setAttribute('aria-hidden', 'true');
      }
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
      }, {once: true});
    };

    const onBtnShowModal = (btn) => {
      btn.addEventListener('click', (evt) => {
        evt.preventDefault();
        openModal();
        onSubmitModalFormSendData();
      });
    };

    onBtnShowModal(buttonOpenModal);
  }
};

// /////////////// КОНЕЦ модальное окно

document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('page--no-js');
  // аккордион в подвале на мобильном
  initAccordion();

  // форма обратной свзяи
  initFeedbackForm();

  // модальное окно
  initModalForm();
});
