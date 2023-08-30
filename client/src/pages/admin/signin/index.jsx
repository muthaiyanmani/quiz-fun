import { useEffect } from "react";

export default function SignInPage() { 
    useEffect(() => {
        window.catalyst.auth.signIn('login', {signInProvidersOnly : true});
      }, [])
    return (
        <>
        
            <h2>Signin page</h2>
            
            <div id="login"></div>
        </>
    )
}