import { Message } from './../node_modules/react-hook-form/dist/types/errors.d';
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
  interface User {
    userTokenfromBackend?: string;
  }
  interface Session {
    user?: User & {
      userTokenfromBackend?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userTokenfromBackend?: string;
  }
}

export const nextauthConfig: NextAuthOptions = {

  providers: [

    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (credentials) => {
        const res = await fetch("https://ecommerce.routemisr.com/api/v1/auth/signin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
        });

        const finalData = await res.json();
        console.log("finalData", finalData);
        // femahihu@mailinator.comVoluptas_12

        if (finalData.message === "success") {
          return {
            id: finalData.user._id,
            name: finalData.user.name,
            email: finalData.user.email,
            userTokenfromBackend: finalData.token,
          }
        } else {
          return null;
        }

      }
    })

  ],

  pages: {
    signIn: "/login"
  },



  callbacks: {

    jwt(params) {
      if (params.user) {
        params.token.userTokenfromBackend = params.user.userTokenfromBackend;
      }

      console.log("params", params);



      return params.token;
    },

    session({ session, token }) {
      if (session.user) {
        // @ts-ignore
        session.user.userTokenfromBackend = token.userTokenfromBackend;
      }
      return session;
    },



  },

  // session: {
  //   maxAge: 60 * 60*24 // 1 day
  // }

}