'use strict';
const dataBase = JSON.parse(localStorage.getItem('awito'));


const modalAdd = document.querySelector('.modal__add'),
    addAd = document.querySelector('.add__ad'),
    modalBtnSubmit = document.querySelector('.modal__btn-submit'),
    modalSubmit = document.querySelector('.modal__submit'),
    catalog = document.querySelector('.catalog'),
    modalItem = document.querySelector('.modal__item'),
    modalBtnWarning = document.querySelector('.modal__btn-warning'),
    modalFileInput = document.querySelector('.modal__file-input'),
    modalFileBtn = document.querySelector('.modal__file-btn'),
    modalImgAdd = document.querySelector('.modal__image-add');

const textFileBtn = modalFileBtn.textContent;
const srcModalImg = modalImgAdd.src;


const elementsModalSubmit = [...modalSubmit.elements]
    .filter(elem => elem.tagName !== 'BUTTON');
const infoPhoto = {};

const saveDB = () => {
  localStorage.setItem('awito', JSON.stringify(dataBase));
};

const checkForm = () => {
    {
        const validForm = elementsModalSubmit.every(elem => elem.value);
        modalBtnSubmit.disabled = !validForm;
        modalBtnWarning.style.display = validForm ? 'none' : '';
    }
};



const closeModal = function (event) {
    const target = event.target;
    if (target.closest('.modal__close')
        || target === this) {
        this.classList.add('hide');
        modalSubmit.reset();

    };

    if (event.code === 'Escape') {
        modalAdd.classList.add('hide');
        modalItem.classList.add('hide');
        document.removeEventListener('keydown', closeModal);
        modalSubmit.reset();
        modalImgAdd.src = srcModalImg;
        modalFileBtn.textContent = textFileBtn;
        checkForm();
    }

};

const render =


modalFileInput.addEventListener('change', event => {
    const target = event.target;
    const reader = new FileReader();
    const  file = target.files[0];
    infoPhoto.filename = file.name;
    infoPhoto.size = file.size;

    reader.readAsBinaryString(file);
    reader.addEventListener('load', event => {
        if (infoPhoto.size < 200000) {
            modalFileBtn.textContent = infoPhoto.filename;
            infoPhoto.base64 = btoa(event.target.result);
            modalImgAdd.src = `data:image/jpeg;base6,${infoPhoto.base64}`
        } else {
            modalFileBtn.textContent = 'Ваш файл больше 200Kb';
        }
    })

});

modalSubmit.addEventListener('input', checkForm)

addAd.addEventListener('click', () => {
    modalAdd.classList.remove('hide');
    modalBtnSubmit.disabled = true;
    document.addEventListener('keydown', closeModal);
});

modalAdd.addEventListener('click',  closeModal);
modalItem.addEventListener('click',  closeModal);

catalog.addEventListener('click',  event => {
   const  target = event.target;
    if (target.closest('.card')) {
        modalItem.classList.remove('hide');
        document.addEventListener('keydown', closeModal);
    };
});

modalSubmit.addEventListener('submit', event => {
    event.preventDefault();
    const itemObj = {};
    for (const elem of elementsModalSubmit) {
        itemObj[elem.name] = elem.value;
    };
    itemObj.image = infoPhoto.base64;
    dataBase.push(itemObj);
    closeModal({target: modalAdd});
    modalSubmit.reset();
    saveDB();

})


