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
import { sendPasswordResetEmail } from "firebase/auth";

export default function ResetPassword({ navigation }: { navigation: any }) {
  const background = require("../assets/images/background.jpg");
  const regex =
    /^(([^<>()[\]\\¿#'&.,^´;{}:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  let [email, setEmail] = React.useState("");
  let [errorMessage, setErrorMessage] = React.useState("");
  let [validationBtn, setValidationBtn] = React.useState(false);
  let [emailValid, setEmailValid] = React.useState(false);

  let validateAndSet = (value: any, setValue: any) => {
    setEmailValid(value.match(regex) ? true : false);
    if (!emailValid) {
      setErrorMessage("Email Invalido");
    }
    setErrorMessage("");
    setValue(value);
  };

  let resetPassword = () => {
    if (email !== "") {
      sendPasswordResetEmail(auth, email)
        .then(() => {
          setErrorMessage(
            "Si el email esta registrado le llegará un correo a spam para cambiar la password."
          );
          navigation.popToTop();
          setErrorMessage("");
          setEmail("");
        })
        .catch((error) => {
          console.log(error.message);
          if (error.message === "Firebase: Error (auth/user-not-found).") {
            setErrorMessage(
              "Si el email esta registrado le llegará un correo a spam para cambiar la password."
            );
          } else if (
            error.message === "Firebase: Error (auth/invalid-email)."
          ) {
            setErrorMessage("Formato de email invalido");
          }
        });
    } else {
      setErrorMessage("Debes ingresar un correo.");
    }
  };

  return (
    <ImageBackground style={AppStyles.imageContainer} source={background}>
      <KeyboardAvoidingView
        style={AppStyles.backgroundCover}
        behavior="padding"
        keyboardVerticalOffset={60}
      >
        <Text style={[AppStyles.lightText, AppStyles.header]}>
          Reset Password
        </Text>
        <Text style={AppStyles.errorText}>{errorMessage}</Text>
        <TextInput
          style={[
            AppStyles.textInput,
            AppStyles.lightTextInput,
            AppStyles.lightText,
          ]}
          textContentType="emailAddress"
          placeholder="Email"
          autoFocus
          keyboardType="email-address"
          placeholderTextColor="#BEBEBE"
          value={email}
          onChangeText={(value) => validateAndSet(value, setEmail)}
        />
        <View style={[AppStyles.rowContainer, AppStyles.topMargin]}>
          <Text style={AppStyles.lightText}>No tenes una cuenta? </Text>
          <InlineTextButton
            text="Registrate"
            onPress={() => navigation.navigate("SignUp")}
          />
        </View>
        <View style={AppStyles.btnAuth}>
          <Button
            title="Cambiar contraseña"
            onPress={resetPassword}
            color="#f7b267"
          />
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
