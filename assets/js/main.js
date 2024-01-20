const form = document.querySelector("form");

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
  const avatarProfile = document.createElement("img");
  avatarProfile.setAttribute("src", avatar_url);
  document.body.appendChild(avatarProfile);

  const username = document.createElement("h1");
  username.textContent = `${name}`;
  document.body.appendChild(username);

  const biography = document.createElement("p");
  biography.textContent = `${bio}`;
  document.body.appendChild(biography);
  
  const onGitHubSince = document.createElement("p");
  onGitHubSince.textContent = `${created_at}`;
  document.body.appendChild(onGitHubSince); //formatar data

  const corp = document.createElement("p");
  corp.textContent = `${company}`;
  document.body.appendChild(corp);

  const liveIn = document.createElement("p");
  liveIn.textContent = `${userLocation}`;
  document.body.appendChild(liveIn);

  const userFollowing = document.createElement("p");
  userFollowing.textContent = `${following}`;
  document.body.appendChild(userFollowing);

  const userFollowers = document.createElement("p");
  userFollowers.textContent = `${followers}`;
  document.body.appendChild(userFollowers);

  const publicRepos = document.createElement("p");
  publicRepos.textContent = `${public_repos}`;
  document.body.appendChild(publicRepos);

  const seeProfile = document.createElement("a");
  seeProfile.setAttribute("href", html_url);
  seeProfile.setAttribute("target", "_blank");
  seeProfile.textContent = `${"Ver Perfil"}`;
  document.body.appendChild(seeProfile);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const username = form.searchBar.value;
  paths(username);
  
  form.reset();
  form.searchBar.focus(); 
});
