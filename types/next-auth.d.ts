// types/next-auth.d.ts

import 'next-auth';

declare module 'next-auth' {
  /**
   * Extends the built-in session/user types with the role property.
   */
  interface User {
    role?: string;
  }

  interface Session {
    user?: User;
  }
}
