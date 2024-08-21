import { useState, useEffect } from "react";
// import { useAlert } from "../components/AlertContext";
import { register, login } from "../services/authService";
import "../styles/user.css";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const Auth = () => {
  const [email, setEmail] = useState("");
  // const [alertMsg, setAlertMsg] = useState("");
  // const [alertType, setAlertType] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [toggleLogin, setToggleLogin] = useState(true);
  const [token, setToken] = useState("");
  // const [alertMessage, setAlertMessage] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const navigate = useNavigate();
  // const { showAlert } = useAlert();
  // const alert = (message, type) => {
  //   setAlertMsg(message);
  //   setAlertType(type);
  // };
  const loginImages = [
    "/loginImage/rei1.png",
    "/loginImage/rei2.png",
    "/loginImage/rei3.png",
    "/loginImage/asuka1.png",
    "/loginImage/asuka2.png",
    "/loginImage/asuka3.png",
  ];
  const validatePassword = (password) => {
    const requirements = [
      {
        test: (pw) => pw.length >= 8,
        message: "Password must be at least 8 characters long.",
      },
      {
        test: (pw) => /[A-Z]/.test(pw),
        message: "Password must include at least one uppercase letter.",
      },
      {
        test: (pw) => /[a-z]/.test(pw),
        message: "Password must include at least one lowercase letter.",
      },
      {
        test: (pw) => /\d/.test(pw),
        message: "Password must include at least one number.",
      },
      {
        test: (pw) => /[!@#$%^&*]/.test(pw),
        message:
          "Password must include at least one special character (!@#$%^&*).",
      },
    ];

    const failingRequirement = requirements.find((req) => !req.test(password));
    setValidationMessage(failingRequirement ? failingRequirement.message : "");
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const handleRegister = async () => {
    if (validationMessage) {
      toast.error({ validationMessage });
      return;
    }

    try {
      const response = await register(username, email, password);
      console.log("response:", response);
      toast.success(response);
      setToggleLogin(true);
    } catch (error) {
      // showAlert("Registration failed. Please try again.", "error");
    }
  };

  const handleLogin = async () => {
    try {
      const response = await login(email, password);
      console.log(response);
      toast.success(response.message || "Login successful!");
      setToken(response.token);
      // showAlert("Logged in successfully!", "success");
      localStorage.setItem("token", response.token);
      navigate("/home");
    } catch (error) {
      toast.error(error.message || "Login failed!");

      // alert("Check your credentials and try again.", "error");
      console.error("Login Error:", error);
      let errorMessage =
        "Login failed. Please check your credentials and try again.";

      if (error.response) {
        // Server responded with a status other than 2xx
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = "Network error, please try again later.";
      }

      // showAlert(errorMessage, "error");
    }
  };

  const toggleLoginHandle = () => {
    setToggleLogin(!toggleLogin);
    setValidationMessage("");
  };

  const [randomRei, setRandomRei] = useState(0);
  const [randomAsuka, setRandomAsuka] = useState(3);
  const notify = () => toast("Here is your toast.");

  useEffect(() => {
    const rei = Math.floor(Math.random() * 3); // 0 to 2
    const asuka = 3 + Math.floor(Math.random() * 3); // 3 to 5
    setRandomRei(rei);
    setRandomAsuka(asuka);
  }, []);

  return (
    <main className="mx-auto my-4 flex h-auto min-h-screen w-full max-w-[1420px] items-center px-2 text-white sm:px-4 lg:px-6 xl:px-0">
      <div className="mx-auto h-3/4 w-full">
        {toggleLogin ? (
          <>
            <div className="mx-auto my-10 flex  h-3/4 max-h-none w-3/4 items-center space-x-4 rounded-3xl border-2 border-teal-500 bg-slate-950 shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)] lg:m-auto lg:w-2/4">
              <div className="logininp flex w-full flex-col p-4 text-start lg:w-1/2">
                <div className="text-2xl font-bold">REGISTER</div>
                <div>
                  <button onClick={notify}>Make me a toast</button>
                  <Toaster />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                    placeholder="john"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                    placeholder="john.doe@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                    placeholder="•••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  {validationMessage && (
                    <div className="px-2 pt-2 text-sm text-red-500">
                      {validationMessage}
                    </div>
                  )}
                </div>
                <div className="mb-3 flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    I agree with the{" "}
                    <a
                      href="#"
                      className="text-blue-600 hover:underline dark:text-blue-500"
                    >
                      terms and conditions
                    </a>
                    .
                  </label>
                </div>
                <button
                  className="mb-2 me-2 rounded-lg bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 px-5 py-2.5 text-center text-sm font-semibold uppercase text-white shadow-lg hover:bg-gradient-to-br focus:outline-none"
                  onClick={handleRegister}
                  disabled={!!validationMessage}
                >
                  Register
                </button>
                <div className="text-sm">
                  Already registered?{" "}
                  <button
                    onClick={toggleLoginHandle}
                    className="text-orange-500"
                  >
                    Sign In
                  </button>
                </div>
              </div>
              <div className=" hidden h-96 w-1/2 overflow-hidden lg:block">
                <img className="  w-full" src={loginImages[randomRei]} alt="" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="m-auto flex h-3/4 max-h-none w-3/4 flex-row-reverse items-center space-x-4 rounded-3xl border-2 border-teal-500 bg-slate-950 shadow-[5px_5px_rgba(0,_98,_90,_0.4),_10px_10px_rgba(0,_98,_90,_0.3),_15px_15px_rgba(0,_98,_90,_0.2),_20px_20px_rgba(0,_98,_90,_0.1),_25px_25px_rgba(0,_98,_90,_0.05)] lg:w-2/4">
              <div className="logininp flex w-full flex-col p-4 text-start lg:w-1/2">
                <div className="text-2xl font-bold">LOGIN</div>
                <div className="mb-3">
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                    placeholder="john.doe@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                    placeholder="•••••••••"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                </div>
                <div className="mb-3 flex items-start">
                  <div className="flex h-5 items-center">
                    <input
                      id="remember"
                      type="checkbox"
                      className="focus:ring-3 h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-blue-300 dark:border-gray-600 dark:bg-gray-700"
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <button
                  className="mb-2 me-2 rounded-lg bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 px-5 py-2.5 text-center text-sm font-semibold uppercase text-white shadow-lg hover:bg-gradient-to-br focus:outline-none"
                  onClick={handleLogin}
                >
                  Login
                </button>
                {/* {alertMsg && (
                  <div className={`alert text-xs text-red-600 ${alertType}`}>
                    {alertMsg}
                  </div>
                )} */}
                <div className="text-sm">
                  Not registered?{" "}
                  <button
                    onClick={toggleLoginHandle}
                    className="text-orange-500"
                  >
                    Create an Account
                  </button>
                </div>
              </div>
              <div className=" hidden h-80 w-1/2 overflow-hidden lg:block">
                <img
                  className="    w-full  "
                  src={loginImages[randomAsuka]}
                  alt=""
                />
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default Auth;
