import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';

import { useQuery } from '@tanstack/react-query';

import { getPokemons } from '../../../actions/pokemons';




export const HomeScreen = () => {

  // const { isLoading, data=[]} = useQuery({
  //   queryKey: ['pokemons'],
  //   queryFn: () => getPokemons(0),
  //   staleTime: 1000*60*60,//60minutes
  // });

  return (
    <View>
      <Button
       mode='contained'
       onPress={()=>{}}
      >
        Press me
      </Button>
      <Text>HomeScreen</Text>
    </View>
  );
}
