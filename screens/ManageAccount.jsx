import {
  Button,
  View,
  TextInput,
  Text,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import React from "react";
import AppStyles from "../styles/AppStyles";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import {
  signOut,
  updatePassword,
  signInWithEmailAndPassword,
  deleteUser,
} from "firebase/auth";

export default function ManageAccount({ navigation }) {
  const background = require("../assets/images/background.jpg");

  let [newPassword, setNewPassword] = React.useState("");
  let [currentPassword, setCurrentPassword] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState("");
  let logout = () => {
    signOut(auth).then(() => {
      navigation.popToTop();
    });
  };

  let updateUserPassword = () => {
    if (currentPassword !== "" && newPassword !== "") {
      signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
        .then((userCredential) => {
          const user = userCredential.user;
          updatePassword(user, newPassword)
            .then(() => {
              setNewPassword("");
              setErrorMessage("");
              setCurrentPassword("");
            })
            .catch((error) => {
              if (newPassword.length < 8) {
                setErrorMessage(
                  "La contraseña nueva debe tener al menos 8 caracteres."
                );
              }
            });
        })
        .catch((error) => {
          if (error.message === "Firebase: Error (auth/wrong-password).") {
            setErrorMessage("Contraseña actual incorrecta.");
          }
        });
    } else {
      setErrorMessage("Debes rellenar los campos de contraseñas.");
    }
  };

  let deleteUserAndToDos = () => {
    if (currentPassword === "") {
      setErrorMessage(
        "Para eliminar la cuenta debe colocar la contraseña actual."
      );
    } else {
      signInWithEmailAndPassword(auth, auth.currentUser.email, currentPassword)
        .then((userCredential) => {
          const user = userCredential.user;

          // Get all todos for user and delete
          let batch = writeBatch(db);
          const q = query(
            collection(db, "todos"),
            where("userId", "==", user.uid)
          );
          getDocs(q).then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              batch.delete(doc.ref);
            });
            batch.commit();

            deleteUser(user)
              .then(() => {
                navigation.popToTop();
              })
              .catch((error) => {
                setErrorMessage(error.message);
              });
          });
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    }
  };

  return (
    <ImageBackground style={AppStyles.imageContainer} source={background}>
      <KeyboardAvoidingView
        style={AppStyles.backgroundCover}
        keyboardVerticalOffset={5}
      >
        <Text style={AppStyles.errorText}>{errorMessage}</Text>
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Contraseña actual"
          textContentType="password"
          value={currentPassword}
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          onChangeText={setCurrentPassword}
        />
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Nueva Contraseña"
          textContentType="newPassword"
          value={newPassword}
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          onChangeText={setNewPassword}
        />
        <Button
          color="#f7b267"
          title="Actualizar contraseña"
          onPress={updateUserPassword}
        />
        <Button
          color="#f7b267"
          title="Eliminar Usuario"
          onPress={deleteUserAndToDos}
        />
        <Button color="#f7b267" title="Cerrar Sesión" onPress={logout} />
        <Button
          color="#f7b267"
          title="Volver"
          onPress={() => navigation.pop()}
        />
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
