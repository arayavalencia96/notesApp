import {
  Text,
  View,
  TextInput,
  ImageBackground,
  Button,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AppStyles from "../styles/AppStyles";
import InlineTextButton from "../components/InlineTextButton";
import React from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function Login({ navigation }: { navigation: any }) {
  const background = require("../assets/images/background.jpg");

  let [validationBtn, setValidationBtn] = React.useState(true);

  if (auth.currentUser) {
    navigation.navigate("ToDo");
  } else {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.navigate("ToDo");
      }
    });
  }

  let [errorMessage, setErrorMessage] = React.useState("");
  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");

  let login = () => {
    if ((email !== "" && password !== "") || password.length < 8) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          navigation.navigate("ToDo", {
            params: { user: userCredential.user },
          });
          setErrorMessage("");
          setEmail("");
          setPassword("");
        })
        .catch((error) => {
          if (
            error.message === "Firebase: Error (auth/wrong-password)" ||
            error.message === "Firebase: Error (auth/user-not-found)."
          ) {
            setErrorMessage("Email o contraseña invalido.");
          } else if (
            error.message === "Firebase: Error (auth/invalid-email)."
          ) {
            setErrorMessage("Formato de email invalido");
          }
        });
    } else {
      setErrorMessage("Ingresar email y contraseña");
    }
  };

  return (
    <ImageBackground style={AppStyles.imageContainer} source={background}>
      <KeyboardAvoidingView
        style={AppStyles.backgroundCover}
        behavior="padding"
        keyboardVerticalOffset={5}
      >
        <Text style={[AppStyles.lightText, AppStyles.header]}>Login</Text>
        <Text style={AppStyles.errorText}>{errorMessage}</Text>
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Email"
          textContentType="emailAddress"
          autoFocus
          keyboardType="email-address"
          placeholderTextColor="#BEBEBE"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Contraseña"
          textContentType="newPassword"
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />
        <View style={[AppStyles.rowContainer, AppStyles.topMargin]}>
          <Text style={AppStyles.lightText}>Aún no tenes una cuenta? </Text>
          <InlineTextButton
            text="Crear Cuenta"
            onPress={() => navigation.navigate("SignUp")}
          />
        </View>
        <View style={[AppStyles.rowContainer, AppStyles.bottomMargin]}>
          <Text style={AppStyles.lightText}>Olvidaste tu contraseña? </Text>
          <InlineTextButton
            text="Restablecer"
            onPress={() => navigation.navigate("ResetPassword")}
          />
        </View>
        <View style={AppStyles.btnAuth}>
          <Button title="Ingresar" onPress={login} color="#f7b267" />
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
