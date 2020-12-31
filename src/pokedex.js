const pokedex = document.getElementById('pokedex');
const pokedexb = document.getElementById('pokedexb');
const formEl = document.querySelector("form");
const inputEl = document.querySelector("input[type=text]");
const pokemonButton = document.getElementById('pokedexButton');

var nextLink, previousLink, currentLink, currentIdPokemon;

function nextFetchPokemon() {

    //console.log(`next link:${nextLink}`);
    FetchPokemon(nextLink);
}
function prevFetchPokemon() {

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
    pokedexb.innerHTML="";
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
pokemonButton.innerHTML = `<button class="PrevButton" onclick="prevFetchPokemon();">Pre</button>
                            <button class="NextButton" onclick="nextFetchPokemon();">Next</button>`;
};



async function getNextPokemon(i)
{
    getPokemon(currentIdPokemon + 1);
}
async function getPrevPokemon(i)
{
    getPokemon(currentIdPokemon - 1);
}

async function getPokemon(i)
{

    currentIdPokemon = i;

    pokedex.innerHTML = "";
    // console.log(`Get function here ${i}`);
    //console.log(currentLink);
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${i}`);
   /* const res_next = await fetch(`https://pokeapi.co/api/v2/pokemon/${i+1}`);
    const res_pre = await fetch(`https://pokeapi.co/api/v2/pokemon/${i-1}`);*/
    const pokemon = await res.json(), pokemonEl = document.createElement("div");
    pokemonEl.classList.add("pokemon");

    pokemonEl.innerHTML = `
    <div id="info">
      <img src="https://pokeres.bastionbot.org/images/pokemon/${
        pokemon.id
    }.png" width="200" alt="">
<h2>${pokemon.name}</h2>
    </div>

    <div id="stats">
      ${pokemon.stats
        .map((stat) => {
            return `<p>${stat.stat.name}: ${stat.base_stat}</p>`;
        })
        .join("")}
    </div>
  `;

    console.log(pokemonButton);
    pokemonButton.innerHTML = '<button class="PrevButton" onclick="getPrevPokemon();">Pre</button>\n' +
        '        <button class="NextButton" onclick="getNextPokemon();">Next</button>';
    pokedexb.innerHTML = '<button class="Back" onclick="FetchPokemon(currentLink)">back pokedex</button>'
    pokedex.appendChild(pokemonEl);

}


LookupServer();

