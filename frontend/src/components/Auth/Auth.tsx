import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Button } from "@/components/ui/button";
import styles from "./Auth.module.css";
import { Field, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";
import { useNavigate, useLocation } from "react-router-dom";
import { authClient } from "@/lib/auth-client";
import React, { useState, useEffect } from "react";

export default function Auth() {
  const navigate = useNavigate();
  const [signInError, setSignInError] = useState<string | null>(null);
  const [signUpError, setSignUpError] = useState<string | null>(null);

  async function signIn(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSignInError(null);
    const fd = new FormData(e.currentTarget);
    const { error } = await authClient.signIn.email({
      email: fd.get("email") as string,
      password: fd.get("password") as string,
    });
    if (error) {
      setSignInError(error.message ?? "Sign in failed");
      return;
    }
    navigate("/");
  }

  async function signUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSignUpError(null);
    const fd = new FormData(e.currentTarget);
    const { error } = await authClient.signUp.email({
      email: fd.get("email") as string,
      name: fd.get("username") as string,
      password: fd.get("password") as string,
    });
    if (error) {
      setSignUpError(error.message ?? "Sign up failed");
      return;
    }
    navigate("/");
  }

  const location = useLocation();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  // Set the active tab based on navigation state
  useEffect(() => {
    if (location.state?.defaultTab) {
      setActiveTab(location.state.defaultTab);
      // Clear the state so it doesn't persist on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  return (
    <div className={styles.wrapper}>
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
        style={{ alignSelf: "stretch" }}
      >
        <TabsList variant="line">
          <TabsTrigger value="sign_in">Sign In</TabsTrigger>
          <TabsTrigger value="sign_up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign_in">
          <form onSubmit={signIn}>
            <FieldSet className="w-full max-w-xs">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input type="email" name="email" placeholder="jane@doe.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input type="password" name="password" />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Button variant="outline" type="submit">
              Log In
            </Button>
            {signInError && (
              <p className="mt-2 text-sm text-destructive">{signInError}</p>
            )}
          </form>
        </TabsContent>
        <TabsContent value="sign_up">
          <form onSubmit={signUp}>
            <FieldSet className="w-full max-w-xs">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input type="email" name="email" placeholder="jane@doe.com" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input
                    type="text"
                    name="username"
                    placeholder="janedoe1234"
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input type="password" name="password" />
                </Field>
              </FieldGroup>
            </FieldSet>
            <Button variant="outline" type="submit">
              Sign Up
            </Button>
            {signUpError && (
              <p className="mt-2 text-sm text-destructive">{signUpError}</p>
            )}
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
