import { pokeApi } from "../../config/api/pokeApi";

import type { Pokemon } from "../../domain/entities/pokemon";
import type { PokeAPIPaginatedResponse, PokeApiPokemon } from "../../infrastructure/interfaces/pokeapi.interface";

import { PokemonMapper } from "../../infrastructure/mappers/pokemon.mapper";



export const getPokemons = async(page:number, limit:number=20):Promise<Pokemon[]> => {
    try {

        const url = `/pokemon?offset=${page*10}&limit=${limit}`;

        //?data los like: "results": [{ "name": "bulbasaur", "url": "https://pokeapi.co/api/v2/pokemon/1/"},{...}]
        const {data} = await pokeApi.get<PokeAPIPaginatedResponse>(url);

        //?get data.url and iterate it to get promesis of each pokemons
        const pokemonsPromises = data.results.map((info)=>{
            return pokeApi.get<PokeApiPokemon>(info.url);
        });

        //?resolve all promises of all pokemons with promise.all
        const pokeApiPokemons = await Promise.all(pokemonsPromises);

        //?mapper data with custom mapper
        const pokemons = pokeApiPokemons.map((item)=>PokemonMapper.pokeApiPokemonToEntity(item.data));

        //?return new object of pokemon (id,name,avatar,sprites,types)
        return pokemons;

    } catch (error) {
        console.log(error);
        throw new Error("Error getting pokemons");
    }
}
