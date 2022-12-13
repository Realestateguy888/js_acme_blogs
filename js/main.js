 function createElemWithText(nameOfElToBeCreated = "p", textContentOfCreatedEl = "", className = "") {

        let newlyCreatedElWithText = document.createElement(nameOfElToBeCreated);

        newlyCreatedElWithText.textContent = textContentOfCreatedEl;

        newlyCreatedElWithText.className = className;

        return newlyCreatedElWithText;
      }

      console.log(createElemWithText("p", "Newly created paragraph or p element."));
      console.log(createElemWithText("h1", "Newly created h1 or heading element.", "h1class"));
      console.log(createElemWithText("div", "Newly created div element.", "divclass"));
      console.log(createElemWithText("h3", "Newly created h3 element."));



function createSelectOptions(users){
    if(users === undefined || users  === null){
        return undefined
    }

    optionArray = []

    for(user of users){
        console.log(user)
        var opt = document.createElement('option');
        opt.value = user.id;
        opt.innerHTML = user.name;
        optionArray.push(opt);

    }
  
    return optionArray

}



   function toggleCommentSection(postId) {
  if (!postId) {
    return undefined;
  } else {
    const commentSection = document.querySelector(`[data-post-id="${postId}"]`);
    if (commentSection) {
      commentSection.classList.toggle('hide');
      return commentSection;
    } else {
      return null;
    }
  }   
}




function toggleCommentButton (postID) {

  if (!postID) {
    return;
  }

  const btnSelectedEl = document.querySelector(`button[data-post-id = "${postID}"`);

  if (btnSelectedEl != null) {
    btnSelectedEl.textContent === "Show Comments" ? (btnSelectedEl.textContent = "Hide Comments") : (btnSelectedEl.textContent = "Show Comments");
  }

  return btnSelectedEl;
};



function deleteChildElements(parentElement) {
  if (!parentElement || !(parentElement instanceof HTMLElement)) {
    return undefined;
  }

  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}

let parentElement = document.getElementById('container');
deleteChildElements(parentElement);




function addButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  if (buttons.length > 0) {
    buttons.forEach((button) => {
      const postId = button.dataset.postId;
      button.addEventListener('click', (event) => {
        toggleComments(event, postId);
      });
    });
  }
  return buttons;
}

function toggleComments(event, postId) {
}



function removeButtonListeners() {
  const buttons = document.querySelectorAll('main button');
  buttons.forEach((button) => {
    const postId = button.dataset.postId;
    button.removeEventListener('click', (event) => {
      toggleComments(event, postId);
    });
  });
  return buttons;
}



function createComments(commentsData) {
  if (!commentsData) {
    return undefined;
  }

  const fragment = document.createDocumentFragment();
  commentsData.forEach((comment) => {
    const article = document.createElement('article');
    const h3 = createElemWithText('h3', comment.name);
    const p1 = createElemWithText('p', comment.body);
    const p2 = createElemWithText('p', `From: ${comment.email}`);
    article.append(h3, p1, p2);
    fragment.append(article);
  });
  return fragment;
}



function populateSelectMenu(usersData) {
  if (!usersData) {
    return undefined;
  }

  const selectMenu = document.querySelector('#selectMenu');
  const options = createSelectOptions(usersData);
  options.forEach((option) => {
    selectMenu.append(option);
  });
  return selectMenu;
}



async function getUsers() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}


async function getUserPosts(userId) {
  if (!userId) {
    return undefined;
  }

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}




async function getUser(userId) {
  if (!userId) {
    return undefined;
  }

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}



async function getPostComments(postId) {
  if (!postId) {
    return undefined;
  }

  try {
    const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${postId}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}



async function displayComments(postId) {
  if (!postId) {
    return undefined;
  }

  const section = document.createElement('section');
  section.dataset.postId = postId;
  section.classList.add('comments', 'hide');
  const comments = await getPostComments(postId);
  const fragment = createComments(comments);
  section.append(fragment);
  return section;
}



async function createPosts(posts) {
  if (!posts) {
    return undefined;
  }

  const fragment = document.createDocumentFragment();
  for (const post of posts) {
    const article = document.createElement('article');
    const h2 = createElemWithText('h2', post.title);
    const p1 = createElemWithText('p', post.body);
    const p2 = createElemWithText('p', `Post ID: ${post.id}`);
    const author = await getUser(post.userId);
    const p3 = createElemWithText('p', `Author: ${author.name} with ${author.company.name}`);
    const p4 = createElemWithText('p', author.company.catchPhrase);
    const button = createElemWithText('button', 'Show Comments');
    button.dataset.postId = post.id;
    article.append(h2, p1, p2, p3, p4, button);
    const section = await displayComments(post.id);
    if (section) {
      article.append(section);
    }
    fragment.append(article);
  }
  return fragment;
}



async function displayPosts(postsData) {
  const main = document.querySelector('main');
  let element;
  if (postsData) {
    element = await createPosts(postsData);
  } else {
    element = createElemWithText('p', 'No posts to display.');
  }
  main.append(element);
  return element;
}



function toggleComments(event, postId) {
  if (!event || !postId) return;

  event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);
  return [section, button];
}



async function refreshPosts(postsData) {
  if (!postsData) return;

  const removeButtons = removeButtonListeners();
  const main = deleteChildElements(document.querySelector('main'));
  const fragment = await displayPosts(postsData);
  const addButtons = addButtonListeners();
  return [removeButtons, main, fragment, addButtons];
}



async function selectMenuChangeEventHandler(event) {
  if (!event) return;

  const getUserPostsResponse = await fetch('/api/user-posts');
  const refreshPostsResponse = await fetch('/api/refresh-posts');

  event.target.disabled = true;

  const userId = event.target.value || 1;

  const userPosts = await getUserPostsResponse.json();
  const posts = userPosts.filter(post => post.userId === userId);

  const refreshPostsArray = await refreshPostsResponse.json();

  event.target.disabled = false;

  return [userId, posts, refreshPostsArray];
}



async function initPage() {
  const getUsers = await fetch('/api/users');
  const populateSelectMenu = (users) => {
  };

  const users = await getUsers();

  const select = populateSelectMenu(users);

  return [users, select];
}



function initApp(){
    initPage();
    let select = document.getElementById("selectMenu");
    select.addEventListener("change", selectMenuChangeEventHandler, false);
}

document.addEventListener("DOMContentLoaded", initApp, false);
