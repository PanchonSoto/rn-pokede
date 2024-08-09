import { useContext, useMemo, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ActivityIndicator, TextInput, Text } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';

import { globalTheme } from '../../../config/theme/global-theme';
import { Pokemon } from '../../../domain/entities/pokemon';
import { PokemonCard } from '../../components/pokemons/PokemonCard';
import { ThemeContext } from '../../context/ThemeContext';
import { getPokemonNamesWithId, getPokemonsByIds } from '../../../actions/pokemons';
import { FullScreenLoader } from '../../components/ui/FullScreenLoader';
import { useDebounceValue } from '../../hooks/useDebouncedValue';


export const SearchScreen = () => {

  const { top } = useSafeAreaInsets();
  const { isDark } = useContext(ThemeContext);
  const [term, setTerm] = useState('');
  const debounceValue = useDebounceValue(term);

  const {isLoading, data: pokemonNameList=[]} = useQuery({
    queryKey: ['pokemons', 'all'],
    queryFn: ()=> getPokemonNamesWithId(),
  })

  const pokemonNameIdList = useMemo(()=>{
    //is a number
    if( !isNaN(Number(debounceValue)) ) {
      const pokemon = pokemonNameList?.find(pokemon=>pokemon.id===Number(debounceValue));
      return pokemon ? [pokemon]: [];
    }

    if(debounceValue.length===0) return [];
    if(debounceValue.length<3) return [];

    return pokemonNameList.filter(pokemon=>
      pokemon.name.includes(debounceValue.toLocaleLowerCase()),
    );

  },[debounceValue]);

  const {isLoading:isLoadingPokemons, data:pokemons} = useQuery({
    queryKey: ['pokemons','by', pokemonNameIdList],
    queryFn: () =>getPokemonsByIds(pokemonNameIdList.map(pokemon=>pokemon.id)),
    staleTime:1000*60*5,//5minutes
  });

  if(isLoading) {
    return (<FullScreenLoader />);
  }

  return (
    <View style={[globalTheme.globalMargin,{paddingTop:top+10}]}>
      <TextInput
        placeholder='Search pokemon'
        placeholderTextColor={isDark ? 'white' : 'grey'}
        textColor = {isDark ? 'white' : 'grey'}
        mode='flat'
        autoFocus
        autoCorrect={false}
        onChangeText={setTerm}
        value={term}
      />

      {isLoadingPokemons && <ActivityIndicator style={{paddingTop:20}}/>}


      <FlatList
       data={pokemons}
       keyExtractor={(pokemon, index)=>`${pokemon.id}-${index}`}
       numColumns={2}
       style={{paddingTop:top+20}}
       renderItem={({item})=>(
        <PokemonCard pokemon={item}/>
       )}
       showsVerticalScrollIndicator={false}
       ListFooterComponent={<View style={{height:150}}/>}
      />
    </View>
  );
}
