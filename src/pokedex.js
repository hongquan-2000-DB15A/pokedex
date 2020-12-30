const pokedex = document.getElementById('pokedex');
const pokedexb = document.getElementById('pokedexb');
const formEl = document.querySelector("form");
const inputEl = document.querySelector("input[type=text]");

var nextLink, previousLink, currentLink;

function nextFetchPokemon() {

    //console.log(`next link:${nextLink}`);
    FetchPokemon(nextLink);
}
function preFetchPokemon() {

    //console.log(`prev link:${previousLink}`);
    FetchPokemon(previousLink);
}

formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    getPokemon(inputEl.value);
});

const LookupServer = () =>
{
    const url = `https://pokeapi.co/api/v2/pokemon/?offset=0&limit=20`;
    fetch(url).then((res) => res.json().then((result)=> {
        nextLink = result.next;
        previousLink = result.previous;
        currentLink = url;
        FetchPokemon(currentLink);
    }
    ));
}

const FetchPokemon = (link) => {
    const promises = [];

    currentLink = link;
    console.log(link);
    if (link !== null)
    {
        var pokeList;

        fetch(link).then((res) => res.json().then((bigResult) => {
                pokeList = bigResult.results;
                nextLink = bigResult.next;
                previousLink = bigResult.previous;

                // console.log(pokeList[0]);
            for (let i = 0; i < pokeList.length; i++) {

                const url = pokeList[i].url;
                promises.push(fetch(url).then((res) => res.json()));
            }

            Promise.all(promises).then((results) => {
                const pokemon = results.map((result) => ({
                    name: result.name,
                    image: result.sprites['front_default'],
                    type: result.types.map((type) => type.type.name).join(', '),
                    id: result.id
                }));
                displayPokemon(pokemon);

            });
            }
        ));

    }

};
const displayPokemon = (pokemon) => {
    // console.log(pokemon);
    const pokemonHTMLString = pokemon
        .map(
            (pokeman) => `
        <li class="card" onclick=" getPokemon(${pokeman.id})">
            <img class="card-image" src="${pokeman.image}"/>
            <h2 class="card-title">${pokeman.id}. ${pokeman.name}</h2>
            <p class="card-subtitle">Type: ${pokeman.type}</p>
            
        </li>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTMLString;

};



async function getPokemon(i) {


    pokedex.innerHTML = "";
    // console.log(`Get function here ${i}`);
    //console.log(currentLink);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
    const pokemon = await res.json(), pokemonEl = document.createElement("div");
    pokemonEl.classList.add("pokemon");

    pokemonEl.innerHTML = `
    <div id="info">
      <img src="https://pokeres.bastionbot.org/images/pokemon/${
        pokemon.id
    }.png" width="200" alt="">

    </div>

    <div id="stats">
      ${pokemon.stats
        .map((stat) => {
            return `<p>${stat.stat.name}: ${stat.base_stat}</p>`;
        })
        .join("")}
    </div>
  `;
    pokedexb.innerHTML = '<button class="Back" onclick="FetchPokemon(currentLink)">back pokedex</button>'
    pokedex.appendChild(pokemonEl);

}


LookupServer();

