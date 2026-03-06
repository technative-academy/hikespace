declare global {
  namespace Express {
    interface User {
      id: string;
      email?: string | null;
      name?: string | null;
      image?: string | null;
    }

    interface Request {
      user: User;
    }
  }
}

export {};
