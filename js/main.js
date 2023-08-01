
import { Pokedex } from "./classes/Pokedex.js";

window.onload = () => {
    const redLed = document.querySelector('.led.red');
    const redYellow = document.querySelector('.led.yellow');
    const redGreen = document.querySelector('.led.green');
    const cristal = document.querySelector('#cristal');
    const leftDisplay = document.querySelector('#leftDisplay');
    const btnPower = document.querySelector('#btnPower');
    const btnEnter = document.querySelector('#btnEnter');
    const btnUp = document.querySelector('#btns .up');
    const btnRight = document.querySelector('#btns .right');
    const btnDown = document.querySelector('#btns .down');
    const btnLeft = document.querySelector('#btns .left');
    const rightDisplay = document.querySelector('#rightDisplay');
    const divPokemon = document.querySelector('#pokemon');
    const pokemonSound = document.querySelector('#pokemonSound');
    const pokedexNode = document.querySelector('#pokedex');

    const pokedex = new Pokedex({
        'redLed': redLed,
        'redYellow': redYellow,
        'redGreen': redGreen,
        'cristal': cristal,
        'leftDisplay': leftDisplay,
        'btnPower': btnPower,
        'btnEnter': btnEnter,
        'btnUp': btnUp,
        'btnRight': btnRight,
        'btnDown': btnDown,
        'btnLeft': btnLeft,
        'rightDisplay': rightDisplay,
        'divPokemon': divPokemon,
        'pokemonSound': pokemonSound,
        'pokedexNode': pokedexNode
    });

    pokedex.init();
}