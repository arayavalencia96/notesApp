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
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

export default function SignUp({ navigation }) {
  const background = require("../assets/images/background.jpg");

  let [email, setEmail] = React.useState("");
  let [password, setPassword] = React.useState("");
  let [confirmPassword, setConfirmPassword] = React.useState("");
  let [validationMessage, setValidationMessage] = React.useState("");

  let validateAndSet = (value, valueToCompare, setValue) => {
    if (value !== valueToCompare) {
      setValidationMessage("Las contraseñas no coinciden");
    } else if (password.length < 8 || confirmPassword.length < 8) {
      setValidationMessage("Las contraseñas deben ser mínimo de 8 caracteres");
    } else {
      setValidationMessage("");
    }
    setValue(value);
  };

  let signUp = () => {
    if (
      password === confirmPassword &&
      password !== "" &&
      confirmPassword !== "" &&
      email !== ""
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          sendEmailVerification(auth.currentUser);
          navigation.navigate("ToDo", { user: userCredential.user });
        })
        .catch((error) => {
          if (
            error.message === "Firebase: Error (auth/wrong-password)" ||
            error.message === "Firebase: Error (auth/user-not-found)."
          ) {
            setValidationMessage("Email o contraseña invalido.");
          } else if (
            error.message === "Firebase: Error (auth/invalid-email)."
          ) {
            setValidationMessage("Formato de email invalido");
          }
        });
    }
  };

  return (
    <ImageBackground style={AppStyles.imageContainer} source={background}>
      <KeyboardAvoidingView
        style={AppStyles.backgroundCover}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={60}
      >
        <Text style={[AppStyles.lightText, AppStyles.header]}>Sign Up</Text>
        <Text style={[AppStyles.errorText]}>{validationMessage}</Text>
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          placeholder="Email"
          keyboardType="email-address"
          autoFocus
          textContentType="emailAddress"
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
          textContentType="newPassword"
          placeholder="Contraseña"
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          value={password}
          onChangeText={(value) =>
            validateAndSet(value, confirmPassword, setPassword)
          }
        />
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          textContentType="newPassword"
          placeholder="Confirmar Contraseña"
          placeholderTextColor="#BEBEBE"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={(value) =>
            validateAndSet(value, password, setConfirmPassword)
          }
        />
        <View style={[AppStyles.rowContainer, AppStyles.topMargin]}>
          <Text style={AppStyles.lightText}>Ya tenes una cuenta? </Text>
          <InlineTextButton
            text="Ingresar"
            onPress={() => navigation.popToTop()}
          />
        </View>
        <View style={AppStyles.btnAuth}>
          <Button title="Registrarse" onPress={signUp} color="#f7b267" />
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
