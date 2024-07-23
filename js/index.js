document.addEventListener('DOMContentLoaded', function() {
  const listElement = document.getElementById('list');
  const showPanel = document.getElementById('show-panel');

  // Fetch and display list of books
  fetch('http://localhost:3000/books')
      .then(response => response.json())
      .then(books => {
          books.forEach(book => {
              const li = document.createElement('li');
              li.textContent = book.title;
              li.addEventListener('click', () => showBookDetails(book));
              listElement.appendChild(li);
          });
      });

  // Function to display book details
  function showBookDetails(book) {
      showPanel.innerHTML = ''; // Clear previous content

      const title = document.createElement('h2');
      title.textContent = book.title;
      showPanel.appendChild(title);

      const thumbnail = document.createElement('img');
      thumbnail.src = book.thumbnailUrl; // Assuming thumbnailUrl is a property of book
      thumbnail.alt = `${book.title} Thumbnail`;
      showPanel.appendChild(thumbnail);

      const description = document.createElement('p');
      description.textContent = book.description;
      showPanel.appendChild(description);

      const likedBy = document.createElement('ul');
      book.users.forEach(user => {
          const userLi = document.createElement('li');
          userLi.textContent = user.username;
          likedBy.appendChild(userLi);
      });
      showPanel.appendChild(likedBy);

      const likeButton = document.createElement('button');
      likeButton.textContent = 'LIKE';
      likeButton.addEventListener('click', () => handleLike(book));
      showPanel.appendChild(likeButton);
  }

  // Function to handle like/unlike button click
  function handleLike(book) {
      const currentUser = { id: 1, username: 'pouros' }; // Replace with actual current user data

      if (isLikedByCurrentUser(book, currentUser)) {
          // Unlike the book
          book.users = book.users.filter(user => user.id !== currentUser.id);
      } else {
          // Like the book
          book.users.push(currentUser);
      }

      updateBookDetails(book);
      sendPatchRequest(book);
  }

  // Function to check if the current user has liked the book
  function isLikedByCurrentUser(book, currentUser) {
      return book.users.some(user => user.id === currentUser.id);
  }

  // Function to update book details section with liked by users
  function updateBookDetails(book) {
      const likedBy = showPanel.querySelector('ul');
      likedBy.innerHTML = ''; // Clear previous likedBy list

      book.users.forEach(user => {
          const userLi = document.createElement('li');
          userLi.textContent = user.username;
          likedBy.appendChild(userLi);
      });
  }

  // Function to send PATCH request to update liked by users
  function sendPatchRequest(book) {
      const url = `http://localhost:3000/books/${book.id}`;
      fetch(url, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ users: book.users })
      })
      .then(response => response.json())
      .then(updatedBook => {
          // Handle response if needed
      })
      .catch(error => console.error('Error updating book:', error));
  }
});
