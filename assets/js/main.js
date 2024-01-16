const searchBar = document.querySelector("#searchBar");
const button = document.querySelector("#button");

const fetchGitHubUser = async (username) => {
  const response = await fetch(`https://api.github.com/users/${username}`);
  return response.json();
};

const getGithubUserData = async (username) => {
  const userData = await fetchGitHubUser(username);
  renderUserDataIntoDom(
    ({
      avatar_url,
      name,
      bio,
      company,
      location: userLocation,
      created_at,
      followers,
      following,
      public_repos,
    } = userData)
  );
};

const renderUserDataIntoDom = () => {
  const avatarProfile = document.createElement("img");
  avatarProfile.setAttribute("src", avatar_url);
  document.body.appendChild(avatarProfile);

  const username = document.createElement("h3");
  username.textContent = `${name}`;
  document.body.appendChild(username);

  const biography = document.createElement("p");
  biography.textContent = `${bio}`;
  document.body.appendChild(biography);

  const corp = document.createElement("p");
  corp.textContent = `${company}`;
  document.body.appendChild(corp);

  const liveIn = document.createElement("p");
  liveIn.textContent = `${userLocation}`;
  document.body.appendChild(liveIn);

  const onGitHubSince = document.createElement("p");
  onGitHubSince.textContent = `${created_at}`;
  document.body.appendChild(onGitHubSince); //formatar data

  const userFollowing = document.createElement("p");
  userFollowing.textContent = `${following}`;
  document.body.appendChild(userFollowing);

  const userFollowers = document.createElement("p");
  userFollowers.textContent = `${followers}`;
  document.body.appendChild(userFollowers);

  const publicRepos = document.createElement("p");
  publicRepos.textContent = `${public_repos}`;
  document.body.appendChild(publicRepos);
};

button.addEventListener("click", () => {
  getGithubUserData(searchBar.value);
});
