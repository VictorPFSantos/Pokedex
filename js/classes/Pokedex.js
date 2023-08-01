import { getAllPokemons, getPokemonDetails, getSpeciesDetails } from "../modules/PokeApi.js";
import { Pokemon } from "./Pokemon.js";

export class Pokedex {
    // COMPONENTS
    #redLed;
    #yellowLed;
    #greenLed;
    #cristal;
    #leftDisplay;
    #btnPower;
    #btnEnter;
    #btnDirectionalUp;
    #btnDirectionalRight;
    #btnDirectionalDown;
    #btnDirectionalLeft;
    #rightDisplay;
    #rightDisplayInfos;
    #pokedexNode;
    #pokedexCoverNode;
    #divPokemon;
    #pokemonSound;
    #btnDisplayDirUp;
    #btnDisplayDirDown;

    // INFOS
    #pathImages;
    #pokemons; // OBJECT WITH ALL THE POKEMONS
    #currentPokemonIndex = 0;
    #currentHabitat;
    habitats;
    #pokedexCoverTransitionTime;
    #pokedexLeftDisplayTransitionTime;
    #allCurrentPokemonInfos;
    #speedScrollRightDisplay = 20;
    #scrollRightDisplay = 0;

    constructor(infos) {
        this.#pathImages = infos.pathImages || 'img/habitats';
        this.#redLed = infos.redLed || null;
        this.#yellowLed = infos.yellowLed || null;
        this.#greenLed = infos.greenLed || null;
        this.#cristal = infos.cristal || null;
        this.#leftDisplay = infos.leftDisplay || null;
        this.#btnPower = infos.btnPower || null;
        this.#btnEnter = infos.btnEnter || null;
        this.#btnDirectionalUp = infos.btnDirectionalUp || null;
        this.#btnDirectionalRight = infos.btnDirectionalRight || null;
        this.#btnDirectionalDown = infos.btnDirectionalDown || null;
        this.#btnDirectionalLeft = infos.btnDirectionalLeft || null;
        this.#rightDisplay = infos.rightDisplay || null;
        this.#rightDisplayInfos = infos.rightDisplay.children[1].children[0];
        this.#pokemonSound = infos.pokemonSound || null;
        this.#divPokemon = infos.divPokemon || null;
        this.#btnDisplayDirUp = infos.btnDisplayDirUp || null;
        this.#btnDisplayDirDown = infos.btnDisplayDirDown || null;
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

    get scrollRightDisplay() {
        return this.#scrollRightDisplay;
    }

    set scrollRightDisplay(position) {
        this.#scrollRightDisplay = position;
    }

    // METHODS
    init = async () => {
        this.#pokedexCoverTransitionTime = parseFloat(getComputedStyle(this.#pokedexCoverNode).getPropertyValue('transition').split(' ')[1].replace('s', '')) * 1000;
        this.#pokedexLeftDisplayTransitionTime = parseFloat(getComputedStyle(this.#leftDisplay).getPropertyValue('transition').split(' ')[1].replace('s', '')) * 1000;

        // GETTING FIRST INFORMATIONS OF POKEDEX
        const { results } = await getAllPokemons();
        this.#pokemons = (results.map(item => ({ ...item, 'id': item.url.split('/')[6] }))).filter(item => item.id <= 10263);
        this.getPokemonByIndex(this.#currentPokemonIndex, false);

        // console.log(this.#pokemons[this.#currentPokemonIndex]);

        this.#pokedexNode.addEventListener('click', this.power);
        this.#btnDirectionalLeft.addEventListener('click', this.previousPokemon);
        this.#btnDirectionalRight.addEventListener('click', this.nextPokemon);
        this.#btnDisplayDirUp.addEventListener('click', this.scrollUpRightDisplay);
        this.#btnDisplayDirDown.addEventListener('click', this.scrollDownRightDisplay);
    }

    pokedexCoverIsClosed = () => !this.#pokedexCoverNode.classList.toString().includes('open-pokedex');

    displayOff = display => !display.classList.toString().includes('powerOn');

    powerOn = () => {
        // SETTING THE ANIMATION CLASS TO OPEN THE COVER
        this.#pokedexCoverNode.classList.add('open-pokedex');

        setTimeout(() => {
            // TURN ON CRISTAL
            this.#cristal.children[0].classList.add('glassOn');
            this.#cristal.children[0].children.shine.classList.add('shining');

            // TURN ON GREEN LED
            this.#greenLed.classList.add('ledGrennOn');

            // DISPLAY LEFT TURN ON
            this.#leftDisplay.classList.add('powerOn');

            // WAIT THE TIME TRANSITION AND PLAY THE POKEMONS SOUND
            setTimeout(() => {
                this.#pokemonSound.play();
                this.setPokemonInfos();
            }, this.#pokedexLeftDisplayTransitionTime);
        }, this.#pokedexCoverTransitionTime);
    }

    powerOff = () => {
        // DISPLAY LEFT TURN OFF
        this.#leftDisplay.classList.remove('powerOn');

        setTimeout(() => {
            // SETTING THE ANIMATION CLASS TO OPEN THE COVER
            this.#pokedexCoverNode.classList.remove('open-pokedex');

            // RETURNS TO THE FIRST POKEMON WHEN THE DISPLAY IS TURNED OFF
            // this.getPokemonByIndex(0);

            setTimeout(() => {
                // TURN ON CRISTAL
                this.#cristal.children[0].classList.remove('glassOn');
                this.#cristal.children[0].children.shine.classList.remove('shining');

                // TURN ON GREEN LED
                this.#greenLed.classList.remove('ledGrennOn');

                // SET THE RIGHT DISPLAY MESSAGE TO "LOADING..."
                this.#rightDisplayInfos.innerHTML = '<div class="center">Loading...</div>';
            }, this.#pokedexCoverTransitionTime);
        }, this.#pokedexLeftDisplayTransitionTime);
    }

    power = event => {
        const isValidElement = ['cover', 'elements'].includes(event.target.classList[0]);

        if (isValidElement) {
            if (this.pokedexCoverIsClosed())
                this.powerOn();
            else
                this.powerOff();
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

    setPokemonInfos = () => {
        const { pokemon, specie } = this.#allCurrentPokemonInfos;

        const infos = `
            <table>
                <thead>
                    <tr>
                        <th>#${(pokemon.id < 10) ? '00' + pokemon.id : (pokemon.id < 100) ? '0' + pokemon.id : pokemon.id}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Specie:</td>
                        <td>${pokemon.name}</td>
                    </tr>
                    <tr>
                        <td>Weight:</td>
                        <td>${pokemon.infos.weight} Kg</td>
                    </tr>
                    <tr>
                        <td>Habitat:</td>
                        <td>${(specie.habitat !== null) ? specie.habitat.name : 'Unknow'}</td>
                    </tr>
                    <tr>
                        <td>Type(s):</td>
                        <td>${pokemon.types.map(item => item.type.name).join(', ')}</td>
                    </tr>
                    <tr>
                        <td>Attack(s):</td>
                    </tr>
                </tbody>
            </table>
            <ul>${pokemon.moves.map(item => `<li>${item.move.name}</li>`).join('')}</ul>
        `;

        this.#rightDisplayInfos.innerHTML = infos;
    }

    setCurrentPokemon = updatePokemonInfos => {
        const { pokemon } = this.#allCurrentPokemonInfos;

        this.#divPokemon.style.backgroundImage = `url(${pokemon.sprites.front_default})`;
        this.#pokemonSound.src = `https://play.pokemonshowdown.com/audio/cries/${pokemon.species.name}.mp3`;

        if (updatePokemonInfos) {
            this.setPokemonInfos(this.#allCurrentPokemonInfos);
            this.resetScrollRightDisplay();
        }

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

    getPokemonByIndex = async (index, updatePokemonInfos = true) => {
        const pokemon = new Pokemon(await getPokemonDetails(this.#pokemons[index].url));
        const specie = await getSpeciesDetails(pokemon.species.url);

        this.#currentPokemonIndex = index;
        this.#allCurrentPokemonInfos = { pokemon, specie };

        if (specie.habitat !== null)
            this.changeHabitat((this.habitats.filter(objHabitat => objHabitat.name === specie.habitat.name))[0]);
        else
            this.changeHabitat(this.habitats[9]);

        this.setCurrentPokemon(updatePokemonInfos);
    }

    previousPokemon = event => {
        event.stopPropagation();

        // BLINK THE RED LED IF POKEDEX IS TURNED ON
        this.blinkRedLed();

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

        // BLINK THE RED LED IF POKEDEX IS TURNED ON
        this.blinkRedLed();

        if (!this.displayOff(this.#leftDisplay)) {
            if ((this.#currentPokemonIndex + 1) <= this.#pokemons.length - 1)
                this.getPokemonByIndex(this.#currentPokemonIndex + 1);
            else
                this.getPokemonByIndex(0);
        }
    }

    resetScrollRightDisplay = () => {
        this.#scrollRightDisplay = 0;
        this.#rightDisplayInfos.style.top = this.#scrollRightDisplay + 'px';
    }

    scrollUpRightDisplay = event => {
        event.stopPropagation();

        if (this.#scrollRightDisplay <= (this.#speedScrollRightDisplay * -1)) {
            this.#scrollRightDisplay += this.#speedScrollRightDisplay;
            this.#rightDisplayInfos.style.top = this.#scrollRightDisplay + 'px';
        }

        if (this.#scrollRightDisplay <= (this.#speedScrollRightDisplay * -1))
            this.#rightDisplay.children[0].innerHTML = '<i class="fa fa-chevron-up"></i><i class="fa fa-chevron-down"></i>';
        else
            this.#rightDisplay.children[0].innerHTML = '<i class="fa fa-chevron-down"></i>';
    }

    scrollDownRightDisplay = event => {
        event.stopPropagation();

        const endOfScroll = this.#rightDisplayInfos.scrollHeight;

        if (this.#scrollRightDisplay >= ((endOfScroll - this.#speedScrollRightDisplay - 40)) * -1) {
            this.#scrollRightDisplay -= this.#speedScrollRightDisplay;
            this.#rightDisplayInfos.style.top = this.#scrollRightDisplay + 'px';
        }

        if (this.#scrollRightDisplay >= ((endOfScroll - this.#speedScrollRightDisplay - 40)) * -1)
            this.#rightDisplay.children[0].innerHTML = '<i class="fa fa-chevron-up"></i><i class="fa fa-chevron-down"></i>';
        else
            this.#rightDisplay.children[0].innerHTML = '<i class="fa fa-chevron-up"></i>';

        // console.log(`${this.#scrollRightDisplay} >= ${(endOfScroll - this.#speedScrollRightDisplay)}`);
    }
}