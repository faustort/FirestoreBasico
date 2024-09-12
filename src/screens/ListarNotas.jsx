import { collection, getDocs } from "firebase/firestore"; // Importa as funções do Firestore para buscar coleções e documentos.
import { useState, useEffect } from "react"; // Importa o useState para gerenciar o estado e o useEffect para controlar os efeitos colaterais.
import { Surface, Text } from "react-native-paper"; // Importa componentes visuais do React Native Paper.
import { db } from "../config/firebase"; // Importa a instância do Firebase configurada.
import { FlatList } from "react-native"; // Importa o componente FlatList para renderizar listas de itens de forma eficiente.

export default function ListarNotas() {
  const [notas, setNotas] = useState([]); // Define o estado "notas" com um array vazio inicialmente.

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
        renderItem={({ item }) => <Text id={item.id}>{item.titulo}</Text>} // Renderiza cada item da lista, acessando a propriedade "titulo".
        keyExtractor={(item) => item.id} // Gera uma chave única para cada item usando o "id".
      />
    </Surface>
  );
}
