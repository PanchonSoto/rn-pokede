import { StyleSheet, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';

import { getPokemons } from '../../../actions/pokemons';
import { PokeballBg } from '../../components/ui/PokeballBg';
import { PokemonCard } from '../../components/pokemons/PokemonCard';
import { globalTheme } from '../../../config/theme/global-theme';




export const HomeScreen = () => {

  const {top} = useSafeAreaInsets();
  const queryClient = useQueryClient();

  //!Traditional way to request http
  /*   const { isLoading, data:pokemons=[]} = useQuery({
    queryKey: ['pokemons'],
    queryFn: () => getPokemons(0),
    staleTime: 1000*60*60,//60minutes
  }); */
  const { isLoading, data, fetchNextPage} = useInfiniteQuery({
    queryKey: ['pokemon', 'infinite'],
    initialPageParam: 0,
    staleTime:1000*60*60,//60minutes
    queryFn: async params => {
      const pokemons = await getPokemons(params.pageParam);
      pokemons.forEach(pokemon=>{
        queryClient.setQueryData(['pokemon',pokemon.id], pokemon);
      });
      return pokemons;
    },
    getNextPageParam: (lastPage, pages)=> pages.length,

  })

  // console.log(JSON.stringify(data?.pages[0]));

  return (
    <View style={globalTheme.globalMargin}>
      <PokeballBg style={styles.imgPosition}/>

      <FlatList
       data={data?.pages.flat() ?? []}
       keyExtractor={(pokemon, index)=>`${pokemon.id}-${index}`}
       numColumns={2}
       style={{paddingTop:top+20}}
       ListHeaderComponent={()=><Text variant='displayMedium'>Pokedex</Text>}
       renderItem={({item})=>(
        <PokemonCard pokemon={item}/>
       )}
       onEndReachedThreshold={0.6}
       onEndReached={()=>fetchNextPage()}
       showsVerticalScrollIndicator={false}
      />

    </View>
  );
}


const styles = StyleSheet.create({
  imgPosition: {
    position: 'absolute',
    top:-100,
    right:-100,
  }
});
