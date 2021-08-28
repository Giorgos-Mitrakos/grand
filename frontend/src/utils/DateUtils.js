export const convertDate = (x) => {
    const options = {
        year: 'numeric', month: 'numeric', day: 'numeric',
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
    }
    const dateTimeFormat = new Intl.DateTimeFormat('en-GB', options);
    var date = Date.parse(x);
    return dateTimeFormat.format(date);
}