function addZero(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function currentDate() {
    let d = new Date();
    let m = addZero(d.getMinutes());
    let h = addZero(d.getHours());
    let s = addZero(d.getSeconds());
    let today = d;
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = String(today.getMonth() + 1).padStart(2, "0");
    let yyyy = today.getFullYear();
    return yyyy + "-" + mm + "-" + dd;
    return today + " " + h + ":" + m + ":" + s;
}


module.exports = {currentDate};