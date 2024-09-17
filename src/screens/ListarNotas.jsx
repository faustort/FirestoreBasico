// Importação dos métodos do Firestore para operações de CRUD e busca de dados
import {
  updateDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
} from "firebase/firestore";
// Importação dos hooks do React
import { useState, useEffect } from "react";
// Importação dos componentes do React Native Paper para interface
import {
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  Surface,
  Text,
  TextInput,
} from "react-native-paper";
// Importação da configuração do banco de dados do Firebase
import { db } from "../config/firebase";
// Importação dos componentes do React Native para layout
import { FlatList, View } from "react-native";

// Componente funcional para listar notas
export default function ListarNotas() {
  const [notas, setNotas] = useState([]); // Estado para armazenar as notas obtidas do Firebase
  const [visible, setVisible] = useState(false); // Estado para controlar a visibilidade do modal
  const [notaId, setNotaId] = useState(null); // Estado para armazenar o ID da nota selecionada
  const [isEditing, setIsEditing] = useState(false); // Estado para controlar se está no modo de edição
  const [nota, setNota] = useState(""); // Estado para armazenar o valor da nota durante a edição

  // Função para exibir o modal de remoção
  const showModal = (id) => {
    setVisible(true);
    setNotaId(id);
  };

  // Função para exibir o modal de edição
  const showEditModal = (id) => {
    setIsEditing(true);
    showModal(id);
  };

  // Função para ocultar o modal
  const hideModal = () => setVisible(false);

  // Efeito para carregar notas do Firebase ao montar o componente
  useEffect(() => {
    listarNotasDoFirebase();
  }, []);

  // Função assíncrona para buscar notas na coleção "notas" do Firebase
  async function listarNotasDoFirebase() {
    const notasRef = collection(db, "notas");
    const notasSnapshot = await getDocs(notasRef);
    const notasList = notasSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setNotas(notasList);
  }

  // Função assíncrona para salvar as alterações de uma nota no Firebase
  async function salvarNota() {
    const notaRef = doc(db, "notas", notaId);
    await updateDoc(notaRef, { titulo: nota });
    await listarNotasDoFirebase();
    hideModal();
    setIsEditing(false);
  }

  // Função assíncrona para remover uma nota do Firebase
  async function removerNota() {
    const notaRef = doc(db, "notas", notaId);
    await deleteDoc(notaRef);
    await listarNotasDoFirebase();
    hideModal();
  }

  // Renderização do componente
  return (
    <Surface style={{ flex: 1, alignItems: "center" }}>
      <Text>Notas inseridas</Text>
      <FlatList
        data={notas}
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
            <View style={{ flexDirection: "row" }}>
              <IconButton icon="delete" onPress={() => showModal(item.id)} />
              <IconButton
                icon="note-edit-outline"
                onPress={() => showEditModal(item.id)}
              />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      <Portal>
        <Modal visible={visible} onDismiss={hideModal} style={{ margin: 40 }}>
          {isEditing ? (
            <Card>
              <Card.Title title="Editar nota" />
              <Card.Content>
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
              <Card.Title title="Remover nota" />
              <Card.Content>
                <Text>Você deseja remover esta nota?</Text>
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
