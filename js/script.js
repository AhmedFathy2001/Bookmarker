"use strict";
const siteName = document.getElementById('siteName');
const siteUrl = document.getElementById('siteUrl');
const tBody = document.getElementById('tBody');
const submitBtn = document.getElementById('submit');
const invalidUrl = document.getElementById('invalidUrl');
const invalidName = document.getElementById('invalidName');
const successGif = document.getElementById('successGif');
let siteNameValid;
let siteUrlValid;
let bookmarksList = [];
const reg = /^(ftp|http|https):\/\/[^ "]+$/;

//displays the data at the website load if there's any.
localStorage.getItem("bookmarksList") != null ? (bookmarksList = JSON.parse(localStorage.getItem("bookmarksList")), displayData()) : bookmarksList = [];

//adds a new bookmark then clears the form and displays the data on the screen
function addBookmark() {
    let bookmark = {
        name: siteName.value,
        url: siteUrl.value
    };
    bookmarksList.unshift(bookmark)
        // uncomment the next line and comment the above line to make bookmarks get put in the end of the array rather than the start
        //bookmarksList.push(bookmark);
    setInStorage();
    displayData();
    clearForm();
}
//displays inputted data if there's any
function displayData() {
    let data = ``;
    for (let i = 0; i < bookmarksList.length; i++) {
        data += `
        <tr>
            <td class = "w-75">${bookmarksList[i].name}</td>
            <td><a href="${bookmarksList[i].url}" class="btn btn-info" target="_blank">Visit</a></td>
            <td><button class="btn btn-danger" onclick=(deleteBookmark(${i}))>Delete</button></td>
        </tr>`;
    }
    tBody.innerHTML = data;
}
//validates the Site name
function siteNameValidation() {
    siteNameValid = siteName.value ? (siteName.classList.remove('is-invalid'), true) : (invalidName.innerText = invalidName.innerText = "Please enter a bookmark name.", siteName.classList.add('is-invalid', false));
    if (siteNameValid) {
        for (let i = 0; i < bookmarksList.length; i++) {
            if (siteName.value.toLowerCase() == bookmarksList[i].name.toLowerCase()) {
                siteName.classList.add('is-invalid');
                invalidName.innerText = "Bookmark name already exists.";
                siteNameValid = false;
                return siteNameValid;
            } else {
                siteNameValid = true;
            }
        }
    }
}
//validates the Site URL
function siteUrlValidation() {
    siteUrlValid = reg.test(siteUrl.value.toLowerCase()) ? (siteUrl.classList.remove('is-invalid'), true) : (invalidUrl.innerText = "Please enter a valid URL. Example: Https://www.domainname.com", siteUrl.classList.add('is-invalid'));

}
//validates if both the url and name are valid, adds the bookmark
function validationChecker() {
    if (siteNameValid && siteUrlValid) {
        successGif.classList.replace('d-none', 'successoverlay');
        document.getElementById('successGifParent').classList.replace('d-none', 'd-flex');
        setTimeout(() => addBookmark(), 500);
        setTimeout(function() {
            successGif.classList.replace('successoverlay', 'd-none');
            document.getElementById('successGifParent').classList.replace('d-flex', 'd-none');
        }, 1200);
    }
}
//adds the input to the local storage
function setInStorage() {
    localStorage.setItem('bookmarksList', JSON.stringify(bookmarksList));
}
//deletes bookmark from the local storage and the array of the data then displays it
function deleteBookmark(index) {
    bookmarksList.splice(index, 1);
    setInStorage();
    displayData();
}
//clears the input form after submition
function clearForm() {
    siteName.value = '';
    siteUrl.value = '';
}

//Button event listener, validates if the input data is valid to be submitted and displays a success gif otherwise throws a validation error message
submitBtn.addEventListener('click', () => {
    siteNameValidation();
    siteUrlValidation();
    validationChecker()
});
//Event listeners to listen to the Enter key to go to the next action
siteName.addEventListener('keyup', e => {
    e.stopPropagation()
    if (e.code == 'Enter') {
        siteUrl.focus();
    }
});
[window, siteUrl].forEach(element =>
    element.addEventListener('keyup', e => {
        e.stopPropagation()
        if (e.code == 'Enter') {
            submitBtn.focus();
            submitBtn.click();
        }
    })
);