class Pokemon {
    #id;
    #name;
    #types;
    #moves;
    #sprites;
    #species;
    #infos;

    constructor(infos) {
        this.#id = infos.id;
        this.#name = infos.name;
        this.#types = infos.types;
        this.#moves = infos.moves;
        this.#sprites = infos.sprites;
        this.#species = infos.species;
        this.#infos = infos;
    }

    get id() {
        return this.#id;
    }

    get name() {
        return this.#name;
    }

    get types() {
        return this.#types;
    }

    get moves() {
        return this.#moves;
    }

    get sprites() {
        return this.#sprites;
    }

    get species() {
        return this.#species;
    }

    get infos() {
        return this.#infos;
    }
}

export { Pokemon }
