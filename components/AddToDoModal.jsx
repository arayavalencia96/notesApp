import {
  View,
  Text,
  TextInput,
  Button,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import AppStyles from "../styles/AppStyles";

export default function AddToDoModal(props) {
  const background = require("../assets/images/background.jpg");
  let [todo, setTodo] = React.useState("");
  return (
    <ImageBackground style={AppStyles.imageContainer} source={background}>
      <KeyboardAvoidingView
        style={AppStyles.backgroundCover}
        behavior="padding"
        keyboardVerticalOffset={5}
      >
        <Text style={[AppStyles.lightText, AppStyles.header]}>
          Agregar Nota
        </Text>
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholderTextColor="#BEBEBE"
          autoFocus
          placeholder="Nota"
          value={todo}
          multiline
          onChangeText={setTodo}
        />
        <View
          style={[
            AppStyles.rowContainer,
            AppStyles.rightAligned,
            AppStyles.rightMargin,
            AppStyles.btnAddNoteCentrar,
          ]}
        >
          <View style={AppStyles.btnAddNote}>
            <Button title="Cancelar" color="#f7b267" onPress={props.onClose} />
          </View>
          <View style={AppStyles.btnAddNote}>
            <Button
              title="Guardar"
              color="#f7b267"
              onPress={() => {
                props.addToDo(todo);
                setTodo("");
                props.onClose();
              }}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
