import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import { Button } from "@/components/ui/button";
import styles from "./Auth.module.css";

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
            <label htmlFor="username">Username</label>
            <input type="text" name="username" />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
            <Button variant="outline" type="submit">
              Log In
            </Button>
          </form>
        </TabsContent>
        <TabsContent value="sign_up">
          {/* Sign Up Form */}
          <form action={signUp}>
            <label htmlFor="email">Email</label>
            <input type="email" name="email" />
            <label htmlFor="username">Username</label>
            <input type="text" name="username" />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
            <Button variant="outline" type="submit">
              Sign Up
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
