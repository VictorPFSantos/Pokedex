
import { Pokedex } from "./classes/Pokedex.js";

window.onload = () => {
    const redLed = document.querySelector('.led.red');
    const yellowLed = document.querySelector('.led.yellow');
    const greenLed = document.querySelector('.led.green');
    const cristal = document.querySelector('#cristal');
    const leftDisplay = document.querySelector('#leftDisplay');
    const btnPower = document.querySelector('#btnPower');
    const btnEnter = document.querySelector('#btnEnter');
    const btnDirectionalUp = document.querySelector('#btns .up');
    const btnDirectionalRight = document.querySelector('#btns .right');
    const btnDirectionalDown = document.querySelector('#btns .down');
    const btnDirectionalLeft = document.querySelector('#btns .left');
    const rightDisplay = document.querySelector('#rightDisplay');
    const btnDisplayDirUp = document.querySelector('#btnDisplayDirUp');
    const btnDisplayDirDown = document.querySelector('#btnDisplayDirDown');
    const divPokemon = document.querySelector('#pokemon');
    const pokemonSound = document.querySelector('#pokemonSound');
    const pokedexNode = document.querySelector('#pokedex');

    const pokedex = new Pokedex({
        'redLed': redLed,
        'yellowLed': yellowLed,
        'greenLed': greenLed,
        'cristal': cristal,
        'leftDisplay': leftDisplay,
        'btnPower': btnPower,
        'btnEnter': btnEnter,
        'btnDirectionalUp': btnDirectionalUp,
        'btnDirectionalRight': btnDirectionalRight,
        'btnDirectionalDown': btnDirectionalDown,
        'btnDirectionalLeft': btnDirectionalLeft,
        'rightDisplay': rightDisplay,
        'divPokemon': divPokemon,
        'pokemonSound': pokemonSound,
        'pokedexNode': pokedexNode,
        'btnDisplayDirUp': btnDisplayDirUp,
        'btnDisplayDirDown': btnDisplayDirDown
    });

    pokedex.init();
}