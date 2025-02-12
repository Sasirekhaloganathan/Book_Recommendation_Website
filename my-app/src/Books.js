import React, { Component } from 'react';
import SearchArea from './SearchArea';
import request from 'superagent';
import BookList from './BookList';

class Books extends Component {
    constructor(props){
        super(props);
        this.state = {
            books: [],
            searchField: '',
            userIDField: '',
            sort: ''
        }
    }

    searchBook = (e) => {
        e.preventDefault();
        if(this.state.searchField.length !== 0){
            request
            .get("https://www.googleapis.com/books/v1/volumes")
            .query({ q: this.state.searchField })
            .then((data) => {
                if(data.body.totalItems !== 0){
                    const cleanData = this.cleanData(data)
                    console.log(data)
                    this.setState({ books: cleanData })
                }
            })
        }
    }


    handleSearch = (e) => {
        this.setState({ searchField: e.target.value })
    }

    handleUserID = (e) => {
        this.setState({ userIDField: e.target.value })
    }

    handleSort = (e) => {
        this.setState({ sort: e.target.value })
        console.log(e.target.value)
    }

    cleanData = (data) => {
        console.log(data)
        const cleanedData = data.body.items.map((book) => {
            if(book.volumeInfo.hasOwnProperty('publishedDate') === false) {
                book.volumeInfo['publishedDate'] = '0000'
            }

            if(book.volumeInfo.hasOwnProperty('imageLinks') === false) {
                book.volumeInfo['imageLinks'] = {thumbnail : "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"}
            }

            if(book.volumeInfo.hasOwnProperty('title') === false) {
                book.volumeInfo['title'] = ""
            }

            if(book.volumeInfo.hasOwnProperty('authors') === false) {
                book.volumeInfo['authors'] = [ "No Author Available" ]
                
            }
            
            return book;
        })

        return cleanedData;
    }

    

    render() {
        console.log(this.state.books)
        const sortedBooks = this.state.books.sort((a, b) => {
            if(this.state.sort === "Newest") {
                return parseInt(b.volumeInfo.publishedDate.substring(0,4)) - parseInt(a.volumeInfo.publishedDate.substring(0,4));
            }
            else if(this.state.sort === "Oldest") {
                return parseInt(a.volumeInfo.publishedDate.substring(0,4)) - parseInt(b.volumeInfo.publishedDate.substring(0,4));
            }
            return this.state.books
        })
        return (
            <div>
                <SearchArea searchBook={this.searchBook} randomBook={this.randomBook} handleSearch={this.handleSearch} handleUserID={this.handleUserID} handleSort={this.handleSort}/>
                <BookList books={sortedBooks}/>
            </div>
        );
    }
}

export default Books;