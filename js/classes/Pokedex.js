import { getAllPokemons, getPokemonDetails, getSpeciesDetails } from "../modules/PokeApi.js";
import { Pokemon } from "./Pokemon.js";

export class Pokedex {
    #redLed;
    #yellowLed;
    #greenLed;
    #cristal;
    #leftDisplay;
    #btnPower;
    #btnEnter;
    #btnUp;
    #btnRight;
    #btnDown;
    #btnLeft;
    #rightDisplay;
    #pokemons; // OBJECT WITH ALL THE POKEMONS
    #divPokemon;
    #pathImages;
    #currentPokemonIndex = 0;
    #currentHabitat;
    #pokemonSound;
    habitats;
    #pokedexNode;
    #pokedexCoverNode;

    constructor(infos) {
        this.#pathImages = infos.pathImages || 'img/habitats';
        this.#redLed = infos.redLed || null;
        this.#yellowLed = infos.yellowLed || null;
        this.#greenLed = infos.greenLed || null;
        this.#cristal = infos.cristal || null;
        this.#leftDisplay = infos.leftDisplay || null;
        this.#btnPower = infos.btnPower || null;
        this.#btnEnter = infos.btnEnter || null;
        this.#btnUp = infos.btnUp || null;
        this.#btnRight = infos.btnRight || null;
        this.#btnDown = infos.btnDown || null;
        this.#btnLeft = infos.btnLeft || null;
        this.#rightDisplay = infos.rightDisplay || null;
        this.#pokemonSound = infos.pokemonSound || null;
        this.#divPokemon = infos.divPokemon || null;
        this.#pokedexNode = infos.pokedexNode || null;
        this.#pokedexCoverNode = Object.values(infos.pokedexNode.children).find(elem => elem.id === 'part2');

        this.habitats = [
            { id: 0, name: 'cave', url: `${this.#pathImages}/cave.jpg` },
            { id: 1, name: 'forest', url: `${this.#pathImages}/forest.jpeg` },
            { id: 2, name: 'grassland', url: `${this.#pathImages}/grassland.png` },
            { id: 3, name: 'mountain', url: `${this.#pathImages}/mountain.avif` },
            { id: 4, name: 'rare', url: `${this.#pathImages}/rare.jpeg` },
            { id: 5, name: 'rough-terrain', url: `${this.#pathImages}/rough-terrain.jpeg` },
            { id: 6, name: 'sea', url: `${this.#pathImages}/sea.png` },
            { id: 7, name: 'urban', url: `${this.#pathImages}/urban.jpeg` },
            { id: 8, name: 'waters-edge', url: `${this.#pathImages}/waters-edge.jpeg` },
            { id: 9, name: 'nothing', url: `${this.#pathImages}/nothing.png` }
        ];
    }

    // METHODS
    init = async () => {
        // GETTING FIRST INFORMATIONS OF POKEDEX
        const { results } = await getAllPokemons();
        this.#pokemons = (results.map(item => ({ ...item, 'id': item.url.split('/')[6] }))).filter(item => item.id <= 10263);
        this.getPokemonByIndex(this.#currentPokemonIndex);

        console.log(this.#pokedexNode);

        this.#pokedexNode.addEventListener('click', this.power);
        this.#btnLeft.addEventListener('click', this.previousPokemon);
        this.#btnRight.addEventListener('click', this.nextPokemon);
    }

    pokedexCoverIsClosed = () => !this.#pokedexCoverNode.classList.toString().includes('open-pokedex');

    displayOff = display => !display.classList.toString().includes('powerOn');

    powerOn = () => {
        const coverTransitionTime = parseFloat(getComputedStyle(this.#pokedexCoverNode).getPropertyValue('transition').split(' ')[1].replace('s', '')) * 1000;
        const leftDisplayTransitionTime = parseFloat(getComputedStyle(this.#leftDisplay).getPropertyValue('transition').split(' ')[1].replace('s', '')) * 1000;

        // SETTING THE ANIMATION CLASS TO OPEN THE COVER
        this.#pokedexCoverNode.classList.add('open-pokedex');

        setTimeout(() => {
            // DISPLAY LEFT TURN ON
            this.#leftDisplay.classList.add('powerOn');

            // WAIT THE TIME TRANSITION AND PLAY THE POKEMONS SOUND
            setTimeout(() => {
                this.#pokemonSound.play();
            }, leftDisplayTransitionTime);
        }, coverTransitionTime);
    }

    powerOff = () => {
        // SETTING THE ANIMATION CLASS TO OPEN THE COVER
        this.#pokedexCoverNode.classList.remove('open-pokedex');

        // DISPLAY LEFT TURN OFF
        this.#leftDisplay.classList.remove('powerOn');

        // RETURNS TO THE FIRST POKEMON WHEN THE DISPLAY IS TURNED OFF
        // this.getPokemonByIndex(0);
    }

    power = event => {
        const isValidElement = ['cover', 'elements'].includes(event.target.classList[0]);

        if (isValidElement) {
            if (this.pokedexCoverIsClosed()) {
                this.powerOn();
            } else {
                // BLINK THE RED LED IF POKEDEX IS TURNED ON
                this.blinkRedLed();

                this.powerOff();
            }
        }
    }

    blinkRedLed = () => {
        this.#redLed.classList.add('on');

        let timeout = setTimeout(() => {
            this.#redLed.classList.remove('on');
            clearTimeout(timeout);
        }, 100);
    }

    setHabitat = objHabitat => {
        this.#currentHabitat = objHabitat;
    }

    setCurrentPokemon = pokemon => {
        this.#divPokemon.style.backgroundImage = `url(${pokemon.sprites.front_default})`;
        this.#pokemonSound.src = `https://play.pokemonshowdown.com/audio/cries/${pokemon.species.name}.mp3`;

        if (!this.displayOff(this.#leftDisplay)) {
            setTimeout(() => {
                this.#pokemonSound.play();
            }, 300);
        }
    }

    changeHabitat = objHabitat => {
        this.setHabitat(objHabitat);
        this.#leftDisplay.style.backgroundImage = `url(${objHabitat.url || ''})`;
        // this.#leftDisplay.style.transition = `0s`;
    }

    getPokemonByIndex = async index => {
        const pokemon = new Pokemon(await getPokemonDetails(this.#pokemons[index].url));
        const specie = await getSpeciesDetails(pokemon.species.url);

        this.#currentPokemonIndex = index;

        if (specie.habitat !== null)
            this.changeHabitat((this.habitats.filter(objHabitat => objHabitat.name === specie.habitat.name))[0]);
        else
            this.changeHabitat(this.habitats[9]);

        this.setCurrentPokemon(pokemon);
    }

    previousPokemon = event => {
        event.stopPropagation();

        if (!this.displayOff(this.#leftDisplay)) {
            let nextIndex = this.#currentPokemonIndex - 1;

            if (nextIndex >= 0)
                this.getPokemonByIndex(nextIndex);
            else
                this.getPokemonByIndex(this.#pokemons.length - 1);
        }
    }

    nextPokemon = event => {
        event.stopPropagation();

        if (!this.displayOff(this.#leftDisplay)) {
            if ((this.#currentPokemonIndex + 1) <= this.#pokemons.length - 1)
                this.getPokemonByIndex(this.#currentPokemonIndex + 1);
            else
                this.getPokemonByIndex(0);
        }
    }
}