import { collection, getDocs } from "firebase/firestore";
import { useState } from "react";
import { Surface, Text } from "react-native-paper";
import { db } from "../config/firebase";
import { FlatList } from "react-native";

export default function ListarNotas() {
  const [notas, setNotas] = useState();

  useState(() => {
    listarNotasDoFirebase();
  }, []); // esse array é importante pois define que é executado apenas uma vez

  async function listarNotasDoFirebase() {
    const notasRef = collection(db, "notas");
    const notasSnapshot = await getDocs(notasRef);
    console.log(notasSnapshot.docs);
    console.log(notasSnapshot.docs.map((doc) => doc.data()));
    setNotas(notasSnapshot.docs.map((doc) => doc.data()));
  }
  return (
    <Surface
      style={{
        flex: 1,
        alignItems: "center",
      }}
    >
      <Text>Notas inseridas</Text>
      <FlatList
        data={notas}
        renderItem={(item) => <Text id={item.id}>{item.titulo}</Text>}
        // keyExtractor={(item) => item.id}
      ></FlatList>
    </Surface>
  );
}
