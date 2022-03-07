const books = [];
const RENDER_EVENT = "render-books";

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete){
    return{
        id,
        title,
        author, 
        year, 
        isComplete
    }
}

function findBook(bookId){
    for(bookItem of books){
        if(bookItem.id === bookId){
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId){
    for(index in books){
        if(books[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function makeBook(bookObject){
    const {id, title, author, year, isComplete} = bookObject;

    const textTitle = document.createElement("h3");
    textTitle.innerText = title;
    
    const authorTitle = document.createElement("p");
    authorTitle.innerText = `Penulis : ${bookObject.author}`;

    
    const yearTitle = document.createElement("p");
    yearTitle.innerText =`Tahun : ${bookObject.year}`;

    const action = document.createElement("div");
    action.classList.add("action");

    const article = document.createElement("article");
    article.classList.add("book_item");
    article.append(textTitle, authorTitle, yearTitle);
    article.setAttribute("id",`book-${id}`);
    

    if(bookObject.isComplete == true){
        const undoButton = document.createElement("button");
        undoButton.classList.add("undoBtn");
        undoButton.innerText = "Belum selesai dibaca";
        undoButton.addEventListener("click", function(){
            undoTaskFromCompleted(id);
        });

        const removeButton = document.createElement("button");
        removeButton.classList.add("deleteBtn");
        removeButton.innerText = "Hapus buku";
        removeButton.addEventListener("click", function(){
            const peringatan = confirm("Yakin ingin hapus?");
            if(peringatan){
                console.log("OK")
                removeTaskFromCompleted();
            }else{
                console.log("Batal")
            }
        });

        action.append(undoButton, removeButton);
        article.append(action);
    }else{
        const checkButton = document.createElement("button");
        checkButton.classList.add("doneBtn");
        checkButton.innerText="Sudah selesai dibaca";
        checkButton.addEventListener("click", function(){
            addTaskToCompleted(id);
        });

        const removeButton = document.createElement("button");
        removeButton.classList.add("deleteBtn");
        removeButton.innerText = "Hapus buku";
        removeButton.addEventListener("click", function(){
            const peringatan = confirm("Yakin ingin hapus?");
            if(peringatan){
                console.log("OK")
                removeTaskFromCompleted();
            }else{
                console.log("Batal")
            }
        });

        action.append(checkButton, removeButton);
        article.append(action);

    }

    return article;
}

function addBook(){
    const textBook = document.getElementById("inputBookTitle").value;
    const textAuthor = document.getElementById("inputBookAuthor").value;
    const textYear = document.getElementById("inputBookYear").value;
    const checklist = document.getElementById("inputBookIsComplete").checked;
    const generatedID = generateId();

    if(checklist){
        const bookObject = generateBookObject(generatedID, textBook, textAuthor, textYear, true );
        books.push(bookObject);    
    }else{
        const bookObject = generateBookObject(generatedID, textBook, textAuthor, textYear, false);
        books.push(bookObject);    
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addTaskToCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget == null) return;

    bookTarget.isComplete = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeTaskFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoTaskFromCompleted(bookId){
    const bookTarget = findBook(bookId);
    if(bookTarget === null) return;

    bookTarget.isComplete = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener("DOMContentLoaded", function(){
    const submitForm = document.getElementById("inputBook");

    submitForm.addEventListener("submit", function(ev){
        ev.preventDefault();
        addBook();
    });
    if(isStorageExist){
        loadDataFromStorage();
    }

});

document.addEventListener(RENDER_EVENT, function(){
    const uncompletdBookList = document.getElementById("incompleteBookshelfList");
    const completedBookList = document.getElementById("completeBookshelfList");

    uncompletdBookList.innerHTML = "";
    completedBookList.innerHTML = "";

    for(bookItem of books){
        const bookElement = makeBook(bookItem);
        if(bookItem.isComplete){
            completedBookList.append(bookElement);
        }else{
            uncompletdBookList.append(bookElement);
        }
    }
});

function saveData(){
    if(isStorageExist()){
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

const SAVED_BOOKS = 'saved-books';
const STORAGE_KEY = 'BOOKS_APPS';

function isStorageExist(){
    if(typeof(Storage)==="undefined"){
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

document.addEventListener(SAVED_BOOKS, function(){
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage(){
    const serializeData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializeData);

    if(data!=null){
        for(book of data){
            books.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

const searchBook = document.getElementById("searchSubmit");
searchBook.addEventListener("click", function(event){
    event.preventDefault();

    const inputTitle = document.getElementById("searchBookTitle").value.toLowerCase();
    const titleSearched = document.querySelectorAll('article');

    for(book of titleSearched){
        const title = book.firstElementChild.textContent.toLowerCase();

        if (title.indexOf(inputTitle) !== -1) {
            book.style.display = 'block';
        } else {
            book.style.display = 'none';
        }
    }
})