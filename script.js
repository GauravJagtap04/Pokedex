const inputValue = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const linesIcon = document.getElementById("display1-icon");
const display1 = document.getElementById("display1-container");
const keypadButtons = document.querySelectorAll(".keypad-btn");
const shift = document.getElementById("shift");
const clear = document.getElementById("clear");
const next = document.getElementById("next");
const back = document.getElementById("back");
const pokemonInfo = document.getElementById("pokemon-info");
const favouriteBtn = document.getElementById("favourite-btn");
const favouriteList = document.getElementById("favourite-list");
const upNav = document.querySelectorAll(".up-nav");
const downNav = document.querySelectorAll(".down-nav");
const rightNav = document.querySelectorAll(".right-nav");
const leftNav = document.querySelectorAll(".left-nav");
const lhsRedBtn = document.querySelector("#first-btn");
const lhsBlueBtn = document.querySelector("#second-btn");

const imageField = document.getElementById("pokemon-image");
const nameField = document.getElementById("pokemon-name");
const idField = document.getElementById("pokemon-id");
const typeField = document.getElementById("types");
const weightField = document.getElementById("weight");
const heightField = document.getElementById("height");
const hpField = document.getElementById("hp");
const attackField = document.getElementById("attack");
const defenseField = document.getElementById("defense");
const specialAttackField = document.getElementById("special-attack");
const specialDefenseField = document.getElementById("special-defense");
const speedField = document.getElementById("speed");

let favouriteArr = [];

let shiftValue = 0;
let currentKey = null;
let currentTimeout = null;
let arrRepMap = {};
let currFavSel = 0;

clear.addEventListener("click", () => {
  inputValue.value = "";
});

shift.addEventListener("click", () => {
  shiftValue = shiftValue === 0 ? 1 : 0;
  currentKey = null;
  clearTimeout(currentTimeout);
  shift.classList.toggle("transformed");
});

next.addEventListener("click", () => {
  let currId = Number(idField.textContent.slice(1));

  currId++;
  fetchPokemonData(currId);
});

back.addEventListener("click", () => {
  let currId = Number(idField.textContent.slice(1));

  if (currId >= 1) {
    currId--;
  } else {
    alert("Currently at ID #1");
  }

  fetchPokemonData(currId);
});

favouriteBtn.addEventListener("click", () => {
  let currId = Number(idField.textContent.slice(1));
  let currPokemon = String(nameField.textContent);

  if (currId !== 0) {
    if (!favouriteArr.some((item) => item[0] === currId)) {
      favouriteArr.push([currId, currPokemon]);
    } else {
      alert(`${currPokemon} already in favourite list.`);
      return;
    }
  } else {
    alert("No Pokémon selected.");
    return;
  }

  console.log(favouriteArr);
});

keypadButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const numericValue = button.querySelector(".number").textContent;
    const alphabeticValue = button.querySelector(".alphabet").textContent;
    const arr = alphabeticValue.split("");

    if (shiftValue === 0) {
      inputValue.value += numericValue;
      currentKey = null;
      clearTimeout(currentTimeout);
    } else {
      if (currentKey === numericValue) {
        arrRepMap[numericValue] = (arrRepMap[numericValue] + 1) % arr.length;
      } else {
        arrRepMap[numericValue] = 0;
        currentKey = numericValue;
      }

      if (inputValue.value.endsWith(arr[arrRepMap[numericValue] - 1])) {
        inputValue.value = inputValue.value.slice(0, -1);
      }

      inputValue.value += arr[arrRepMap[numericValue]];

      clearTimeout(currentTimeout);
      currentTimeout = setTimeout(() => {
        currentKey = null;
      }, 1000);
    }
  });
});

const setFavicon = (iconPath) => {
  const favicon = document.getElementById("favicon");
  if (favicon) {
    favicon.href = iconPath;
  }
};

const fetchPokemonData = async (pokemonName) => {
  try {
    if (!inputValue.value) {
      alert("Please enter a Pokémon name.");
      return;
    }

    pokemonInfo.style.display = "flex";
    imageField.style.display = "flex";
    favouriteList.style.display = "none";
    pokemonInfo.style.width = "50%";
    imageField.style.width = "50%";
    favouriteList.style.width = "0%";

    typeField.innerHTML = "";
    const apiUrl = `https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/${pokemonName}`;

    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(`Network response was not ok. Status ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    typeField.textContent = "";

    const pokemonTypes = data.types.map((type) => type.type.name.toUpperCase());
    pokemonTypes.forEach((type) => {
      const typeElement = document.createElement("div");
      typeElement.textContent = type;
      typeField.appendChild(typeElement);
    });

    imageField.innerHTML = `<img id="sprite" src="${data.sprites.front_default}" alt="pokemon-image" style="max-width: 100%; max-height: 100%; object-fit: contain;">`;
    nameField.innerHTML = `${data.name.toUpperCase()}`;
    idField.innerHTML = `#${data.id}`;
    weightField.innerHTML = `Weight: ${data.weight}`;
    heightField.innerHTML = `Height: ${data.height}`;
    hpField.innerHTML = `${data.stats[0].base_stat}`;
    attackField.innerHTML = `${data.stats[1].base_stat}`;
    defenseField.innerHTML = `${data.stats[2].base_stat}`;
    specialAttackField.innerHTML = `${data.stats[3].base_stat}`;
    specialDefenseField.innerHTML = `${data.stats[4].base_stat}`;
    speedField.innerHTML = `${data.stats[5].base_stat}`;
  } catch (error) {
    console.error("Error fetching Pokémon data: ", error);
    alert("Pokémon not found");
  } finally {
    setFavicon("");
  }
};

linesIcon.addEventListener("click", () => {
  if (!favouriteArr.length) {
    alert("No favourite Pokémon");
    return;
  }

  pokemonInfo.style.display =
    pokemonInfo.style.display === "none" ? "flex" : "none";
  imageField.style.display =
    imageField.style.display === "none" ? "flex" : "none";
  favouriteList.style.display =
    favouriteList.style.display === "flex" ? "none" : "flex";

  favouriteList.innerHTML = favouriteArr
    .map((item) => `<li id=${item[0]}>${item[1]}</li>`)
    .join("");

  favouriteList.addEventListener("click", (event) => {
    const li = event.target.closest("li");
    if (li) {
      const index = Array.from(favouriteList.children).indexOf(li);
      fetchPokemonData(favouriteArr[index][0]);
    }
  });

  if (
    pokemonInfo.style.display === "none" &&
    imageField.style.display === "none" &&
    favouriteList.style.display === "flex"
  ) {
    pokemonInfo.style.width = "0%";
    imageField.style.width = "0%";
    favouriteList.style.width = "100%";
  } else if (
    pokemonInfo.style.display === "flex" &&
    imageField.style.display === "flex" &&
    favouriteList.style.display === "none"
  ) {
    pokemonInfo.style.width = "50%";
    imageField.style.width = "50%";
    favouriteList.style.width = "0%";
  }
});

searchBtn.addEventListener("click", () => {
  fetchPokemonData(inputValue.value.toLowerCase());
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    searchBtn.click();
  }
});

downNav.forEach((element) => {
  element.addEventListener("click", () => {
    const currentActive = favouriteList.querySelector(".active");
    if (currentActive) {
      currentActive.classList.remove("active");
      const nextElement = currentActive.nextElementSibling;
      if (nextElement) {
        nextElement.classList.add("active");
      } else {
        favouriteList.firstElementChild.classList.add("active");
      }
    } else {
      favouriteList.firstElementChild.classList.add("active");
    }
  });
});

upNav.forEach((element) => {
  element.addEventListener("click", () => {
    const currentActive = favouriteList.querySelector(".active");
    if (currentActive) {
      currentActive.classList.remove("active");
      const prevElement = currentActive.previousElementSibling;
      if (prevElement) {
        prevElement.classList.add("active");
      } else {
        favouriteList.lastElementChild.classList.add("active");
      }
    } else {
      favouriteList.lastElementChild.classList.add("active");
    }
  });
});

rightNav.forEach((element) => {
  element.addEventListener("click", () => {
    const currentActive = favouriteList.querySelector(".active");
    if (currentActive) {
      fetchPokemonData(currentActive.id);
    } else {
      alert("No Pokémon selected");
    }
  });
});

leftNav.forEach((element) => {
  element.addEventListener("click", () => {
    const currentActive = favouriteList.querySelector(".active");
    if (currentActive) {
      const activeId = Number(currentActive.id);
      favouriteArr = favouriteArr.filter((item) => item[0] !== activeId);
      favouriteList.innerHTML = favouriteArr
        .map((item) => `<li id=${item[0]}>${item[1]}</li>`)
        .join("");

      if (!favouriteArr.length) {
        pokemonInfo.style.display = "flex";
        imageField.style.display = "flex";
        favouriteList.style.display = "none";
        pokemonInfo.style.width = "50%";
        imageField.style.width = "50%";
        favouriteList.style.width = "0%";
        alert("No Pokémon in favourite list");
      }
    } else {
      alert("No Pokémon selected");
    }
  });
});

lhsRedBtn.addEventListener("click", () => {
  const currentActive = favouriteList.querySelector(".active");
  if (currentActive) {
    const activeId = Number(currentActive.id);
    favouriteArr = favouriteArr.filter((item) => item[0] !== activeId);
    favouriteList.innerHTML = favouriteArr
      .map((item) => `<li id=${item[0]}>${item[1]}</li>`)
      .join("");

    if (!favouriteArr.length) {
      pokemonInfo.style.display = "flex";
      imageField.style.display = "flex";
      favouriteList.style.display = "none";
      pokemonInfo.style.width = "50%";
      imageField.style.width = "50%";
      favouriteList.style.width = "0%";
      alert("No Pokémon in favourite list");
    }
  } else {
    alert("No Pokémon selected");
  }
});

lhsBlueBtn.addEventListener("click", () => {
  const currentActive = favouriteList.querySelector(".active");
  if (currentActive) {
    fetchPokemonData(currentActive.id);
  } else {
    alert("No Pokémon selected");
  }
});
