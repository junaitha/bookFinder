let searchButton = document.getElementById('searchButton');
let searchInput = document.getElementById('searchInput');
let searchResult = document.getElementById('searchResult');
let loader = document.getElementById('booksLoading');

function loadData(query) {
    $.ajax({
        url: `https://www.googleapis.com/books/v1/volumes?q= ` + query,
    }).done(function (response) {
        if (response.items && response.items.length) {
            response.items.forEach(function (book) {
                let temp = $('#cardTemplate').html();
                let data = {
                    title: book.volumeInfo.title ? book.volumeInfo.subtitle ? book.volumeInfo.title + ' - ' + book.volumeInfo.subtitle : book.volumeInfo.title : '',
                    imgUrl: `http://books.google.com/books/content?id=` + book.id + `&printsec=frontcover&img=1&zoom=1&source=gbs_api`,
                    author: book.volumeInfo.authors ? book.volumeInfo.authors.reduce(function (result, author) {
                        if (result) {
                            result += ', ' + author;
                        } else {
                            result += author;
                        }
                        return result;
                    }, '') : book.volumeInfo.title,
                    publishedDate: book.volumeInfo.publishedDate ? book.volumeInfo.publishedDate : '',
                    readUrl: book.accessInfo.webReaderLink ? book.accessInfo.webReaderLink : '',
                    buyUrl: book.saleInfo.buyLink ? book.saleInfo.buyLink : '',
                    previewUrl: book.volumeInfo.previewLink ? book.volumeInfo.previewLink : '',
                    isPublishedDate: book.volumeInfo.publishedDate ? ' ' : 'hidden',
                    isReadUrl: book.accessInfo.webReaderLink ? ' ' : 'hidden',
                    isBuyUrl: book.saleInfo.buyLink ? ' ' : 'hidden'
                }
                let html = Mustache.render(temp, data)
                $(searchResult).find('#orderedList').append(html);
            });
        }
    }).fail(function (error, err) {
        alert(JSON.parse(error.responseText).error.message);

    }).always(function () {
        if (!$(loader).hasClass('hide')) {
            $(loader).addClass('hide');
            $(loader).removeClass('show');
        }
    });
}

searchButton.addEventListener('click', function (event) {
    event.preventDefault();
    if ($(searchInput).val() !== '') {
        $(searchResult).find('#orderedList').children().remove();
        if ($(loader).hasClass('hide')) {
            $(loader).removeClass('hide');
            $(loader).addClass('show');
        }
        loadData($(searchInput).val());
    } else {
        alert('Please enter title or author name or keyword to search for books')
    }

});

$(searchInput).on('keypress', function (e) {
    let key = e.which;
    if(key == 13) {
        e.preventDefault();
        $(searchButton).trigger('click');
    }

});

window.onload = function() {
    if (searchInput && $(searchInput).val() !== '') {
        loadData($(searchInput).val());
    }
}
   