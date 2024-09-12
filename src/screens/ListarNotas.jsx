import { updateDoc } from "firebase/firestore";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore"; // Importa as funções do Firestore para buscar coleções e documentos.
import { useState, useEffect } from "react"; // Importa o useState para gerenciar o estado e o useEffect para controlar os efeitos colaterais.
import {
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
} from "react-native-paper"; // Importa componentes visuais do React Native Paper.
import { db } from "../config/firebase"; // Importa a instância do Firebase configurada.
import { FlatList, View } from "react-native"; // Importa o componente FlatList para renderizar listas de itens de forma eficiente.

export default function ListarNotas() {
  const [notas, setNotas] = useState([]); // Define o estado "notas" com um array vazio inicialmente.

  // Programática do Modal
  const [visible, setVisible] = useState(false);
  const [notaId, setNotaId] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [nota, setNota] = useState("");

  const showModal = (id) => {
    setVisible(true);
    setNotaId(id);
  };
  const showEditModal = (id) => {
    setIsEditing(true);
    showModal(id);
  };

  const hideModal = () => setVisible(false);

  // useEffect é utilizado para executar efeitos colaterais após a renderização do componente.
  useEffect(() => {
    listarNotasDoFirebase(); // Chama a função para listar as notas do Firebase quando o componente for montado.
  }, []); // O array vazio [] garante que este efeito seja executado apenas uma vez após o componente ser montado.

  // Função assíncrona para buscar as notas no Firebase.
  async function listarNotasDoFirebase() {
    const notasRef = collection(db, "notas"); // Acessa a coleção "notas" no Firestore.
    const notasSnapshot = await getDocs(notasRef); // Busca todos os documentos da coleção "notas".
    console.log(notasSnapshot.docs); // Loga os documentos retornados.
    console.log(notasSnapshot.docs.map((doc) => doc.data())); // Loga os dados dos documentos.
    setNotas(notasSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))); // Atualiza o estado "notas" com os dados e IDs dos documentos.
  }
  async function salvarNota() {
    const notaRef = doc(db, "notas", notaId);
    await updateDoc(notaRef, {
      titulo: nota,
    });
    await listarNotasDoFirebase();
    hideModal();
    setIsEditing(false);
  }

  async function removerNota() {
    const id = notaId;
    try {
      const notaRef = doc(db, "notas", id);
      await deleteDoc(notaRef);
      await listarNotasDoFirebase();
      hideModal();
    } catch (error) {
      console.error("Error removing note:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  }

  return (
    <Surface
      style={{
        flex: 1,
        alignItems: "center", // Centraliza os itens horizontalmente.
      }}
    >
      <Text>Notas inseridas</Text>
      {/* FlatList é utilizado para renderizar listas de forma eficiente. */}

      <FlatList
        data={notas} // Passa o estado "notas" como fonte de dados.
        style={{ width: "100%" }}
        renderItem={({ item }) => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text>{item.titulo}</Text>
            <View
              style={{
                justifyContent: "space-between",
                display: "flex",
                flexDirection: "row",
              }}
            >
              <IconButton icon="delete" onPress={() => showModal(item.id)} />
              <IconButton icon="note-edit-outline" onPress={() => showEditModal(item.id)} />
            </View>
          </View>
        )} // Renderiza cada item da lista, acessando a propriedade "titulo".
        keyExtractor={(item) => item.id} // Gera uma chave única para cada item usando o "id".
      />

      <Portal>
        <Modal visible={visible} onDismiss={hideModal} style={{ margin: 40 }}>
          {isEditing ? (
            <Card>
              <Card.Title title="Editar nota" />
              <Card.Content>
                <Text>Conteúdo do modal de edição</Text>
                <TextInput
                  label="Novo título"
                  value={nota}
                  onChangeText={setNota}
                />
              </Card.Content>
              <Card.Actions>
                <Button onPress={hideModal}>Cancelar</Button>
                <Button onPress={salvarNota}>Salvar</Button>
              </Card.Actions>
            </Card>
          ) : (
            <Card>
              <Card.Title title="Título do modal" />
              <Card.Content>
                <Text>Conteúdo do modal</Text>
              </Card.Content>
              <Card.Actions>
                <Button onPress={hideModal}>Cancelar</Button>
                <Button onPress={removerNota}>Remover</Button>
              </Card.Actions>
            </Card>
          )}
        </Modal>
      </Portal>
    </Surface>
  );
}
