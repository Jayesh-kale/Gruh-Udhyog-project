import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button, Card, Input } from "../../components/common";
import { useAuth } from "../../services/context/authContext.jsx";

import "./Login.css";

function Login() {

    //login function from auth context
    const { login } = useAuth();

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

    const onSubmit = async (data) => {

        try {
            let response = await login(data);
            console.log("Login Response:", response);
            toast.success("Login Successful");
        }

        catch (error) {

            toast.error(
                error.response?.data?.message ||
                "Login Failed"
            );

        }

    };

    return (

        <div className="login-page">

            <Card className="login-card">

                <h2>Kale's GruhUdyog </h2>

                <p>

                    Welcome Back

                </p>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <Input

                        label="Email"

                        type="email"

                        placeholder="Enter Email"

                        error={errors.email?.message}

                        {...register("email", {

                            required: "Email is required"

                        })}

                    />

                    <Input

                        label="Password"

                        type="password"

                        placeholder="Enter Password"

                        error={errors.password?.message}

                        {...register("password", {

                            required: "Password is required",

                            minLength: {

                                value: 8,

                                message: "Minimum 8 characters"

                            }

                        })}

                    />

                    <Button

                        type="submit"

                        fullWidth

                        loading={isSubmitting}

                    >

                        Login

                    </Button>

                </form>

                <div className="login-footer">
                    <span>
                        Forget Password? <Link to="/forget-password">Click here</Link>
                    </span>
                </div>
                <div className="login-footer" >
                    <span>
                        Don't have an account?
                    </span>
                    <Link to="/register">
                        <Button variant="outlined">
                            Register
                        </Button>

                    </Link>

                </div>

            </Card>

        </div>

    );

}

export default Login;