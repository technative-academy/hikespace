import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Button } from "@/components/ui/button";
import styles from "./Auth.module.css";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "../ui/field";
import { Input } from "../ui/input";

export default function Auth() {
  async function signIn() {
    // sign in logic
    try {
    } catch (err) {
      alert(`Sign In unsuccessful:" ${err}`);
    }
    console.log("sign In confirmed");
  }

  async function signUp() {
    // sign up logic
    try {
    } catch (err) {
      alert(`Sign Up unsuccessful:" ${err}`);
    }
    console.log("sign Up confirmed");
  }

  return (
    <div className={styles.wrapper}>
      <Tabs defaultValue="sign_in" style={{ alignSelf: "stretch" }}>
        <TabsList variant="line">
          <TabsTrigger value="sign_in">Sign In</TabsTrigger>
          <TabsTrigger value="sign_up">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="sign_in">
          {/* Sign In Form */}
          <form action={signIn}>
            <FieldSet className="w-full max-w-xs">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input type="text" name="username" />
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
          </form>
        </TabsContent>
        <TabsContent value="sign_up">
          {/* Sign Up Form */}
          <form action={signUp}>
            <FieldSet className="w-full max-w-xs">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input type="email" name="email" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <Input type="text" name="username" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input type="password" name="password" />
                </Field>
                <Field>
                  <FieldLabel htmlFor="profile-picture">Profile picture</FieldLabel>
                  <Input id="profile-picture" type="file" />
                  <FieldDescription>Select a profile picture to upload.</FieldDescription>
                </Field>
              </FieldGroup>
            </FieldSet>
            <Button variant="outline" type="submit">
              Sign Up
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
