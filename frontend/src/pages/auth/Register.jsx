import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import { Button, Card, Input } from "../../components/common";
import { useAuth } from "../../services/context/authContext.jsx";

function Register() {

    const { register: registerUser } = useAuth();
    const { register, handleSubmit, watch, formState: { errors, isSubmitting }} = useForm();

    const password = watch("password");

    const onSubmit = async (data) => {

        try {

            const payload = {
                name: data.name,
                email: data.email,
                phone: data.phone,
                password: data.password,
                role: data.role
            };

            await registerUser(payload);

            toast.success("Registration Successfull.Go To Login..");

            setTimeout(() => {
                window.navigation.navigate("/login");
            }, 600);
            

        } catch (error) {

            toast.error(

                error.response?.data?.message ||

                "Registration Failed"

            );

        }

    };

    return (

        <div className="register-page m-5">

            <Card className="register-card">

                <div className="w-100">
                    <img
                        src="https://res.cloudinary.com/drky4ztad/image/upload/v1792432703/JAY_Gruh_Udhyog_Heritage_Logo.png"
                        alt="Logo"
                        className="d-block mx-auto" 
                        style={{ "height": "75px" }}
                    />
                </div>
                <h2 className="text-center">Jay Gruh Udyog</h2>

                <p>Create your account</p>

                <form onSubmit={handleSubmit(onSubmit)}>

                    <Input
                        label="Full Name"
                        placeholder="Enter your name"
                        error={errors.name?.message}
                        {...register("name", {
                            required: "Name is required",
                            minLength: {
                                value: 3,
                                message: "Minimum 3 characters"
                            }
                        })}
                    />

                    <Input
                        label="Email"
                        type="email"
                        placeholder="Enter your email"
                        error={errors.email?.message}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+\.\S+$/,
                                message: "Invalid email address"
                            }
                        })}
                    />

                    <Input
                        label="Phone Number"
                        placeholder="Enter phone number"
                        error={errors.phone?.message}
                        {...register("phone", {
                            required: "Phone number is required",
                            pattern: {
                                value: /^[6-9]\d{9}$/,
                                message: "Enter a valid 10-digit mobile number"
                            }
                        })}
                    />
                    <select name="role" {...register("role", { required: "Role is required" })}>
                        <option value="">Select Role</option>
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                    </select>
                    {errors.role && <p className="error">{errors.role.message}</p>}

                    <Input
                        label="Password"
                        type="password"
                        placeholder="Enter password"
                        error={errors.password?.message}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            }
                        })}
                    />

                    <Input
                        label="Confirm Password"
                        type="password"
                        placeholder="Confirm password"
                        error={errors.confirmPassword?.message}
                        {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value) =>
                                value === password || "Passwords do not match"
                        })}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        loading={isSubmitting}
                    >
                        {isSubmitting ? "Registering..." : "Register"}
                    </Button>

                </form>

                <div className="register-footer">

                    <p>

                        Already have an account?

                    </p>

                    <Link to="/login">

                        <Button variant="outlined">

                            Login

                        </Button>

                    </Link>

                </div>

            </Card>

        </div>

    );

}

export default Register;