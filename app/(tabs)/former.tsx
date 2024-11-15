import React, { useEffect, useState, useLayoutEffect } from "react";
import {
  View,
  FlatList,
  ActivityIndicator,
  Text,
  Image,
  Pressable,
  Modal,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Link, useNavigation } from "expo-router";
import playersData from "../../assets/players_data.json";
import { imageMap } from "../../lib/imageMap";
import { Player } from "../../interfaces/Player";
import { formatYears } from "../../lib/formatYears";
import { positionOrder } from "../../lib/positionOrder";
import { years } from "../../lib/years";
import { yearLabels } from "../../lib/yearLabels";
import { Picker } from "@react-native-picker/picker";

const PlayersList: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>("2016.1");
  const [isModalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    // Filtrar jugadores por año y ordenar por posición
    const filteredPlayers = playersData
      .filter((player) => player.years.includes(selectedYear))
      .sort(
        (a, b) =>
          (positionOrder[a.position as keyof typeof positionOrder] || 999) -
          (positionOrder[b.position as keyof typeof positionOrder] || 999)
      );

    setPlayers(filteredPlayers);
  }, [selectedYear]);

  useLayoutEffect(() => {
    // Cambiar el headerRight con el año seleccionado
    navigation.setOptions({
      headerRight: () => (
        <Text
          className={`text-slate-950 font-bold ${
            selectedYear === "2016.2" || selectedYear === "2016.3"
              ? "text-xl"
              : "text-2xl"
          } me-3`}
        >
          {yearLabels[selectedYear] || selectedYear} Roster
        </Text>
      ),
    });
  }, [navigation, selectedYear]);

  return (
    <View className="flex-1 bg-[#C8D9F0] pt-8 px-2">
      {/* Selector de año */}
      <View className="mb-6 mx-5 bg-[#92a2c8] rounded-lg">
        {Platform.OS === "ios" ? (
          <>
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="px-4 py-2 text-center bg-[#92a2c8] rounded-lg"
            >
              <Text className="text-center text-white">
                {yearLabels[selectedYear] || selectedYear}
              </Text>
            </TouchableOpacity>
            <Modal
              transparent={true}
              visible={isModalVisible}
              animationType="slide"
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white w-4/5 rounded-lg p-4">
                  <FlatList
                    data={years}
                    keyExtractor={(item) => item}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedYear(item);
                          setModalVisible(false);
                        }}
                        className="py-2"
                      >
                        <Text
                          className={`text-center text-lg ${
                            selectedYear === item
                              ? "font-bold text-blue-600"
                              : "text-black"
                          }`}
                        >
                          {yearLabels[item] || item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    className="mt-4 p-2 bg-blue-600 rounded-lg"
                  >
                    <Text className="text-center text-white">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          </>
        ) : (
          <Picker
            selectedValue={selectedYear}
            onValueChange={(year) => setSelectedYear(year)}
            className="px-4 py-2 text-center rounded-lg"
          >
            {years.map((year) => (
              <Picker.Item
                key={year}
                label={yearLabels[year] || year}
                value={year}
              />
            ))}
          </Picker>
        )}
      </View>

      {players.length === 0 ? (
        <ActivityIndicator color={"#000"} size={"large"} />
      ) : (
        <FlatList
          data={players}
          keyExtractor={(player) => player.nickname}
          renderItem={({ item }) => (
            <Link href={`/${item.nickname}`} asChild>
              <Pressable
                className="flex-row items-center bg-[#92a2c8] mb-4 p-2 rounded-lg"
                style={{
                  ...Platform.select({
                    ios: {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1, // Reduce la opacidad de la sombra para iOS
                      shadowRadius: 3,
                    },
                    android: {
                      elevation: 4, // Mantén o ajusta la elevación para Android
                    },
                  }),
                }}
              >
                <Image
                  source={imageMap[item.img]}
                  className="w-48 h-48 rounded-full mr-4"
                  resizeMode="center"
                />
                <View className="flex-1">
                  <Text className="text-3xl font-bold mb-1">
                    {item.nickname}
                  </Text>
                  <Text className="text-xl text-slate-950">{item.name}</Text>
                  <Text className="text-xl text-slate-950">{item.country}</Text>
                  <Text className="text-xl text-slate-950">
                    {item.position}
                  </Text>
                  <Text className="text-xl text-slate-950">
                    Age: {item.age}
                  </Text>
                  <Text className="text-xl text-slate-950">
                    Years: {formatYears(item.years)}
                  </Text>
                </View>
              </Pressable>
            </Link>
          )}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default PlayersList;
