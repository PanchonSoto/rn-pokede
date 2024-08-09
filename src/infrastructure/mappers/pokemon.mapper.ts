import { getColorFromImage } from "../../config/helpers/get-color";
import { Pokemon } from "../../domain/entities/pokemon";
import { PokeApiPokemon } from "../interfaces/pokeapi.interface";



export class PokemonMapper {

  static async pokeApiPokemonToEntity(data:PokeApiPokemon):Promise<Pokemon> {

    const sprites = PokemonMapper.getSprites(data);
    const avatar = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
    const color = await getColorFromImage(avatar);

    return {
      id: data.id,
      name: data.name,
      avatar: avatar,
      sprites: sprites,
      types: data.types.map(type=>type.type.name),
      color: color,

      stats: data.stats.map(stats=>({name:stats.stat.name, value:stats.base_stat})),
      abilities: data.abilities.map(ability=>ability.ability.name),
      moves: data.moves
       .map(move=>({ name:move.move.name, level:move.version_group_details[0].level_learned_at }))
       .sort((a,b)=>a.level - b.level),
      games: data.game_indices.map(game=> game.version.name),
    }

  }


  static getSprites(data: PokeApiPokemon): string[] {

    const sprites: string[] = [];

    if (data.sprites.other?.home.front_default)
      sprites.push(data.sprites.other?.home.front_default);
    if (data.sprites.other?.['official-artwork'].front_default)
      sprites.push(data.sprites.other?.['official-artwork'].front_default);
    if (data.sprites.other?.['official-artwork'].front_shiny)
      sprites.push(data.sprites.other?.['official-artwork'].front_shiny);
    if (data.sprites.other?.showdown.front_default)
      sprites.push(data.sprites.other?.showdown.front_default);
    if (data.sprites.other?.showdown.back_default)
      sprites.push(data.sprites.other?.showdown.back_default);

    return sprites;
  }

}
