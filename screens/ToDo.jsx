import {
  View,
  Button,
  Text,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  FlatList,
  ImageBackground,
  KeyboardAvoidingView,
  StatusBar,
} from "react-native";
import InlineTextButton from "../components/InlineTextButton";
import AppStyles from "../styles/AppStyles";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  setDoc,
} from "firebase/firestore";
import { signOut, sendEmailVerification } from "firebase/auth";
import * as React from "react";
import AddToDoModal from "../components/AddToDoModal";
import BouncyCheckbox from "react-native-bouncy-checkbox";

import { LogBox } from "react-native";
import { Icon } from "@rneui/themed";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
  "AsyncStorage has been extracted from react-native core and will be removed in a future release",
  "Cannot update a component",
]);

export default function ToDo({ navigation }) {
  let [modalVisible, setModalVisible] = React.useState(false);
  let [isLoading, setIsLoading] = React.useState(true);
  let [isRefreshing, setIsRefreshing] = React.useState(false);
  let [toDos, setToDos] = React.useState([]);

  let logout = () => {
    signOut(auth).then(() => {
      navigation.popToTop();
    });
  };

  let loadToDoList = async () => {
    const q = query(
      collection(db, "todos"),
      where("userId", "==", auth.currentUser.uid)
    );

    const querySnapshot = await getDocs(q);
    let toDos = [];
    querySnapshot.forEach((doc) => {
      let toDo = doc.data();
      toDo.id = doc.id;
      toDos.push(toDo);
    });

    setToDos(toDos);
    setIsLoading(false);
    setIsRefreshing(false);
  };

  if (isLoading) {
    loadToDoList();
  }

  let checkToDoItem = (item, isChecked) => {
    const toDoRef = doc(db, "todos", item.id);
    setDoc(toDoRef, { completed: isChecked }, { merge: true });
  };

  let deleteToDo = async (toDoId) => {
    await deleteDoc(doc(db, "todos", toDoId));
    let updatedToDos = [...toDos].filter((item) => item.id != toDoId);
    setToDos(updatedToDos);
  };

  let modifyToDo = async (toDoId) => {
    await updateDocDoc(doc(db, "todos", toDoId));
    let updatedToDos = [...toDos].filter((item) => item.id != toDoId);
    setToDos(updatedToDos);
  };

  let renderToDoItem = ({ item }) => {
    return (
      <View style={AppStyles.item}>
        <View style={AppStyles.fillSpace}>
          <BouncyCheckbox
            isChecked={item.complated}
            size={25}
            fillColor="#258ea6"
            unfillColor="#FFFFFF"
            style={AppStyles.title}
            text={item.text}
            iconStyle={{ borderColor: "#258ea6" }}
            onPress={(isChecked) => {
              checkToDoItem(item, isChecked);
            }}
          />
        </View>
        <View style={AppStyles.iconsNotesList}>
          <Icon
            name="close-circle-outline"
            onPress={() => deleteToDo(item.id)}
            type="ionicon"
            color="#DC143C"
          />
          <Icon
            name="create-outline"
            onPress={() => deleteToDo(item.id)}
            type="ionicon"
            color="#fb4d3d"
          />
        </View>
      </View>
    );
  };

  let showToDoList = () => {
    return (
      <FlatList
        data={toDos}
        refreshing={isRefreshing}
        onRefresh={() => {
          loadToDoList();
          setIsRefreshing(true);
        }}
        renderItem={renderToDoItem}
        keyExtractor={(item) => item.id}
      />
    );
  };

  let showContent = () => {
    return (
      <View>
        {isLoading ? <ActivityIndicator size="large" /> : showToDoList()}
        <Button
          title="Agregar Nota"
          onPress={() => setModalVisible(true)}
          color="#fb4d3d"
        />
      </View>
    );
  };

  let showSendVerificationEmail = () => {
    const background = require("../assets/images/background.jpg");
    return (
      <ImageBackground
        style={AppStyles.emailVerifyingContainer}
        source={background}
      >
        <KeyboardAvoidingView
          style={AppStyles.emailVerifyingbackgroundCover}
          keyboardVerticalOffset={5}
        >
          <Text style={AppStyles.lightText}>
            Se le ha enviado un correo a su casilla spam. Por favor confirmar
            email.
          </Text>
          <View style={AppStyles.marginBtnNotes}>
            <Button
              topMargin={10}
              color="#f7b267"
              title="Verificar Email"
              onPress={() => sendEmailVerification(auth.currentUser)}
            />
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  };

  let addToDo = async (todo) => {
    let toDoToSave = {
      text: todo,
      completed: false,
      userId: auth.currentUser.uid,
    };
    const docRef = await addDoc(collection(db, "todos"), toDoToSave);

    toDoToSave.id = docRef.id;

    let updatedToDos = [...toDos];
    updatedToDos.push(toDoToSave);

    setToDos(updatedToDos);
  };

  return (
    <SafeAreaView
      style={{
        marginTop: StatusBar.currentHeight || 0,
        flex: 1,
        marginBottom: 110,
      }}
    >
      <View
        style={[
          AppStyles.rowContainer,
          AppStyles.rightAligned,
          AppStyles.rightMargin,
          AppStyles.topMargin,
        ]}
      >
        <Icon
            name="person-circle-outline"
            onPress={() => navigation.navigate("ManageAccount")}
            type="ionicon"
            color="#fb4d3d"
          />
        <Icon
            name="log-out-outline"
            onPress={logout}
            type="ionicon"
            color="#DC143C"
          />
      </View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <AddToDoModal
          onClose={() => setModalVisible(false)}
          addToDo={addToDo}
        />
      </Modal>
      <Text style={AppStyles.header}>Notes</Text>
      {auth.currentUser.emailVerified
        ? showContent()
        : showSendVerificationEmail()}
    </SafeAreaView>
  );
}
