function showToastMessage(id, messageBody = 'Nhịp tim không ổn!') {
    const toast = document.getElementById(id);
    console.log({toast});
    toast.style.display = 'flex';
    const messageTag = toast.getElementsByClassName('toast__msg')[0]
    messageTag.innerText = messageBody;

    toast.onclick = function (evt) {
        if (evt.target.closest('.fa-times')) {
            toast.style.display = 'none';
        }
    }
}
function closeToastMessage(id){
    const toast = document.getElementById(id);
    console.log({toast});
    toast.style.display = 'none';
}
export { showToastMessage, closeToastMessage }