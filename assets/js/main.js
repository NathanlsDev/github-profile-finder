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

const paths = username => {
  const endPoint = `https://api.github.com/users/${username}`;
  getGithubUserData(endPoint);
};

const fetchGitHubUser = async endPoint => {
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

const getGithubUserData = async endPoint => {
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

  title.textContent = `${name !== "null" ? name : `Uninformed`}`;
  biography.textContent = `${bio || `Uninformed`}`;
  onGitHubSince.textContent = formatDate(created_at);
  corp.textContent = `${company || `Uninformed`}`;

  livesIn.textContent = `${userLocation || `Uninformed`}`;
  userFollowing.textContent = `Following: ${formatValue(following)}`;
  userFollowers.textContent = `Followers: ${formatValue(followers)}`;
  publicRepos.textContent = `Public Repos: ${public_repos}`;

  seeProfile.setAttribute("href", html_url);
  seeProfile.setAttribute("target", "_blank");
  seeProfile.textContent = `${"See Profile"}`;

  safeHistory();
  stylesHandler();
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

  if (pastResearchProfiles.length <= 5 && !idAlreadyExists) {
    pastResearchProfiles.unshift(userData);
    historySection.prepend(createdItem());
    dataHolder(userData);
  }

  if (pastResearchProfiles.length === 6) {
    pastResearchProfiles.pop();
  }

  if (historySection.children.length === 6) {
    historySection.removeChild(historySection.lastElementChild);
  }
};

createdItem = () => {
  const item = document.createElement("li");
  const imgContainer = document.createElement("figure");
  const image = document.createElement("img");
  const title = document.createElement("h4");
  const paragraph = document.createElement("p");
  const link = document.createElement("a");

  item.id = id;
  item.appendChild(imgContainer);
  item.appendChild(title);
  item.appendChild(paragraph);
  item.appendChild(link);
  imgContainer.appendChild(image);

  item.setAttribute("tabindex", "0");
  image.setAttribute("src", avatar_url);
  image.setAttribute("alt", `${name} profile photo.`);
  link.setAttribute("href", html_url);
  link.setAttribute("target", "_blank");

  title.textContent = `${name !== "null" ? name : `Uninformed`}`;
  paragraph.textContent = `${bio || `Uninformed`}`;
  link.classList.add("secondary-btn");
  link.textContent = `Profile`;

  return item;
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

  title.textContent = `${
    clickedUser.name !== "null" ? clickedUser.name : `Uninformed`
  }`;
  biography.textContent = `${clickedUser.bio || `Uninformed`}`;
  onGitHubSince.textContent = formatDate(clickedUser.created_at);
  corp.textContent = `${clickedUser.company || `Uninformed`}`;
  livesIn.textContent = `${clickedUser.location || `Uninformed`}`;
  userFollowing.textContent = `Following: ${clickedUser.following}`;
  userFollowers.textContent = `Followers: ${formatValue(clickedUser.followers)}`;
  publicRepos.textContent = `Public Repos: ${formatValue(clickedUser.public_repos)}`;
  seeProfile.setAttribute("href", clickedUser.html_url);
  backToTop();
});

const dataHolder = data => {
  const userData = JSON.parse(localStorage.getItem("userData")) || [];

  if (userData.length < 5) {
    userData.unshift(data);
  } else {
    userData.pop();
    userData.unshift(data);
  }

  localStorage.setItem("userData", JSON.stringify(userData));
};

const formatDate = date => {
  const createdAt = new Date(date);
  return createdAt.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

form.addEventListener("submit", event => {
  event.preventDefault();

  const username = form.searchBar.value;
  paths(username);

  form.reset();
  form.searchBar.focus();
  backToTop();
});

const backToTop = () => {
  scrollTo(0, 0);
};

const stylesHandler = () => {
  const presentation = document.querySelector(".user-presentation");
  const userStats = document.querySelector(".user-stats");
  const userHistory = document.querySelector(".users-history");
  const main = document.querySelector(".initial-state");

  main.classList.remove("initial-state");
  presentation.classList.remove("disabled");
  userStats.classList.remove("disabled");
  userHistory.classList.remove("disabled");
};

const formatValue = number => {
  if (number >= 100000) {
    const value = Math.floor(number / 1000);
    const fraction = Math.floor((number % 1000) / 100);
    return fraction === 0 ? value + "k" : value + "." + fraction + "k";
  }
  if (number >= 1000) {
    const value = Math.floor(number / 100) / 10;
    return value + "k";
  }
  return number.toString();
};
