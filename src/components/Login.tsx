"use client"
import { account } from "@/appwrite/config";
import { Button, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ID, OAuthProvider } from "appwrite";
import { toast, Toaster } from "react-hot-toast";
import useAuth from "@/contexts/useAuth";

// Custom error type for Appwrite errors
interface AppwriteError extends Error {
    code?: number;
}

export default function Login() {

    // const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
    const [isRegistred, setIsRegistering] = useState(true);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { setIsLoggedIn } = useAuth();


    const router = useRouter();

    useEffect(() => {
        const userLog = async () => {
            try {
                await account.get();
                setIsLoggedIn(true);
            } catch (error) {
                setIsLoggedIn(false);
                console.log(error);
            }
        };
        setIsRegistering(true);
        userLog();

    }, [setIsLoggedIn]);

    const handleSubmit = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();

        // Show loading toast
        const loadingToast = toast.loading("Loading...");

        try {
            if (isRegistred) {
                await account.createEmailPasswordSession(email, password);
                // Optionally setLoggedInUser(await account.get());
                setIsLoggedIn(true);
                router.push('/profile');
            } else {
                await account.create(ID.unique(), email, password, username);
                await account.createEmailPasswordSession(email, password);
                setIsLoggedIn(true);
                router.push('/profile');
            }
        } catch (error) {
            const appwriteError = error as AppwriteError; // Type assertion
            toast.dismiss(loadingToast);

            if (appwriteError.code) {
                switch (appwriteError.code) {
                    case 401: // Invalid password or user not found
                        toast.error("Invalid email or password.");
                        break;
                    case 404: // User not found
                        toast.error("User not found.");
                        break;
                    case 400: // Invalid email format or other bad request
                        toast.error("Invalid email format.");
                        break;
                    default:
                        toast.error("An unexpected error occurred.");
                }
            } else {
                toast.error("An unexpected error occurred.");
            }
        }
    };

    const handleGoogle = () => {
        account.createOAuth2Session(
            OAuthProvider.Google, // provider
            'https://localhost:3000/', // redirect here on success
            'https://localhost:3000/login', // redirect here on failure
        );
    }

    return (
        <div>
            <Toaster />
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a
                    href="#"
                    className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
                ></a>
                <div className="w-full rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 bg-slate-300">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-black md:text-2xl ">
                            {isRegistred ? "Log in to your account" : "Create an account"}
                        </h1>
                        <form
                            className="space-y-4 md:space-y-6 flex flex-col justify-center align-middle"
                            onSubmit={handleSubmit}
                        >
                            {!isRegistred && <div>
                                <TextField required
                                    className="w-full"
                                    id="filled-basic"
                                    label="Username"
                                    variant="filled"
                                    value={username}
                                    onChange={(e) => { setUsername(e.target.value) }}
                                />
                            </div>}

                            <div>
                                <TextField required
                                    className="w-full"
                                    id="filled-basic"
                                    label="Email"
                                    variant="filled"
                                    value={email}
                                    onChange={(e) => { setEmail(e.target.value) }}
                                />
                            </div>
                            <div>

                                <TextField
                                    required
                                    className="w-full"
                                    id="filled-password-input"
                                    label="Password"
                                    type="password"
                                    autoComplete="current-password"
                                    variant="filled"
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value) }}

                                />
                            </div>

                            <Button
                                type="submit"
                                className=" font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 text-white bg-slate-700 "

                            >
                                {" "}
                                {isRegistred ? "Login" : "Register"}
                            </Button>
                        </form>
                        <h1 className="font-semibold text-center">or</h1>
                        <div className="flex items-center justify-center   ">
                            <button onClick={handleGoogle} className="flex gap-2 items-center  dark:bg-gray-900 border hover:bg-white hover:text-black rounded-lg shadow-md px-6 py-2 text-sm font-medium  dark:text-white  focus:outline-none  ">
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width="800px" height="800px" viewBox="-0.5 0 48 48" version="1.1"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </svg>
                                <span>Continue with Google</span>

                            </button>
                        </div>
                        <p className="text-sm font-light text-center text-black">
                            {isRegistred
                                ? "Don't have an account yet?"
                                : "already have account?"}{" "}
                            <button
                                onClick={() => {
                                    setIsRegistering(!isRegistred);
                                }}
                                className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                            >
                                {isRegistred ? "Register" : "login"}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
