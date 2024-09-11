import { Button, Surface, Text, TextInput } from "react-native-paper";
import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../config/firebase";

export default function InserirDocumento() {
  const [nota, setNota] = useState("");

  async function inserirNotaNoFirestore() {
    const notaRef = collection(db, "notas");
    const docRef = await addDoc(notaRef, {
      titulo: nota,
    });
  }

  function salvarNota(){
    inserirNotaNoFirestore();
    setNota("");
  }

  return (
    <Surface style={{ flex: 1, alignItems: "center" }}>
      <Text>Inserir Documento</Text>
      <TextInput label="Nota" value={nota} onChangeText={setNota} />
      <Button
        onPress={salvarNota}
      >Salvar</Button>
    </Surface>
  );
}
