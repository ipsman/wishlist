import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    
}

export default function Stars () {
    return(
         <View className="flex-row items-center gap-2 mb-3">
          <Text className="text-sm text-slate-500 mr-1">Fontosság:</Text>
          {[1, 2, 3].map(star => (
            <TouchableOpacity key={star} onPress={() => setPriority(star)}>
              <Text className="text-xl">{star <= priority ? '⭐' : '☆'}</Text>
            </TouchableOpacity>
          ))}
        </View>
    );
}