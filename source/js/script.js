/* eslint-env es6 */
'use strict';


document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.remove('page--no-js');
  // headerMenu.classList.remove('header-menu--no-js');
  // headerMenu.classList.add('header-menu--closed');

});


// //////////////// аккордион
const footer = document.querySelector('.footer');
const accordionBtns = footer.querySelectorAll('.accordion__btn');

const addcordion = () => {
  accordionBtns.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      accordionBtns.forEach((btnj, j) => {
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

const openAccordionMenu = () => {
  accordionBtns.forEach(btn => {
    btn.parentElement.classList.remove('accordion--open');
  });
};

const closeAccordionMenu = () => {
  accordionBtns.forEach(btn => {
    btn.parentElement.classList.remove('accordion--open');
  });
};

if (window.matchMedia('(max-width: 767.9px)').matches) {
  closeAccordionMenu();
  addcordion();
} else {
  openAccordionMenu();
}
// ////////////////  КОНЕЦ аккордион
