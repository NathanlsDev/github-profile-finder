const historySection = document.querySelector('[data-js="research-history"]');
const form = document.querySelector("form");

const userPhoto = document.querySelector('[data-js="user-photo"]');
const title = document.querySelector('[data-js="username"]');
const biography = document.querySelector('[data-js="biography"]');
const onGitHubSince = document.querySelector('[data-js="onGitHubSince"]');
const corp = document.querySelector('[data-js="company"]');
const livesIn = document.querySelector('[data-js="location"]');
const userFollowing = document.querySelector('[data-js="userFollowing"]');
const userFollowers = document.querySelector('[data-js="userFollowers"]');
const publicRepos = document.querySelector('[data-js="publicRepos"]');
const seeProfile = document.querySelector('[data-js="profileLink"]');

const pastResearchProfiles = [];
const userData = [];

const paths = (username) => {
  const endPoint = `https://api.github.com/users/${username}`;
  getGithubUserData(endPoint);
};

const fetchGitHubUser = async (endPoint) => {
  try {
    const response = await fetch(endPoint);
    if (!response.ok) {
      throw new Error(`can't find your user profile`);
    }
    return response.json();
  } catch ({ name, message }) {
    console.log(`${name}: ${message}`);
  }
};

const getGithubUserData = async (endPoint) => {
  const userData = await fetchGitHubUser(endPoint);
  renderUserDataIntoDom(
    ({
      id,
      avatar_url,
      name,
      bio,
      company,
      location: userLocation,
      created_at,
      followers,
      following,
      public_repos,
      html_url,
    } = userData)
  );
};

const renderUserDataIntoDom = () => {
  userPhoto.setAttribute("src", avatar_url);
  userPhoto.setAttribute("alt", `${name} profile photo`);

  title.textContent = `${name}`;
  biography.textContent = `${bio}`;
  onGitHubSince.textContent = formatDate(created_at);
  corp.textContent = `${company}`;
  livesIn.textContent = `${userLocation}`;
  userFollowing.textContent = `${following}`;
  userFollowers.textContent = `${followers}`;
  publicRepos.textContent = `${public_repos}`;

  seeProfile.setAttribute("href", html_url);
  seeProfile.setAttribute("target", "_blank");
  seeProfile.textContent = `${"See Profile"}`;

  safeHistory();
};

const safeHistory = () => {
  const userData = {
    id,
    avatar_url,
    name,
    bio,
    company,
    location: userLocation,
    created_at,
    followers,
    following,
    public_repos,
    html_url,
  };

  const idAlreadyExists = pastResearchProfiles.some(
    (researchedUser) => researchedUser.id === userData.id
  );

  const item = document.createElement("li");
  const imgContainer = document.createElement("figure");
  const image = document.createElement("img");
  const title = document.createElement("h4");
  const paragraph = document.createElement("p");
  const link = document.createElement("a");

  if (pastResearchProfiles.length <= 5 && !idAlreadyExists) {
    pastResearchProfiles.unshift(userData);
    item.id = id;
    item.appendChild(imgContainer);
    item.setAttribute("tabindex", "0");
    imgContainer.appendChild(image);
    image.setAttribute("src", avatar_url);
    image.setAttribute("alt", `${name} profile photo.`);
    item.appendChild(title);
    title.textContent = name;
    item.appendChild(paragraph);
    paragraph.textContent = bio;
    item.appendChild(link);
    link.classList.add("secondary-btn");
    link.setAttribute("href", html_url);
    link.setAttribute("target", "_blank");
    link.textContent = `Profile`;
    historySection.prepend(item);

    dataHolder(userData);
  }

  if (pastResearchProfiles.length === 6) {
    pastResearchProfiles.pop();
  }

  if (historySection.children.length === 6) {
    historySection.removeChild(historySection.lastElementChild);
  }
};

historySection.addEventListener("click", ({ target }) => {
  let elementId = null;

  if (target.nodeName === "LI") {
    elementId = target.id;
  }

  if (target.nodeName === "IMG") {
    elementId = target.parentNode.parentNode.id;
  }

  const storageData = localStorage.getItem("userData");
  const parsedData = JSON.parse(storageData);
  const clickedUser = parsedData.find((obj) => obj.id === Number(elementId));

  userPhoto.setAttribute("src", clickedUser.avatar_url);
  userPhoto.setAttribute("alt", `${clickedUser.name} profile photo`);

  title.textContent = `${clickedUser.name}`;
  biography.textContent = `${clickedUser.bio}`;
  onGitHubSince.textContent = formatDate(clickedUser.created_at);
  corp.textContent = `${clickedUser.company}`;
  livesIn.textContent = `${clickedUser.location}`;
  userFollowing.textContent = `${clickedUser.following}`;
  userFollowers.textContent = `${clickedUser.followers}`;
  publicRepos.textContent = `${clickedUser.public_repos}`;

  seeProfile.setAttribute("href", clickedUser.html_url);
  seeProfile.setAttribute("target", "_blank");
  seeProfile.textContent = `${"See Profile"}`;
  backToTop();
});

const dataHolder = (data) => {
  const userData = JSON.parse(localStorage.getItem("userData")) || [];

  if (userData.length < 5) {
    userData.unshift(data);
  } else {
    userData.pop();
    userData.unshift(data);
  }

  localStorage.setItem("userData", JSON.stringify(userData));
};

const formatDate = (date) => {
  const createdAt = new Date(date);
  return createdAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = form.searchBar.value;
  paths(username);

  backToTop();
  form.reset();
  form.searchBar.focus();
});

const backToTop = () => {
  scrollTo(0, 0);
};
